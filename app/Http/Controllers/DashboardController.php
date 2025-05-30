<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Models\Stage;

class DashboardController extends Controller
{
    
    /**
     * Display the dashboard with users data.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'stage', 'created_at', 'status')
            ->orderBy('id')
            ->get();

        $stages = Stage::select('id', 'name', 'order')->orderBy('order')->get();
        
        return Inertia::render('dashboard', [
            'users' => $users,
            'stages' => $stages,
        ]);
    }

    /**
     * Store a newly created user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'stage' => ['required', 'numeric', 'min:0'], // Changed from integer to numeric
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'stage' => $validated['stage'],
        ]);

        return redirect()->route('dashboard');
    }

    /**
     * Update the specified user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'stage' => ['required', 'numeric', 'min:0'], // Changed from integer to numeric
        ]);

        // Only update password if provided
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['string', 'min:8'],
            ]);
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);

        return redirect()->route('dashboard');
    }

    /**
     * Remove the specified user.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return redirect()->route('dashboard');
    }
    
    public function moveToNextStage($id)
{
    $user = User::findOrFail($id);
    $currentOrder = (float) $user->stage;

    // Find the next stage with a higher order
    $nextStage = Stage::where('order', '>', $currentOrder)
        ->orderBy('order')
        ->first();

    if ($nextStage) {
        $user->update(['stage' => $nextStage->order,'status' => null]);
    }
    return redirect()->intended(route('dashboard', absolute: false));
}
    
    /**
     * Move user to a specific stage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function moveToStage(Request $request, $id)
    {
        $validated = $request->validate([
            'stage' => ['required', 'numeric', 'min:0'],
        ]);
        
        $user = User::findOrFail($id);
        $user->update([
            'stage' => $validated['stage'],
            'status' => null,
        ]);
        
        return redirect()->route('dashboard');
    }

    public function handleButtonClick(Request $request, $id)
{
    $request->validate([
        'button_text' => 'required|string',
    ]);

    $user = User::findOrFail($id);
    $currentOrder = (float) $user->stage;

    // Get the current stage
    $stage = Stage::where('order', $currentOrder)->first();

    if (!$stage) {
        return redirect()->back()->withErrors(['stage' => 'Stage not found.']);
    }

    $buttonLinking = $stage->button_linking;

    if (!is_array($buttonLinking)) {
        return $this->moveToNextStage($id);
    }

    // Find the clicked button by its text
    $button = collect($buttonLinking)->firstWhere('text', $request->button_text);

    if (!$button || empty($button['status'])) {
        // If no status is set for the button → move to next stage
        return $this->moveToNextStage($id);
    }

    // If status exists → update user's status field
    $user->update(['status' => $button['status']]);

    return redirect()->route('dashboard')->with('success', 'Status updated.');
}
}