  import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStockSummary, NewStockSummary } from '../stock-summary.model';

export type PartialUpdateStockSummary = Partial<IStockSummary> & Pick<IStockSummary, 'id'>;

type RestOf<T extends IStockSummary | NewStockSummary> = Omit<T, 'lastPurchaseDate' | 'lastSaleDate'> & {
  lastPurchaseDate?: string | null;
  lastSaleDate?: string | null;
};

export type RestStockSummary = RestOf<IStockSummary>;

export type NewRestStockSummary = RestOf<NewStockSummary>;

export type PartialUpdateRestStockSummary = RestOf<PartialUpdateStockSummary>;

export type EntityResponseType = HttpResponse<IStockSummary>;
export type EntityArrayResponseType = HttpResponse<IStockSummary[]>;

@Injectable({ providedIn: 'root' })
export class StockSummaryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/stock-summaries');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(stockSummary: IStockSummary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stockSummary);
    return this.http
      .post<RestStockSummary>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(stockSummary: IStockSummary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stockSummary);
    return this.http
      .put<RestStockSummary>(`${this.resourceUrl}/${this.getStockSummaryIdentifier(stockSummary)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(stockSummary: PartialUpdateStockSummary): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(stockSummary);
    return this.http
      .patch<RestStockSummary>(`${this.resourceUrl}/${this.getStockSummaryIdentifier(stockSummary)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestStockSummary>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestStockSummary[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getStockSummaryIdentifier(stockSummary: Pick<IStockSummary, 'id'>): string {
    return stockSummary.id??'';
  }

  compareStockSummary(o1: Pick<IStockSummary, 'id'> | null, o2: Pick<IStockSummary, 'id'> | null): boolean {
    return o1 && o2 ? this.getStockSummaryIdentifier(o1) === this.getStockSummaryIdentifier(o2) : o1 === o2;
  }

  addStockSummaryToCollectionIfMissing<Type extends Pick<IStockSummary, 'id'>>(
    stockSummaryCollection: Type[],
    ...stockSummariesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const stockSummaries: Type[] = stockSummariesToCheck.filter(isPresent);
    if (stockSummaries.length > 0) {
      const stockSummaryCollectionIdentifiers = stockSummaryCollection.map(
        stockSummaryItem => this.getStockSummaryIdentifier(stockSummaryItem)!,
      );
      const stockSummariesToAdd = stockSummaries.filter(stockSummaryItem => {
        const stockSummaryIdentifier = this.getStockSummaryIdentifier(stockSummaryItem);
        if (stockSummaryCollectionIdentifiers.includes(stockSummaryIdentifier)) {
          return false;
        }
        stockSummaryCollectionIdentifiers.push(stockSummaryIdentifier);
        return true;
      });
      return [...stockSummariesToAdd, ...stockSummaryCollection];
    }
    return stockSummaryCollection;
  }

  convertDateFromClient<T extends IStockSummary | NewStockSummary | PartialUpdateStockSummary>(stockSummary: T): RestOf<T> {
    return {
      ...stockSummary,
      lastPurchaseDate: stockSummary.lastPurchaseDate?.format(DATE_FORMAT) ?? null,
      lastSaleDate: stockSummary.lastSaleDate?.format(DATE_FORMAT) ?? null,
    };
  }

  convertDateFromServer(restStockSummary: RestStockSummary): IStockSummary {
    return {
      ...restStockSummary,
      lastPurchaseDate: restStockSummary.lastPurchaseDate ? dayjs(restStockSummary.lastPurchaseDate) : undefined,
      lastSaleDate: restStockSummary.lastSaleDate ? dayjs(restStockSummary.lastSaleDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestStockSummary>): HttpResponse<IStockSummary> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestStockSummary[]>): HttpResponse<IStockSummary[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
