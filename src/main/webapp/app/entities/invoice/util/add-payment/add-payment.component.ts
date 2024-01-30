import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IPaymentDetail, IPayment } from '../payment.model';
import { PaymentType } from '../../enum/paymentType-enum';
import { PaymentStatus } from '../../enum/paymentStatus-enum';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import dayjs from 'dayjs/esm';
import { DATE_FORMAT } from 'app/config/input.constants';
import { InvoiceService } from '../../service/invoice.service';

@Component({
  standalone: true,
  selector: 'jhi-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss'],
  imports: [ReactiveFormsModule, FormsModule,DurationPipe,
    FormatMediumDatetimePipe,
    FormatMediumDatePipe,SharedModule],
})
export class AddPaymentComponent implements OnInit {
  public payment: IPayment | null = null;
  paymentTypeOptions = Object.values(PaymentType);
  paymentStatusOptions = Object.values(PaymentStatus);
  detailsArray: IPaymentDetail[]= [];
  due: number = this.payment?.dueAmount!;
  existingDetails: IPaymentDetail[] = [];
  errorMgs: string | null = null;

  constructor(private fb: FormBuilder, protected activeModal: NgbActiveModal
    ,protected invoiceService: InvoiceService) {
  //   if(this.payment){
  //   this.payment?.details.forEach(detail => {
  //     copy.push(this.invoiceService.convertPaymentDetailFromServer(detail));
  //   });
  //   this.payment.details = copy;
  // }
  
  }
  ngOnInit(): void {
    this.due = this.payment?.dueAmount!;
    this.existingDetails =  this.existingDetails.concat(this.payment?.details??[]);
  }

  createPaymentDetailFormGroup(): FormGroup {
    return this.fb.group({
      paymentDate: [dayjs().format(DATE_FORMAT) ?? null],
      amount: [Validators.required],
      paymentType: [null, Validators.required],
    });
  }

  getCurrentDate(): dayjs.Dayjs {
    return dayjs(); // This creates a Dayjs object representing the current date and time
  }

  addPaymentDetail(): void {
    this.detailsArray.push({
      paymentDate: this.getCurrentDate(),
      amount: 0,
      paymentType: PaymentType.CASH
    });
  }

  removePaymentDetail(index: number): void {
    if(this.payment)
    this.detailsArray = this.detailsArray.slice(index, 1);  
  }

  manageAmountChange(val : number){
    if(this.payment != null){
    if((this.payment?.dueAmount! - val)< 0){
      this.errorMgs = "Payment Amount cannot be greater than the due amount";
      // throw new Error("Payment Amount cannot be greater than the due amount");
      return;
    }
    this.errorMgs = null;
    this.due = this.payment?.dueAmount! - val;
    this.payment.paymentStatus = this.calculateAndPopulateData(this.payment);
    }
  }

  cancel(): void {
    this.activeModal.dismiss();
  }

  submitForm(): void {
    if (this.detailsArray.length > 0) {
      if(this.payment && this.errorMgs == null){
        this.payment.details = this.existingDetails.concat(this.detailsArray);
        this.payment.dueAmount = this.due;
        this.activeModal.close(Object.assign({}, this.payment));
      }
    } 
  }

  calculateAndPopulateData(obj: IPayment) {
    if (this.due == 0) {
      return PaymentStatus.PAID;
    } else if (this.due > 0) {
      return  PaymentStatus.PARTIAL;
    } else {
      return PaymentStatus.PENDING;
    }
  }
}

