import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBillingItem } from '../billing-item.model';
import { BillingItemService } from '../service/billing-item.service';
import { BillingItemFormService, BillingItemFormGroup } from './billing-item-form.service';

@Component({
  standalone: true,
  selector: 'jhi-billing-item-update',
  templateUrl: './billing-item-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BillingItemUpdateComponent implements OnInit {
  isSaving = false;
  billingItem: IBillingItem | null = null;

  editForm: BillingItemFormGroup = this.billingItemFormService.createBillingItemFormGroup();

  constructor(
    protected billingItemService: BillingItemService,
    protected billingItemFormService: BillingItemFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ billingItem }) => {
      this.billingItem = billingItem;
      if (billingItem) {
        this.updateForm(billingItem);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const billingItem = this.billingItemFormService.getBillingItem(this.editForm);
    if (billingItem.id !== null) {
      this.subscribeToSaveResponse(this.billingItemService.update(billingItem));
    } else {
      this.subscribeToSaveResponse(this.billingItemService.create(billingItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBillingItem>>): void {
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

  protected updateForm(billingItem: IBillingItem): void {
    this.billingItem = billingItem;
    this.billingItemFormService.resetForm(this.editForm, billingItem);
  }
}
