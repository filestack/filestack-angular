import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { FilestackService } from './filestack.service';
import { PickerOverlayComponent } from './picker/pickerOverlay.component';

/**
 * Verifies the SDK works under zoneless change detection: the picker overlay's
 * state is signal-driven, so view updates happen without zone.js.
 */
describe('Zoneless change detection', () => {
  let capturedOptions: any;

  const mockPicker = {
    open: jasmine.createSpy('open').and.returnValue(Promise.resolve()),
    close: jasmine.createSpy('close')
  };

  const filestackServiceMock = {
    init: jasmine.createSpy('init'),
    picker: jasmine.createSpy('picker').and.callFake((options: any) => {
      capturedOptions = options;
      return mockPicker;
    })
  };

  beforeEach(() => {
    capturedOptions = undefined;
    mockPicker.open.calls.reset();
    filestackServiceMock.init.calls.reset();
    filestackServiceMock.picker.calls.reset();

    TestBed.configureTestingModule({
      imports: [PickerOverlayComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: FilestackService, useValue: filestackServiceMock }
      ]
    });
  });

  it('PickerOverlayComponent renders signal-driven state without zone.js', () => {
    const fixture = TestBed.createComponent(PickerOverlayComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;

    expect(component.isActive()).toBeFalse();
    expect(fixture.nativeElement.querySelector('div[id^="picker-container"]')).toBeNull();

    // Activating via the signal must update the @if block under zoneless CD.
    component.onClick(jasmine.createSpyObj('event', ['stopPropagation', 'preventDefault']));
    fixture.detectChanges();

    expect(component.isActive()).toBeTrue();
    expect(fixture.nativeElement.querySelector('div[id^="picker-container"]')).toBeTruthy();

    // onClose (a non-Angular callback) flips the signal back off.
    capturedOptions.onClose();
    fixture.detectChanges();

    expect(component.isActive()).toBeFalse();
  });
});
