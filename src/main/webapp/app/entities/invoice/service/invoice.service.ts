import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { map, tap } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInvoice, NewInvoice } from '../invoice.model';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { BusinessService } from 'app/entities/business/service/business.service';
import { IBusiness } from 'app/entities/business/business.model';
import { IPaymentDetail } from '../util/payment.model';

export type PartialUpdateInvoice = Partial<IInvoice> & Pick<IInvoice, 'id'>;

type RestOf<T extends IInvoice | NewInvoice> = Omit<T, 'issueDate' | 'dueDate'> & {
  issueDate?: string | null;
  dueDate?: string | null;
};

export type RestInvoice = RestOf<IInvoice>;

export type NewRestInvoice = RestOf<NewInvoice>;

export type PartialUpdateRestInvoice = RestOf<PartialUpdateInvoice>;

export type EntityResponseType = HttpResponse<IInvoice>;
export type EntityArrayResponseType = HttpResponse<IInvoice[]>;



@Injectable({ providedIn: 'root' })
export class InvoiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/invoices');
  businessId: any;
  // private invoices : IInvoice[] = [];

  private invoiceListSubject = new BehaviorSubject<IInvoice[] | null>(null);
public invoiceListData$ = this.invoiceListSubject.asObservable();

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private firestore: AngularFirestore,
    private businessService: BusinessService,
  ) {
    this.businessService.businessData$.subscribe(business => {
      if(business) {
        this.businessId = business.id;
        // this.query().subscribe(
        //   (data) => {
        //     // this.invoices = data;
        //     this.invoiceListSubject.next(data);
        //   },
        // );
      }
    });
    // this.productCollection = this.firestore.collection<any>(`businesses/${this.businessId}/products`);
  } 

  setInvoices(invoices:IInvoice[]){
    this.invoiceListSubject.next(invoices);
  }
  private get invoiceCollection(): AngularFirestoreCollection<any> {
    return this.firestore.collection<any>(`businesses/${this.businessId}/invoices`);
  }


  create(invoice: NewInvoice):  Promise<DocumentReference<IInvoice>>  {
    let copy = { ...this.convertDateFromClient(invoice) };
    let copyPayment : any = [];
    copy.payment?.details.forEach((detail) => {
      copyPayment.push(this.convertPaymentDetailFromClient(detail));
            });
    copy.payment!.details = copyPayment;
    return this.invoiceCollection.add(copy);
  }

  update(invoice: IInvoice): Promise<void> {
    const updatedInvoice = this.convertDateFromClient(invoice);
    let copy : any = [];
    updatedInvoice.payment?.details.forEach((detail) => {
              copy.push(this.convertPaymentDetailFromClient(detail));
            });
    updatedInvoice.payment!.details = copy;
    const promise = this.invoiceCollection.doc(updatedInvoice.id!).update(updatedInvoice);
    return promise;
  }
  

  partialUpdate(invoice: PartialUpdateInvoice): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoice);
    return this.http
      .patch<RestInvoice>(`${this.resourceUrl}/${this.getInvoiceIdentifier(invoice)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestInvoice>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any):  Observable<IInvoice[]> {
    const options = createRequestOption(req);
    return this.invoiceCollection.valueChanges({ idField: 'id' })
    .pipe(map(x=>{
      return x.map(y=>{
         let el =  this.convertDateFromServer(y);
         let copy : any = [];
         el.payment?.details.forEach((detail) => {
              copy.push(this.convertPaymentDetailFromServer(detail));
            });
            el.payment!.details = copy;
            return el;
       });
     }));
  }

 public convertPaymentDetailFromServer(val : IPaymentDetail){
    return {
      ...val,
      paymentDate: val.paymentDate ? dayjs(val.paymentDate) : undefined,
    }
  }

  convertPaymentDetailFromClient(val : IPaymentDetail){
    return {
      ...val,
      paymentDate: val.paymentDate?.format(DATE_FORMAT) ?? null,
    }
  }

  delete(id: string): Promise<void> {
    return this.invoiceCollection.doc(id).delete();
  }

  getInvoiceIdentifier(invoice: Pick<IInvoice, 'id'>): string {
    return invoice.id;
  }

  compareInvoice(o1: Pick<IInvoice, 'id'> | null, o2: Pick<IInvoice, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvoiceIdentifier(o1) === this.getInvoiceIdentifier(o2) : o1 === o2;
  }

  addInvoiceToCollectionIfMissing<Type extends Pick<IInvoice, 'id'>>(
    invoiceCollection: Type[],
    ...invoicesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const invoices: Type[] = invoicesToCheck.filter(isPresent);
    if (invoices.length > 0) {
      const invoiceCollectionIdentifiers = invoiceCollection.map(invoiceItem => this.getInvoiceIdentifier(invoiceItem)!);
      const invoicesToAdd = invoices.filter(invoiceItem => {
        const invoiceIdentifier = this.getInvoiceIdentifier(invoiceItem);
        if (invoiceCollectionIdentifiers.includes(invoiceIdentifier)) {
          return false;
        }
        invoiceCollectionIdentifiers.push(invoiceIdentifier);
        return true;
      });
      return [...invoicesToAdd, ...invoiceCollection];
    }
    return invoiceCollection;
  }

  protected convertDateFromClient<T extends IInvoice | NewInvoice | PartialUpdateInvoice>(
    invoice: T
  ): Pick<IInvoice, keyof IInvoice> {
    return {
      ...invoice,
      issueDate: invoice.issueDate?.format(DATE_FORMAT) ?? null,
      dueDate: invoice.dueDate?.format(DATE_FORMAT) ?? null,
    } as Pick<IInvoice, keyof IInvoice>;
  }

  protected convertDateFromServer(restInvoice: RestInvoice): IInvoice {
    return {
      ...restInvoice,
      issueDate: restInvoice.issueDate ? dayjs(restInvoice.issueDate) : undefined,
      dueDate: restInvoice.dueDate ? dayjs(restInvoice.dueDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInvoice>): HttpResponse<IInvoice> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInvoice[]>): HttpResponse<IInvoice[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
