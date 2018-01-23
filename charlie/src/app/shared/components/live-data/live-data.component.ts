import { Observable } from 'rxjs/Rx';
import { AnonymousSubscription } from 'rxjs/Subscription';

export abstract class LiveDataComponent {

  protected timerSubscription: AnonymousSubscription;
  protected interval: number = 10000;

  /**
   * Stops calls for updated data form backend when component is not shown anymore
   */
  public ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  protected subscribeToData(): void {
    this.timerSubscription = Observable.timer(0, this.interval).subscribe(() => this.refreshData());
  }

  // Call for updated data from backend, needs to be specified idividually for every component
  // Example:
  /*
  this.dataSubscription = this.http.getLines().subscribe( data => {
      this.counter++;
      console.log(this.counter)
    },
    err =>
      console.log('Could not fetch new line-data.'));
      */
  abstract refreshData(): void;
}
