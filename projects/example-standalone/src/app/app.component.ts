import { Component } from '@angular/core';

import {
  PickerOverlayComponent,
  PickerInlineComponent,
  PickerDropPaneComponent,
} from '@filestack/angular';
import { FilestackError, PickerOptions, PickerResponse } from 'filestack-js';

@Component({
  selector: 'app-root',
  standalone: true,
  // Picker components are standalone, so they are imported directly.
  imports: [
    PickerOverlayComponent,
    PickerInlineComponent,
    PickerDropPaneComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  // Shared picker options passed to the inline / drop-pane examples.
  pickerOptions: PickerOptions = {
    fromSources: ['local_file_system', 'url'],
  };

  onUploadSuccess(res: PickerResponse) {
    console.log('### uploadSuccess', res);
  }

  onUploadError(err: FilestackError) {
    console.log('### uploadError', err);
  }
}
