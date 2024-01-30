import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortDirective, SortByDirective } from 'app/shared/sort';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { SortService } from 'app/shared/sort/sort.service';
import { IProduct } from '../product.model';
import { EntityArrayResponseType, ProductService } from '../service/product.service';
import { ProductDeleteDialogComponent } from '../delete/product-delete-dialog.component';
import { CategoryService } from 'app/entities/category/service/category.service';
import { ICategory } from 'app/entities/category/category.model';

@Component({
  standalone: true,
  selector: 'jhi-product',
  templateUrl: './product.component.html',
  imports: [
    RouterModule,
    FormsModule,
    SharedModule,
    SortDirective,
    SortByDirective,
    DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,
  ],
})
export class ProductComponent implements OnInit {


  products?: IProduct[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  actualProducts: IProduct[] = [];
  categories: ICategory[] = [];

  constructor(
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
    protected categoryService: CategoryService,
  ) {
    this.isLoading = true;
    // this.productService.productListData$.subscribe(data => {
    //   if (data) {
    //     console.log(data,'data');
    //     this.products = data;
    //     this.actualProducts = data;
    //     this.isLoading = false;
    //   }
    //   this.isLoading = false;
    // });

    this.categoryService.categoryListData$.subscribe(data => {
      if (data) {
        this.categories = data;
      }
    });
  }

  trackId = (_index: number, item: IProduct): string | null => this.productService.getProductIdentifier(item)!;

  ngOnInit(): void {
    this.load();
  }
  onInputChange(event: any) {
    this.products = this.actualProducts.filter(product => product.name?.toLowerCase().includes(event.target?.value.toLowerCase()));
  }

  onCategoryChange(event: any) {
    this.products = this.actualProducts.filter(product => product.category?.toLowerCase().includes(event.target?.value.toLowerCase()));
}


  delete(product: IProduct): void {
    const modalRef = this.modalService.open(ProductDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.product = product;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe({
        next: (res: IProduct[]) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.isLoading = true;
    this.productService.productListData$.subscribe(data => {
      if (data) {
        this.products = data;
        this.isLoading = false;
      }
      this.isLoading = false;
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<IProduct[]> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending)),
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: IProduct[]): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response);
    this.products = this.refineData(dataFromBody);
    this.actualProducts = this.refineData(dataFromBody);
  }

  protected refineData(data: IProduct[]): IProduct[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IProduct[] | null): IProduct[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<IProduct[]> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.productService.productListData$.pipe(
      map(data => data ?? []),
      tap(() => (this.isLoading = false))
    );
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
