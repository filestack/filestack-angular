import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { PickerDisplayMode } from 'filestack-js';

import { PickerBaseDirective } from './pickerBase.component';

@Component({
  selector: 'ng-picker-overlay',
  standalone: true,
  template: '<div><ng-content class="ng-picker"></ng-content>@if (isActive()) {<div [id]="elementId"></div>}</div>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickerOverlayComponent extends PickerBaseDirective implements AfterContentInit {

  // Signal so state changes drive change detection without zone.js (zoneless-ready).
  readonly isActive = signal(false);

  ngAfterContentInit() {
    // Picker creation accesses the DOM (document); skip it on the server.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Overwrite display mode to be always 'overlay' in this component
    this.picker = this.filestackService.picker({
      ...this.pickerOptions(),
      rootId: this.uniqueId('picker-overlay'),
      container: this.elementId,
      displayMode: PickerDisplayMode.overlay,
      onUploadDone: res => this.uploadSuccess.emit(res),
      onClose: () => {
        // Setting the signal schedules change detection under both zone and
        // zoneless modes — no ChangeDetectorRef.markForCheck() needed.
        this.isActive.set(false);
        this.generateId();
      }
    });
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    if (this.isActive()) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    this.isActive.set(true);

    // Picker open success handler there is ommited, because it's accessible from pickerOptions
    this.picker.open().catch(err => this.uploadError.emit(err));
  }
}
