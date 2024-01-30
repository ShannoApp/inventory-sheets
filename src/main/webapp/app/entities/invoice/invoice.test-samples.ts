import dayjs from 'dayjs/esm';

import { IInvoice, NewInvoice } from './invoice.model';

export const sampleWithRequiredData: IInvoice = {
  id: 'a9d244d5-2770-4ef8-b33d-b74ac80ccf9c',
  invoiceNumber: 'where',
  issueDate: dayjs('2024-01-18'),
  dueDate: dayjs('2024-01-18'),
  amount: 2066.69,
};

export const sampleWithPartialData: IInvoice = {
  id: '4c99e792-9915-40a5-a3bb-3dccf4526f71',
  invoiceNumber: 'sponsor grizzled velvety',
  issueDate: dayjs('2024-01-18'),
  dueDate: dayjs('2024-01-18'),
  amount: 12555.7,
};

export const sampleWithFullData: IInvoice = {
  id: 'ea02d0f5-3419-45e3-85e1-75e057f7bfed',
  invoiceNumber: 'apud lest whereas',
  issueDate: dayjs('2024-01-17'),
  dueDate: dayjs('2024-01-18'),
  amount: 2230.68,
};

export const sampleWithNewData: NewInvoice = {
  invoiceNumber: 'questioningly',
  issueDate: dayjs('2024-01-18'),
  dueDate: dayjs('2024-01-18'),
  amount: 886.76,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
