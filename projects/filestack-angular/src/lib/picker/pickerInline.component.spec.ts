import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickerDisplayMode } from 'filestack-js';

import { FilestackService } from '../filestack.service';
import { PickerInlineComponent } from './pickerInline.component';

describe('PickerInlineComponent', () => {
  let component: PickerInlineComponent;
  let fixture: ComponentFixture<PickerInlineComponent>;
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

  beforeEach(async () => {
    capturedOptions = undefined;
    mockPicker.open.calls.reset();
    mockPicker.open.and.returnValue(Promise.resolve());
    mockPicker.close.calls.reset();
    filestackServiceMock.init.calls.reset();
    filestackServiceMock.picker.calls.reset();

    await TestBed.configureTestingModule({
      imports: [CommonModule, PickerInlineComponent],
      providers: [{ provide: FilestackService, useValue: filestackServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(PickerInlineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should auto-open an inline-mode picker after content init', () => {
    fixture.detectChanges();

    expect(filestackServiceMock.init).toHaveBeenCalledTimes(1);
    expect(filestackServiceMock.picker).toHaveBeenCalledTimes(1);
    expect(capturedOptions.displayMode).toBe(PickerDisplayMode.inline);
    expect(capturedOptions.container).toBe(component.elementId);
    expect(mockPicker.open).toHaveBeenCalledTimes(1);
  });

  it('should emit uploadSuccess when onUploadDone fires', () => {
    fixture.detectChanges();
    const successSpy = jasmine.createSpy('success');
    component.uploadSuccess.subscribe(successSpy);

    const response: any = { filesUploaded: [], filesFailed: [] };
    capturedOptions.onUploadDone(response);

    expect(successSpy).toHaveBeenCalledWith(response);
  });

  it('should emit uploadError when picker.open rejects', (done: DoneFn) => {
    const error: any = { name: 'open failed' };
    mockPicker.open.and.returnValue(Promise.reject(error));

    component.uploadError.subscribe(err => {
      expect(err).toBe(error);
      done();
    });

    fixture.detectChanges();
  });

  it('should close the picker on destroy', () => {
    fixture.detectChanges();
    fixture.destroy();
    expect(mockPicker.close).toHaveBeenCalledTimes(1);
  });
});
