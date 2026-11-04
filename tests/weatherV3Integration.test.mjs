import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const templates = ['surge', 'loon', 'stash', 'quantumultx'];
const base = 'https://weatherkit.apple.com/api/';

test('client response rules match v2 and v3 and use the integrated bundle', async () => {
    for (const client of templates) {
        for (const suffix of ['', '.dev']) {
            const template = await readFile(new URL(`../template/${client}${suffix}.handlebars`, import.meta.url), 'utf8');
            const rule = template.split('\n').find(line => line.includes('api\\/v[23]\\/weather\\/'));
            assert.ok(rule, `${client}${suffix} response rule`);
            const pattern = rule.match(/\^https\?:.*?weather\\\//)?.[0];
            assert.ok(pattern, `${client}${suffix} pattern`);
            const regex = new RegExp(pattern);
            assert.ok(regex.test(`${base}v2/weather/zh-Hans-US/36.064/120.318`));
            assert.ok(regex.test(`${base}v3/weather/zh-Hans-US/36.064/120.318?country=CN`));
            assert.ok(!regex.test(`${base}v1/weather/zh-Hans-US/36.064/120.318`));
            assert.match(template, /https:\/\/raw\.githubusercontent\.com\/wang01h2\/WeatherKit\/codex\/weatherkit-v3\/scripts\/response\.bundle\.js/);
        }
    }
});

test('v3 preserves next-hour data and retains other configured handlers', async () => {
    const source = await readFile(new URL('../src/process/Response.mjs', import.meta.url), 'utf8');
    const bundle = await readFile(new URL('../scripts/response.bundle.js', import.meta.url), 'utf8');
    assert.match(source, /parameters\.version !== "v3" \|\| dataSet !== "forecastNextHour"/);
    assert.match(bundle, /a\.version!=="v3"\|\|t!=="forecastNextHour"/);
    for (const dataset of ['airQuality', 'forecastNextHour', 'weatherAlerts']) {
        assert.ok(source.includes(`case "${dataset}"`), `${dataset} handler`);
    }
});
