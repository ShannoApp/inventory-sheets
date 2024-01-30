import { IBillingItem, NewBillingItem } from './billing-item.model';

export const sampleWithRequiredData: IBillingItem = {
  id: '1bb153ed-5c47-4003-b66d-536d963163bb',
  quantity: 12350,
  unitPrice: 5908.98,
  adjustPrice: 22525.55,
};

export const sampleWithPartialData: IBillingItem = {
  id: '0acd0415-921a-4263-8b81-4514fdb20f02',
  quantity: 20071,
  unitPrice: 2843.71,
  adjustPrice: 3699.3,
};

export const sampleWithFullData: IBillingItem = {
  id: 'fa7850e0-aabd-4978-a720-3d52fa06205c',
  quantity: 21096,
  unitPrice: 6712.72,
  adjustPrice: 27474.88,
};

export const sampleWithNewData: NewBillingItem = {
  quantity: 2589,
  unitPrice: 7665.06,
  adjustPrice: 18772.41,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
