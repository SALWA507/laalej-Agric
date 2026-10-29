<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->where('is_active', true);

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->input('brand'));
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        return response()->json(
            $query->latest()->paginate(12)
        );
    }

    public function show(Product $product)
    {
        abort_unless($product->is_active, 404);

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'reference' => ['nullable', 'string', 'max:255', 'unique:products,reference'],
            'brand' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        $product = Product::create($validated);

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($product->id),
            ],
            'description' => ['nullable', 'string'],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'stock' => ['sometimes', 'integer', 'min:0'],
            'reference' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('products', 'reference')->ignore($product->id),
            ],
            'brand' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string', 'max:2048'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès.',
        ]);
    }
}
