import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SignUpComponent } from './sign-up.component';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { SignUpService } from '../../services/sign-up.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let service: SignUpService;
  let fixture: ComponentFixture<SignUpComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SignUpComponent,
      ],
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        SignUpComponent,
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .overrideComponent(SignUpComponent, {
      set: {
        providers: []
      }
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(SignUpComponent);
      component = fixture.componentInstance;
      httpMock = TestBed.get(HttpTestingController);
    });
  }));

  it('should should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a invalid form on page load', () => {
    expect(component.signUpForm.valid).toBeFalsy();
  });

  it('should not mark firstName as valid on page load', () => {
    let firstName = component.signUpForm.controls['firstName'];
    expect(firstName.valid).toBeFalsy();
  });

  it('should mark firstName as valid after valid input', () => {
    component.signUpForm.controls['firstName'].setValue('foo');
    let firstName = component.signUpForm.controls['firstName'];
    expect(firstName.valid).toBeTruthy();
  });

  it('should not mark lastName as valid on page load', () => {
    let lastName = component.signUpForm.controls['lastName'];

    expect(lastName.valid).toBeFalsy();
  });

  it('should mark firstName as valid after valid input', () => {
    component.signUpForm.controls['lastName'].setValue('foo');
    let lastName = component.signUpForm.controls['lastName'];

    expect(lastName.valid).toBeTruthy();
  });

  it('should not mark email as valid on page load', () => {
    let email = component.signUpForm.controls['email'];

    expect(email.valid).toBeFalsy();
  });

  it('email field should be valid', () => {
    component.signUpForm.controls['email'].setValue('foo@baz.com');
    let email = component.signUpForm.controls['email'];

    expect(email.valid).toBeTruthy();
  });

  it('should not mark password as valid on page load', () => {
    let password = component.signUpForm.controls['password'];

    expect(password.valid).toBeFalsy();
  });

  it('should not mark password field as valid with 6 characters only', () => {
    component.signUpForm.controls['password'].setValue('Abcdef');
    let password = component.signUpForm.controls['password'];

    expect(password.valid).toBeFalsy();
  });

  it('should not mark password field as valid without uppercase characters', () => {
    component.signUpForm.controls['password'].setValue('abcdefgh');
    let password = component.signUpForm.controls['password'];

    expect(password.valid).toBeFalsy();
  });

  it('should not mark password field as valid when it contains firstName', () => {
    component.signUpForm.controls['firstName'].setValue('fedex');
    component.signUpForm.controls['password'].setValue('fedexAbcdef');
    let password = component.signUpForm.controls['password'];

    expect(password.valid).toBeFalsy();
  });

  it('should not mark password field as valid when it contains lastName', () => {
    component.signUpForm.controls['lastName'].setValue('fedex');
    component.signUpForm.controls['password'].setValue('fedexAbcdef');
    let password = component.signUpForm.controls['password'];

    expect(password.valid).toBeFalsy();
  });

  it('should not mark passwordConfirm as valid when the value is different', () => {
    component.signUpForm.controls['password'].setValue('Abcdefgh123');
    component.signUpForm.controls['confirmPassword'].setValue('Abcdefgh321');
    let password = component.signUpForm.controls['confirmPassword'];

    expect(password.valid).toBeFalsy();
  });

  it('should mark valid when value is the same as password', () => {
    component.signUpForm.controls['password'].setValue('Abcdefgh123');
    component.signUpForm.controls['confirmPassword'].setValue('Abcdefgh123');
    let password = component.signUpForm.controls['confirmPassword'];

    component.signUpForm.controls['password'].setValue('FedEx1234');
    component.signUpForm.controls['confirmPassword'].setValue('FedEx1234');
    password = component.signUpForm.controls['confirmPassword'];

    expect(password.valid).toBeTruthy();
  });

  it('should do a succesfull request and call correct success hook', () => {
    expect(component.signUpForm.valid).toBeFalsy();

    component.signUpForm.controls['firstName'].setValue('Steve');
    component.signUpForm.controls['lastName'].setValue('Jobs');
    component.signUpForm.controls['email'].setValue('steve@apple.com');
    component.signUpForm.controls['password'].setValue('ILoveWindows12');
    component.signUpForm.controls['confirmPassword'].setValue('ILoveWindows12');

    expect(component.signUpForm.valid).toBeTruthy();

    service = TestBed.inject(SignUpService);
    const spyService = spyOn(service, 'signUp').and.callThrough();
    const spyHandler = spyOn(component, 'handleSubmitSuccess');

    component.onSubmit();

    const req = httpMock.expectOne(service.SIGN_UP_ENDPOINT);
    const expectedResponse = new HttpResponse({ status: 200, statusText: 'Created', body: {} });
    req.event(expectedResponse);

    expect(req.request.method).toEqual('POST');

    expect(spyService).toHaveBeenCalledWith({
      firstName: 'Steve',
      lastName: 'Jobs',
      email: 'steve@apple.com'
    });

    expect(spyHandler).toHaveBeenCalled();

    httpMock.verify();
  });

  it('should do a request and handle errors correctly', () => {
    expect(component.signUpForm.valid).toBeFalsy();

    component.signUpForm.controls['firstName'].setValue('Steve');
    component.signUpForm.controls['lastName'].setValue('Jobs');
    component.signUpForm.controls['email'].setValue('steve@apple.com');
    component.signUpForm.controls['password'].setValue('ILoveWindows12');
    component.signUpForm.controls['confirmPassword'].setValue('ILoveWindows12');

    expect(component.signUpForm.valid).toBeTruthy();

    service = TestBed.inject(SignUpService);
    const spyService = spyOn(service, 'signUp').and.callThrough();
    const spyHandler = spyOn(component, 'handleSubmitError');

    component.onSubmit();

    const req = httpMock.expectOne(service.SIGN_UP_ENDPOINT);
    req.flush('404 error', { status: 404, statusText: 'Not Found' });

    expect(req.request.method).toEqual('POST');

    expect(spyService).toHaveBeenCalledWith({
      firstName: 'Steve',
      lastName: 'Jobs',
      email: 'steve@apple.com'
    });


    expect(spyHandler).toHaveBeenCalled();

    httpMock.verify();
  });
});

