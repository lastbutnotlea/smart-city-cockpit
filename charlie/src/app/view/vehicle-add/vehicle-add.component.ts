import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpRoutingService} from '../../services/http-routing.service';
import {DropdownValue} from '../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})

export class VehicleAddComponent implements OnInit {
  a: DropdownValue = new DropdownValue(null, "test");
  constructor(public activeModal: NgbActiveModal, private http: HttpRoutingService) {
  }

  ngOnInit(): void {
  }

  confirm(): void {
    this.activeModal.close('Close click');
  }
}
