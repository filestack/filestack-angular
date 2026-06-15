import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { FilestackTransformPipe } from './filestack-transform.pipe';
import { FilestackService } from './filestack.service';

// Mock so stories render without a real apikey / network call.
const filestackServiceMock = {
  transform: (value: string) =>
    `https://cdn.filestackcontent.com/resize=width:200/${value}`
};

const meta: Meta = {
  title: 'Filestack/TransformPipe',
  decorators: [
    moduleMetadata({ imports: [FilestackTransformPipe] }),
    applicationConfig({
      providers: [{ provide: FilestackService, useValue: filestackServiceMock }]
    })
  ]
};

export default meta;
type Story = StoryObj;

/** Shows the transformation URL produced by the `filestackTransform` pipe. */
export const TransformedUrl: Story = {
  render: () => ({
    template: `<code>{{ '5aYkEQJSQCmYShsoCnZN' | filestackTransform: { resize: { width: 200 } } }}</code>`
  })
};

/** Uses the pipe directly in an &lt;img&gt; src binding. */
export const AsImage: Story = {
  render: () => ({
    template: `<img [src]="'5aYkEQJSQCmYShsoCnZN' | filestackTransform: { resize: { width: 200 } }" alt="transformed" />`
  })
};
