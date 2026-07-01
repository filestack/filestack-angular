// Shared Storybook config for the picker stories.
// Real Filestack apikey so the pickers actually load in Storybook.
// Storybook inlines env vars prefixed with STORYBOOK_ into process.env (see .env).
export const STORYBOOK_FILESTACK_APIKEY = process.env['STORYBOOK_FILESTACK_APIKEY'] ?? '';
