import dayjs from 'dayjs/esm';

export interface ICategory {
  id: string;
  name?: string | null;
  description?: string | null;
  createdDate?: dayjs.Dayjs | null;
  modifiedDate?: dayjs.Dayjs | null;
}

export type NewCategory = Omit<ICategory, 'id'> & { id: null };
