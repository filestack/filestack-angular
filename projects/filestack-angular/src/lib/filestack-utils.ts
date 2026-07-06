/**
 * Convenience re-exports of filestack-js standalone utility functions, so
 * consumers can import them directly from `@filestack/angular` rather than
 * adding a second import from `filestack-js`.
 *
 * These helpers are stateless and version-stable across filestack-js v3 and v4:
 * - `getSecurity` — generate a Filestack policy/signature pair from an app secret
 * - `validateWebhookSignature` — verify an incoming Filestack webhook payload
 * - `getMimetype` — detect the mimetype of a File/Blob
 */
export {
  getSecurity,
  validateWebhookSignature,
  getMimetype,
  SecurityOptions,
  WebhookValidatePayload
} from 'filestack-js';
