import dayjs from 'dayjs/esm';

export interface IBusiness {
  id: string | null;
  name?: string | null;
  website?: string | null;
  email?: string | null;
  isDeflaut?: boolean | null;
  phone?: string | null;
  createdDate?: dayjs.Dayjs | null;
  modifiedDate?: dayjs.Dayjs | null;
  userIds: string[] | null;
}

export type NewBusiness = Omit<IBusiness, 'id'> & { id: null };
