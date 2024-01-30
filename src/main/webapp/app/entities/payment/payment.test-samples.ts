import dayjs from 'dayjs/esm';

import { IPayment, NewPayment } from './payment.model';

export const sampleWithRequiredData: IPayment = {
  id: '529856d2-c843-4912-9021-765ce8d3b067',
  paymentDate: dayjs('2024-01-18'),
  amount: 25043.95,
};

export const sampleWithPartialData: IPayment = {
  id: '12bff80f-ec38-415a-9222-224580aab186',
  paymentDate: dayjs('2024-01-17'),
  amount: 8341.58,
  partialAmount: 20641.8,
};

export const sampleWithFullData: IPayment = {
  id: '1bc637b1-04c8-4376-a75f-e8ad448e3055',
  paymentDate: dayjs('2024-01-18'),
  amount: 30692.15,
  partialAmount: 29615.27,
  dueAmount: 24475.89,
};

export const sampleWithNewData: NewPayment = {
  paymentDate: dayjs('2024-01-18'),
  amount: 31090.85,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
