import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FilestackService } from './filestack.service';
import { FilestackTransformPipe } from './filestack-transform.pipe';
import { PickerOverlayComponent } from './picker/pickerOverlay.component';
import { PickerInlineComponent } from './picker/pickerInline.component';
import { PickerDropPaneComponent } from './picker/pickerDropPane.component';
import { FILESTACK_CONFIG, InitialConfig } from './filestack-config';

// Re-exported so existing consumers importing these from the module keep working.
export { FILESTACK_CONFIG, InitialConfig } from './filestack-config';


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
export class FilestackModule {

  static forRoot(config: InitialConfig): ModuleWithProviders<FilestackModule> {

    return {
      ngModule: FilestackModule,
      providers: [FilestackService, { provide: FILESTACK_CONFIG, useValue: config }]
    };
  }
}
