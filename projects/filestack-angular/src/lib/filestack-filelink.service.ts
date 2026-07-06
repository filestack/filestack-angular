import { Injectable, inject } from '@angular/core';
import { Filelink } from 'filestack-js';

import { FilestackService } from './filestack.service';

/**
 * Angular-friendly, injectable wrapper around the filestack-js `Filelink` class
 * for building chained transformation URLs.
 *
 * The apikey is taken from the active {@link FilestackService} client session,
 * so callers don't need to pass it themselves:
 *
 * ```typescript
 * const url = filelink.forHandle('HANDLE').resize({ width: 200 }).toString();
 * ```
 *
 * Requires `FilestackService` to be provided (via `provideFilestack()` or
 * `FilestackModule.forRoot()`).
 */
@Injectable({ providedIn: 'root' })
export class FilestackFilelink {

  private filestackService = inject(FilestackService);

  /**
   * Create a {@link Filelink} for a Filestack handle.
   * @param handle - Filestack file handle
   */
  forHandle(handle: string): Filelink {
    return new Filelink(handle, this.apikey);
  }

  /**
   * Create a {@link Filelink} for an external URL.
   * @param url - Source URL to transform
   */
  forUrl(url: string): Filelink {
    return new Filelink(url, this.apikey);
  }

  private get apikey(): string {
    return this.filestackService.getClientInstance().session.apikey;
  }
}
