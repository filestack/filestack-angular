import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { FilestackService } from '../filestack.service';
import { PickerInlineComponent } from './pickerInline.component';
import { PickerDropPaneComponent } from './pickerDropPane.component';
import { PickerOverlayComponent } from './pickerOverlay.component';

/**
 * Regression tests for the container/rootId collision bug: several pickers
 * created in the same tick used to share a `picker-container-<Date.now()>` id,
 * so document.getElementById() mounted them all into the first container and
 * the rest rendered nothing. Ids must be unique per instance.
 */
describe('picker id uniqueness', () => {
  const capturedRootIds: string[] = [];

  const mockPicker = {
    open: jasmine.createSpy('open').and.returnValue(Promise.resolve()),
    close: jasmine.createSpy('close')
  };

  const filestackServiceMock = {
    init: jasmine.createSpy('init'),
    picker: jasmine.createSpy('picker').and.callFake((options: any) => {
      capturedRootIds.push(options.rootId);
      return mockPicker;
    })
  };

  beforeEach(async () => {
    capturedRootIds.length = 0;
    mockPicker.open.calls.reset();
    mockPicker.open.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        PickerInlineComponent,
        PickerDropPaneComponent,
        PickerOverlayComponent
      ],
      providers: [{ provide: FilestackService, useValue: filestackServiceMock }]
    }).compileComponents();
  });

  it('gives different container ids to an inline and a drop-pane picker (the reported bug)', () => {
    const inline = TestBed.createComponent(PickerInlineComponent).componentInstance;
    const dropPane = TestBed.createComponent(PickerDropPaneComponent).componentInstance;

    expect(inline.elementId).not.toBe(dropPane.elementId);
  });

  it('gives different container ids to two pickers of the same type', () => {
    const a = TestBed.createComponent(PickerInlineComponent).componentInstance;
    const b = TestBed.createComponent(PickerInlineComponent).componentInstance;

    expect(a.elementId).not.toBe(b.elementId);
  });

  it('gives a unique container id to every picker created in the same tick', () => {
    const ids = [
      TestBed.createComponent(PickerOverlayComponent).componentInstance.elementId,
      TestBed.createComponent(PickerInlineComponent).componentInstance.elementId,
      TestBed.createComponent(PickerDropPaneComponent).componentInstance.elementId
    ];

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives distinct rootIds to inline and drop-pane pickers', () => {
    const inline = TestBed.createComponent(PickerInlineComponent);
    const dropPane = TestBed.createComponent(PickerDropPaneComponent);
    inline.detectChanges();
    dropPane.detectChanges();

    expect(capturedRootIds.length).toBe(2);
    expect(capturedRootIds[0]).not.toBe(capturedRootIds[1]);
  });
});
