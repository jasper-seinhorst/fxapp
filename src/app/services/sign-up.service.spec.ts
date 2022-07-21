import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SignUpService } from './sign-up.service';

describe('SignUpService', () => {
  let service: SignUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(SignUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a valid endpoint', () => {
    expect(service.SIGN_UP_ENDPOINT).toEqual('https://demo-api.now.sh/users');
  });

  it('should do secure calls with POST', () => {
    const httpSpy = spyOn(service.httpClient, 'post').and.stub();

    service.signUp({
      firstName: 'Steve',
      lastName: 'Jobs',
      email: 'steve@apple1234.com',
    });

    expect(httpSpy).toHaveBeenCalledWith('https://demo-api.now.sh/users', {
      firstName: 'Steve',
      lastName: 'Jobs',
      email: 'steve@apple1234.com',
    });
  });
});
