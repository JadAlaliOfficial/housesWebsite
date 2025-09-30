<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Stage;
use App\Models\TrustedPartnersPDF;

class WelcomeCController extends Controller
{
    public function index()
    {
        $stages = Stage::orderBy('order')->get();
        $user = Auth::user();

        // Map each stage and decode button_linking
        $stagesTransformed = $stages->map(function ($stage) use ($user) {
            $decodedButtonLinking = json_decode($stage->button_linking, true);
            $stageDescription = $stage->description;

            // Check if user is authenticated and has a stage
            if ($user && $user->stage) {
                // Check if this stage matches the user's current stage
                if ($stage->order == $user->stage && $user->status) {
                    // Look through button_linking array for matching status and replacing_text = true
                    if (is_array($decodedButtonLinking)) {
                        foreach ($decodedButtonLinking as $button) {
                            if (isset($button['status']) && 
                                isset($button['replacing_text']) && 
                                $button['status'] === $user->status && 
                                $button['replacing_text'] === true) {
                                
                                // Replace stage description with button popup
                                $stageDescription = $button['popup'] ?? $stage->description;
                                break; // Exit loop once we find the first match
                            }
                        }
                    }
                }
            }

            return [
                'id' => $stage->id,
                'name' => $stage->name,
                'order' => $stage->order,
                'button_linking' => $decodedButtonLinking,
                'title' => $stage->title,
                'description' => $stageDescription, // This might be replaced with popup content
                'image' => $stage->image,
                'subtitle' => $stage->subtitle,
            ];
        });

        $TrustedPartnersPDF = TrustedPartnersPDF::first();

        return Inertia::render('welcome', [
            'user' => $user,
            'stages' => $stagesTransformed,
            'file'=> $TrustedPartnersPDF,
        ]);
    }
}
