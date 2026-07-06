/** Options for the `ng add @filestack/angular` schematic. */
export interface Schema {
  /** Target Angular project name (defaults to the workspace's default project). */
  project?: string;
  /** Filestack API key to wire into `provideFilestack({ apikey })`. */
  apikey?: string;
  /** When true, append a sample `<ng-picker-overlay>` snippet to the root template. */
  addSample?: boolean;
}
