<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stage extends Model
{
    protected $fillable = [
        'order',
        'name',
        'title',
        'subtitle',
        'description',
        'button_linking',
        'image',
        'email_subject',
        'email_content',
    ];
}
