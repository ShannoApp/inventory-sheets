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
import { ICustomer } from '../customer.model';
import { EntityArrayResponseType, CustomerService } from '../service/customer.service';
import { CustomerDeleteDialogComponent } from '../delete/customer-delete-dialog.component';

@Component({
  standalone: true,
  selector: 'jhi-customer',
  templateUrl: './customer.component.html',
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
export class CustomerComponent implements OnInit {

  customers?: ICustomer[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  actualCustomers: ICustomer[] = [];

  constructor(
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal,
  ) { }

  trackId = (_index: number, item: ICustomer): string => this.customerService.getCustomerIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  onInputChange(event: any) {
    this.customers = this.actualCustomers.filter(c=>{
      return c.firstName!.toLowerCase().includes(event.target.value.toLowerCase()) ||
      c.lastName!.toLowerCase().includes(event.target.value.toLowerCase()) ||
      c.phone!.toLowerCase().includes(event.target.value.toLowerCase());
    });
    }

  delete(customer: ICustomer): void {
    const modalRef = this.modalService.open(CustomerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.customer = customer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations()),
      )
      .subscribe({
        next: (res: ICustomer[]) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: ICustomer[]) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<ICustomer[]> {
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

  protected onResponseSuccess(response: ICustomer[]): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response);
    this.customers = this.refineData(dataFromBody);
    this.actualCustomers = this.refineData(dataFromBody);
  }

  protected refineData(data: ICustomer[]): ICustomer[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ICustomer[] | null): ICustomer[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<ICustomer[]> {
    this.isLoading = true;
    const queryObject: any = {
      
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.customerService.customerListData$.pipe(
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

