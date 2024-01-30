import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Login } from 'app/login/login.model';
import { ApplicationConfigService } from '../config/application-config.service';
import { StateStorageService } from './state-storage.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

type JwtToken = {
  id_token: string;
};

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private applicationConfigService: ApplicationConfigService,
    private afAuth: AngularFireAuth
  ) {}

  getToken(): string {
    return this.stateStorageService.getAuthenticationToken() ?? '';
  }

  login(credentials: Login) {
    return this.afAuth.signInWithEmailAndPassword(credentials.username, credentials.password);
    // return this.http
    //   .post<JwtToken>(this.applicationConfigService.getEndpointFor('api/authenticate'), credentials)
    //   .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  logout() {
    // return new Observable(observer => {
    //   this.stateStorageService.clearAuthenticationToken();
    //   observer.complete();
    // });
    return this.afAuth.signOut();
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    this.stateStorageService.storeAuthenticationToken(response.id_token, rememberMe);
  }
}
