import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategory, NewCategory } from '../category.model';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { BusinessService } from 'app/entities/business/service/business.service';
import { IProduct } from 'app/entities/product/product.model';

export type PartialUpdateCategory = Partial<ICategory> & Pick<ICategory, 'id'>;

type RestOf<T extends ICategory | NewCategory> = Omit<T, 'createdDate' | 'modifiedDate'> & {
  createdDate?: string | null;
  modifiedDate?: string | null;
};

export type RestCategory = RestOf<ICategory>;

export type NewRestCategory = RestOf<NewCategory>;

export type PartialUpdateRestCategory = RestOf<PartialUpdateCategory>;

export type EntityResponseType = HttpResponse<ICategory>;
export type EntityArrayResponseType = HttpResponse<ICategory[]>;

@Injectable({ providedIn: 'root' })
export class CategoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/categories');
  businessId: any;

  private categoryListSubject = new BehaviorSubject<ICategory[] | null>(null);
  public categoryListData$ = this.categoryListSubject.asObservable();

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private firestore: AngularFirestore,
    private businessService: BusinessService,
  ) {
    this.businessService.businessData$.subscribe(business => {
      if(business) {
        this.businessId = business.id;
        this.query().subscribe(x=>{
          this.categoryListSubject.next(x);
        });
      }
    });
    // this.productCollection = this.firestore.collection<any>(`businesses/${this.businessId}/products`);
  } 

  private get categoryCollection(): AngularFirestoreCollection<any> {
    return this.firestore.collection<any>(`businesses/${this.businessId}/categories`);
  }

  create(category: NewCategory):  Promise<DocumentReference<ICategory>>  {
    let copy = { ...this.convertDateFromClient(category) };
    return this.categoryCollection.add(copy);
  }

  update(category: ICategory): Promise<void> {
    const copy = this.convertDateFromClient(category);
    return this.categoryCollection.doc(copy.id!).update(copy);
  }

  partialUpdate(category: PartialUpdateCategory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(category);
    return this.http
      .patch<RestCategory>(`${this.resourceUrl}/${this.getCategoryIdentifier(category)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any):  Observable<ICategory[]> {
    const options = createRequestOption(req);
    return this.categoryCollection.valueChanges({ idField: 'id' });
  }

  delete(id: string): Promise<void> {
    return this.categoryCollection.doc(id).delete();
  }

  getCategoryIdentifier(category: Pick<ICategory, 'id'>): string {
    return category.id;
  }

  compareCategory(o1: Pick<ICategory, 'id'> | null, o2: Pick<ICategory, 'id'> | null): boolean {
    return o1 && o2 ? this.getCategoryIdentifier(o1) === this.getCategoryIdentifier(o2) : o1 === o2;
  }

  addCategoryToCollectionIfMissing<Type extends Pick<ICategory, 'id'>>(
    categoryCollection: Type[],
    ...categoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const categories: Type[] = categoriesToCheck.filter(isPresent);
    if (categories.length > 0) {
      const categoryCollectionIdentifiers = categoryCollection.map(categoryItem => this.getCategoryIdentifier(categoryItem)!);
      const categoriesToAdd = categories.filter(categoryItem => {
        const categoryIdentifier = this.getCategoryIdentifier(categoryItem);
        if (categoryCollectionIdentifiers.includes(categoryIdentifier)) {
          return false;
        }
        categoryCollectionIdentifiers.push(categoryIdentifier);
        return true;
      });
      return [...categoriesToAdd, ...categoryCollection];
    }
    return categoryCollection;
  }

  protected convertDateFromClient<T extends ICategory | NewCategory | PartialUpdateCategory>(category: T): RestOf<T> {
    return {
      ...category,
      createdDate: category.createdDate?.toJSON() ?? null,
      modifiedDate: category.modifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCategory: RestCategory): ICategory {
    return {
      ...restCategory,
      createdDate: restCategory.createdDate ? dayjs(restCategory.createdDate) : undefined,
      modifiedDate: restCategory.modifiedDate ? dayjs(restCategory.modifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCategory>): HttpResponse<ICategory> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCategory[]>): HttpResponse<ICategory[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
