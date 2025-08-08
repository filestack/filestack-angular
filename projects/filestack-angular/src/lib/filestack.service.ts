import { FILSTACK_CONFIG, InitialConfig } from "./filestack.module";
import { Injectable, Inject, Optional } from "@angular/core";
import { from, Observable } from "rxjs";
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
  init,
} from "filestack-js";

@Injectable()
export class FilestackService {
  private clientInstance: Client;

  private clientOptions: ClientOptions;

  private apikey: string;

  constructor(
    @Optional() @Inject(FILSTACK_CONFIG) private config?: InitialConfig
  ) {
    if (!config) {
      return;
    }

    this.clientOptions = config.options;
    this.apikey = config.apikey;
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
   * Initialize filestack client
   * @param apikey - Filestack apikey
   * @param clientOptions - Client options
   */
  init(apikey?: string, clientOptions?: ClientOptions): Client {
    this.client = init(
      apikey || this.apikey,
      clientOptions || this.clientOptions
    );

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
   */
  storeURL(
    url: string,
    options?: StoreParams,
    token?: string,
    security?: Security
  ): Observable<object> {
    return from(this.client.storeURL(url, options, token, security));
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
      return from(
        this.client.multiupload(file, options, storeOptions, token, security)
      );
    }

    return from(
      this.client.upload(file, options, storeOptions, token, security)
    );
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
   * Used for viewing files via Filestack handles or storage aliases
   * @param handle - Filestack handle
   * @param options - Preview options
   */
  preview(
    handle: string,
    options?: PreviewOptions
  ): HTMLIFrameElement | Window {
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
