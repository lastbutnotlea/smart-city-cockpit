import { Observable } from 'rxjs/Rx';
import { AnonymousSubscription } from 'rxjs/Subscription';

export abstract class LiveDataComponent {

  protected timerSubscription: AnonymousSubscription;
  protected interval: number = 20000;

  /**
   * Stops calls for updated data form backend when component is not shown anymore
   */
  public ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  protected subscribeToData(): void {
    this.timerSubscription = Observable.timer(0, this.interval).subscribe(() => {
      this.refreshData();
    });
  }

  abstract refreshData(): void;
}
