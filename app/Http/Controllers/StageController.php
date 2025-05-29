<?php

namespace App\Http\Controllers;

use App\Http\Requests\StageRequest;
use App\Services\StageService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StageController extends Controller
{
    protected $stageService;

    /**
     * Constructor
     */
    public function __construct(StageService $stageService)
    {
        $this->stageService = $stageService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stages = $this->stageService->getAllStages();
        
        return Inertia::render('Stages/Index', [
            'stages' => $stages
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Stages/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StageRequest $request)
    {
        $stage = $this->stageService->createStage($request->validated());
        
        return redirect()->route('stages.index')
            ->with('success', 'Stage created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $stage = $this->stageService->findStageById($id);
        
        if (!$stage) {
            return redirect()->route('stages.index')
                ->with('error', 'Stage not found.');
        }
        
        return Inertia::render('Stages/Show', [
            'stage' => [
        ...$stage->toArray(),
        'button_linking' => json_decode($stage->button_linking, true),
    ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $stage = $this->stageService->findStageById($id);
        
        if (!$stage) {
            return redirect()->route('stages.index')
                ->with('error', 'Stage not found.');
        }
        
        return Inertia::render('Stages/Edit', [
            'stage' => [
        ...$stage->toArray(),
        'button_linking' => json_decode($stage->button_linking, true),
    ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StageRequest $request, string $id)
    {
        $stage = $this->stageService->updateStage($id, $request->validated());
        
        if (!$stage) {
            return redirect()->route('stages.index')
                ->with('error', 'Stage not found.');
        }
        
        return redirect()->route('stages.index')
            ->with('success', 'Stage updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $deleted = $this->stageService->deleteStage($id);
        
        if (!$deleted) {
            return redirect()->route('stages.index')
                ->with('error', 'Stage not found.');
        }
        
        return redirect()->route('stages.index')
            ->with('success', 'Stage deleted successfully.');
    }
}
