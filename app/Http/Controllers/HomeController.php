<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function home()
    {
        return Inertia::render('Home', [
//            'translations' => [
//                'welcome' => __('Welcome to your application'),
//                'dashboard' => __('Dashboard'),
//                'profile' => __('Profile'),
//                'logout' => __('Logout'),
//            ],
            'welcome' => __('messages.welcome_dashboard', ['name' => Auth::user()->name]),
        ]);
    }
}
