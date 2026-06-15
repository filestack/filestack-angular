import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  // Stories live next to the library components they document.
  stories: ['../projects/filestack-angular/src/**/*.stories.@(ts|mdx)'],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {}
  }
};

export default config;
