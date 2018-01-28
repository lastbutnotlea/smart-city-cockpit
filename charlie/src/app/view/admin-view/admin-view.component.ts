import {Component, OnInit} from "@angular/core";
import {HttpRoutingService} from '../../services/http-routing.service';
import {LiveDataConfiguration} from '../../shared/data/live-data-configuration';
import {LiveDataConfigurationCollection} from '../../shared/data/live-data-configuration-collection';
import {ToastService} from '../../services/toast.service';

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
  selectedConfiguration: LiveDataConfiguration = new LiveDataConfiguration();
  minCapacity = 0;
  maxCapacity = 100;

  constructor(private http: HttpRoutingService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.http.getConfigurationCollection().subscribe(
      data => {
        this.configurationCollection = data;

        this.http.getCurrentConfiguration().subscribe(
          data => {
            this.currentConfiguration = data;
            this.setValues(this.currentConfiguration);
            this.loaded = true;
          }, err => {
            this.toastService.showErrorToast('Failed to load current live data configuration');
            console.log(JSON.stringify(err));
          }
        );
      }, err => {
        this.toastService.showErrorToast('Failed to load default live data configurations');
        console.log(JSON.stringify(err));
      });
  }

  updateConfigurations(): void {
    this.http.editConfiguration(this.selectedConfiguration).subscribe(
      data => {
        this.toastService.showSuccessToast('Updated live data configuration');
        console.log('Updated live data configurations');
      }, err => {
        this.toastService.showErrorToast('Failed to update live data configuration');
        console.log(JSON.stringify(err));
      }
    )
  }

  exportVehicles() {
    var nameOfFileToDownload = "VehicleExport.csv";
    this.http.getVehiclesExport().subscribe(
      data => {

      }, err => {
        if(err.status === 200) {
          // we want to export a csv-file here
          // if we get the text from backend as csv, parsing doesn't work here
          // instead of changing the file before and after sending, we just get the sent text from the error message
          this.exportCsv(err.error.text, nameOfFileToDownload);
        } else {
          this.toastService.showErrorToast('Failed to export vehicles');
          console.log(JSON.stringify(err));
        }
      });
  }

  exportAnnouncements() {
    var nameOfFileToDownload = "AnnouncementsExport.csv";
    this.http.getAnnouncementsExport().subscribe(
      data => {

      }, err => {
        if(err.status === 200){
          // we want to export a csv-file here
          // if we get the text from backend as csv, parsing doesn't work here
          // instead of changing the file before and after sending, we just get the sent text from the error message
          this.exportCsv(err.error.text, nameOfFileToDownload);
        } else {
          this.toastService.showErrorToast('Failed to export announcements');
          console.log(JSON.stringify(err));
        }
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
        this.setValues(this.configurationCollection.good);
        this.usingGood = true;
        this.usingMedium = false;
        this.usingBad = false;
        break;
      case "medium":
        this.setValues(this.configurationCollection.medium);
        this.usingGood = false;
        this.usingMedium = true;
        this.usingBad = false;
        break;
      case "bad":
        this.setValues(this.configurationCollection.bad);
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

  setValues(config: LiveDataConfiguration): void {
    this.selectedConfiguration.defectChance = config.defectChance;
    this.selectedConfiguration.defectRemoveChance = config.defectRemoveChance;
    this.selectedConfiguration.feedbackChance = config.feedbackChance;
  }

  validate(event, value) {
    var input = value.toString();
    var position = event.location;
    var output = parseInt([input.slice(0, position), event.key, input.slice(position)].join(''));
    if(isNaN(parseInt(event.key)) || output < this.minCapacity || output > this.maxCapacity) {
      event.preventDefault();
    }
  }
}
