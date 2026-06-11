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
    // Components and the pipe are standalone, so they are imported (not declared).
    PickerOverlayComponent,
    PickerInlineComponent,
    PickerDropPaneComponent,
    FilestackTransformPipe
  ],
  providers: [
    FilestackService
  ],
  exports: [
    PickerOverlayComponent,
    PickerInlineComponent,
    PickerDropPaneComponent,
    FilestackTransformPipe
  ]
})
export class FilestackModule {

  /**
   * @deprecated Prefer the standalone `provideFilestack(config)` with
   * `bootstrapApplication()` / `ApplicationConfig`. `FilestackModule.forRoot()`
   * is kept for backward compatibility and will be removed in a future major release.
   */
  static forRoot(config: InitialConfig): ModuleWithProviders<FilestackModule> {

    return {
      ngModule: FilestackModule,
      providers: [FilestackService, { provide: FILESTACK_CONFIG, useValue: config }]
    };
  }
}
