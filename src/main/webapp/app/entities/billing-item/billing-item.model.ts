export interface IBillingItem {
  id: string;
  name?:string | null;
  unit?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  adjustPrice?: number | null;
  productId?: string | null;
  total?: number | null;
}

export type NewBillingItem = Omit<IBillingItem, 'id'> & { id: null };
