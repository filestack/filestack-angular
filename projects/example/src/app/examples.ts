export const code = {
  importCode: `import { FilestackModule } from '@filestack/angular';

@NgModule({
  imports: [
    FilestackModule.forRoot({ apikey: YOUR_APIKEY, options: ClientConfig })
  ]
}

export class AppModule { }`,

  example1: `<ng-picker-overlay
  (uploadSuccess)="onUploadSuccess($event)"
  (uploadError)="onUploadError($event)">
  <button mat-raised-button color="primary">Open Picker</button>
</ng-picker-overlay>`,
  example2: `<ng-picker-inline
  [pickerOptions]="pickerOptions"
  (uploadSuccess)="onUploadSuccess($event)"
  (uploadError)="onUploadError($event)"
>
</ng-picker-inline>`,
  example3: `<ng-picker-drop-pane
(uploadSuccess)="onUploadSuccess($event)"
(uploadError)="onUploadError($event)"
>
</ng-picker-drop-pane>`,
  example4: `<img class="example5img" src="{{ '5aYkEQJSQCmYShsoCnZN' | filestackTransform: transformOptions }}"/>`,
  example5: ``,
};
