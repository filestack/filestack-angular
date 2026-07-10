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

// Monotonic counter guaranteeing unique picker DOM ids per instance.
// A timestamp alone (Date.now()) collides when several pickers are created in
// the same tick, making them share one id — so document.getElementById resolves
// them all to the first element and the rest render nothing.
let pickerInstanceCounter = 0;

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
    this.elementId = this.uniqueId('picker-container');
  }

  /**
   * Build a DOM id that is unique across every picker instance on the page,
   * even ones created within the same millisecond. Used for both the container
   * element id and the picker's `rootId`.
   */
  protected uniqueId(prefix: string): string {
    return `${prefix}-${Date.now()}-${pickerInstanceCounter++}`;
  }
}
