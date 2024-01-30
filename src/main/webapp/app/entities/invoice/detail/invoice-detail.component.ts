import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IInvoice } from '../invoice.model';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { NewBusiness } from 'app/entities/business/business.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPaymentComponent } from '../util/add-payment/add-payment.component';
import { InvoiceService } from '../service/invoice.service';
import { DATE_FORMAT } from 'app/config/input.constants';
import { IPayment, IPaymentDetail } from '../util/payment.model';
import { PaymentStatus } from '../enum/paymentStatus-enum';

@Component({
  standalone: true,
  selector: 'jhi-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.scss'],
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class InvoiceDetailComponent {
  @Input() invoice: IInvoice | null = null;
  paymentRecord: any;

  constructor(protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    protected invoiceService: InvoiceService) { 

    }

  previousState(): void {
    window.history.back();
  }

  addPayment(): void {
    const modalRef = this.modalService.open(AddPaymentComponent, { size: 'lg', backdrop: 'static' });
    // modalRef.componentInstance.availableProducts = this.products;
    modalRef.componentInstance.payment = this.invoice?.payment;
    modalRef.closed
      .subscribe({
        next: (res: any) => {
          if (this.invoice) {
            this.invoice.payment = res;

            this.invoiceService.update(Object.assign({},this.invoice));
          }
        },
      });
  }

  /**
  * Downloads the invoice as a PDF.
  */
  downloadPdf(): void {
    const data = document.getElementById('invoice-detail') ?? document.body;

    // Capture the HTML content as an image using html2canvas
    html2canvas(data).then(canvas => {
      const imgWidth = this.getImgWidth(); // Calculate image width based on device type
      const pageDimensions = this.getPageDimensions(); // Set page dimensions based on device type

      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', pageDimensions as [number, number]); // Create a new PDF document
      const position = 0;

      // Add the captured image to the PDF
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);

      // Save the generated PDF
      pdf.save('invoice.pdf');
    });
  }

  getImgWidth(): number {
    // Adjust image width based on screen width
    return window.innerWidth > 768 ? 208 : 140; // Adjust these values as needed
  }

  getPageDimensions(): [number, number] | [string, string] {
    // Set page dimensions based on screen width
    return window.innerWidth > 768 ? [210, 297] : [140, 330]; // Adjust these values as needed
  }
}
