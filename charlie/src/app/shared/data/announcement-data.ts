import {StopData} from './stop-data';

export class AnnouncementData {
  id: string;
  text: string;
  validFrom: string;
  validTo: string;
  stops: StopData[];
}
