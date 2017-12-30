import { VehiclePositionData } from './vehicle-position-data';

export class StopPositionData {

  constructor(public stopId: string, public stopName: string, public state, public vehiclePositionData: VehiclePositionData[]) {  }

}
