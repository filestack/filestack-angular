import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { PickerDisplayMode } from 'filestack-js';

import { PickerBaseDirective } from './pickerBase.component';

@Component({
  selector: 'ng-picker-inline',
  standalone: true,
  template: '<div [id]="elementId" class="ng-picker"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerInlineComponent extends PickerBaseDirective implements AfterContentInit {
  ngAfterContentInit() {
    // Picker creation/open accesses the DOM (document); skip it on the server.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Overwrite display mode to be always 'inline' in this component
    this.picker = this.filestackService.picker({
      ...this.pickerOptions(),
      rootId: `picker-inline-${Date.now()}`,
      displayMode: PickerDisplayMode.inline,
      container: this.elementId,
      onUploadDone: res => this.uploadSuccess.emit(res)
    });

    // Picker open success handler there is ommited, because it's accessible from pickerOptions
    this.picker.open()
      .catch(err => this.uploadError.emit(err));
  }
}
