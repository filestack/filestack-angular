import {
  Input,
  Output,
  OnInit,
  Inject,
  OnDestroy
} from '@angular/core';
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
  }

  ngOnInit() {
    const {apikey, clientOptions, filestackService} = this;
    filestackService.init(apikey, clientOptions);
  }

  ngOnDestroy() {
    const {picker} = this;
    if (picker) {
      picker.close();
    }
  }
}
