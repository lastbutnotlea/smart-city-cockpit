import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ToastService} from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(public viewContainerReference: ViewContainerRef,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.toastService.setViewContrainerRef(this.viewContainerReference);
  }
}
