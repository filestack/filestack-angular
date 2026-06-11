import {
  DestroyRef,
  Directive,
  OnInit,
  inject,
  input,
  output,
} from '@angular/core';

import {
  ClientOptions,
  FilestackError,
  InputFile,
  PickerInstance,
  PickerOptions,
  PickerResponse,
} from 'filestack-js';

import { FilestackService } from '../filestack.service';

@Directive({})
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
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.generateId();
    this.destroyRef.onDestroy(() => this.picker?.close());
  }

  ngOnInit() {
    this.filestackService.init(this.apikey(), this.clientOptions());
  }

  generateId() {
    this.elementId = `picker-container-${Date.now()}`;
  }
}
