import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeV3AirQuality, encodeV3AirQuality } from '../src/function/v3AirQuality.mjs';

const raw = { primaryPollutant: 'C6H6', pollutants: [
    { pollutantType: 'PM10', amount: 4, units: 'UNKNOWN2' },
    { pollutantType: 'SO2', amount: 8, units: 'UNKNOWN2' },
    { pollutantType: 'PM2_5', amount: 89, units: 'UNKNOWN2' },
    { pollutantType: 'UNKNOWN12', amount: 0.4, units: 'UNKNOWN2' },
    { pollutantType: 'NOX', amount: 8, units: 'UNKNOWN2' },
    { pollutantType: 'CO', amount: 12, units: 'UNKNOWN2' },
] };

test('v3 pollutant names and units match captured response and round trip', () => {
    const decoded = decodeV3AirQuality(raw);
    assert.deepEqual(decoded.pollutants.map(p => [p.pollutantType, p.amount, p.units]), [
        ['SO2', 4, 'MICROGRAMS_PER_CUBIC_METER'], ['PM2_5', 8, 'MICROGRAMS_PER_CUBIC_METER'],
        ['OZONE', 89, 'MICROGRAMS_PER_CUBIC_METER'], ['CO', 0.4, 'MICROGRAMS_PER_CUBIC_METER'],
        ['NO2', 8, 'MICROGRAMS_PER_CUBIC_METER'], ['PM10', 12, 'MICROGRAMS_PER_CUBIC_METER'],
    ]);
    assert.deepEqual(encodeV3AirQuality(decoded, raw.primaryPollutant), raw);
    decoded.primaryPollutant = 'OZONE';
    assert.equal(encodeV3AirQuality(decoded, raw.primaryPollutant).primaryPollutant, 'PM2_5');
});

test('unconfirmed pollutant types and units cause a safe fallback', () => {
    assert.equal(decodeV3AirQuality({ ...raw, pollutants: [{ ...raw.pollutants[0], units: 'UNKNOWN3' }] }), null);
    assert.equal(decodeV3AirQuality({ ...raw, pollutants: [{ ...raw.pollutants[0], pollutantType: 'NH3' }] }), null);
    const normalized = decodeV3AirQuality(raw);
    normalized.pollutants[0].units = 'PARTS_PER_BILLION';
    assert.equal(encodeV3AirQuality(normalized, raw.primaryPollutant), null);
});
