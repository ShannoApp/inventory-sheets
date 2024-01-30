import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IProduct } from '../product.model';
import { map, switchMap } from 'rxjs';
import { ProductService } from '../service/product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddStockComponent } from '../util/add-stock/add-stock.component';
import { IStockSummary } from 'app/entities/stock-summary/stock-summary.model';

@Component({
  standalone: true,
  selector: 'jhi-product-detail',
  templateUrl: './product-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ProductDetailComponent implements OnInit{
  @Input() product: IProduct | null = null;
  productId: any;

  constructor(protected activatedRoute: ActivatedRoute,
    protected productService: ProductService,
    protected modalService: NgbModal
    ) {
   
  }
  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      switchMap((params) => {
      this.productId = params.id;
      return this.productService.productListData$;
    })).subscribe(ps=>{
      this.product = ps?.find((p)=>p.id === this.productId)??null;
      });
  }

  previousState(): void {
    window.history.back();
  }

  openAddStock(){
    const modalRef = this.modalService.open(AddStockComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.stockSummary = this.product?.stockSummary;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .subscribe({
        next: (res: IStockSummary) => {
          this.product!.stockSummary = res;
          this.productService.update(this.product!).then();
        },
      });
  }
}
