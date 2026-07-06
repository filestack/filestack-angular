import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { FILESTACK_CONFIG, InitialConfig } from './filestack-config';
import { FilestackService } from './filestack.service';

/**
 * Standalone-friendly alternative to `FilestackModule.forRoot()`.
 *
 * Registers {@link FilestackService} and supplies the apikey/options through the
 * {@link FILESTACK_CONFIG} injection token. Use it in `bootstrapApplication()`
 * or an `ApplicationConfig`:
 *
 * ```typescript
 * bootstrapApplication(AppComponent, {
 *   providers: [provideFilestack({ apikey: 'YOUR_API_KEY' })]
 * });
 * ```
 *
 * @param config - Filestack apikey and optional client options
 */
export function provideFilestack(config: InitialConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    FilestackService,
    { provide: FILESTACK_CONFIG, useValue: config }
  ]);
}
