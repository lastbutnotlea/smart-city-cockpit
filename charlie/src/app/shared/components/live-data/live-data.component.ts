import { Observable } from 'rxjs/Rx';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { OnInit } from '@angular/core';

export abstract class LiveDataComponent implements OnInit {

  protected dataSubscription: AnonymousSubscription;
  protected timerSubscription: AnonymousSubscription;

  /**
   * Starts periodical calls to get updated data from backend
   */
  public ngOnInit(){
    this.refreshData();
  }

  /**
   * Stops calls for updated data form backend when component is not shown anymore
   */
  public ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  // Waits for a set period of time, then triggers refreshData to get new Data from backend
  protected subscribeToData(): void {
    this.timerSubscription = Observable.timer(15000).first().subscribe(() => this.refreshData());
  }

  protected setDataSubscription(val: AnonymousSubscription): void {
    this.dataSubscription = val;
  }

  // Call for updated data from backend, needs to be specified idividually for every component
  // Example:
  /*
  this.dataSubscription = this.http.getLines().subscribe( data => {
      this.counter++;
      console.log(this.counter)
      this.subscribeToData();
    },
    err =>
      console.log('Could not fetch new line-data.'));
      */
  abstract refreshData(): void;
}
