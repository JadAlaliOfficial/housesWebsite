<?php

namespace App\Services;

use App\Models\Stage;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Storage;
class StageService
{
    /**
     * Get all stages
     *
     * @return Collection
     */
    public function getAllStages(): Collection
    {
        return Stage::orderBy('order')->get();
    }

    /**
     * Get paginated stages
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedStages(int $perPage = 10): LengthAwarePaginator
    {
        return Stage::orderBy('order')->paginate($perPage);
    }

    /**
     * Find stage by ID
     *
     * @param int $id
     * @return Stage|null
     */
    public function findStageById(int $id): ?Stage
    {
        return Stage::find($id);
    }

    /**
     * Create a new stage
     *
     * @param array $data
     * @return Stage
     */
    public function createStage(array $data): Stage
    {
        // Handle image upload if present
        if (isset($data['image']) && $data['image']) {
            $data['image'] = $this->handleImageUpload($data['image']);
        }

        // Handle button linking JSON conversion
        if (isset($data['button_linking']) && is_array($data['button_linking'])) {
            // Inline cleaning of null values
            array_walk_recursive($data['button_linking'], function (&$value, $key) use (&$data) {
                if ($value === null) {
                    $value = '__REMOVE__'; // Temporary marker
                }
            });
        
            // Remove all keys that were marked
            $data['button_linking'] = json_decode(
                json_encode($data['button_linking']),
                true
            );
        
            $data['button_linking'] = array_filter($data['button_linking'], function ($value) {
                return $value !== '__REMOVE__';
            });
        
            $data['button_linking'] = json_encode($data['button_linking']);
        }

        return Stage::create($data);
    }

    /**
     * Update an existing stage
     *
     * @param int $id
     * @param array $data
     * @return Stage|null
     */
    public function updateStage(int $id, array $data): ?Stage
    {
        $stage = $this->findStageById($id);

        if (!$stage) {
            return null;
        }

        // Handle image upload if present
        if (isset($data['image']) && $data['image']) {
            $data['image'] = $this->handleImageUpload($data['image'], $stage->image);
        }

        // Handle button linking JSON conversion
        if (isset($data['button_linking']) && is_array($data['button_linking'])) {
            // Inline cleaning of null values
            array_walk_recursive($data['button_linking'], function (&$value, $key) use (&$data) {
                if ($value === null) {
                    $value = '__REMOVE__'; // Temporary marker
                }
            });
        
            // Remove all keys that were marked
            $data['button_linking'] = json_decode(
                json_encode($data['button_linking']),
                true
            );
        
            $data['button_linking'] = array_filter($data['button_linking'], function ($value) {
                return $value !== '__REMOVE__';
            });
        
            $data['button_linking'] = json_encode($data['button_linking']);
        }

        $stage->update($data);
        return $stage;
    }

    /**
     * Delete a stage
     *
     * @param int $id
     * @return bool
     */
    public function deleteStage(int $id): bool
    {
        $stage = $this->findStageById($id);

        if (!$stage) {
            return false;
        }

        // Delete associated image if exists
        if ($stage->image) {
            $this->deleteImage($stage->image);
        }

        return $stage->delete();
    }

    /**
     * Handle image upload
     *
     * @param mixed $image
     * @param string|null $oldImage
     * @return string
     */
    private function handleImageUpload($image, ?string $oldImage = null): string
    {
        // Delete old image if exists
        if ($oldImage) {
            $this->deleteImage($oldImage);
        }

        // Store the new image
        $path = $image->store('stages', 'public');
        return $path;
    }

    /**
     * Delete image from storage
     *
     * @param string $path
     * @return void
     */
    private function deleteImage(string $path): void
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}