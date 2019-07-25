import {
    Component,
    ChangeDetectionStrategy,
    AfterViewInit,
    HostListener,
    ViewChild,
    ElementRef,
    AfterContentInit
} from '@angular/core';
import { PickerBaseComponent } from './pickerBase.component';
import { PickerDisplayMode } from 'filestack-js';
@Component({
    selector: 'ng-picker-overlay',
    template: '<div #customRender><ng-content class="ng-picker"></ng-content></div>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerOverlayComponent extends PickerBaseComponent implements AfterContentInit, AfterViewInit {
    @ViewChild('customRender', {static: false}) customRenderRef: ElementRef;

    ngAfterContentInit() {
      const { filestackService, uploadSuccess, pickerOptions } = this;

      // Overwrite display mode to be always 'overlay' in this component
      this.picker = filestackService.picker({
        ...pickerOptions,
        displayMode: PickerDisplayMode.overlay,
        onUploadDone: res => uploadSuccess.next(res)
      });
    }

    ngAfterViewInit() {
      const {picker, customRenderRef, uploadError} = this;
      if (!customRenderRef.nativeElement.children.length) {
        // Picker open success handler there is ommited, because it's accessible from pickerOptions
        picker.open()
          .then(void(0))
          .catch(err => uploadError.next(err));
      }
    }

    @HostListener('click', ['$event'])
    onClick(event) {
      const {picker, uploadError} = this;
      event.stopPropagation();
      event.preventDefault();
      // Picker open success handler there is ommited, because it's accessible from pickerOptions
      picker.open()
        .then(void(0))
        .catch(err => uploadError.next(err));
    }
}
