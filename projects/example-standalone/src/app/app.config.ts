import { ApplicationConfig } from '@angular/core';

import { provideFilestack } from '@filestack/angular';

/**
 * Standalone application config.
 *
 * `provideFilestack()` is the standalone-friendly replacement for the
 * (deprecated) `FilestackModule.forRoot()`. It registers `FilestackService`
 * and supplies the apikey through the `FILESTACK_CONFIG` injection token, so
 * the picker components pick it up without an `apikey` input on each one.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideFilestack({ apikey: 'YOUR_API_KEY' })
  ]
};
