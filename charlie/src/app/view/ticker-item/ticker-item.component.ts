import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-ticker-item',
  templateUrl: './ticker-item.component.html',
  styleUrls: ['./ticker-item.component.css']
})
export class TickerItemComponent implements OnInit {

  @Input()
  content: string;

  constructor() { }

  ngOnInit() {
  }

}
