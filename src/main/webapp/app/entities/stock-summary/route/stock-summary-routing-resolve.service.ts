import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IStockSummary } from '../stock-summary.model';
import { StockSummaryService } from '../service/stock-summary.service';

export const stockSummaryResolve = (route: ActivatedRouteSnapshot): Observable<null | IStockSummary> => {
  const id = route.params['id'];
  if (id) {
    return inject(StockSummaryService)
      .find(id)
      .pipe(
        mergeMap((stockSummary: HttpResponse<IStockSummary>) => {
          if (stockSummary.body) {
            return of(stockSummary.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default stockSummaryResolve;
