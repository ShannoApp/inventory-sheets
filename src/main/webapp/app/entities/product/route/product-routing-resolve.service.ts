import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProduct } from '../product.model';
import { ProductService } from '../service/product.service';

export const productResolve = (route: ActivatedRouteSnapshot): Observable<null | IProduct> => {
  const id = route.params['id'];
  if (id) {
    return inject(ProductService)
    .productListData$
      .pipe(
        mergeMap((products: IProduct[] | null) => {
          const product = products?.find(it => it.id === id);
          if (product) {
            return of(product);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default productResolve;
