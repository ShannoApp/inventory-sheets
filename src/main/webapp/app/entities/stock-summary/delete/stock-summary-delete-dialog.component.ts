import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IStockSummary } from '../stock-summary.model';
import { StockSummaryService } from '../service/stock-summary.service';

@Component({
  standalone: true,
  templateUrl: './stock-summary-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class StockSummaryDeleteDialogComponent {
  stockSummary?: IStockSummary;

  constructor(
    protected stockSummaryService: StockSummaryService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.stockSummaryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
