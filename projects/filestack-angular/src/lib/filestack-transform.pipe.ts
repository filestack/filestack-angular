import {
  Pipe,
  PipeTransform
} from '@angular/core';
import { FilestackService } from './filestack.service';
import { TransformOptions } from 'filestack-js';

@Pipe({name: 'filestackTransform'})
export class FilestackTransformPipe implements PipeTransform {

  constructor(private filestackService: FilestackService) {}

  transform(value: string, transformOptions?: TransformOptions): string {
    return this.filestackService.transform(value, transformOptions);
  }
}
