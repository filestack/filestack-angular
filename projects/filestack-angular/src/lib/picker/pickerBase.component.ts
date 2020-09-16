import { Input, Output, OnInit, Inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FilestackService } from '../filestack.service';
import {
  PickerInstance,
  PickerOptions,
  ClientOptions,
  InputFile,
  PickerResponse,
  FilestackError
} from 'filestack-js';


export abstract class PickerBaseComponent implements OnInit, OnDestroy {

  public elementId = 'picker-container';

  @Input() apikey: string;
  @Input() pickerOptions: PickerOptions;
  @Input() clientOptions: ClientOptions;
  @Input() file: InputFile;
  @Input() source: string;

  @Output() uploadSuccess: Subject<PickerResponse>;
  @Output() uploadError: Subject<FilestackError>;

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
