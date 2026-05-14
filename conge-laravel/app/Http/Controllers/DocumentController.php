<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Document;

class DocumentController extends Controller
{
    public function index()
    {
        $document=Document::with('user')->get();
        return response()->json($document);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'file' => 'required|file|max:20480',
        ]);

        $file = $request->file('file');
        $path = $file->store('documents', 'public');

        $document = Document::create([
            'title' => $request->title,
            'file_url' => asset('storage/' . $path), 
            'mime_type' => $file->getClientMimeType(),
            'user_id' => auth()->id(),
        ]);

        return response()->json($document);
    }

    public function destroy($id)
    {
        $document = Document::findOrFail($id);
        $document->delete();

        return response()->json(['message' => 'deleted']);
    }

}