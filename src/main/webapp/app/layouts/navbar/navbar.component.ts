import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import HasAnyAuthorityDirective from 'app/shared/auth/has-any-authority.directive';
import { VERSION } from 'app/app.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import NavbarItem from './navbar-item.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { IBusiness } from 'app/entities/business/business.model';
import { Observable, combineLatest, concatMap, switchMap } from 'rxjs';
import { ProductService } from 'app/entities/product/service/product.service';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IProduct } from 'app/entities/product/product.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IInvoice } from 'app/entities/invoice/invoice.model';

@Component({
  standalone: true,
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [RouterModule, SharedModule, HasAnyAuthorityDirective],
})
export default class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: NavbarItem[] = [];
  business: IBusiness | null = null;

  constructor(
    private loginService: LoginService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router,
    private productService: ProductService,
    private businessService: BusinessService,
    private customerService: CustomerService,
    private invoiceService: InvoiceService
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });

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
      return combineLatest([this.productService.productListData$,
        this.customerService.customerListData$,this.invoiceService.invoiceListData$]);
    }),).pipe(switchMap(([products, customers, invoices]) => {
      if(products && customers && invoices){
        return combineLatest([this.productService.productListData$,
          this.customerService.customerListData$,this.invoiceService.invoiceListData$])
      }else{
        return combineLatest([this.productService.query(),
          this.customerService.query(),this.invoiceService.query()]);
      }
    })).subscribe(([products, customers, invoices]) => {
      this.productService.setProductList(products!);
      this.customerService.setCustomers(customers!);
      this.invoiceService.setInvoices(invoices!);
    });
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
