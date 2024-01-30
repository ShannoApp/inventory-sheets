import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBillingItem } from '../billing-item.model';
import { BillingItemService } from '../service/billing-item.service';

export const billingItemResolve = (route: ActivatedRouteSnapshot): Observable<null | IBillingItem> => {
  const id = route.params['id'];
  if (id) {
    return inject(BillingItemService)
      .find(id)
      .pipe(
        mergeMap((billingItem: HttpResponse<IBillingItem>) => {
          if (billingItem.body) {
            return of(billingItem.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default billingItemResolve;
