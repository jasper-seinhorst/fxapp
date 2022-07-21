import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../validators/must-match.validator';
import { NotContain } from '../../validators/not-contain.validator';
import { SignUpService, SignUpData } from '../../services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],

})
export class SignUpComponent {
  public hasError: boolean = false;
  public success: boolean = false;

  signUpForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.pattern('(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}'),
    ]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: [
      MustMatch('password', 'confirmPassword'),
      NotContain('password', ['firstName', 'lastName']),
    ]
  });

  constructor(private formBuilder: FormBuilder, private service: SignUpService) { }

  onSubmit(): void {
    if (this.signUpForm.valid) {      
      const formData = this.signUpForm.value;

      const user: SignUpData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      this.hasError = false;

      this.service.signUp(user).subscribe( (res) => {
        this.handleSubmitSuccess();
      },
      (err: any) => {
        this.handleSubmitError();
      });
    }
  }

  handleSubmitSuccess(): void {
    this.hasError = false;
    // do something for example a redirect. For now I just show a simple message
    this.success = true;
  }

  handleSubmitError(): void {
    this.hasError = true;
  }

}
