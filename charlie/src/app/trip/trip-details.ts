
export class TripDetails {

  constructor(public firstParam: string, public secondParam: string) { }

  public isFiltered1(): boolean {
    if(this.firstParam === 'filtered'){
      return true;
    }
    return false;
  }

  public isFiltered2(): boolean {
    if(this.secondParam === 'filtered'){
      return true;
    }
    return false;
  }
}
