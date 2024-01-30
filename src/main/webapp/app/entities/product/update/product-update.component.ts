import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProduct } from '../product.model';
import { ProductService } from '../service/product.service';
import { ProductFormService, ProductFormGroup } from './product-form.service';
import { StockSummaryFormGroup, StockSummaryFormService } from 'app/entities/stock-summary/update/stock-summary-form.service';
import { IStockSummary } from 'app/entities/stock-summary/stock-summary.model';
import { UnitService } from 'app/entities/unit/service/unit.service';
import { IUnit } from 'app/entities/unit/unit.model';
import { CategoryService } from 'app/entities/category/service/category.service';
import { ICategory } from 'app/entities/category/category.model';

@Component({
  standalone: true,
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, RouterModule],
})
export class ProductUpdateComponent implements OnInit {

  isSaving = false;
  product: IProduct | null = null;

  editForm: ProductFormGroup = this.productFormService.createProductFormGroup();

  stockSummary: IStockSummary | null = null;

  editSummaryForm: StockSummaryFormGroup = this.stockSummaryFormService.createStockSummaryFormGroup();
  units: IUnit[] | null = [];
  categories: ICategory[] | null = [];
  isAddNew: boolean = false;

  constructor(
    protected stockSummaryFormService: StockSummaryFormService,
    protected productService: ProductService,
    protected productFormService: ProductFormService,
    protected activatedRoute: ActivatedRoute,
    protected unitService: UnitService,
    protected router: Router,
    protected categoryService: CategoryService,
  ) {
    this.unitService.unitListData$.subscribe(u=>{
      this.units = u;
    });
    this.categoryService.categoryListData$.subscribe(c=>{
      console.log(c);
      this.categories = c;
    });
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
      if (product) {
        this.updateForm(product);
      }
    });
  }

  onChange(val: any){
    if(val.target.value == 'Add New Unit'){
      this.router.navigateByUrl('/unit/new');
    }
  }

  addNewCategory(val: any){
    if(val.target.value == 'Add New Category'){
      this.router.navigateByUrl('/category/new');
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.productFormService.getProduct(this.editForm);
    product.stockSummary = this.stockSummaryFormService.getStockSummary(this.editSummaryForm);
    let unit = this.units?.find(u=>u.id == product.unit+'');
    product.unit = {id:unit?.id!,name:unit?.name}

    // for (let i=1;i<100;i++) {
    //   let productx = Object.assign({},product);
    //   productx.name = product.name! + '-'+i;
    //   productx.sellingPrice = product.sellingPrice! + i;
    //   productx.purchasePrice = product.purchasePrice! + i;
    //   this.subscribeToSaveResponse(this.productService.create(productx));
    // }
    if (product.id !== null) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  saveAndAdd() {
    this.isAddNew = true;
    this.save();
    }

  protected subscribeToSaveResponse(result: Promise<any>): void {
    result.then(
      () => {this.onSaveSuccess();this.onSaveFinalize();},
      () => {this.onSaveError();this.onSaveFinalize();},
    )
  }

  protected onSaveSuccess(): void {
    // if(this.isAddNew){
    //   window.location.reload();
    // }else{
    //   this.previousState();
    // }
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(product: IProduct): void {
    this.product = product;
    this.productFormService.resetForm(this.editForm, product);
    this.stockSummaryFormService.resetForm(this.editSummaryForm, product.stockSummary!);
  }
}
