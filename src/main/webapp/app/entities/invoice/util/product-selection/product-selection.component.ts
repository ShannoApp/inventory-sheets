import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IProduct } from 'app/entities/product/product.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.scss'],
  imports: [FormsModule,SharedModule],
})
export class ProductSelectionComponent implements OnInit ,OnChanges{



  @Input() 
  availableProducts: IProduct[] = [];

  allProducts: IProduct[] = [];

  @Output() 
  selectedProductsChange = new EventEmitter<IProduct[]>();

  selectedProducts: any[] = [];
  selectedProducts1: any[] = [];
  searchText: any = '';


  constructor(
    protected activeModal: NgbActiveModal,
  ) { 
    
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.searchText);
  }

  onInputChange(event: any) {
    let text = event.target?.value;

    this.availableProducts = this.allProducts.filter(product => product.name?.toLowerCase().includes(text.toLowerCase()));
  }

  ngOnInit(): void {
    // You can keep or remove this depending on your use case
    this.selectedProducts1 = this.selectedProducts.concat(this.selectedProducts1);
    this.allProducts = this.availableProducts.concat(this.allProducts);
    this.selectedProductsChange.emit(this.selectedProducts);
  }
  removeProduct(index: number) {
    this.selectedProducts1.splice(index, 1);
    }

  toggleSelection(product: any): void {
    const index = this.selectedProducts1.findIndex(p => p.id === product.id);
    if (index === -1) {
      this.selectedProducts1.push(product);
    } else {
      this.selectedProducts1.splice(index, 1);
    }
  }

  isSelected(product: IProduct) {
    const index = this.selectedProducts1.findIndex(p => p.id === product.id);
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  }

  confirm(): void {
    this.selectedProducts = this.selectedProducts1;
      this.activeModal.close(this.selectedProducts);
  }

  cancel() {
    this.activeModal.dismiss('cancel');
    }
}
