import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
} from '@angular/core';

import { PickerDisplayMode } from 'filestack-js';

import { PickerBaseDirective } from './pickerBase.component';

@Component({
  selector: 'ng-picker-overlay',
  standalone: true,
  template: '<div><ng-content class="ng-picker"></ng-content>@if (isActive) {<div [id]="elementId"></div>}</div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerOverlayComponent extends PickerBaseDirective implements AfterContentInit {

  public isActive = false;

  private cdr = inject(ChangeDetectorRef);

  ngAfterContentInit() {
    // Overwrite display mode to be always 'overlay' in this component
    this.picker = this.filestackService.picker({
      ...this.pickerOptions(),
      rootId: `picker-overlay-${Date.now()}`,
      container: this.elementId,
      displayMode: PickerDisplayMode.overlay,
      onUploadDone: res => this.uploadSuccess.emit(res),
      onClose: () => {
        this.isActive = false;
        this.generateId();
        this.cdr.markForCheck();
      }
    });
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    if (this.isActive) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    this.isActive = true;

    // Picker open success handler there is ommited, because it's accessible from pickerOptions
    this.picker.open().catch(err => this.uploadError.emit(err));
  }
}
