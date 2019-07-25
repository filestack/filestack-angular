import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilestackService } from './filestack.service';
import { FilestackTransformPipe } from './filestack-transform.pipe';
import { PickerOverlayComponent } from './picker/pickerOverlay.component';
import { PickerInlineComponent } from './picker/pickerInline.component';
import { PickerDropPaneComponent } from './picker/pickerDropPane.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    FilestackService
  ],
  declarations: [
    PickerOverlayComponent,
    PickerInlineComponent,
    PickerDropPaneComponent,
    FilestackTransformPipe
  ],
  exports: [
    PickerOverlayComponent,
    PickerInlineComponent,
    PickerDropPaneComponent,
    FilestackTransformPipe
  ]
})
export class FilestackModule {}
