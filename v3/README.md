# WeatherKit v3 experimental add-on

This add-on runs alongside the original WeatherKit module. Disable other v3 response scripts. For v3 it processes only currentWeather, forecastDaily, and forecastHourly; air quality, alerts and other root datasets remain untouched. The current weather provider defaults to ColorfulClouds for CN unless configured otherwise.

The bundle is based on the upstream v3.3.2 release (SHA-256 `ce1db90d77c44fce972db0c2e319845fc1d6a276d41d772c0294882e59d7f999`), with the v3 route, dataset restriction, and daily forecast merge fixes applied. Corresponding source changes are in `src/process/Response.mjs` and `src/class/Weather.mjs`. GitHub Packages authentication prevented a source build, so the changes were applied directly to the verified release bundle.

A captured v3 FlatBuffer and a live provider response were used to check that the three forecast slots are rewritten without a daily encoder error, and all other original root slots, including unknown slot 14, remain linked to original bytes. Fields within rewritten tables and operation on an actual device remain unverified. Disable this add-on if weather data is missing or incorrect.
