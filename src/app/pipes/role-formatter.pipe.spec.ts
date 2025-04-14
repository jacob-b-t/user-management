import { RoleFormatterPipe } from './role-formatter.pipe';
import { roleOptions } from '../ui_objects/roleOptions';

describe('RoleFormatterPipe', () => {
  let pipe: RoleFormatterPipe;

  beforeEach(() => {
    pipe = new RoleFormatterPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct viewValue for a known role', () => {
    const knownRole = roleOptions[0];
    const result = pipe.transform(knownRole.value);
    expect(result).toBe(knownRole.viewValue);
  });

  it('should return "Role not defined" for an unknown role', () => {
    const result = pipe.transform('unknown-role');
    expect(result).toBe('Role not defined');
  });

  it('should return "Role not defined" for null', () => {
    const result = pipe.transform(null);
    expect(result).toBe('Role not defined');
  });

  it('should return "Role not defined" for undefined', () => {
    const result = pipe.transform(undefined as any);
    expect(result).toBe('Role not defined');
  });
});