import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBusiness } from '../business.model';
import { BusinessService } from '../service/business.service';

@Component({
  standalone: true,
  templateUrl: './business-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BusinessDeleteDialogComponent {
  business?: IBusiness;

  constructor(
    protected businessService: BusinessService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.businessService.deleteBusiness(id).then(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
