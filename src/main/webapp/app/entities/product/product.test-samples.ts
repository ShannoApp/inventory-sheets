import dayjs from 'dayjs/esm';

import { IProduct, NewProduct } from './product.model';

export const sampleWithRequiredData: IProduct = {
  id: '3090a85f-db9c-465e-9fc5-5cb21cecea3b',
  name: 'whoever plonk brick',
  sellingPrice: 10505.48,
  purchasePrice: 31032.92,
  minStockToMaintain: 17911.15,
  openingQuantity: 15218,
  asOfDate: dayjs('2024-01-17'),
};

export const sampleWithPartialData: IProduct = {
  id: '47309b82-5872-44b0-9023-1c219bf634f1',
  name: 'sideboard undulate doze',
  sellingPrice: 17295.82,
  purchasePrice: 8955.76,
  minStockToMaintain: 15588.74,
  openingQuantity: 21704,
  asOfDate: dayjs('2024-01-18'),
  location: 'deeply',
};

export const sampleWithFullData: IProduct = {
  id: '27e70134-eb90-449c-bda2-c5fc9c7ec4c3',
  name: 'ick',
  description: 'whereas',
  unit: 'stand barn and',
  sellingPrice: 3449.06,
  purchasePrice: 21236.16,
  minStockToMaintain: 4146.96,
  openingQuantity: 9038,
  asOfDate: dayjs('2024-01-18'),
  location: 'obediently rightfully',
  createdDate: dayjs('2024-01-18T02:43'),
  modifiedDate: dayjs('2024-01-18T04:02'),
};

export const sampleWithNewData: NewProduct = {
  name: 'actually mid rightfully',
  sellingPrice: 2402.69,
  purchasePrice: 8588.48,
  minStockToMaintain: 29651.92,
  openingQuantity: 11114,
  asOfDate: dayjs('2024-01-17'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
