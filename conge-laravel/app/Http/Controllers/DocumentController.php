<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index()
    {
        // Code to retrieve and return documents
        $documents = Document::all();
        return response()->json($documents);
    }
    public function store(Request $request)
    {
        // Code to validate and store a new document
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'url' => 'required|url',
        ]);

        $document = Document::create($validatedData);
        return response()->json($document, 201);
    }
    public function destroy($id)
    {
        // Code to delete a document
        $document = Document::findOrFail($id);
        $document->delete();
        return response()->json(null, 204);
    }
}
