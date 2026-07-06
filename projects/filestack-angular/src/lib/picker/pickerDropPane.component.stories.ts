import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';

import { provideFilestack } from '../provide-filestack';
import { PickerDropPaneComponent } from './pickerDropPane.component';
import { STORYBOOK_FILESTACK_APIKEY } from '../../../../../.storybook/storybook.config';

// Real Filestack apikey so the drop-pane picker actually loads in Storybook.
const APIKEY = STORYBOOK_FILESTACK_APIKEY;

const meta: Meta<PickerDropPaneComponent> = {
  title: 'Filestack/PickerDropPane',
  component: PickerDropPaneComponent,
  decorators: [
    applicationConfig({ providers: [provideFilestack({ apikey: APIKEY })] })
  ],
  render: () => ({
    props: {
      onSuccess: (res: unknown) => console.log('uploadSuccess', res),
      onError: (err: unknown) => console.log('uploadError', err)
    },
    // Drop-pane mounts into its container, which needs a visible size.
    template: `
      <div style="width: 600px; height: 400px;">
        <ng-picker-drop-pane (uploadSuccess)="onSuccess($event)" (uploadError)="onError($event)"></ng-picker-drop-pane>
      </div>
    `
  })
};

export default meta;
type Story = StoryObj<PickerDropPaneComponent>;

/** Drop-pane picker — renders a drag-and-drop area into its container on init. */
export const Default: Story = {};
