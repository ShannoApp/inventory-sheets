import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'business',
        data: { pageTitle: 'Businesses' },
        loadChildren: () => import('./business/business.routes'),
      },
      {
        path: 'product',
        data: { pageTitle: 'Products' },
        loadChildren: () => import('./product/product.routes'),
      },
      {
        path: 'customer',
        data: { pageTitle: 'Customers' },
        loadChildren: () => import('./customer/customer.routes'),
      },
      {
        path: 'unit',
        data: { pageTitle: 'Units' },
        loadChildren: () => import('./unit/unit.routes'),
      },
      {
        path: 'category',
        data: { pageTitle: 'Categories' },
        loadChildren: () => import('./category/category.routes'),
      },
      {
        path: 'billing-item',
        data: { pageTitle: 'BillingItems' },
        loadChildren: () => import('./billing-item/billing-item.routes'),
      },
      {
        path: 'stock-summary',
        data: { pageTitle: 'StockSummaries' },
        loadChildren: () => import('./stock-summary/stock-summary.routes'),
      },
      {
        path: 'invoice',
        data: { pageTitle: 'Invoices' },
        loadChildren: () => import('./invoice/invoice.routes'),
      },
      {
        path: 'payment',
        data: { pageTitle: 'Payments' },
        loadChildren: () => import('./payment/payment.routes'),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
