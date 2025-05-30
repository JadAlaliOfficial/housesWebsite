<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ThemeSetting extends Model
{
    protected $fillable = ['light', 'dark'];

    protected $casts = [
        'light' => 'array',
        'dark'  => 'array',
    ];
}
