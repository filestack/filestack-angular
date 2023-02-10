import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';

import { PickerDisplayMode } from 'filestack-js';

import { PickerBaseDirective } from './pickerBase.component';

@Component({
  selector: 'ng-picker-overlay',
  template: '<div><ng-content class="ng-picker"></ng-content><div *ngIf="isActive" [id]="elementId"></div></div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerOverlayComponent extends PickerBaseDirective implements AfterContentInit {

  public isActive = false;

  @HostListener('click', ['$event'])
  onClick(event) {
    if (this.isActive) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    this.isActive = true;

    // Picker open success handler there is ommited, because it's accessible from pickerOptions
    this.picker.open().catch(err => this.uploadError.next(err));
  }

  ngAfterContentInit() {
    // Overwrite display mode to be always 'overlay' in this component
    this.picker = this.filestackService.picker({
      ...this.pickerOptions,
      rootId: `picker-overlay-${Date.now()}`,
      container: this.elementId,
      displayMode: PickerDisplayMode.overlay,
      onUploadDone: res => this.uploadSuccess.next(res),
      onClose: () => {
        this.isActive = false;
        this.generateId();
      }
    });

    console.log({
      ...this.pickerOptions,
      container: `#${this.elementId}`,
      displayMode: PickerDisplayMode.overlay,
      onUploadDone: res => this.uploadSuccess.next(res),
      onClose: () => {
        this.isActive = false;
        this.generateId();
      }
    });
  }
}
