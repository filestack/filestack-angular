import type { StorybookConfig } from '@storybook/angular';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Storybook's built-in dotenv only auto-loads .env / .env.local / .env.<mode>.
// We deliberately keep the apikey in the committed .env.example instead, so
// parse it here and expose STORYBOOK_-prefixed vars to the preview build via
// the `env` hook (those vars get inlined into process.env in the browser).
function loadEnvExample(): Record<string, string> {
  const file = resolve(process.cwd(), '.env.example');
  const vars: Record<string, string> = {};
  if (!existsSync(file)) {
    return vars;
  }
  for (const line of readFileSync(file, 'utf-8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !line.trimStart().startsWith('#')) {
      vars[match[1]] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return vars;
}

const config: StorybookConfig = {
  // Stories live next to the library components they document.
  stories: ['../projects/filestack-angular/src/**/*.stories.@(ts|mdx)'],
  addons: [],
  framework: {
    name: '@storybook/angular',
    options: {}
  },
  env: (existing) => ({ ...existing, ...loadEnvExample() })
};

export default config;
