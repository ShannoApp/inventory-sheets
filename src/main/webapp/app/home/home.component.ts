import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { FirestoreService } from 'app/core/db/firestore.service';
import { ProductService } from 'app/entities/product/service/product.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';
import { IProduct } from 'app/entities/product/product.model';

@Component({
  standalone: true,
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [SharedModule, RouterModule],
})
export default class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;

  private readonly destroy$ = new Subject<void>();
  totalEarnings: number = 0;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private firestore: FirestoreService,
    private productService: ProductService,
    private businessService: BusinessService,
    private customerService: CustomerService,
    private invoiceService: InvoiceService
  ) {
    this.businessService.businessData$.pipe(
      switchMap((business: IBusiness | null) => {
        // Check if 'business' is null
        if (business !== null) {
          console.log('business',business);
          return this.businessService.businessData$;
        }else{
          return this.businessService.query();
        }
      })
    ).pipe(switchMap(business => {
      // Simulate an asynchronous operation
      console.log('business1',business);
      const combined$: Observable<[IProduct[], ICustomer[], IInvoice[]]> = combineLatest([this.productService.query(),
        this.customerService.query(),this.invoiceService.query()]);
      return combined$;
    }),).subscribe(([products, customers, invoices]) => {
      console.log('data',products, customers, invoices);
      this.productService.setProductList(products);
      this.customerService.setCustomers(customers);
      this.invoiceService.setInvoices(invoices);
    });
  }

  ngOnInit(): void {
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
      
      this.productService.productListData$.subscribe(ps => {
        
        if(ps){
          this.totalEarnings = 0;
        ps.forEach(element => {
          if(!element.totalProfit){
            element.totalProfit = 0;
          }
          this.totalEarnings = this.totalEarnings + element.totalProfit! ;
        });
      }
      });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addItem(): void {
    let item = {
      products: [{name:"abc"},{name:"xyz"}]
    };

    this.firestore.addItem(item)?.then(result => {
      this.firestore.addSubcollection(result.id, 'products', {name:"abc"});
    });
  }

  getItem(): void {
    let item = {
      products: [{name:"abc"},{name:"xyz"}]
    };

    this.firestore.getItems()?.subscribe(result => {
      console.log(result);
    });
  }
}
