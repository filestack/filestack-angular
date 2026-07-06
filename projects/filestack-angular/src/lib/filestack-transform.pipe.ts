import {
  Pipe,
  PipeTransform,
  inject
} from '@angular/core';
import { FilestackService } from './filestack.service';
import { TransformOptions } from 'filestack-js';

@Pipe({ name: 'filestackTransform', standalone: true })
export class FilestackTransformPipe implements PipeTransform {

  private filestackService = inject(FilestackService);

  transform(value: string, transformOptions?: TransformOptions): string {
    return this.filestackService.transform(value, transformOptions);
  }
}
