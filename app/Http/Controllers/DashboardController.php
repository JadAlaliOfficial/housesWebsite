<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with users data.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'stage', 'created_at')
            ->orderBy('id')
            ->get();

        return Inertia::render('dashboard', [
            'users' => $users
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
    
    /**
     * Move user to the next stage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function moveToNextStage($id)
    {
        $user = User::findOrFail($id);
        $currentStage = (float) $user->stage;
        
        // Define the progression of stages
        $stageProgression = [0, 1, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6,6.5 , 7];
        
        // Find the current index
        $currentIndex = array_search($currentStage, $stageProgression);
        
        // If found and not at the last stage, move to next stage
        if ($currentIndex !== false && $currentIndex < count($stageProgression) - 1) {
            $user->update([
                'stage' => $stageProgression[$currentIndex + 1]
            ]);
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
            'stage' => $validated['stage']
        ]);
        
        return redirect()->route('dashboard');
    }
}