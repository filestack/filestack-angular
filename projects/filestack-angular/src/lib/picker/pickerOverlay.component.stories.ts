import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { provideFilestack } from '../provide-filestack';
import { PickerOverlayComponent } from './pickerOverlay.component';

// Real Filestack apikey so the picker actually loads in Storybook.
// Loaded from the STORYBOOK_FILESTACK_APIKEY env var (see .env).
const APIKEY = process.env['STORYBOOK_FILESTACK_APIKEY'] ?? '';

const meta: Meta<PickerOverlayComponent> = {
  title: 'Filestack/PickerOverlay',
  component: PickerOverlayComponent,
  decorators: [
    applicationConfig({ providers: [provideFilestack({ apikey: APIKEY })] })
  ],
  render: () => ({
    props: {
      onSuccess: (res: unknown) => console.log('uploadSuccess', res),
      onError: (err: unknown) => console.log('uploadError', err)
    },
    // Projected content is the click target that opens the overlay picker.
    template: `
      <div style="padding: 24px;">
        <ng-picker-overlay (uploadSuccess)="onSuccess($event)" (uploadError)="onError($event)">
          <button>Open Filestack Picker</button>
        </ng-picker-overlay>
      </div>
    `
  })
};

export default meta;
type Story = StoryObj<PickerOverlayComponent>;

/** Click the button to open the picker in overlay (modal) mode. */
export const Default: Story = {};
