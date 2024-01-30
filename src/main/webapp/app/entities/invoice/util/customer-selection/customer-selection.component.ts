import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICustomer } from 'app/entities/customer/customer.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  standalone: true,
  selector: 'jhi-customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.scss'],
  imports: [FormsModule,SharedModule],
})
export class CustomerSelectionComponent implements OnInit{
  actulalCustomers: ICustomer[] = [];

  @Input() customers: ICustomer[] = [];
  @Output() customerSelected = new EventEmitter<ICustomer>();


  constructor(
    protected activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
    this.actulalCustomers = this.customers;
  }

  onInputChange(event: any) {
    this.customers = this.actulalCustomers.filter(c=>{
      return c.firstName!.toLowerCase().includes(event.target.value.toLowerCase()) ||
      c.lastName!.toLowerCase().includes(event.target.value.toLowerCase()) ||
      c.phone!.toLowerCase().includes(event.target.value.toLowerCase());
    });
  }
  
  selectCustomer(customer: ICustomer): void {
    this.activeModal.close(customer);
  }
}
