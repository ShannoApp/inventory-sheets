import dayjs from 'dayjs/esm';

import { ICategory, NewCategory } from './category.model';

export const sampleWithRequiredData: ICategory = {
  id: '32775c3f-2f3c-4d1d-8e6d-06902eedde86',
  name: 'alienate huzzah a',
};

export const sampleWithPartialData: ICategory = {
  id: '9e0f6846-f83b-4592-ab37-899a01d9735e',
  name: 'pish',
  description: 'because',
  modifiedDate: dayjs('2024-01-18T03:01'),
};

export const sampleWithFullData: ICategory = {
  id: '8ee4f985-d8e6-4a74-a6c3-880ae88fad40',
  name: 'what',
  description: 'step-grandmother crate physically',
  createdDate: dayjs('2024-01-18T06:15'),
  modifiedDate: dayjs('2024-01-18T01:56'),
};

export const sampleWithNewData: NewCategory = {
  name: 'towel surrender disk',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
