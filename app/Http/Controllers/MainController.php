<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MainController extends Controller
{
    //

    public function home()
    {
        return Inertia::render('Dashboard');
    }

    public function upload(Request $request)
    {
        if (!$request->hasFile('file')) {
            dd('No file uploaded', $request->all(), $request->files);
        }
        $collection = (new \Rap2hpoutre\FastExcel\FastExcel)->import($request->file('file'));
        dd($collection);
    }
}
