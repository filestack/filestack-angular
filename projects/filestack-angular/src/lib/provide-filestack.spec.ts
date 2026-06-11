import { TestBed } from '@angular/core/testing';

import { FILESTACK_CONFIG } from './filestack-config';
import { FilestackService } from './filestack.service';
import { provideFilestack } from './provide-filestack';

describe('provideFilestack', () => {
  it('should register FilestackService and the config token', () => {
    const config = { apikey: 'provide-key', options: { cname: 'cdn.example.com' } };

    TestBed.configureTestingModule({
      providers: [provideFilestack(config)]
    });

    const service = TestBed.inject(FilestackService);
    expect(service).toBeTruthy();
    expect((service as any).apikey).toBe('provide-key');
    expect((service as any).clientOptions).toBe(config.options);
    expect(TestBed.inject(FILESTACK_CONFIG)).toBe(config);
  });

  it('should provide a FilestackService instance even with a minimal config', () => {
    TestBed.configureTestingModule({
      providers: [provideFilestack({ apikey: 'minimal' })]
    });

    expect(TestBed.inject(FilestackService)).toBeTruthy();
  });
});
