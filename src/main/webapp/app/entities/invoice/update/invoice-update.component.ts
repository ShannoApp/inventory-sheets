import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInvoice, NewInvoice } from '../invoice.model';
import { InvoiceService } from '../service/invoice.service';
import { InvoiceFormService, InvoiceFormGroup } from './invoice-form.service';
import { ProductSelectionComponent } from '../util/product-selection/product-selection.component';
import { ProductService } from 'app/entities/product/service/product.service';
import { IProduct } from 'app/entities/product/product.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IBillingItem } from 'app/entities/billing-item/billing-item.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { IBusiness, NewBusiness } from 'app/entities/business/business.model';
import { CustomerSelectionComponent } from '../util/customer-selection/customer-selection.component';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { InvoiceDetailComponent } from '../detail/invoice-detail.component';
import { PaymentStatus } from '../enum/paymentStatus-enum';

@Component({
  standalone: true,
  selector: 'jhi-invoice-update',
  templateUrl: './invoice-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, 
    ProductSelectionComponent, CustomerSelectionComponent,InvoiceDetailComponent],
  styleUrls:["./invoice-form.service.scss"]
})
export class InvoiceUpdateComponent implements OnInit {
  isSaving = false;
  invoice: IInvoice | null  = null;

  editForm: InvoiceFormGroup = this.invoiceFormService.createInvoiceFormGroup();
  products: IProduct[] = [];
  selectedProducts: IBillingItem[] = [];
  business: IBusiness | undefined;
  selectedCustomer: ICustomer = {
    id: "",
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    address: null,
    createdDate: null,
    modifiedDate:null, };
  customers: ICustomer[]  = [];
  openView: boolean = false;
  selectedProductList: any[] = [];

  constructor(
    protected invoiceService: InvoiceService,
    protected invoiceFormService: InvoiceFormService,
    protected activatedRoute: ActivatedRoute,
    protected productService: ProductService,
    protected modalService: NgbModal,
    protected businessService: BusinessService,
    protected customerService: CustomerService,
    protected router: Router,
  ) {
    this.businessService.businessData$.subscribe(business => {
      if(business) {
        this.business = business;
      }
    });

    this.customerService.customerListData$.subscribe(customers => {
      this.customers = customers??[];
    });

    this.productService.productListData$.subscribe(res => {
      this.products = res??[];
    });
  }

  removeProduct(index: number): void {
    this.selectedProductList.splice(index, 1);
    this.selectedProducts.splice(index, 1);
    this.calculateTotalSellingPrice();
  }

