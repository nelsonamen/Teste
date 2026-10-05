import test from 'node:test';
import assert from 'node:assert/strict';
import { soccerEntityIds } from '../../src/cards/editor-helper.js';

test('soccerEntityIds matches by sensor_type regardless of localized entity_id (#28)', () => {
  const hass = {
    states: {
      // German entity_id that does NOT contain "soccer_live_all" as a substring.
      'sensor.soccer_live_uefa_nations_alle_spiele': { attributes: { sensor_type: 'match_day' } },
      // English entity_id matched by the name pattern.
      'sensor.soccer_live_ned_1_soccerlive_all_ned_1': { attributes: { sensor_type: 'match_day' } },
      // A different Soccer Live sensor type that shouldn't be offered here.
      'sensor.soccer_live_ned_1_standings': { attributes: { sensor_type: 'standings' } },
      // Not a Soccer Live sensor at all.
      'sensor.living_room_temperature': { attributes: {} },
      // Not a sensor domain.
      'light.kitchen': { attributes: { sensor_type: 'match_day' } },
    },
  };
  const result = soccerEntityIds(hass, {
    sensorTypes: ['team_matches', 'team_matches_mixed', 'all_matches_today', 'match_day'],
    includes: ['soccerlive_all', 'soccer_live_all'],
  });
  assert.ok(result.includes('sensor.soccer_live_uefa_nations_alle_spiele'));
  assert.ok(result.includes('sensor.soccer_live_ned_1_soccerlive_all_ned_1'));
  assert.ok(!result.includes('sensor.soccer_live_ned_1_standings'));
  assert.ok(!result.includes('sensor.living_room_temperature'));
  assert.ok(!result.includes('light.kitchen'));
});
