import { TestBed } from '@angular/core/testing';

import { FILESTACK_CONFIG } from './filestack-config';
import { FilestackModule } from './filestack.module';
import { FilestackService } from './filestack.service';

describe('FilestackModule', () => {
  describe('forRoot', () => {
    it('should return a ModuleWithProviders pointing at FilestackModule', () => {
      const moduleWithProviders = FilestackModule.forRoot({ apikey: 'test-key' });

      expect(moduleWithProviders.ngModule).toBe(FilestackModule);
    });

    it('should provide FilestackService and the config under FILESTACK_CONFIG', () => {
      const config = { apikey: 'test-key', options: {} };

      const providers = FilestackModule.forRoot(config).providers as any[];

      expect(providers).toContain(FilestackService);
      const configProvider = providers.find(p => p && p.provide === FILESTACK_CONFIG);
      expect(configProvider).toBeDefined();
      expect(configProvider.useValue).toBe(config);
    });
  });

  describe('dependency injection', () => {
    it('should inject the forRoot config into FilestackService', () => {
      const config = { apikey: 'injected-key', options: { cname: 'cdn.example.com' } };

      TestBed.configureTestingModule({
        imports: [FilestackModule.forRoot(config)]
      });
      const service = TestBed.inject(FilestackService);

      expect(service).toBeTruthy();
      expect((service as any).apikey).toBe('injected-key');
      expect((service as any).clientOptions).toBe(config.options);
    });

    it('should construct FilestackService even without forRoot config', () => {
      TestBed.configureTestingModule({
        imports: [FilestackModule]
      });

      expect(TestBed.inject(FilestackService)).toBeTruthy();
    });
  });
});
