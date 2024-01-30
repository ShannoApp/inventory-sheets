import dayjs from 'dayjs/esm';

export interface IStockSummary {
  id: string | null;
  currentStockQuantity?: number | null;
  minimumStockQuantity?: number | null;
  maximumStockQuantity?: number | null;
  lastPurchaseDate?: dayjs.Dayjs | null;
  lastPurchaseQuantity?: number | null;
  lastPurchasePrice?: number | null;
  lastSaleDate?: dayjs.Dayjs | null;
  lastSaleQuantity?: number | null;
  totalSaleQuantityTillDate?: number | null;
  totalSaleTillDate?: number | null;
}

interface purchaseRecord {
  id: string | null;
  quantity: number | null;
  date: dayjs.Dayjs | null;
}

export type NewStockSummary = Omit<IStockSummary, 'id'> & { id: null };