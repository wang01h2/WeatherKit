// WeatherKit v3 enum values confirmed by a captured response and the Weather app.
// The existing codec interprets these numeric values using the v2 enum names.
const v3ToV2 = { NOX: 'NO2', PM2_5: 'OZONE', SO2: 'PM2_5', PM10: 'SO2', CO: 'PM10', UNKNOWN12: 'CO' };
const v2ToV3 = Object.fromEntries(Object.entries(v3ToV2).map(([v3, v2]) => [v2, v3]));

function convert(airQuality, types, inputUnits, outputUnits, originalPrimary) {
    if (!airQuality || !Array.isArray(airQuality.pollutants)) return null;
    if (!airQuality.pollutants.every(p => types[p.pollutantType] && p.units === inputUnits)) return null;
    const primary = airQuality.primaryPollutant;
    if (originalPrimary !== undefined && primary && primary !== 'NOT_AVAILABLE' && !types[primary]) return null;
    const mappedPrimary = types[primary] ?? (originalPrimary === undefined ? 'NOT_AVAILABLE' : originalPrimary);
    return {
        ...airQuality,
        ...(primary ? { primaryPollutant: mappedPrimary } : {}),
        pollutants: airQuality.pollutants.map(p => ({ ...p, pollutantType: types[p.pollutantType], units: outputUnits })),
    };
}

export const decodeV3AirQuality = value => convert(value, v3ToV2, 'UNKNOWN2', 'MICROGRAMS_PER_CUBIC_METER');
export const encodeV3AirQuality = (value, originalPrimary) => convert(value, v2ToV3, 'MICROGRAMS_PER_CUBIC_METER', 'UNKNOWN2', originalPrimary ?? 'NOT_AVAILABLE');
