import dayjs from 'dayjs/esm';
import { PaymentType } from '../enum/paymentType-enum';
import { PaymentStatus } from '../enum/paymentStatus-enum';

export interface IPayment {
  id: string | null;
  paymentStatus: PaymentStatus;
  dueAmount?: number | null;
  details: IPaymentDetail[];
}

export interface IPaymentDetail {
  paymentDate?: dayjs.Dayjs | null;
  amount?: number | null;
  paymentType: PaymentType;
}
