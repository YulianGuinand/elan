<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentsController extends Controller
{
    /**
     * Affiche la liste des apprenants avec recherche, filtres et pagination
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $program = $request->input('program');
        $status = $request->input('status');
        $perPage = 5; // Nombre elements par page

        // Simuler une requete de base de donnees avec filtres
        $allStudents = $this->getAllStudents();
        $students = $allStudents;

        // Filtrer par recherche (nom, prenom, email)
        if ($search) {
            $students = array_filter($students, function ($student) use ($search) {
                $searchLower = strtolower($search);

                return str_contains(strtolower($student['full_name']), $searchLower) ||
                  str_contains(strtolower($student['email']), $searchLower);
            });
        }

        // Filtrer par programme
        if ($program) {
            $students = array_filter($students, function ($student) use ($program) {
                return $student['program_type'] === $program;
            });
        }

        // Filtrer par statut
        if ($status) {
            $students = array_filter($students, function ($student) use ($status) {
                return $student['status'] === $status;
            });
        }

        // Reindexer le tableau apres filtrage
        $students = array_values($students);
        $total = count($students);

        // Pagination manuelle
        $currentPage = $request->input('page', 1);
        $offset = ($currentPage - 1) * $perPage;
        $paginatedStudents = array_slice($students, $offset, $perPage);

        $lastPage = ceil($total / $perPage);
        $from = $total > 0 ? $offset + 1 : 0;
        $to = min($offset + $perPage, $total);

        return Inertia::render('Students', [
            'students' => [
                'data' => $paginatedStudents,
                'meta' => [
                    'current_page' => (int) $currentPage,
                    'last_page' => (int) $lastPage,
                    'per_page' => $perPage,
                    'total' => $total,
                    'from' => $from,
                    'to' => $to,
                ],
            ],
            'filters' => [
                'search' => $search,
                'program' => $program ?: 'all',
                'status' => $status ?: 'all',
            ],
        ]);
    }

    /**
     * Retourne la liste complete des apprenants (donnees placeholder)
     */
    private function getAllStudents(): array
    {
        return [
            [
                'id' => 1,
                'first_name' => 'Thomas',
                'last_name' => 'Dubois',
                'full_name' => 'Thomas Dubois',
                'email' => 'thomas.d@example.com',
                'phone' => '06 12 34 56 78',
                'avatar' => null,
                'program' => 'Developpeur Web Fullstack',
                'program_type' => 'web_dev',
                'status' => 'active',
                'enrollment_date' => '2023-01-12',
            ],
            [
                'id' => 2,
                'first_name' => 'Sarah',
                'last_name' => 'Connor',
                'full_name' => 'Sarah Connor',
                'email' => 's.connor@example.com',
                'phone' => '07 89 12 34 56',
                'avatar' => null,
                'program' => 'Cybersecurite Avancee',
                'program_type' => 'cybersecurity',
                'status' => 'graduated',
                'enrollment_date' => '2023-02-05',
            ],
            [
                'id' => 3,
                'first_name' => 'Lucas',
                'last_name' => 'Martin',
                'full_name' => 'Lucas Martin',
                'email' => 'lucas.m@example.com',
                'phone' => '06 45 67 89 01',
                'avatar' => null,
                'program' => 'Data Analyst',
                'program_type' => 'data_analyst',
                'status' => 'paused',
                'enrollment_date' => '2023-03-20',
            ],
            [
                'id' => 4,
                'first_name' => 'Emma',
                'last_name' => 'Leroy',
                'full_name' => 'Emma Leroy',
                'email' => 'emma.l@example.com',
                'phone' => '06 11 22 33 44',
                'avatar' => null,
                'program' => 'UX/UI Design',
                'program_type' => 'ux_ui',
                'status' => 'active',
                'enrollment_date' => '2023-04-10',
            ],
            [
                'id' => 5,
                'first_name' => 'Karim',
                'last_name' => 'Benali',
                'full_name' => 'Karim Benali',
                'email' => 'karim.b@example.com',
                'phone' => '07 65 43 21 09',
                'avatar' => null,
                'program' => 'Developpeur Mobile',
                'program_type' => 'mobile_dev',
                'status' => 'active',
                'enrollment_date' => '2023-05-15',
            ],
            [
                'id' => 6,
                'first_name' => 'Marie',
                'last_name' => 'Dupont',
                'full_name' => 'Marie Dupont',
                'email' => 'marie.d@example.com',
                'phone' => '06 98 76 54 32',
                'avatar' => null,
                'program' => 'Developpeur Web Fullstack',
                'program_type' => 'web_dev',
                'status' => 'active',
                'enrollment_date' => '2023-01-20',
            ],
            [
                'id' => 7,
                'first_name' => 'Alexandre',
                'last_name' => 'Bernard',
                'full_name' => 'Alexandre Bernard',
                'email' => 'alex.b@example.com',
                'phone' => '07 12 34 56 78',
                'avatar' => null,
                'program' => 'Cybersecurite Avancee',
                'program_type' => 'cybersecurity',
                'status' => 'active',
                'enrollment_date' => '2023-02-15',
            ],
            [
                'id' => 8,
                'first_name' => 'Sophie',
                'last_name' => 'Lefebvre',
                'full_name' => 'Sophie Lefebvre',
                'email' => 'sophie.l@example.com',
                'phone' => '06 55 44 33 22',
                'avatar' => null,
                'program' => 'Data Analyst',
                'program_type' => 'data_analyst',
                'status' => 'suspended',
                'enrollment_date' => '2023-03-01',
            ],
            [
                'id' => 9,
                'first_name' => 'Nicolas',
                'last_name' => 'Moreau',
                'full_name' => 'Nicolas Moreau',
                'email' => 'nicolas.m@example.com',
                'phone' => '07 88 77 66 55',
                'avatar' => null,
                'program' => 'UX/UI Design',
                'program_type' => 'ux_ui',
                'status' => 'graduated',
                'enrollment_date' => '2023-01-05',
            ],
            [
                'id' => 10,
                'first_name' => 'Lea',
                'last_name' => 'Rousseau',
                'full_name' => 'Lea Rousseau',
                'email' => 'lea.r@example.com',
                'phone' => '06 33 22 11 00',
                'avatar' => null,
                'program' => 'Developpeur Mobile',
                'program_type' => 'mobile_dev',
                'status' => 'active',
                'enrollment_date' => '2023-04-20',
            ],
        ];
    }
}
