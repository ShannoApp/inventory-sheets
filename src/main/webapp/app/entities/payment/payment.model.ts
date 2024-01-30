import dayjs from 'dayjs/esm';

export interface IPayment {
  id: string;
  paymentDate?: dayjs.Dayjs | null;
  amount?: number | null;
  partialAmount?: number | null;
  dueAmount?: number | null;
}

export type NewPayment = Omit<IPayment, 'id'> & { id: null };
