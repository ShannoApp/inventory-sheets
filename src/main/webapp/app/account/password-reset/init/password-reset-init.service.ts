import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class PasswordResetInitService {
  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private afAuth: AngularFireAuth
  ) {}

  save(mail: string) {
    // return this.http.post(this.applicationConfigService.getEndpointFor('api/account/reset-password/init'), mail);
    return this.afAuth.sendPasswordResetEmail(mail);
  }
}
