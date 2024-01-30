import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { UnitComponent } from './list/unit.component';
import { UnitDetailComponent } from './detail/unit-detail.component';
import { UnitUpdateComponent } from './update/unit-update.component';
import UnitResolve from './route/unit-routing-resolve.service';

const unitRoute: Routes = [
  {
    path: '',
    component: UnitComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UnitDetailComponent,
    resolve: {
      unit: UnitResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UnitUpdateComponent,
    resolve: {
      unit: UnitResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UnitUpdateComponent,
    resolve: {
      unit: UnitResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default unitRoute;
