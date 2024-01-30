import dayjs from 'dayjs/esm';

export interface ICustomer {
  id: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdDate?: dayjs.Dayjs | null;
  modifiedDate?: dayjs.Dayjs | null;
}

export type NewCustomer = Omit<ICustomer, 'id'> & { id: null };
