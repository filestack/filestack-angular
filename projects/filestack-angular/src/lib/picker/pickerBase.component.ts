import {
  Directive,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import {
  ClientOptions,
  FilestackError,
  InputFile,
  PickerInstance,
  PickerOptions,
  PickerResponse,
} from 'filestack-js';
import { Subject } from 'rxjs';

import { FilestackService } from '../filestack.service';

@Directive({})
export abstract class PickerBaseDirective implements OnInit, OnDestroy {

  @Input() apikey: string;
  @Input() pickerOptions: PickerOptions;
  @Input() clientOptions: ClientOptions;
  @Input() file: InputFile;
  @Input() source: string;

  @Output() uploadSuccess: Subject<PickerResponse>;
  @Output() uploadError: Subject<FilestackError>;

  public elementId = 'picker-container';

  picker: PickerInstance;

  constructor(@Inject(FilestackService) protected filestackService: FilestackService) {
    this.uploadSuccess = new Subject();
    this.uploadError = new Subject();

    this.generateId();
  }

  ngOnInit() {
    this.filestackService.init(this.apikey, this.clientOptions);
  }

  generateId() {
    this.elementId = `picker-container-${Date.now()}`;
  }

  ngOnDestroy() {
    if (this.picker) {
      this.picker.close();
    }
  }
}
