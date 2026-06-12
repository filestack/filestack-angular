import { TestBed } from '@angular/core/testing';
import { Filelink } from 'filestack-js';

import { FilestackFilelink } from './filestack-filelink.service';
import { FilestackService } from './filestack.service';

describe('FilestackFilelink', () => {
  let filelink: FilestackFilelink;

  // A valid (20-char) Filestack handle — Filelink rejects malformed sources.
  const exampleHandle = 'TESToQJSQCmYShsoCnZN';
  const exampleUrl = 'https://example.com/image.jpg';

  const filestackServiceMock = {
    getClientInstance: jasmine.createSpy('getClientInstance').and.returnValue({
      session: { apikey: 'TEST_APIKEY' }
    })
  };

  beforeEach(() => {
    filestackServiceMock.getClientInstance.calls.reset();
    TestBed.configureTestingModule({
      providers: [
        FilestackFilelink,
        { provide: FilestackService, useValue: filestackServiceMock }
      ]
    });
    filelink = TestBed.inject(FilestackFilelink);
  });

  it('should be created', () => {
    expect(filelink).toBeTruthy();
  });

  it('forHandle should return a Filelink built from the handle and the session apikey', () => {
    const result = filelink.forHandle(exampleHandle);

    expect(result instanceof Filelink).toBeTrue();
    expect(filestackServiceMock.getClientInstance).toHaveBeenCalledTimes(1);
    const url = result.toString();
    expect(url).toContain('TEST_APIKEY');
    expect(url).toContain(exampleHandle);
  });

  it('forUrl should return a Filelink built from the external url', () => {
    const result = filelink.forUrl(exampleUrl);

    expect(result instanceof Filelink).toBeTrue();
    const url = result.toString();
    expect(url).toContain('TEST_APIKEY');
    expect(url).toContain(exampleUrl);
  });

  it('should return a chainable Filelink whose transforms affect the URL', () => {
    const result = filelink.forHandle(exampleHandle);

    expect(typeof result.resize).toBe('function');
    expect(result.resize({ width: 100 })).toBe(result); // chaining returns the same instance
    expect(result.toString()).toContain('resize=width:100');
  });
});
