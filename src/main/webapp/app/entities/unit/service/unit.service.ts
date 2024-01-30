import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUnit, NewUnit } from '../unit.model';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { BusinessService } from 'app/entities/business/service/business.service';

export type PartialUpdateUnit = Partial<IUnit> & Pick<IUnit, 'id'>;

type RestOf<T extends IUnit | NewUnit> = Omit<T, 'createdDate' | 'modifiedDate'> & {
  createdDate?: string | null;
  modifiedDate?: string | null;
};

export type RestUnit = RestOf<IUnit>;

export type NewRestUnit = RestOf<NewUnit>;

export type PartialUpdateRestUnit = RestOf<PartialUpdateUnit>;

export type EntityResponseType = HttpResponse<IUnit>;
export type EntityArrayResponseType = HttpResponse<IUnit[]>;

@Injectable({ providedIn: 'root' })
export class UnitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/units');
  businessId: any;
  private unitListSubject = new BehaviorSubject<IUnit[] | null>(null);
  public unitListData$ = this.unitListSubject.asObservable();

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
          this.unitListSubject.next(x);
        });
      }
    });
    // this.productCollection = this.firestore.collection<any>(`businesses/${this.businessId}/products`);
  } 

  private get unitCollection(): AngularFirestoreCollection<any> {
    return this.firestore.collection<any>(`businesses/${this.businessId}/units`);
  }


  create(unit: NewUnit): Promise<DocumentReference<IUnit>>{
    let copy = { ...this.convertDateFromClient(unit) };
    return this.unitCollection.add(copy);
  }

  update(unit: IUnit): Promise<void> {
    const copy = this.convertDateFromClient(unit);
    return this.unitCollection.doc(copy.id!).update(copy);
  }

  partialUpdate(unit: PartialUpdateUnit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(unit);
    return this.http
      .patch<RestUnit>(`${this.resourceUrl}/${this.getUnitIdentifier(unit)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestUnit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any):  Observable<IUnit[]> {
    const options = createRequestOption(req);
    return this.unitCollection.valueChanges({ idField: 'id' }).pipe(
      map(x => x.map(
      y=>{return this.convertDateFromServer(y)}
    )));
  }

  delete(id: string): Promise<void> {
    return this.unitCollection.doc(id).delete();
  }

  getUnitIdentifier(unit: Pick<IUnit, 'id'>): string {
    return unit.id;
  }

  compareUnit(o1: Pick<IUnit, 'id'> | null, o2: Pick<IUnit, 'id'> | null): boolean {
    return o1 && o2 ? this.getUnitIdentifier(o1) === this.getUnitIdentifier(o2) : o1 === o2;
  }

  addUnitToCollectionIfMissing<Type extends Pick<IUnit, 'id'>>(
    unitCollection: Type[],
    ...unitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const units: Type[] = unitsToCheck.filter(isPresent);
    if (units.length > 0) {
      const unitCollectionIdentifiers = unitCollection.map(unitItem => this.getUnitIdentifier(unitItem)!);
      const unitsToAdd = units.filter(unitItem => {
        const unitIdentifier = this.getUnitIdentifier(unitItem);
        if (unitCollectionIdentifiers.includes(unitIdentifier)) {
          return false;
        }
        unitCollectionIdentifiers.push(unitIdentifier);
        return true;
      });
      return [...unitsToAdd, ...unitCollection];
    }
    return unitCollection;
  }

  protected convertDateFromClient<T extends IUnit | NewUnit | PartialUpdateUnit>(unit: T): RestOf<T> {
    return {
      ...unit,
      createdDate: unit.createdDate?.toJSON() ?? null,
      modifiedDate: unit.modifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restUnit: RestUnit): IUnit {
    return {
      ...restUnit,
      createdDate: restUnit.createdDate ? dayjs(restUnit.createdDate) : undefined,
      modifiedDate: restUnit.modifiedDate ? dayjs(restUnit.modifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestUnit>): HttpResponse<IUnit> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestUnit[]>): HttpResponse<IUnit[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
