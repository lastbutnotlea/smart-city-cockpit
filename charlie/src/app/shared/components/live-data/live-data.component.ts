import { Observable } from 'rxjs/Rx';
import { AnonymousSubscription } from 'rxjs/Subscription';

export abstract class LiveDataComponent {

  protected timerSubscription: AnonymousSubscription;
  protected interval: number = 2000;

  /**
   * Makes sure live-data-requests are stopped
   */
  public ngOnDestroy(): void {
    this.unsubscribe();
  }

  protected subscribeToData(): void {
    this.timerSubscription = Observable.timer(0, this.interval).subscribe(() => {
      this.refreshData();
    });
  }

  protected unsubscribe(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  abstract refreshData(): void;
}
