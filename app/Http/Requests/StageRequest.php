<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StageRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authorization logic
    }
    protected function prepareForValidation(): void
    {
        $buttonLinking = $this->input('button_linking', []);
        
        if (!empty($buttonLinking)) {
            foreach ($buttonLinking as $index => $button) {
                if (isset($button['replacing_text'])) {
                    // Convert string "true"/"false" to actual boolean
                    $buttonLinking[$index]['replacing_text'] = filter_var(
                        $button['replacing_text'], 
                        FILTER_VALIDATE_BOOLEAN, 
                        FILTER_NULL_ON_FAILURE
                    );
                }
            }
            
            $this->merge([
                'button_linking' => $buttonLinking
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'order' => 'required|integer',
            'name' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'email_subject' =>'nullable|string|max:255',
            'email_content' => 'nullable|string',
            'button_linking' => 'nullable|array',
            'button_linking.*.text' => 'required_with:button_linking|string|max:255',
            'button_linking.*.popup' => 'string|max:500',
            'button_linking.*.status' => 'string|max:255',
            'button_linking.*.replacing_text' => 'boolean', // New validation rule
        ];

        // Only require image for store (create) requests
        if ($this->isMethod('post')) {
            $rules['image'] = 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048';
        } else {
            $rules['image'] = 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048';
        }

        return $rules;
    }
}