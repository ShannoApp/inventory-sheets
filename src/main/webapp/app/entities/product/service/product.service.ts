import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProduct, NewProduct } from '../product.model';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { BusinessService } from 'app/entities/business/service/business.service';
import { StockSummaryService } from 'app/entities/stock-summary/service/stock-summary.service';
import { IStockSummary } from 'app/entities/stock-summary/stock-summary.model';

export type PartialUpdateProduct = Partial<IProduct> & Pick<IProduct, 'id'>;

type RestOf<T extends IProduct | NewProduct> = Omit<T, 'asOfDate' | 'createdDate' | 'modifiedDate'> & {
  asOfDate?: string | null;
  createdDate?: string | null;
  modifiedDate?: string | null;
};

export type RestProduct = RestOf<IProduct>;

export type NewRestProduct = RestOf<NewProduct>;

export type PartialUpdateRestProduct = RestOf<PartialUpdateProduct>;

export type EntityResponseType = HttpResponse<IProduct>;
export type EntityArrayResponseType = HttpResponse<IProduct[]>;

@Injectable({ providedIn: 'root' })
export class ProductService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/products');
  // private productCollection: AngularFirestoreCollection<any>;
  businessId: any;

  private productListSubject = new BehaviorSubject<IProduct[] | null>(null);
  public productListData$ = this.productListSubject.asObservable();

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private firestore: AngularFirestore,
    private businessService: BusinessService,
    private stockService: StockSummaryService
  ) {
    this.businessService.businessData$.subscribe(business => {
      if(business) {
        this.businessId = business.id;
        this.query().subscribe(products => this.productListSubject.next(products));
      }
    });
    // this.productCollection = this.firestore.collection<any>(`businesses/${this.businessId}/products`);
  } 

  public setProductList(products: IProduct[]) {
    this.productListSubject.next(products);
  }
  
  private get productCollection(): AngularFirestoreCollection<any> {
    return this.firestore.collection<any>(`businesses/${this.businessId}/products`);
  }


  create(product: IProduct): Promise<DocumentReference<IProduct>> {
    let copy = { ...this.convertDateFromClient(product) };
    let stockCopy : any = null;
    if(product.stockSummary){
    stockCopy = {...this.stockService.convertDateFromClient(product.stockSummary) };
    }
    copy.stockSummary = stockCopy;
    return this.productCollection.add(copy);
  }

   update(product: IProduct): Promise<void> {
    let copy = { ...this.convertDateFromClient(product) };
    let stockCopy : any = null;
    if(product.stockSummary){
    stockCopy = {...this.stockService.convertDateFromClient(product.stockSummary) };
    }
    copy.stockSummary = stockCopy;
    return this.productCollection.doc(copy.id!).update(copy);
  }

  partialUpdate(product: PartialUpdateProduct): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(product);
    return this.http
      .patch<RestProduct>(`${this.resourceUrl}/${this.getProductIdentifier(product)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestProduct>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<IProduct[]> {

    return this.productCollection
    .valueChanges({ idField: 'id' })
    .pipe(
      map(products => {
        return products.map(product=>{
          let el =  this.convertDateFromServer(product);
          let stock : IStockSummary | null = el.stockSummary??null;
          el.stockSummary = this.stockService.convertDateFromServer({
          id:null,
          currentStockQuantity:stock?.currentStockQuantity,
          lastPurchaseQuantity:stock?.lastPurchaseQuantity,
          maximumStockQuantity:stock?.maximumStockQuantity,
          minimumStockQuantity:stock?.minimumStockQuantity,
          lastPurchasePrice:stock?.lastPurchasePrice,
          lastSaleQuantity:stock?.lastSaleQuantity,
          totalSaleQuantityTillDate:stock?.totalSaleQuantityTillDate,
          totalSaleTillDate:stock?.totalSaleTillDate,
          lastSaleDate:JSON.stringify(stock?.lastSaleDate),
          lastPurchaseDate:JSON.stringify(stock?.lastPurchaseDate), 
          });
 
          return el;
        })
        // .slice(0, 3 + 1);
      })
    );
    const options = createRequestOption(req);
    return this.productCollection.valueChanges({ idField: 'id' })
    .pipe(map(x=>{
      return x.map(y=>{
         let el =  this.convertDateFromServer(y);
         let stock : IStockSummary | null = el.stockSummary??null;
         el.stockSummary = this.stockService.convertDateFromServer({
         id:null,
         currentStockQuantity:stock?.currentStockQuantity,
         lastPurchaseQuantity:stock?.lastPurchaseQuantity,
         maximumStockQuantity:stock?.maximumStockQuantity,
         minimumStockQuantity:stock?.minimumStockQuantity,
         lastSaleQuantity:stock?.lastSaleQuantity,
         lastSaleDate:JSON.stringify(stock?.lastSaleDate),
         lastPurchaseDate:JSON.stringify(stock?.lastPurchaseDate), 
         });

         return el;
       });
     }));
  }

  delete(id: string): Promise<void>  {
    return this.productCollection.doc(id).delete();
  }

  getProductIdentifier(product: Pick<IProduct, 'id'>): string | null {
    return product.id;
  }

  compareProduct(o1: Pick<IProduct, 'id'> | null, o2: Pick<IProduct, 'id'> | null): boolean {
    return o1 && o2 ? this.getProductIdentifier(o1) === this.getProductIdentifier(o2) : o1 === o2;
  }

  addProductToCollectionIfMissing<Type extends Pick<IProduct, 'id'>>(
    productCollection: Type[],
    ...productsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const products: Type[] = productsToCheck.filter(isPresent);
    if (products.length > 0) {
      const productCollectionIdentifiers = productCollection.map(productItem => this.getProductIdentifier(productItem)!);
      const productsToAdd = products.filter(productItem => {
        const productIdentifier = this.getProductIdentifier(productItem);
        if (productCollectionIdentifiers.includes(productIdentifier!)) {
          return false;
        }
        productCollectionIdentifiers.push(productIdentifier!);
        return true;
      });
      return [...productsToAdd, ...productCollection];
    }
    return productCollection;
  }

  protected convertDateFromClient<T extends IProduct | NewProduct | PartialUpdateProduct>(product: T): RestOf<T> {
    return {
      ...product,
      asOfDate: product.asOfDate?.format(DATE_FORMAT) ?? null,
      createdDate: product.createdDate?.toJSON() ?? null,
      modifiedDate: product.modifiedDate?.toJSON() ?? null,
    };
  }

  // protected convertDateFromClient(product: IProduct): IProduct {
  //   return {
  //     ...product,
  //     // asOfDate: product.asOfDate?.format(DATE_FORMAT) ?? null,
  //     createdDate: product.createdDate?.toJSON() ?? null,
  //     modifiedDate: product.modifiedDate?.toJSON() ?? null,
  //   };
  // }

  protected convertDateFromServer(restProduct: RestProduct): IProduct {
    return {
      ...restProduct,
      asOfDate: restProduct.asOfDate ? dayjs(restProduct.asOfDate) : undefined,
      createdDate: restProduct.createdDate ? dayjs(restProduct.createdDate) : undefined,
      modifiedDate: restProduct.modifiedDate ? dayjs(restProduct.modifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestProduct>): HttpResponse<IProduct> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestProduct[]>): HttpResponse<IProduct[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
