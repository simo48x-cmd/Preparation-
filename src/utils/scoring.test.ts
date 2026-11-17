import test from 'node:test';
import assert from 'node:assert/strict';
import {
  scoreToCEFR,
  versantToCEFR,
  calculateVersantScore,
  calculateAdaptiveStep,
  analyzeSpeechMetrics,
  evaluateAndUpgradeFrenchResponse,
} from './scoring';

test('scoreToCEFR maps 0-100 percentages accurately to A1-C2', () => {
  assert.equal(scoreToCEFR(94), 'C2');
  assert.equal(scoreToCEFR(82), 'C1');
  assert.equal(scoreToCEFR(68), 'B2');
  assert.equal(scoreToCEFR(50), 'B1');
  assert.equal(scoreToCEFR(33), 'A2');
  assert.equal(scoreToCEFR(15), 'A1');
});

test('calculateVersantScore computes weighted 20-80 scale and CEFR mapping', () => {
  const result = calculateVersantScore({
    sentenceMastery: 80,
    vocabulary: 85,
    fluency: 75,
    pronunciation: 80,
  });
  assert.ok(result.overallScore >= 65 && result.overallScore <= 72);
  assert.equal(result.cefr, 'C1');
  assert.equal(versantToCEFR(78), 'C2');
  assert.equal(versantToCEFR(58), 'B2');
});

test('calculateAdaptiveStep increases difficulty on fast accurate answers and steps down on errors', () => {
  const up = calculateAdaptiveStep({
    currentDifficulty: 500,
    isCorrect: true,
    responseTimeSeconds: 10,
    targetTimeSeconds: 30,
  });
  assert.ok(up.nextDifficulty > 550);

  const down = calculateAdaptiveStep({
    currentDifficulty: 500,
    isCorrect: false,
    responseTimeSeconds: 25,
    targetTimeSeconds: 30,
  });
  assert.ok(down.nextDifficulty < 460);
});

test('analyzeSpeechMetrics calculates word accuracy, WPM, and filler word penalties', () => {
  const metrics = analyzeSpeechMetrics({
    targetText: 'Bonjour Madame je comprends parfaitement votre réclamation concernant la livraison',
    spokenTranscript: 'Bonjour Madame euh je comprends parfaitement du coup votre réclamation concernant la livraison',
    durationSeconds: 6,
  });
  assert.equal(metrics.matchAccuracy, 100);
  assert.equal(metrics.fillerCount, 2);
  assert.ok(metrics.wpm > 80);
  assert.ok(metrics.confidenceRhythmScore > 60);
});

test('evaluateAndUpgradeFrenchResponse detects missing accents, informal register, and generates 3-tier output with Darija coach', () => {
  const upgrade = evaluateAndUpgradeFrenchResponse(
    'Salut je suis desole pour le probleme malgré que j ai verifie le numero recu'
  );
  assert.ok(upgrade.highlightedSegments.some((s) => s.type === 'accent'));
  assert.ok(upgrade.highlightedSegments.some((s) => s.type === 'informal'));
  assert.ok(upgrade.detectedWeaknesses.length >= 2);
  assert.ok(upgrade.versionB2.length > 30);
  assert.ok(upgrade.versionC1.length > 50);
  assert.ok(upgrade.darijaExplanation.length > 20);
});
