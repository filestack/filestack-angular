import {
  Component,
  OnInit,
} from '@angular/core';
import { FilestackService } from './../../../../dist/filestack-angular';
import {
  InputFile,
  TransformOptions,
  PickerOptions
} from 'filestack-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  apikey: string;
  action: string;
  clientOptions: object;
  file: InputFile;
  source: string;
  pickerOptions: PickerOptions;
  transformOptions: TransformOptions;
  isInline = false;
  isDropPane = false;

  constructor(private filestackService: FilestackService) {}

  ngOnInit() {
      this.apikey = 'A0NTRSxHcR66kmTku9Gcsz';
      this.clientOptions = {
        sessionCache: false
      };
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
