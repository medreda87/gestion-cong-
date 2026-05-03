<?php

namespace App\Http\Controllers;

use App\Models\Holiday;
use Illuminate\Http\Request;

class HolidayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Holiday::orderBy('date')->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'date' => 'required|date',
            'is_recurring' => 'boolean'
        ]);

        $holiday = Holiday::create([
            'name' => $request->name,
            'type' => $request->type,
            'date' => $request->date,
            'is_recurring' => $request->is_recurring ?? true,
        ]);

        return response()->json($holiday, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Holiday $holiday)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Holiday $holiday)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $holiday = Holiday::findOrFail($id);

        $request->validate([
            'name' => 'required|string',
            'date' => 'required|date',
            'is_recurring' => 'boolean'
        ]);

        $holiday->update([
            'name' => $request->name,
            'date' => $request->date,
            'is_recurring' => $request->is_recurring ?? true,
        ]);

        return response()->json($holiday);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $holiday = Holiday::findOrFail($id);
        $holiday->delete();

        return response()->json([
            'message' => 'Holiday deleted successfully'
        ]);
    }

   
}
