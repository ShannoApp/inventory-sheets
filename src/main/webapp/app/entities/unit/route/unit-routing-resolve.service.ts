import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUnit } from '../unit.model';
import { UnitService } from '../service/unit.service';

export const unitResolve = (route: ActivatedRouteSnapshot): Observable<null | IUnit> => {
  const id = route.params['id'];
  if (id) {
    return inject(UnitService)
      .find(id)
      .pipe(
        mergeMap((unit: HttpResponse<IUnit>) => {
          if (unit.body) {
            return of(unit.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default unitResolve;
