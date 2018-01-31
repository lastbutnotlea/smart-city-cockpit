export function getUrlForId(id: string): string {
  if (id.startsWith('Trip_')) {
    return '/trip/detail/' + id;
  } else if (id.startsWith('Line_')) {
    return '/network/detail/' + id;
  } else if (id.startsWith('Stop_')) {
    // This is actually dead because the backend has stop Ids without the Stop_ prefix.
    return '/network/stop/' + id;
  } else if (id.startsWith('Vehicle_')) {
    return '/vehicles/' + id;
  } else if (id.startsWith('Feedback_')) {
    return '/feedback';
  } else if (id.length >= 10) {
      return '/network/stop/' + id;
  } else {
    return '/events/detail/' + id;
  }
}
