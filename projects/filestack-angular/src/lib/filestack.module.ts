import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { FilestackService } from "./filestack.service";
import { FilestackTransformPipe } from "./filestack-transform.pipe";
import { PickerOverlayComponent } from "./picker/pickerOverlay.component";
import { PickerInlineComponent } from "./picker/pickerInline.component";
import { PickerDropPaneComponent } from "./picker/pickerDropPane.component";
import { ClientOptions } from "filestack-js";

export type InitialConfig = {
  apikey?: string;
  options?: ClientOptions;
};

export const FILSTACK_CONFIG = new InjectionToken<InitialConfig>("config");

@NgModule({
  imports: [CommonModule],
  providers: [FilestackService],
  declarations: [
    PickerOverlayComponent,
    PickerInlineComponent,
    PickerDropPaneComponent,
    FilestackTransformPipe,
  ],
  exports: [
    PickerOverlayComponent,
    PickerInlineComponent,
    PickerDropPaneComponent,
    FilestackTransformPipe,
  ],
})
export class FilestackModule {
  static forRoot(config: InitialConfig): ModuleWithProviders<FilestackModule> {
    return {
      ngModule: FilestackModule,
      providers: [
        FilestackService,
        { provide: FILSTACK_CONFIG, useValue: config },
      ],
    };
  }
}
