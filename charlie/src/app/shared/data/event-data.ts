import {PartyData} from './party-data';
import {C4CNotes} from './c4c-notes';

export class EventData {
  id: string;
  subject: string;
  priority: string;
  startTime: string;
  endTime: string;
  locationName: string;
  appointmentInvolvedParties: PartyData[];
  appointmentNotes: C4CNotes[];
}
