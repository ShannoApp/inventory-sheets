import dayjs from 'dayjs/esm';

import { IStockSummary, NewStockSummary } from './stock-summary.model';

export const sampleWithRequiredData: IStockSummary = {
  id: '8d194925-53f0-4713-be75-1a973b097cbb',
  currentStockQuantity: 29609,
};

export const sampleWithPartialData: IStockSummary = {
  id: 'e3510e26-7094-4f57-ad9d-1aa445bad0cf',
  currentStockQuantity: 11356,
  lastPurchaseDate: dayjs('2024-01-18'),
  lastPurchaseQuantity: 32411,
  lastSaleDate: dayjs('2024-01-18'),
};

export const sampleWithFullData: IStockSummary = {
  id: '0aeaeae6-e566-4d2f-b986-dd2ba8e27fb3',
  currentStockQuantity: 28817,
  minimumStockQuantity: 31085,
  maximumStockQuantity: 24787,
  lastPurchaseDate: dayjs('2024-01-17'),
  lastPurchaseQuantity: 12664,
  lastSaleDate: dayjs('2024-01-17'),
  lastSaleQuantity: 4992,
};

export const sampleWithNewData: NewStockSummary = {
  currentStockQuantity: 27034,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
