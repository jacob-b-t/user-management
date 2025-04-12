import { Pipe, PipeTransform } from '@angular/core';
import { roleOptions } from '../ui_objects/roleOptions';

@Pipe({
  name: 'roleFormatter',
  standalone: true,
})
export class RoleFormatterPipe implements PipeTransform {
  transform(value: string): string | undefined {
    const found = roleOptions.find((option) => option.value === value)
    return found?.viewValue
  }
}
