@extends('app')

@section('content')
<div class="container max-w-lg mx-auto mt-8">
    <h1 class="text-2xl font-bold mb-6">Créer un utilisateur</h1>
    <form action="{{ route('utilisateurs.store') }}" method="POST" class="space-y-4 bg-white p-6 rounded shadow">
        @csrf
        <div>
            <label for="nom" class="block font-semibold">Nom</label>
            <input type="text" name="nom" id="nom" class="w-full border rounded px-3 py-2" required>
        </div>
        <div>
            <label for="prenom" class="block font-semibold">Prénom</label>
            <input type="text" name="prenom" id="prenom" class="w-full border rounded px-3 py-2" required>
        </div>
        <div>
            <label for="fonction" class="block font-semibold">Fonction</label>
            <input type="text" name="fonction" id="fonction" class="w-full border rounded px-3 py-2">
        </div>
        <div>
            <label for="email" class="block font-semibold">Email</label>
            <input type="email" name="email" id="email" class="w-full border rounded px-3 py-2" required>
        </div>
        <div>
            <label for="mdp" class="block font-semibold">Mot de passe</label>
            <input type="password" name="mdp" id="mdp" class="w-full border rounded px-3 py-2" required>
        </div>
        <div>
            <label for="mdp_confirmation" class="block font-semibold">Confirmer le mot de passe</label>
            <input type="password" name="mdp_confirmation" id="mdp_confirmation" class="w-full border rounded px-3 py-2" required>
        </div>
        <div>
            <label for="role" class="block font-semibold">Rôle</label>
            <select name="role" id="role" class="w-full border rounded px-3 py-2" required>
                <option value="utilisateur">Utilisateur</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
            </select>
        </div>
        <div class="pt-4">
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Créer</button>
        </div>
    </form>
</div>
@endsection
