import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBillingItem } from '../billing-item.model';
import { BillingItemService } from '../service/billing-item.service';

@Component({
  standalone: true,
  templateUrl: './billing-item-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BillingItemDeleteDialogComponent {
  billingItem?: IBillingItem;

  constructor(
    protected billingItemService: BillingItemService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.billingItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
