import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { provideFilestack } from '../provide-filestack';
import { PickerInlineComponent } from './pickerInline.component';

// Real Filestack apikey so the inline picker actually loads in Storybook.
const APIKEY = 'AChYFTnwRzuITHHX95rDmz';

const meta: Meta<PickerInlineComponent> = {
  title: 'Filestack/PickerInline',
  component: PickerInlineComponent,
  decorators: [
    applicationConfig({ providers: [provideFilestack({ apikey: APIKEY })] })
  ],
  render: () => ({
    props: {
      onSuccess: (res: unknown) => console.log('uploadSuccess', res),
      onError: (err: unknown) => console.log('uploadError', err)
    },
    // Inline picker mounts into its container, which needs a visible size.
    template: `
      <div style="width: 600px; height: 500px;">
        <ng-picker-inline (uploadSuccess)="onSuccess($event)" (uploadError)="onError($event)"></ng-picker-inline>
      </div>
    `
  })
};

export default meta;
type Story = StoryObj<PickerInlineComponent>;

/** Inline picker — mounts and opens into its container on init. */
export const Default: Story = {};
