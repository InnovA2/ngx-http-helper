import { AuthInterceptor } from './auth-interceptor';

describe('TokenInterceptor', () => {
  it('should create an instance', () => {
    expect(new AuthInterceptor({ authConfigs: [] })).toBeTruthy();
  });
});
