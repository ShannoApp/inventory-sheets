import dayjs from 'dayjs/esm';

import { IUnit, NewUnit } from './unit.model';

export const sampleWithRequiredData: IUnit = {
  id: '10fbc43e-85a2-4b5a-83fa-150822eb93b2',
  name: 'undervalue',
};

export const sampleWithPartialData: IUnit = {
  id: 'a6657b68-80da-4d28-b3dc-de94d3e332f4',
  name: 'on indeed',
};

export const sampleWithFullData: IUnit = {
  id: '1fb5deb8-f537-46d4-a6c4-be21e306d911',
  name: 'caddie midst questionnaire',
  description: 'trace',
  createdDate: dayjs('2024-01-18T17:54'),
  modifiedDate: dayjs('2024-01-18T10:41'),
};

export const sampleWithNewData: NewUnit = {
  name: 'vibraphone',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
