import { Injector } from '@angular/core';
import { TransformOptions } from 'filestack-js';

import { FilestackService } from './filestack.service';
import { FilestackTransformPipe } from './filestack-transform.pipe';

describe('FilestackTransformPipe', () => {
  let pipe: FilestackTransformPipe;

  const filestackServiceMock = {
    transform: jasmine.createSpy('transform').and.returnValue('https://cdn.filestackcontent.com/transformed')
  };

  beforeEach(() => {
    filestackServiceMock.transform.calls.reset();
    // The pipe now uses inject(), so build it inside an injection context
    // that provides the mocked FilestackService.
    pipe = Injector.create({
      providers: [
        { provide: FilestackService, useValue: filestackServiceMock },
        { provide: FilestackTransformPipe, deps: [] }
      ]
    }).get(FilestackTransformPipe);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should delegate to FilestackService.transform and return its result', () => {
    const options: TransformOptions = { resize: { width: 100 } };

    const result = pipe.transform('handle', options);

    expect(filestackServiceMock.transform).toHaveBeenCalledTimes(1);
    expect(filestackServiceMock.transform).toHaveBeenCalledWith('handle', options);
    expect(result).toBe('https://cdn.filestackcontent.com/transformed');
  });

  it('should pass undefined options through when none are provided', () => {
    pipe.transform('handle');

    expect(filestackServiceMock.transform).toHaveBeenCalledWith('handle', undefined);
  });

  it('should forward empty/null values to the service unchanged', () => {
    pipe.transform('');
    expect(filestackServiceMock.transform).toHaveBeenCalledWith('', undefined);

    pipe.transform(null as unknown as string);
    expect(filestackServiceMock.transform).toHaveBeenCalledWith(null, undefined);
  });
});
