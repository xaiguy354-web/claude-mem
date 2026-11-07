import { afterAll, describe, expect, it } from 'bun:test';
import { validateMode } from '../../src/services/domain/mode-validation.js';
import { ModeManager } from '../../src/services/domain/ModeManager.js';

const TYPE_IDS = [
  'identity',
  'algorithm',
  'invariant',
  'counterexample',
  'domain-limit',
  'verification',
  'representation',
];

const CONCEPT_IDS = [
  'exact',
  'approximate',
  'numerical-stability',
  'edge-case',
  'complexity',
  'assumption',
  'gotcha',
];

describe('math-engine mode', () => {
  afterAll(() => {
    ModeManager.getInstance().loadMode('code');
  });

  it('validates the full prompt set and taxonomy', () => {
    const mode = ModeManager.getInstance().loadMode('math-engine');

    expect(validateMode(mode)).toEqual([]);
    expect(mode.name).toBe('Math Engine');
    expect(mode.observation_types.map(type => type.id)).toEqual(TYPE_IDS);
    expect(mode.observation_concepts.map(concept => concept.id)).toEqual(CONCEPT_IDS);
    for (const id of TYPE_IDS) expect(mode.prompts.type_guidance).toContain(id);
    for (const id of CONCEPT_IDS) expect(mode.prompts.concept_guidance).toContain(id);
    expect(mode.prompts.recording_focus).toContain('counterexample');
    expect(mode.prompts.skip_guidance).toContain('<skip_summary reason="noise" />');
    expect(mode.prompts.observer_role).toContain('SILENT BY DESIGN');
    expect(mode.prompts.observer_role).toContain('NO CONTACT');
  });

  it('chill inherits the taxonomy and keeps the skip contract', () => {
    const mode = ModeManager.getInstance().loadMode('math-engine--chill');

    expect(validateMode(mode)).toEqual([]);
    expect(mode.name).toBe('Math Engine (Chill)');
    expect(mode.observation_types.map(type => type.id)).toEqual(TYPE_IDS);
    expect(mode.prompts.recording_focus).toContain('HIGH SIGNAL ONLY');
    expect(mode.prompts.skip_guidance).toContain('<skip_summary reason="noise" />');
    expect(mode.prompts.system_identity).toContain('math engine');
  });
});
