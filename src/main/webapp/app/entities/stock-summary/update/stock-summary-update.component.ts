import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IStockSummary } from '../stock-summary.model';
import { StockSummaryService } from '../service/stock-summary.service';
import { StockSummaryFormService, StockSummaryFormGroup } from './stock-summary-form.service';

@Component({
  standalone: true,
  selector: 'jhi-stock-summary-update',
  templateUrl: './stock-summary-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StockSummaryUpdateComponent implements OnInit {
  isSaving = false;
  stockSummary: IStockSummary | null = null;

  editForm: StockSummaryFormGroup = this.stockSummaryFormService.createStockSummaryFormGroup();

  constructor(
    protected stockSummaryService: StockSummaryService,
    protected stockSummaryFormService: StockSummaryFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stockSummary }) => {
      this.stockSummary = stockSummary;
      if (stockSummary) {
        this.updateForm(stockSummary);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const stockSummary = this.stockSummaryFormService.getStockSummary(this.editForm);
    if (stockSummary.id !== null) {
      this.subscribeToSaveResponse(this.stockSummaryService.update(stockSummary));
    } else {
      this.subscribeToSaveResponse(this.stockSummaryService.create(stockSummary));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStockSummary>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(stockSummary: IStockSummary): void {
    this.stockSummary = stockSummary;
    this.stockSummaryFormService.resetForm(this.editForm, stockSummary);
  }
}
