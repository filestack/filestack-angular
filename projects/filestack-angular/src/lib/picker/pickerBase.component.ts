import {
  DestroyRef,
  Directive,
  OnInit,
  PLATFORM_ID,
  inject,
  input,
  output,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
  ClientOptions,
  FilestackError,
  InputFile,
  PickerInstance,
  PickerOptions,
  PickerResponse,
} from 'filestack-js';

import { FilestackService } from '../filestack.service';

@Directive({
  standalone: true
})
export abstract class PickerBaseDirective implements OnInit {

  public elementId = 'picker-container';

  readonly apikey = input<string>();
  readonly pickerOptions = input<PickerOptions>();
  readonly clientOptions = input<ClientOptions>();
  readonly file = input<InputFile>();
  readonly source = input<string>();

  readonly uploadSuccess = output<PickerResponse>();
  readonly uploadError = output<FilestackError>();

  picker: PickerInstance;

  protected filestackService = inject(FilestackService);
  protected platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.generateId();
    this.destroyRef.onDestroy(() => this.picker?.close());
  }

  ngOnInit() {
    // filestack-js client init is DOM-free, but there's no value initializing
    // it on the server where the picker can never open.
    if (isPlatformBrowser(this.platformId)) {
      this.filestackService.init(this.apikey(), this.clientOptions());
    }
  }

  generateId() {
    this.elementId = `picker-container-${Date.now()}`;
  }
}
