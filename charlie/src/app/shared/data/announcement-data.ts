import {StopData} from './stop-data';

export class AnnouncementData {
  text: string;
  validFrom: Date;
  validTo: Date;
  stops: StopData[];
}
