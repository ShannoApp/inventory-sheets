import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ICustomer } from '../customer.model';
import { CustomerService } from '../service/customer.service';
import { CustomerFormService, CustomerFormGroup } from './customer-form.service';

@Component({
  standalone: true,
  selector: 'jhi-customer-update',
  templateUrl: './customer-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CustomerUpdateComponent implements OnInit {
  isSaving = false;
  customer: ICustomer | null = null;

  editForm: CustomerFormGroup = this.customerFormService.createCustomerFormGroup();

  constructor(
    protected customerService: CustomerService,
    protected customerFormService: CustomerFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customer }) => {
      this.customer = customer;
      if (customer) {
        this.updateForm(customer);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customer = this.customerFormService.getCustomer(this.editForm);

    // for(let i=1;i<50;i++){
    //   let customer1 = Object.assign({}, customer);
    //   customer1.firstName = customer.firstName + " " + i;
    //   customer1.lastName = customer.lastName! +  " "+ i;
    //   customer1.phone = (parseInt(customer.phone!) + i)+'';

    //   this.subscribeToSaveResponse(this.customerService.create(customer1));
    // }
    if (customer.id !== null) {
      this.subscribeToSaveResponse(this.customerService.update(customer));
    } else {
      this.subscribeToSaveResponse(this.customerService.create(customer));
    }
  }

  protected subscribeToSaveResponse(result: Promise<any>): void {
    result.then(
      () => {this.onSaveSuccess(),this.onSaveFinalize()},
      () => {this.onSaveError(),this.onSaveFinalize()}
    );
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

  protected updateForm(customer: ICustomer): void {
    this.customer = customer;
    this.customerFormService.resetForm(this.editForm, customer);
  }
}
