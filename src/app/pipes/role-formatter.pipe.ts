import { Pipe, PipeTransform } from '@angular/core';
import { roleOptions } from '../ui_objects/roleOptions';

@Pipe({
  name: 'roleFormatter',
  standalone: true,
})
export class RoleFormatterPipe implements PipeTransform {
  transform(value: string | null): string | undefined {
    const found = roleOptions.find((option) => option.value === value)
    if (!found || !value) {
      return 'Role not defined'
    }
    return found?.viewValue
  }
}
