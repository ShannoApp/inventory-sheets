import dayjs from 'dayjs/esm';

import { ICustomer, NewCustomer } from './customer.model';

export const sampleWithRequiredData: ICustomer = {
  id: '2fd91947-cb33-4a97-93f1-23e45c649c02',
  firstName: 'Theodore',
  lastName: 'Dietrich-Ledner',
  phone: '855.576.0858 x45122',
};

export const sampleWithPartialData: ICustomer = {
  id: 'cf3e1c7f-3df6-413a-9d54-1bc1191a7caf',
  firstName: 'Raymond',
  lastName: 'Friesen',
  email: 'Elmo.MacGyver@hotmail.com',
  phone: '824-307-0057 x17269',
  address: 'even off while',
};

export const sampleWithFullData: ICustomer = {
  id: '79e98c71-b9d5-4113-84bc-1d282878293d',
  firstName: 'Orion',
  lastName: 'Rodriguez',
  email: 'Jakob36@hotmail.com',
  phone: '(865) 506-9941 x39158',
  address: 'blah',
  createdDate: dayjs('2024-01-18T13:42'),
  modifiedDate: dayjs('2024-01-18T09:13'),
};

export const sampleWithNewData: NewCustomer = {
  firstName: 'Treva',
  lastName: 'Bauch',
  phone: '948.829.5412 x680',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
