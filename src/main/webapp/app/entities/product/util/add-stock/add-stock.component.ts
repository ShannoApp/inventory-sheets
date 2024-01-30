import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IStockSummary } from 'app/entities/stock-summary/stock-summary.model';
import SharedModule from 'app/shared/shared.module';
import dayjs from 'dayjs/esm';

@Component({
  standalone: true,
  selector: 'jhi-add-stock',
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.scss'],
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AddStockComponent {


  stockSummary : IStockSummary | null = null;
  lastPurchaseQuanty : number | null = null;
  lastPurchasePrce : number | null = null;

  constructor( protected activeModal: NgbActiveModal) { 

  }

  previousState() {
      this.activeModal.dismiss();
  }
  

    save() {
      this.stockSummary!.lastPurchaseQuantity = this.lastPurchaseQuanty;
      this.stockSummary!.lastPurchaseDate = dayjs();
      this.stockSummary!.lastPurchasePrice = this.lastPurchasePrce;
      this.stockSummary!.currentStockQuantity = this.stockSummary!.currentStockQuantity! + this.lastPurchaseQuanty!;
        this.activeModal.close(this.stockSummary);
    }
}
