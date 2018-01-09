import { ServiceRequestTarget } from './service-request-target';

export class FeedbackData {
  message: string;
  timestamp: string;
  objective: ServiceRequestTarget;
  feedbackType: string;
  rating: string;
}
