import {StopData} from './stop-data';

export class AnnouncementData {
  id: string;
  text: string;
  validFrom: Date;
  validTo: Date;
  stops: StopData[];
}
