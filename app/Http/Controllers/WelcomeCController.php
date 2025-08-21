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

    // Map each stage and decode button_linking
    $stagesTransformed = $stages->map(function ($stage) {
        return [
            'id' => $stage->id,
            'name' => $stage->name,
            'order' => $stage->order,
            'button_linking' => json_decode($stage->button_linking, true),
            'title' => $stage->title,
            'description' => $stage->description,
            'image' => $stage->image,
            'subtitle' => $stage->subtitle,
        ];
    });
    $TrustedPartnersPDF = TrustedPartnersPDF::first();

    return Inertia::render('welcome', [
        'user' => Auth::user(),
        'stages' => $stagesTransformed,
        'file'=> $TrustedPartnersPDF,
    ]);
}
}
