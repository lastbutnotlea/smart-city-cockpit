import {Component, OnInit} from "@angular/core";
import {HttpRoutingService} from '../../services/http-routing.service';
import {LiveDataConfiguration} from '../../shared/data/live-data-configuration';
import {LiveDataConfigurationCollection} from '../../shared/data/live-data-configuration-collection';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.css']
})

export class AdminViewComponent implements OnInit{

  currentConfiguration: LiveDataConfiguration;
  configurationCollection: LiveDataConfigurationCollection;
  usingGood: boolean = false;
  usingMedium: boolean = false;
  usingBad: boolean = false;
  loaded: boolean = false;

  constructor(
    private http: HttpRoutingService) {
  }

  ngOnInit(): void {
    this.http.getConfigurationCollection().subscribe(
      data => {
        this.configurationCollection = data;

        this.http.getCurrentConfiguration().subscribe(
          data => {
            this.currentConfiguration = data;
            this.loaded = true;
          }, err => {
            console.log(err);
          }
        );
      }, err => {
        console.log(err);
      });
  }

  updateConfigurations(): void {
    this.http.editConfiguration(this.currentConfiguration).subscribe(
      data => {
        console.log('Succes');
      }, err => {
        console.log('Failure');
      }
    )
  }

  exportVehicles() {
    var nameOfFileToDownload = "VehicleExport.csv";
    this.http.getVehiclesExport().subscribe(
      data => {

      }, err => {
        debugger;
        // we want to export a csv-file here
        // if we get the text from backend as csv, parsing doesn't work here
        // instead of changing the file before and after sending, we just get the sent text from the error message
        this.exportCsv(err.error.text, nameOfFileToDownload);
        console.log(err);
      });
  }

  exportAnnouncements() {
    var nameOfFileToDownload = "AnnouncementsExport.csv";
    this.http.getAnnouncementsExport().subscribe(
      data => {

      }, err => {
        debugger;
        // we want to export a csv-file here
        // if we get the text from backend as csv, parsing doesn't work here
        // instead of changing the file before and after sending, we just get the sent text from the error message
        this.exportCsv(err.error.text, nameOfFileToDownload);
        console.log(err);
      });
  }

  exportCsv(message: string, nameOfFile: string) {

    var blob = new Blob([message], { type: 'text/csv' });

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, nameOfFile);
    } else {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = nameOfFile;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  changeConfigurations(value: string){
    switch (value) {
      case "good":
        this.currentConfiguration = this.configurationCollection.good;
        this.usingGood = true;
        this.usingMedium = false;
        this.usingBad = false;
        break;
      case "medium":
        this.currentConfiguration = this.configurationCollection.medium;
        this.usingGood = false;
        this.usingMedium = true;
        this.usingBad = false;
        break;
      case "bad":
        this.currentConfiguration = this.configurationCollection.bad;
        this.usingGood = false;
        this.usingMedium = false;
        this.usingBad = true;
        break;
      default:
        this.usingGood = false;
        this.usingMedium = false;
        this.usingBad = false;
    }
  }
}
