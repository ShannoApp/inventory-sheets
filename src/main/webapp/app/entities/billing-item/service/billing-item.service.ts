import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBillingItem, NewBillingItem } from '../billing-item.model';

export type PartialUpdateBillingItem = Partial<IBillingItem> & Pick<IBillingItem, 'id'>;

export type EntityResponseType = HttpResponse<IBillingItem>;
export type EntityArrayResponseType = HttpResponse<IBillingItem[]>;

@Injectable({ providedIn: 'root' })
export class BillingItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/billing-items');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(billingItem: NewBillingItem): Observable<EntityResponseType> {
    return this.http.post<IBillingItem>(this.resourceUrl, billingItem, { observe: 'response' });
  }

  update(billingItem: IBillingItem): Observable<EntityResponseType> {
    return this.http.put<IBillingItem>(`${this.resourceUrl}/${this.getBillingItemIdentifier(billingItem)}`, billingItem, {
      observe: 'response',
    });
  }

  partialUpdate(billingItem: PartialUpdateBillingItem): Observable<EntityResponseType> {
    return this.http.patch<IBillingItem>(`${this.resourceUrl}/${this.getBillingItemIdentifier(billingItem)}`, billingItem, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IBillingItem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBillingItem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBillingItemIdentifier(billingItem: Pick<IBillingItem, 'id'>): string {
    return billingItem.id;
  }

  compareBillingItem(o1: Pick<IBillingItem, 'id'> | null, o2: Pick<IBillingItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getBillingItemIdentifier(o1) === this.getBillingItemIdentifier(o2) : o1 === o2;
  }

  addBillingItemToCollectionIfMissing<Type extends Pick<IBillingItem, 'id'>>(
    billingItemCollection: Type[],
    ...billingItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const billingItems: Type[] = billingItemsToCheck.filter(isPresent);
    if (billingItems.length > 0) {
      const billingItemCollectionIdentifiers = billingItemCollection.map(
        billingItemItem => this.getBillingItemIdentifier(billingItemItem)!,
      );
      const billingItemsToAdd = billingItems.filter(billingItemItem => {
        const billingItemIdentifier = this.getBillingItemIdentifier(billingItemItem);
        if (billingItemCollectionIdentifiers.includes(billingItemIdentifier)) {
          return false;
        }
        billingItemCollectionIdentifiers.push(billingItemIdentifier);
        return true;
      });
      return [...billingItemsToAdd, ...billingItemCollection];
    }
    return billingItemCollection;
  }
}
