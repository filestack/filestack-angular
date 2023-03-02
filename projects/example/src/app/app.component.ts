import { Component,  OnInit} from '@angular/core';
import { FilestackService } from './../../../filestack-angular/src/public-api';
import { InputFile, TransformOptions, PickerOptions } from 'filestack-js';
import { Code } from './examples';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  action: string;
  clientOptions: object;
  file: InputFile;
  source: string;
  pickerOptions: PickerOptions;
  transformOptions: TransformOptions;
  isInline = false;
  isDropPane = false;

  exampleCodes = Code;

  constructor(private filestackService: FilestackService) {}

  ngOnInit() {
      this.pickerOptions = {
        onOpen: () => {
          console.log('### Open picker event');
        },
        onFileUploadProgress: (res) => {
          console.log('### File upload progress', res);
        }
      };

      this.transformOptions = {
        resize: {
          width: 400
        },
        sepia: {
          tone: 80
        }
      };
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  showDropPane() {
    this.isInline = false;
    this.isDropPane = true;
  }

  showInline() {
    this.isDropPane = false;
    this.isInline = true;
  }

  uploadFile() {
    this.filestackService.upload(this.file)
      .subscribe(value => console.log(value));
  }

  onUploadSuccess(res: object) {
    console.log('###uploadSuccess', res);
  }

  onUploadError(err: object) {
    console.log('###uploadError', err);
  }
}
