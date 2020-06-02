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

    @ViewChild('customRender', {static: false})
    customRenderRef: ElementRef;

    ngAfterContentInit() {
      // Overwrite display mode to be always 'overlay' in this component
      this.picker = this.filestackService.picker({
        ...this.pickerOptions,
        displayMode: PickerDisplayMode.overlay,
        onUploadDone: res => this.uploadSuccess.next(res)
      });
    }

    ngAfterViewInit() {
      if (!this.customRenderRef.nativeElement.children.length) {
        // Picker open success handler there is ommited, because it's accessible from pickerOptions
        this.picker.open()
          .then(void(0))
          .catch(err => this.uploadError.next(err));
      }
    }

    @HostListener('click', ['$event'])
    onClick(event) {
      event.stopPropagation();
      event.preventDefault();
      // Picker open success handler there is ommited, because it's accessible from pickerOptions
      this.picker.open()
        .then(void(0))
        .catch(err => this.uploadError.next(err));
    }
}
