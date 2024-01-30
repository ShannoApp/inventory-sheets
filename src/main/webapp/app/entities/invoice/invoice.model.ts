import dayjs from 'dayjs/esm';
import { IBillingItem } from '../billing-item/billing-item.model';
import { IPayment } from './util/payment.model';

export interface IInvoice {
  id: string;
  invoiceNumber?: string | null;
  customerId?: string | null;
  customerName?: string | null;
  issueDate?: dayjs.Dayjs | null;
  dueDate?: dayjs.Dayjs | null;
  amount?: number | null;
  subTotal?: number | null;
  tax?: number | null;
  discount?: number | null;
  shippingCharges?: number | null;
  billingItems?: IBillingItem[];
  paid?: boolean;
  totalAmount?: number | null;
  businessName?: string | null;
  businessWebsite?: string | null;
  businessEmail?: string | null;
  businessPhone?: string | null;
  payment?: IPayment;
}

export type NewInvoice = Omit<IInvoice, 'id'> & { id: null };
