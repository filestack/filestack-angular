// Shared Storybook config for the picker stories.
// Real Filestack apikey so the pickers actually load in Storybook.
// The apikey is defined in the committed .env.example and loaded into
// process.env by the `env` hook in .storybook/main.ts.
export const STORYBOOK_FILESTACK_APIKEY = process.env['STORYBOOK_FILESTACK_APIKEY'] ?? '';
