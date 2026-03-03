@extends('app')

@section('content')
<div class="container">
    <h1 class="text-2xl font-bold mb-4">Liste des utilisateurs</h1>
    <a href="{{ route('utilisateurs.create') }}" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 inline-block">Créer un utilisateur</a>
    <table class="table-auto w-full border">
        <thead>
            <tr>
                <th class="px-4 py-2 border">Nom</th>
                <th class="px-4 py-2 border">Prénom</th>
                <th class="px-4 py-2 border">Fonction</th>
                <th class="px-4 py-2 border">Email</th>
                <th class="px-4 py-2 border">Rôle</th>
            </tr>
        </thead>
        <tbody>
            @foreach($utilisateurs as $utilisateur)
                <tr>
                    <td class="px-4 py-2 border">{{ $utilisateur->nom }}</td>
                    <td class="px-4 py-2 border">{{ $utilisateur->prenom }}</td>
                    <td class="px-4 py-2 border">{{ $utilisateur->fonction }}</td>
                    <td class="px-4 py-2 border">{{ $utilisateur->email }}</td>
                    <td class="px-4 py-2 border">{{ $utilisateur->role }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
