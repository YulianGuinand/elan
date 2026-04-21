<?php

use App\Models\Enquete;

describe('SeoController - Sitemap', function () {
    it('returns sitemap xml on /sitemap.xml route', function () {
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml');
    });

    it('sitemap contains required xml structure', function () {
        $response = $this->get('/sitemap.xml');

        $content = $response->getContent();

        expect($content)->toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect($content)->toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
        expect($content)->toContain('</urlset>');
    });

    it('sitemap includes home page', function () {
        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        expect($content)->toContain('<loc>' . route('welcome') . '</loc>');
    });

    it('sitemap includes dashboard page', function () {
        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        expect($content)->toContain('<loc>' . route('dashboard') . '</loc>');
    });

    it('sitemap includes surveys index page', function () {
        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        expect($content)->toContain('<loc>' . route('surveys.index') . '</loc>');
    });

    it('sitemap includes active surveys', function () {
        $activeSurvey = Enquete::factory()->active()->create();

        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        expect($content)->toContain(route('surveys.fill', $activeSurvey->id));
    });

    it('sitemap does not include inactive surveys', function () {
        $draftSurvey = Enquete::factory()->draft()->create();

        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        expect($content)->not->toContain(route('surveys.fill', $draftSurvey->id));
    });

    it('sitemap includes lastmod timestamps', function () {
        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        expect($content)->toContain('<lastmod>');
        expect($content)->toContain('</lastmod>');
    });

    it('sitemap includes changefreq values', function () {
        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        expect($content)->toContain('<changefreq>');
        expect($content)->toContain('</changefreq>');
    });

    it('sitemap includes priority values', function () {
        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        expect($content)->toContain('<priority>');
        expect($content)->toContain('</priority>');
    });

    it('sitemap urls are properly escaped', function () {
        Enquete::factory()->active()->create(['titre' => 'Test & Survey']);

        $response = $this->get('/sitemap.xml');
        $content = $response->getContent();

        expect($content)->toContain('&amp;');
    });

    it('sitemap can handle many surveys', function () {
        Enquete::factory()->active()->count(50)->create();

        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        expect($response->getContent())->toContain('<loc>');
    });
});
