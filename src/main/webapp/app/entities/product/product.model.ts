import dayjs from 'dayjs/esm';
import { IStockSummary } from '../stock-summary/stock-summary.model';
import { IUnit } from '../unit/unit.model';

export interface IProduct {
  id: string | null;
  name?: string | null;
  description?: string | null;
  unit?: Unit | null;
  sellingPrice?: number | null;
  purchasePrice?: number | null;
  minStockToMaintain?: number | null;
  openingQuantity?: number | null;
  asOfDate?: dayjs.Dayjs | null;
  location?: string | null;
  createdDate?: dayjs.Dayjs | null;
  modifiedDate?: dayjs.Dayjs | null;
  stockSummary?: IStockSummary | null ;
  category?: string | null;
  totalProfit?: number | null;
}

export interface Unit {
  id: string | null;
  name?: string | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
