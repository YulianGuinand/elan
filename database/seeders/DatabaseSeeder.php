<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'email' => 'aguinand@etik.com',
            'fonction' => 'Directeur',
            'nom' => 'Guinand',
            'prenom' => 'Antoine',
            'role' => 'superadmin',
            'mdp' => Hash::make("Fq7Tg4h8fhYDCU35")
        ]);

        // Appeler le seeder des notifications
        $this->call(NotificationSeeder::class);
    }
}
