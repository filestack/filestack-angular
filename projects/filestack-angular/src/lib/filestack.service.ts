import { FILESTACK_CONFIG } from './filestack-config';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { from, Observable } from 'rxjs';
import {
  PickerOptions,
  PickerInstance,
  StoreParams,
  TransformOptions,
  InputFile,
  RetrieveOptions,
  MetadataOptions,
  Security,
  UploadOptions,
  StoreUploadOptions,
  PreviewOptions,
  ClientOptions,
  Client,
  FilestackError,
  PrefetchOptions,
  PrefetchResponse,
  UploadTags,
  init,
} from 'filestack-js';

/**
 * Response returned by {@link FilestackService.download}.
 *
 * filestack-js declares `FsResponse` internally but does not re-export it from
 * its public entrypoint, so we derive it from the client's `download` signature
 * to expose a named, stable type to consumers (works on both v3 and v4).
 */
export type FsResponse = Awaited<ReturnType<Client['download']>>;

/**
 * Emitted by {@link FilestackService.uploadWithProgress} as an upload advances.
 *
 * - `progress` — an intermediate progress tick (`totalPercent` / `totalBytes`)
 * - `complete` — the upload finished successfully; `file` holds the result
 * - `error` — the upload failed; `error` holds the FilestackError
 */
export interface UploadProgress {
  status: 'progress' | 'complete' | 'error';
  totalBytes: number;
  totalPercent: number;
  file?: object;
  error?: FilestackError;
}


@Injectable()
export class FilestackService {

  private clientInstance: Client;

  private clientOptions: ClientOptions;

  private apikey: string;

  private config = inject(FILESTACK_CONFIG, { optional: true });

  private platformId = inject(PLATFORM_ID);

  constructor() {
    if (!this.config) {
      return;
    }

    this.clientOptions = this.config.options;
    this.apikey = this.config.apikey;
  }

  private get client(): Client {
    if (!this.clientInstance) {
      return this.init();
    }

    return this.clientInstance;
  }

  private set client(client: Client) {
    this.clientInstance = client;
  }

  /**
   * Set another client instance as this one used by FilestackService
   * @param client - An instance of filestack client class
   */
  setClientInstance(client: Client) {
    if (client) {
      this.client = client;
    }
  }

  /**
   * Returns the underlying filestack-js client instance (lazily initialized).
   * Useful for accessing client internals such as the active session/apikey.
   */
  getClientInstance(): Client {
    return this.client;
  }

  /**
   * Initialize filestack client
   * @param apikey - Filestack apikey
   * @param clientOptions - Client options
   */
  init(apikey?: string, clientOptions?: ClientOptions): Client {
    this.client = init(apikey || this.apikey, clientOptions || this.clientOptions);

    return this.client;
  }

  /**
   * Instance of picker class
   * @param options - picker options
   */
  picker(options?: PickerOptions): PickerInstance {
    return this.client.picker(options);
  }

  /**
   * Lazily load filestack-js and open a picker on demand.
   *
   * Uses a dynamic `import('filestack-js')` so apps that don't immediately show
   * the picker can keep the SDK out of their initial bundle (it loads in a
   * separate chunk the first time `openPicker` is called). Returns the opened
   * `PickerInstance`, or `null` when running on the server (SSR).
   * @param options - picker options
   */
  async openPicker(options?: PickerOptions): Promise<PickerInstance | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const filestack = await import('filestack-js');
    const client = this.clientInstance ?? (this.client = filestack.init(this.apikey, this.clientOptions));
    const picker = client.picker(options);
    await picker.open();

