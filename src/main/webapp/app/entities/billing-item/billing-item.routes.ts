import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { BillingItemComponent } from './list/billing-item.component';
import { BillingItemDetailComponent } from './detail/billing-item-detail.component';
import { BillingItemUpdateComponent } from './update/billing-item-update.component';
import BillingItemResolve from './route/billing-item-routing-resolve.service';

const billingItemRoute: Routes = [
  {
    path: '',
    component: BillingItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BillingItemDetailComponent,
    resolve: {
      billingItem: BillingItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BillingItemUpdateComponent,
    resolve: {
      billingItem: BillingItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BillingItemUpdateComponent,
    resolve: {
      billingItem: BillingItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default billingItemRoute;
