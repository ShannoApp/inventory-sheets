import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { map, tap } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBusiness, NewBusiness } from '../business.model';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { AccountService } from 'app/core/auth/account.service';
import { ProductService } from 'app/entities/product/service/product.service';

export type PartialUpdateBusiness = Partial<IBusiness> & Pick<IBusiness, 'id'>;

type RestOf<T extends IBusiness | NewBusiness> = Omit<T, 'createdDate' | 'modifiedDate'> & {
  createdDate?: string | null;
  modifiedDate?: string | null;
};

export type RestBusiness = RestOf<IBusiness>;

export type NewRestBusiness = RestOf<NewBusiness>;

// export type PartialUpdateRestBusiness = RestOf<PartialUpdateBusiness>;

export type EntityResponseType = HttpResponse<IBusiness>;
export type EntityArrayResponseType = HttpResponse<IBusiness[]>;

@Injectable({ providedIn: 'root' })
export class BusinessService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/businesses');
  private businessCollection: AngularFirestoreCollection<any>;
  private userId : string | null = null;

  private businessSubject = new BehaviorSubject<IBusiness | null>(null);
  public businessData$ = this.businessSubject.asObservable();

  private businessListSubject = new BehaviorSubject<IBusiness[] | null>(null);
  public businessListData$ = this.businessListSubject.asObservable();

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private firestore: AngularFirestore,
    private accountService: AccountService,
  ) {
    this.businessCollection = this.firestore.collection<any>('businesses');
    this.accountService.getAuthenticationState().subscribe(account => {
      console.log('account', account);
      this.userId = account?.id??null;
    });
  }

  create(business: IBusiness): Promise<DocumentReference<IBusiness>> {
    // const copy = this.convertDateFromClient(business);
    let copy  = {...business, createdDate: business.modifiedDate?.toJSON(), modifiedDate: business.modifiedDate?.toJSON()};
    let users : string[] = [];
    users.push(this.userId??'');
    copy.userIds = users;
    return this.businessCollection.add(copy);
  }

  update(business: Partial<IBusiness>): Promise<void> {
    // const copy = this.convertDateFromClient(business);
    return this.businessCollection.doc(business.id+"").update(business);
    }

  // partialUpdate(business: PartialUpdateBusiness): Observable<EntityResponseType> {
  //   const copy = this.convertDateFromClient(business);
  //   return this.http
  //     .patch<RestBusiness>(`${this.resourceUrl}/${this.getBusinessIdentifier(business)}`, copy, { observe: 'response' })
  //     .pipe(map(res => this.convertResponseFromServer(res)));
  // }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBusiness>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<IBusiness[]> {
    // const options = createRequestOption(req);
    // return this.http
    //   .get<RestBusiness[]>(this.resourceUrl, { params: options, observe: 'response' })
    //   .pipe(map(res => this.convertResponseArrayFromServer(res)));

    if(this.userId == null) {
      console.log('userId is null');;
      return of([]);
    }
    console.log('userId is not null');;
    return this.firestore
    .collection<IBusiness>('businesses', (ref) => ref.where('userIds', 'array-contains', this.userId))
    .valueChanges({ idField: 'id' }).pipe(tap(businesses => {
      this.businessListSubject.next(businesses);
      let defaultBusiness = businesses.find(b => b.isDeflaut);
      if(businesses.length == 1 && defaultBusiness == null) {
        defaultBusiness = businesses[0];
      }
      this.businessSubject.next(defaultBusiness ?? null);
     }));
  }

  deleteBusiness(id: string): Promise<void> {
    return this.businessCollection.doc(id).delete();
  }

  getBusinessIdentifier(business: Pick<IBusiness, 'id'>): string | null {
    return business.id;
  }

  compareBusiness(o1: Pick<IBusiness, 'id'> | null, o2: Pick<IBusiness, 'id'> | null): boolean {
    return o1 && o2 ? this.getBusinessIdentifier(o1) === this.getBusinessIdentifier(o2) : o1 === o2;
  }

  addBusinessToCollectionIfMissing<Type extends Pick<IBusiness, 'id'>>(
    businessCollection: Type[],
    ...businessesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const businesses: Type[] = businessesToCheck.filter(isPresent);
    if (businesses.length > 0) {
      const businessCollectionIdentifiers = businessCollection.map(businessItem => this.getBusinessIdentifier(businessItem)!);
      const businessesToAdd = businesses.filter(businessItem => {
        const businessIdentifier = this.getBusinessIdentifier(businessItem);
        if (businessCollectionIdentifiers.includes(businessIdentifier!)) {
          return false;
        }
        businessCollectionIdentifiers.push(businessIdentifier!);
        return true;
      });
      return [...businessesToAdd, ...businessCollection];
    }
    return businessCollection;
  }

  protected convertDateFromClient<T extends IBusiness | NewBusiness >(business: T): RestOf<T> {
    return {
      ...business,
      createdDate: business.createdDate?.toJSON() ?? null,
      modifiedDate: business.modifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restBusiness: RestBusiness): IBusiness {
    return {
      ...restBusiness,
      createdDate: restBusiness.createdDate ? dayjs(restBusiness.createdDate) : undefined,
      modifiedDate: restBusiness.modifiedDate ? dayjs(restBusiness.modifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBusiness>): HttpResponse<IBusiness> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBusiness[]>): HttpResponse<IBusiness[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
