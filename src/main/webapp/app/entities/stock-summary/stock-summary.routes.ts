import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { StockSummaryComponent } from './list/stock-summary.component';
import { StockSummaryDetailComponent } from './detail/stock-summary-detail.component';
import { StockSummaryUpdateComponent } from './update/stock-summary-update.component';
import StockSummaryResolve from './route/stock-summary-routing-resolve.service';

const stockSummaryRoute: Routes = [
  {
    path: '',
    component: StockSummaryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StockSummaryDetailComponent,
    resolve: {
      stockSummary: StockSummaryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StockSummaryUpdateComponent,
    resolve: {
      stockSummary: StockSummaryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StockSummaryUpdateComponent,
    resolve: {
      stockSummary: StockSummaryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default stockSummaryRoute;
