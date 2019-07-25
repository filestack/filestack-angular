import {
    Component,
    ChangeDetectionStrategy,
    AfterContentInit
} from '@angular/core';
import { PickerBaseComponent } from './pickerBase.component';
import { PickerDisplayMode } from 'filestack-js';
@Component({
    selector: 'ng-picker-drop-pane',
    template: '<div id="ng-picker-drop-pane-container" class="ng-picker"></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerDropPaneComponent extends PickerBaseComponent implements AfterContentInit {
    ngAfterContentInit() {
      const { filestackService, uploadSuccess, uploadError, pickerOptions } = this;

      // Overwrite display mode to be always 'dropPane' in this component
      this.picker = filestackService.picker({
        ...pickerOptions,
        displayMode: PickerDisplayMode.dropPane,
        container: 'ng-picker-drop-pane-container',
        onUploadDone: res => uploadSuccess.next(res)
      });

      // Picker open success handler there is ommited, because it's accessible from pickerOptions
      this.picker.open()
        .then(void(0))
        .catch(err => uploadError.next(err));
    }
}
