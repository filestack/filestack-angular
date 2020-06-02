import {
    Component,
    ChangeDetectionStrategy,
    AfterContentInit
} from '@angular/core';
import { PickerBaseComponent } from './pickerBase.component';
import { PickerDisplayMode } from 'filestack-js';
@Component({
    selector: 'ng-picker-inline',
    template: '<div id="ng-picker-inline-container" class="ng-picker"></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerInlineComponent extends PickerBaseComponent implements AfterContentInit {
    ngAfterContentInit() {

      // Overwrite display mode to be always 'inline' in this component
      this.picker = this.filestackService.picker({
        ...this.pickerOptions,
        displayMode: PickerDisplayMode.inline,
        container: 'ng-picker-inline-container',
        onUploadDone: res => this.uploadSuccess.next(res)
      });

      // Picker open success handler there is ommited, because it's accessible from pickerOptions
      this.picker.open()
        .then(void(0))
        .catch(err => this.uploadError.next(err));
    }
}