    return picker;
  }

  /**
   * Generate url with filestack transformations
   * @param url - Filestack handle or external url
   * @param options - Transformation options
   * @param b64 - Encode url params in base64
   */
  transform(
    url: string | string[],
    options: TransformOptions,
    b64?: boolean
  ): string {
    return this.client.transform(url, options, b64);
  }

  /**
   * Access files via their Filestack handles
   * @param handle - Filestack handle
   * @param options - Retrieve options
   * @param security - Filestack security object
   * @deprecated Since filestack-js v4. Use {@link FilestackService.download}
   * (to fetch file contents) or {@link FilestackService.metadata} (for file
   * details) instead. `retrieve()` will be removed in a future major release.
   */
  retrieve(
    handle: string,
    options?: RetrieveOptions,
    security?: Security
  ): Observable<object | Blob> {
    return from(this.client.retrieve(handle, options, security));
  }

  /**
   * Retrieve detailed data of stored files
   * @param handle - Filestack handle
   * @param options - Metadata options
   * @param security - Filestack security object
   */
  metadata(
    handle: string,
    options?: MetadataOptions,
    security?: Security
  ): Observable<object> {
    return from(this.client.metadata(handle, options, security));
  }

  /**
   * Store a file from its URL
   * @param url - Valid url to file
   * @param options - Store params
   * @param token - Optional control token to call .cancel()
   * @param security - Filestack security object
   * @param uploadTags - Optional key/value tags to attach to the stored file (filestack-js v4+)
   * @param headers - Optional request headers to send with the store request (filestack-js v4+)
   * @param workflowIds - Optional Filestack Workflow ids to trigger after storing (filestack-js v4+)
   */
  storeURL(
    url: string,
    options?: StoreParams,
    token?: string,
    security?: Security,
    uploadTags?: UploadTags,
    headers?: { [key: string]: string },
    workflowIds?: string[]
  ): Observable<object> {
    return from(this.client.storeURL(url, options, token, security, uploadTags, headers, workflowIds));
  }

  /**
   * Download a file via its Filestack handle (filestack-js v4+).
   *
   * Recommended replacement for the deprecated {@link FilestackService.retrieve}.
   * @param handle - Filestack handle
   * @param security - Filestack security object
   */
  download(handle: string, security?: Security): Observable<FsResponse> {
    return from(this.client.download(handle, security));
  }

  /**
   * Make a basic prefetch request to check permissions before running
   * operations (filestack-js v4+).
   * @param params - Prefetch options
   */
  prefetch(params: PrefetchOptions): Observable<PrefetchResponse> {
    return from(this.client.prefetch(params));
  }

  /**
   * Update the security object used by the client at runtime (filestack-js v4+).
   * @param security - Filestack security object
   */
  setSecurity(security: Security): void {
    this.client.setSecurity(security);
  }

  /**
   * Update the CNAME used by the client at runtime (filestack-js v4+).
   * @param cname - Custom domain name
   */
  setCname(cname: string): void {
    this.client.setCname(cname);
  }

  /**
   * Upload a provided file
   * @param file - A file or array of files to upload
   * @param options - Upload options
   * @param storeOptions - Store options
   * @param token - Optional control token to call .cancel()
   * @param security - Filestack security object
   */
  upload(
    file: InputFile | InputFile[],
    options?: UploadOptions,
    storeOptions?: StoreUploadOptions,
    token?: string,
    security?: Security
  ): Observable<object> {
    if (Array.isArray(file)) {
      return from(this.client.multiupload(file, options, storeOptions, token, security));
    }

    return from(this.client.upload(file, options, storeOptions, token, security));
  }

  /**
   * Upload a single file while emitting progress updates.
   *
   * Emits `{ status: 'progress' }` ticks as the upload advances (driven by
   * filestack-js' `onProgress`), then a final `{ status: 'complete', file }`
   * before completing. On failure it emits `{ status: 'error', error }` and
   * errors the observable.
   * @param file - A file to upload
   * @param options - Upload options
   * @param storeOptions - Store options
   * @param security - Filestack security object
   */
  uploadWithProgress(
    file: InputFile,
    options?: UploadOptions,
    storeOptions?: StoreUploadOptions,
    security?: Security
  ): Observable<UploadProgress> {
    return new Observable<UploadProgress>((subscriber) => {
      let lastBytes = 0;

      const uploadOptions: UploadOptions = {
        ...options,
        onProgress: (evt) => {
          lastBytes = evt.totalBytes;
          subscriber.next({
            status: 'progress',
            totalBytes: evt.totalBytes,
            totalPercent: evt.totalPercent
          });
        }
      };

      this.client.upload(file, uploadOptions, storeOptions, undefined, security)
        .then((result) => {
          subscriber.next({
            status: 'complete',
            totalBytes: lastBytes,
            totalPercent: 100,
            file: result
          });
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.next({
            status: 'error',
            totalBytes: lastBytes,
            totalPercent: 0,
            error
          });
          subscriber.error(error);
        });
    });
  }

  /**
   * Remove a file from storage and the Filestack system
   * @param handle - Filestack handle
   * @param security - Filestack security object
   */
  remove(handle: string, security: Security): Observable<object> {
    return from(this.client.remove(handle, security));
  }

  /**
   * Remove a file only from the Filestack system. The file remains in storage
   * @param handle - Filestack handle
   * @param security - Filestack security object
   */
  removeMetadata(handle: string, security: Security): Observable<object> {
    return from(this.client.removeMetadata(handle, security));
  }

  /**
   * Used for viewing files via Filestack handles or storage aliases.
   *
   * Returns `null` when running on the server (SSR), since preview renders into
   * the DOM and has no meaning outside the browser.
   * @param handle - Filestack handle
   * @param options - Preview options
   */
  preview(
    handle: string,
    options?: PreviewOptions
  ): HTMLIFrameElement | Window | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return this.client.preview(handle, options);
  }

  /**
   * Clear all current cloud sessions in the picker or
   * particular one if name is passed
   * @param name - Optional cloud name to be passed
   */
  logout(name?: string): Observable<object> {
    return from(this.client.logout(name));
  }
}
