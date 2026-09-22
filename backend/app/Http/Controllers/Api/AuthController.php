<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::with(['plant', 'department'])
            ->where('email', $credentials['email'])
            ->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 422);
        }

        return response()->json([
            'token' => $user->createToken('react-client')->plainTextToken,
            'user' => $user,
        ]);
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'in:admin,operator'],
            'plant_id' => ['required', 'exists:plants,id'],
            'department_id' => ['required', 'exists:departments,id'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
            'plant_id' => $data['plant_id'],
            'department_id' => $data['department_id'],
        ]);

        return response()->json(['message' => 'User berhasil dibuat.', 'user' => $user], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['message' => 'Berhasil logout.']);
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(User::with(['plant', 'department'])->get());
    }

        public function store(Request $request): JsonResponse
        {
            if ($request->user()->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8'],
                'role' => ['required', 'in:admin,operator'],
                'plant_id' => ['required', 'exists:plants,id'],
                'department_id' => ['required', 'exists:departments,id'],
            ]);

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'role' => $data['role'],
                'plant_id' => $data['plant_id'],
                'department_id' => $data['department_id'],
            ]);

            return response()->json(['message' => 'User baru.', 'user' => $user], 201);
        }
}