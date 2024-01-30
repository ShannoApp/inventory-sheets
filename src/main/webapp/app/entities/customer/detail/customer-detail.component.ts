import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { ICustomer } from '../customer.model';
import { InvoiceService } from 'app/entities/invoice/service/invoice.service';
import { IInvoice } from 'app/entities/invoice/invoice.model';
import { PaymentStatus } from 'app/entities/invoice/enum/paymentStatus-enum';

@Component({
  standalone: true,
  selector: 'jhi-customer-detail',
  templateUrl: './customer-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class CustomerDetailComponent implements OnInit {
  @Input() customer: ICustomer | null = null;

  invoices: IInvoice[] = [];
  totalPaidAmounttillDate: number = 0;
  totalDueTillDate: number = 0;

  constructor(protected activatedRoute: ActivatedRoute, protected invoiceService: InvoiceService) {
    
  }
  ngOnInit(): void {
    this.invoiceService.invoiceListData$.subscribe(invces => {
      this.invoices = invces!.filter((invoice) => invoice.customerId === this.customer?.id);
      console.log(this.invoices);
      this.calculateTotal(this.invoices);
    });
  }

  previousState(): void {
    window.history.back();
  }

  calculateTotal(invices : IInvoice[]): void {
   invices.forEach((invoice) =>{
    
    if(invoice.payment?.paymentStatus == PaymentStatus.PENDING){
      this.totalDueTillDate = this.totalDueTillDate  + invoice.totalAmount!;
    } else if(invoice.payment?.paymentStatus == PaymentStatus.PARTIAL){
      this.totalPaidAmounttillDate = this.totalPaidAmounttillDate + (invoice.totalAmount! - invoice.payment.dueAmount!);
      this.totalDueTillDate = this.totalDueTillDate  + invoice.payment.dueAmount!;
    } else if(invoice.payment?.paymentStatus == PaymentStatus.PAID){
      this.totalPaidAmounttillDate = this.totalPaidAmounttillDate + invoice.totalAmount!;
    } 
   });
  }
}
