import { InjectionToken } from '@angular/core';
import { ClientOptions } from 'filestack-js';

export type InitialConfig = {
  apikey?: string,
  options?: ClientOptions
};

/**
 * DI token carrying the apikey/options supplied through `FilestackModule.forRoot()`.
 *
 * Lives in its own module (rather than in `filestack.module.ts`) so that
 * `FilestackService` can depend on it without creating a circular import
 * between the service and the NgModule.
 */
export const FILESTACK_CONFIG = new InjectionToken<InitialConfig>('filestack.config');
