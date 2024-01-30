import dayjs from 'dayjs/esm';

export interface IUnit {
  id: string;
  name?: string | null;
  description?: string | null;
  createdDate?: dayjs.Dayjs | null;
  modifiedDate?: dayjs.Dayjs | null;
}

export type NewUnit = Omit<IUnit, 'id'> & { id: null };