  openProductSelection(): void {
    const modalRef = this.modalService.open(ProductSelectionComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.availableProducts = this.products;
    modalRef.componentInstance.selectedProducts = this.selectedProductList;

    modalRef.closed
      .subscribe({
        next: (res: IProduct[]) => {
          res.forEach(product => {
            this.handleSelectedProductsChange(product);
          });
        },
      });
  }

  openCustomerSelection(): void {
    const modalRef = this.modalService.open(CustomerSelectionComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.customers = this.customers;

    modalRef.closed
      .subscribe({
        next: (res: ICustomer) => {
          this.handleCustomerSelection(res);
        },
      });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ invoice }) => {
      this.invoice = invoice;
      if (invoice) {
        this.selectedCustomer.firstName = invoice.customerName.split(" ")[0];
        this.selectedCustomer.lastName = invoice.customerName.split(" ")[1];
        this.selectedProducts = invoice.billingItems;
        this.updateForm(invoice);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const invoice = this.invoiceFormService.getInvoice(this.editForm);

    invoice.businessName = this.business?.name;
    invoice.businessWebsite = this.business?.website;
    invoice.businessEmail = this.business?.email;
    invoice.businessPhone = this.business?.phone;

    invoice.billingItems = this.selectedProducts;
    invoice.customerId = this.selectedCustomer?.id;
    invoice.customerName = this.selectedCustomer?.firstName + " " + this.selectedCustomer?.lastName;

    invoice.payment = {
      id: null,
      paymentStatus : PaymentStatus.PENDING,
      dueAmount: invoice.totalAmount,
      details: []
    }

    if (invoice.id !== null) {
      this.subscribeToSaveResponse(this.invoiceService.update(invoice));
    } else {
      this.subscribeToSaveResponse(this.invoiceService.create(invoice));
    }
  }
protected async subscribeToSaveResponse(result: Promise<any>): Promise<void> {
  try {
    await result.then((res=>{
      if (res) {
        console.log(res);
        this.invoice = res;
      }
    }));
    
    for (const bi of this.selectedProducts ?? []) {
      const product: IProduct = this.selectedProductList.find(p => p.id === bi.productId);
      if (product) {
        product.stockSummary!.currentStockQuantity = product.stockSummary!.currentStockQuantity! - bi.quantity!;

        if(!product.stockSummary!.totalSaleTillDate){
          product.stockSummary!.totalSaleTillDate = 0;
        }
        if(!product.stockSummary!.totalSaleQuantityTillDate){
          product.stockSummary!.totalSaleQuantityTillDate = 0;
        }
        if(!product.stockSummary!.lastPurchasePrice){
          product.stockSummary!.lastPurchasePrice = null;
        }
        product.totalProfit = product.totalProfit??0 + ((bi.adjustPrice!*bi.quantity!)-((product.purchasePrice?? 0)*bi.quantity!));
        product.stockSummary!.totalSaleTillDate = (product.stockSummary!.totalSaleTillDate ?? 0) + (bi.adjustPrice!*bi.quantity!);
        product.stockSummary!.totalSaleQuantityTillDate = (product.stockSummary!.totalSaleQuantityTillDate ?? 0) + bi.quantity!;
        product.stockSummary!.lastSaleQuantity = bi.quantity!;

        await this.productService.update(product).then();
        console.log("Product stock updated successfully", product);
      }
    }

    this.onSaveSuccess();
    this.onSaveFinalize();
  } catch (error) {
    console.error("Error while saving invoice:", error);
    this.onSaveError();
    this.onSaveFinalize();
  }
}


  protected onSaveSuccess(): void {
    this.openView = true;
    this.router.navigateByUrl('/invoice/'+this.invoice?.id+'/view');
    // this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(invoice: IInvoice): void {
    this.invoice = invoice;
    this.invoiceFormService.resetForm(this.editForm, invoice);
  }

  handleCustomerSelection(customer: ICustomer): void {
    this.selectedCustomer = customer;
    // You can perform additional actions based on the selected customer
  }

  handleSelectedProductsChange(product: IProduct): void {
    // Check if the product is already in the selected products array
    const existingProduct = this.selectedProducts.find((billingProduct: IBillingItem) => billingProduct.productId == product.id);

    if (!existingProduct) {
      // If the product is not in the array, add it with default values
      const newProduct: IBillingItem = {
        id: product.id??'',
        name: product.name,
        unit : product.unit?.name,
        quantity: 1, // You can set default values as needed
        unitPrice: product.sellingPrice,
        adjustPrice: product.sellingPrice,
        productId: product.id,  // Assigning productId
      };
      this.selectedProductList.push(product);
      this.selectedProducts.push(newProduct);
    }
    this.calculateTotalSellingPrice();
  }

  calculateTotalSellingPrice(): void {
    this.selectedProducts.forEach((product: IBillingItem) => {
      product.total = (product.quantity || 0) * (product.adjustPrice || 0);
    });

    const totalSellingPrice = this.selectedProducts.reduce((sum, product) => {
      // You may need to fetch the actual selling price from your data source
      // For now, we assume sellingPrice is always 0, you should replace it with actual data
      return sum + (product.total || 0);
    }, 0);
    this.editForm.get("amount")?.setValue(totalSellingPrice);
    this.calculateTotalBasedOnExtraParameter();
  }

  calculateTotalBasedOnExtraParameter(): void {
    const discountAmount = this.editForm.get("discount")?.value??0;
    const subAmount = this.editForm.get("amount")?.value??0;
    const taxAmount = this.editForm.get("tax")?.value??0;
    const shippingCharges = this.editForm.get("shippingCharges")?.value??0;
    this.editForm.get("totalAmount")?.setValue((subAmount + taxAmount + shippingCharges - Math.abs(discountAmount)) );
     ;
  }
}
