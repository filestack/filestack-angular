import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickerDisplayMode } from 'filestack-js';

import { FilestackService } from '../filestack.service';
import { PickerOverlayComponent } from './pickerOverlay.component';

describe('PickerOverlayComponent', () => {
  let component: PickerOverlayComponent;
  let fixture: ComponentFixture<PickerOverlayComponent>;
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

  const clickEvent = () => jasmine.createSpyObj('event', ['stopPropagation', 'preventDefault']);

  beforeEach(async () => {
    capturedOptions = undefined;
    mockPicker.open.calls.reset();
    mockPicker.open.and.returnValue(Promise.resolve());
    mockPicker.close.calls.reset();
    filestackServiceMock.init.calls.reset();
    filestackServiceMock.picker.calls.reset();

    await TestBed.configureTestingModule({
      imports: [CommonModule, PickerOverlayComponent],
      providers: [{ provide: FilestackService, useValue: filestackServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(PickerOverlayComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the client and create an overlay-mode picker after content init', () => {
    fixture.detectChanges();

    expect(filestackServiceMock.init).toHaveBeenCalledTimes(1);
    expect(filestackServiceMock.picker).toHaveBeenCalledTimes(1);
    expect(capturedOptions.displayMode).toBe(PickerDisplayMode.overlay);
    expect(capturedOptions.container).toBe(component.elementId);
  });

  it('should open the picker and become active on click', () => {
    fixture.detectChanges();
    const event = clickEvent();

    component.onClick(event);

    expect(component.isActive).toBeTrue();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockPicker.open).toHaveBeenCalledTimes(1);
  });

  it('should ignore clicks while already active', () => {
    fixture.detectChanges();
    component.isActive = true;
    const event = clickEvent();

    component.onClick(event);

    expect(mockPicker.open).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should emit uploadSuccess when onUploadDone fires', () => {
    fixture.detectChanges();
    const successSpy = jasmine.createSpy('success');
    component.uploadSuccess.subscribe(successSpy);

    const response: any = { filesUploaded: [], filesFailed: [] };
    capturedOptions.onUploadDone(response);

    expect(successSpy).toHaveBeenCalledWith(response);
  });

  it('should reset state and trigger OnPush change detection on close', () => {
    fixture.detectChanges();
    const cdr = (component as any).cdr;
    spyOn(cdr, 'markForCheck');
    spyOn(component, 'generateId');
    component.isActive = true;

    capturedOptions.onClose();

    expect(component.isActive).toBeFalse();
    expect(component.generateId).toHaveBeenCalledTimes(1);
    expect(cdr.markForCheck).toHaveBeenCalledTimes(1);
  });

  it('should emit uploadError when picker.open rejects', (done: DoneFn) => {
    const error: any = { name: 'open failed' };
    mockPicker.open.and.returnValue(Promise.reject(error));
    fixture.detectChanges();

    component.uploadError.subscribe(err => {
      expect(err).toBe(error);
      done();
    });

    component.onClick(clickEvent());
  });

  it('should close the picker on destroy', () => {
    fixture.detectChanges();
    fixture.destroy();
    expect(mockPicker.close).toHaveBeenCalledTimes(1);
  });
});
