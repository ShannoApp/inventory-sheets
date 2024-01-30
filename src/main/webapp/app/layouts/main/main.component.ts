import { Component, OnInit } from '@angular/core';

import { AccountService } from 'app/core/auth/account.service';
import { AppPageTitleStrategy } from 'app/app-page-title-strategy';
import { Router } from '@angular/router';
import { ProductService } from 'app/entities/product/service/product.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';
import { IProduct } from 'app/entities/product/product.model';
import { switchMap, Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  providers: [AppPageTitleStrategy],
})
export default class MainComponent implements OnInit {
  constructor(
    private router: Router,
    private appPageTitleStrategy: AppPageTitleStrategy,
    private accountService: AccountService,
  ) {
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();
  }
}
