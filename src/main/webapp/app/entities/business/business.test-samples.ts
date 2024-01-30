import dayjs from 'dayjs/esm';

import { IBusiness, NewBusiness } from './business.model';

export const sampleWithRequiredData: IBusiness = {
  id: 159,
  name: 'whoever which next',
};

export const sampleWithPartialData: IBusiness = {
  id: 6971,
  name: 'jot',
  website: 'price',
  email: 'Angela.Keeling@hotmail.com',
  isDeflaut: true,
  createdDate: dayjs('2024-01-18T10:21'),
  modifiedDate: dayjs('2024-01-18T08:11'),
};

export const sampleWithFullData: IBusiness = {
  id: 1417,
  name: 'clueless',
  website: 'whoever an wholly',
  email: 'Valerie.Jast5@yahoo.com',
  isDeflaut: false,
  phone: '980.525.6321 x48224',
  createdDate: dayjs('2024-01-17T19:14'),
  modifiedDate: dayjs('2024-01-17T23:24'),
};

export const sampleWithNewData: NewBusiness = {
  name: 'worth controller',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
