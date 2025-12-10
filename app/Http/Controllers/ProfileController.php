<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('Profile/Edit', [
            'user' => auth()->user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return redirect()->route('profile.edit')
            ->with('success', 'Profile updated successfully!');
    }

    public function updatePhoto(Request $request)
    {
        Log::info('📸 Photo upload started');
        Log::info('User ID: ' . auth()->id());
        Log::info('OS: ' . PHP_OS);

        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        Log::info('✅ Validation passed');

        $user = auth()->user();

        // Delete old photo if exists
        if ($user->photo) {
            Log::info('Deleting old photo: ' . $user->photo);
            try {
                Storage::disk('public')->delete($user->photo);
                Log::info('Old photo deleted successfully');
            } catch (\Exception $e) {
                Log::error('Failed to delete old photo: ' . $e->getMessage());
            }
        }

        // Store new photo
        Log::info('Storing new photo...');
        try {
            $path = $request->file('photo')->store('profile-photos', 'public');
            Log::info('Photo stored at: ' . $path);
        } catch (\Exception $e) {
            Log::error('Failed to store photo: ' . $e->getMessage());
            return redirect()->route('profile.edit')
                ->with('error', 'Failed to upload photo. Please try again.');
        }

        // Verify full storage path
        $fullPath = storage_path('app/public/' . $path);
        Log::info('Full path: ' . $fullPath);
        Log::info('File exists: ' . (file_exists($fullPath) ? 'YES' : 'NO'));

        // Verify public path
        $publicPath = public_path('storage/' . $path);
        Log::info('Public path: ' . $publicPath);
        Log::info('Public access exists: ' . (file_exists($publicPath) ? 'YES' : 'NO'));

        // Update user
        try {
            $user->update(['photo' => $path]);
            Log::info('User updated with new photo path');
        } catch (\Exception $e) {
            Log::error('Failed to update user photo column: ' . $e->getMessage());

            try {
                Storage::disk('public')->delete($path);
                Log::info('Uploaded file deleted due to DB failure');
            } catch (\Exception $ex) {
                Log::error('Failed to delete uploaded file after DB failure: ' . $ex->getMessage());
            }

            return redirect()->route('profile.edit')
                ->with('error', 'Failed to save photo information. Please try again.');
        }

        return redirect()->route('profile.edit')
            ->with('success', 'Profile photo updated successfully!');
    }

    public function deletePhoto()
    {
        $user = auth()->user();

        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
            $user->update(['photo' => null]);
        }

        return redirect()->route('profile.edit')
            ->with('success', 'Profile photo removed successfully!');
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|current_password',
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        auth()->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('profile.edit')
            ->with('success', 'Password updated successfully!');
    }
}
