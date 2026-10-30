<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // Liste des produits avec recherche et filtres
    public function index(Request $request)
    {
        $query = Product::with('category')
            ->where('is_active', true);

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

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
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

    // Afficher un produit
    public function show(Product $product)
    {
        abort_unless($product->is_active, 404);

        return response()->json(
            $product->load('category')
        );
    }

    // Ajouter un produit avec image
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
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $validated['slug'] = $validated['slug']
            ?? Str::slug($validated['name']);

        // Stocker l'image dans storage/app/public/products
        $validated['image'] = $request->hasFile('image')
            ? $request->file('image')->store('products', 'public')
            : null;

        $product = Product::create($validated);

        return response()->json(
            $product->load('category'),
            201
        );
    }

    // Modifier un produit
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
            'image' => ['sometimes', 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'category_id' => ['sometimes', 'nullable', 'exists:categories,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        // Ne pas modifier l'image si aucun nouveau fichier n'est envoyé
        unset($validated['image']);

        // Remplacer l'ancienne image si une nouvelle est envoyée
        if ($request->hasFile('image')) {
            $newImagePath = $request->file('image')->store('products', 'public');

            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }

            $validated['image'] = $newImagePath;
        }

        $product->update($validated);

        return response()->json(
            $product->fresh()->load('category')
        );
    }

    // Supprimer un produit
    public function destroy(Product $product)
    {
        // Supprimer l'image du stockage
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Produit supprimé avec succès.',
        ]);
    }
}
