# WeatherKit v3 experimental add-on

This add-on targets v3 responses and is intended to run alongside the original WeatherKit module. Disable other v3 response scripts to avoid processing the same response twice.

The bundle is the upstream v3.3.2 release (SHA-256 `ce1db90d77c44fce972db0c2e319845fc1d6a276d41d772c0294882e59d7f999`) with only the weather response path condition extended to v3. The corresponding source change is in `src/process/Response.mjs`. A source build could not be performed because the GitHub Packages dependencies require authentication.

V3 FlatBuffer compatibility is unverified: unknown fields within rewritten tables might be lost, even though unmodified root tables are preserved by the upstream processor. Disable this add-on if weather data is missing or incorrect. A captured v3 response is needed for compatibility testing.
