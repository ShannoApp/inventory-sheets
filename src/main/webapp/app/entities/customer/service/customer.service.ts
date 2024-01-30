import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICustomer, NewCustomer } from '../customer.model';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { BusinessService } from 'app/entities/business/service/business.service';

export type PartialUpdateCustomer = Partial<ICustomer> & Pick<ICustomer, 'id'>;

type RestOf<T extends ICustomer | NewCustomer> = Omit<T, 'createdDate' | 'modifiedDate'> & {
  createdDate?: string | null;
  modifiedDate?: string | null;
};

export type RestCustomer = RestOf<ICustomer>;

export type NewRestCustomer = RestOf<NewCustomer>;

export type PartialUpdateRestCustomer = RestOf<PartialUpdateCustomer>;

export type EntityResponseType = HttpResponse<ICustomer>;
export type EntityArrayResponseType = HttpResponse<ICustomer[]>;

@Injectable({ providedIn: 'root' })
export class CustomerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/customers');
  businessId: string | null | undefined;

  private cusomerListSubject = new BehaviorSubject<ICustomer[] | null>(null);
  public customerListData$ = this.cusomerListSubject.asObservable();

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private firestore: AngularFirestore,
    private businessService: BusinessService,
  ) {
    this.businessService.businessData$.subscribe(business => {
      if(business) {
        this.businessId = business.id;
      }
    });
    // this.productCollection = this.firestore.collection<any>(`businesses/${this.businessId}/products`);
  } 

  setCustomers(customers: ICustomer[]): void {
    this.cusomerListSubject.next(customers);
  }
  private get customerCollection(): AngularFirestoreCollection<any> {
    return this.firestore.collection<any>(`businesses/${this.businessId}/customers`);
  }

  create(customer: ICustomer): Promise<DocumentReference<ICustomer>> {
    let copy = { ...this.convertDateFromClient(customer) };
    return this.customerCollection.add(copy);
  }

  update(customer: ICustomer): Promise<void> {
    const copy = this.convertDateFromClient(customer);
    return this.customerCollection.doc(copy.id!).update(copy);
  }

  partialUpdate(customer: PartialUpdateCustomer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(customer);
    return this.http
      .patch<RestCustomer>(`${this.resourceUrl}/${this.getCustomerIdentifier(customer)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestCustomer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<ICustomer[]> {
    const options = createRequestOption(req);
    return this.customerCollection.valueChanges({ idField: 'id' })
    .pipe(
      map(customers => {
        return customers.map(cust=>{
          let el =  this.convertDateFromServer(cust);
          return el;
          });
        }),
        );
        // .slice(0, 3 + 1);
      }

  delete(id: string): Promise<void> {
    return this.customerCollection.doc(id).delete();
  }

  getCustomerIdentifier(customer: Pick<ICustomer, 'id'>): string {
    return customer.id??'';
  }

  compareCustomer(o1: Pick<ICustomer, 'id'> | null, o2: Pick<ICustomer, 'id'> | null): boolean {
    return o1 && o2 ? this.getCustomerIdentifier(o1) === this.getCustomerIdentifier(o2) : o1 === o2;
  }

  addCustomerToCollectionIfMissing<Type extends Pick<ICustomer, 'id'>>(
    customerCollection: Type[],
    ...customersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const customers: Type[] = customersToCheck.filter(isPresent);
    if (customers.length > 0) {
      const customerCollectionIdentifiers = customerCollection.map(customerItem => this.getCustomerIdentifier(customerItem)!);
      const customersToAdd = customers.filter(customerItem => {
        const customerIdentifier = this.getCustomerIdentifier(customerItem);
        if (customerCollectionIdentifiers.includes(customerIdentifier)) {
          return false;
        }
        customerCollectionIdentifiers.push(customerIdentifier);
        return true;
      });
      return [...customersToAdd, ...customerCollection];
    }
    return customerCollection;
  }

  protected convertDateFromClient<T extends ICustomer | NewCustomer | PartialUpdateCustomer>(customer: T): RestOf<T> {
    return {
      ...customer,
      createdDate: customer.createdDate?.toJSON() ?? null,
      modifiedDate: customer.modifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCustomer: RestCustomer): ICustomer {
    return {
      ...restCustomer,
      createdDate: restCustomer.createdDate ? dayjs(restCustomer.createdDate) : undefined,
      modifiedDate: restCustomer.modifiedDate ? dayjs(restCustomer.modifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCustomer>): HttpResponse<ICustomer> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCustomer[]>): HttpResponse<ICustomer[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
