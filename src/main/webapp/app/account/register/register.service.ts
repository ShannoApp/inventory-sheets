import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private afAuth: AngularFireAuth
  ) { }

  save(registration: Registration) {
    // return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration);
    return this.afAuth.createUserWithEmailAndPassword(registration.email, registration.password);
  }
}

