import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { PickerDisplayMode } from 'filestack-js';

import { PickerBaseDirective } from './pickerBase.component';

@Component({
  selector: 'ng-picker-drop-pane',
  template: '<div [id]="elementId" class="ng-picker"></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerDropPaneComponent extends PickerBaseDirective implements AfterContentInit {
  ngAfterContentInit() {
    // Overwrite display mode to be always 'dropPane' in this component
    this.picker = this.filestackService.picker({
      ...this.pickerOptions,
      rootId: `picker-overlay-${Date.now()}`,
      displayMode: PickerDisplayMode.dropPane,
      container: this.elementId,
      onUploadDone: res => this.uploadSuccess.next(res)
    });

    // Picker open success handler there is ommited, because it's accessible from pickerOptions
    this.picker.open()
      .then(void (0))
      .catch(err => this.uploadError.next(err));
  }
}
