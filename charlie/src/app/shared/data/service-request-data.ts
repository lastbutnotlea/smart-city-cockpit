import { ServiceRequestTarget } from './service-request-target';
import { FeedbackData } from './feedback-data';
import { C4CNotes } from './c4c-notes';

export class ServiceRequestData {
  id: string = null; // generated by backend
  name: string = null; // generated by backend
  serviceType: string; // CLEANING or MAINTENANCE
  target: ServiceRequestTarget;
  statusCode: string = "OPEN"; //OPEN, IN_PROCESS, CUSTOMER_ACTION, COMPLETED, CLOSED, used in C4C
  dueDate: string;
  completionDate: string = null; // used in C4C
  serviceRequestDescription: C4CNotes[];
  feedbacks: FeedbackData[];
  priority: string; // FINE, PROBLEMATIC or CRITICAL, like state
  objectId: string; // Caro: Braucht das Backend um patch requests zu realisieren ohne vor das Objekt neu anfragen zu müssen :)
  referencedFeedback: string; // Caro: um im Backend Feedback-Gruppen wiederverwenden zu können :)
}
