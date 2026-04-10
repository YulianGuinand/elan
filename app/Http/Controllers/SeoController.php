<?php

namespace App\Http\Controllers;

use App\Models\Enquete;
use Illuminate\Support\Facades\Response;

class SeoController extends Controller
{
    /**
     * Generate dynamic sitemap.xml
     */
    public function sitemap()
    {
        $urls = [];

        // Home page
        $urls[] = [
            'loc' => route('welcome'),
            'lastmod' => now()->toAtomString(),
            'changefreq' => 'daily',
            'priority' => 1.0,
        ];

        // Authenticated pages
        $urls[] = [
            'loc' => route('dashboard'),
            'lastmod' => now()->toAtomString(),
            'changefreq' => 'daily',
            'priority' => 0.9,
        ];

        $urls[] = [
            'loc' => route('surveys.index'),
            'lastmod' => now()->toAtomString(),
            'changefreq' => 'daily',
            'priority' => 0.9,
        ];

        $urls[] = [
            'loc' => route('participants.index'),
            'lastmod' => now()->toAtomString(),
            'changefreq' => 'weekly',
            'priority' => 0.8,
        ];

        // Active surveys (publicly accessible for filling)
        $surveys = Enquete::where('statut', 'active')
            ->select('id', 'updated_at')
            ->get();

        foreach ($surveys as $survey) {
            $urls[] = [
                'loc' => route('surveys.fill', $survey->id),
                'lastmod' => $survey->updated_at->toAtomString(),
                'changefreq' => 'daily',
                'priority' => 0.7,
            ];
        }

        $sitemap = $this->generateSitemapXml($urls);

        return Response::make($sitemap, 200, [
            'Content-Type' => 'application/xml',
        ]);
    }

    /**
     * Generate sitemap XML content
     */
    private function generateSitemapXml(array $urls): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>" . htmlspecialchars($url['loc']) . "</loc>\n";
            $xml .= "    <lastmod>" . $url['lastmod'] . "</lastmod>\n";
            $xml .= "    <changefreq>" . $url['changefreq'] . "</changefreq>\n";
            $xml .= "    <priority>" . $url['priority'] . "</priority>\n";
            $xml .= "  </url>\n";
        }

        $xml .= '</urlset>';

        return $xml;
    }
}
