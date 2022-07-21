import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {
  SIGN_UP_ENDPOINT = 'https://demo-api.now.sh/users';

  constructor(public httpClient: HttpClient) { }

  signUp(formData: SignUpData) {
    return this.httpClient.post<any>(this.SIGN_UP_ENDPOINT, formData);
  }
}

// The assignment gave a sample object for the request body. Password was missing, so I left it out. But I suppose it should be part of this interface
export interface SignUpData {
  firstName: string,
  lastName: string,
  email: string,
}


