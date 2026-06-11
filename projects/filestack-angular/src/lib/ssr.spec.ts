import { PLATFORM_ID, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FILESTACK_CONFIG } from './filestack-config';
import { FilestackService } from './filestack.service';
import { PickerBaseDirective } from './picker/pickerBase.component';
import { PickerDropPaneComponent } from './picker/pickerDropPane.component';
import { PickerInlineComponent } from './picker/pickerInline.component';
import { PickerOverlayComponent } from './picker/pickerOverlay.component';

/**
 * SSR behaviour is validated by overriding PLATFORM_ID to 'server'. A full
 * @angular/platform-server render runs in Node and cannot execute inside the
 * Karma (browser) test runner, so the platform guard is exercised directly.
 */
describe('SSR (server platform)', () => {
  const filestackServiceMock = {
    init: jasmine.createSpy('init'),
    picker: jasmine.createSpy('picker').and.returnValue({
      open: () => Promise.resolve(),
      close: () => undefined
    })
  };

  const pickers: Array<{ name: string; component: Type<PickerBaseDirective> }> = [
    { name: 'PickerOverlayComponent', component: PickerOverlayComponent },
    { name: 'PickerInlineComponent', component: PickerInlineComponent },
    { name: 'PickerDropPaneComponent', component: PickerDropPaneComponent }
  ];

  beforeEach(() => {
    filestackServiceMock.init.calls.reset();
    filestackServiceMock.picker.calls.reset();
  });

  pickers.forEach(({ name, component }) => {
    it(`${name} should not init the client or create a picker on the server`, () => {
      TestBed.configureTestingModule({
        imports: [component],
        providers: [
          { provide: FilestackService, useValue: filestackServiceMock },
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });

      const fixture = TestBed.createComponent(component);
      // Triggers ngOnInit + ngAfterContentInit; both are platform-guarded.
      expect(() => fixture.detectChanges()).not.toThrow();

      expect(filestackServiceMock.init).not.toHaveBeenCalled();
      expect(filestackServiceMock.picker).not.toHaveBeenCalled();
    });
  });

  it('FilestackService.preview() should return null on the server', () => {
    TestBed.configureTestingModule({
      providers: [
        FilestackService,
        { provide: FILESTACK_CONFIG, useValue: { apikey: 'ssr-key' } },
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });

    const service = TestBed.inject(FilestackService);
    expect(service.preview('handle')).toBeNull();
  });
});
