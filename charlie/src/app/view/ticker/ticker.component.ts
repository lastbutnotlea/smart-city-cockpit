import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticker',
  templateUrl: './ticker.component.html',
  styleUrls: ['./ticker.component.css',
    '../../shared/styling/global-styling.css']
})
export class TickerComponent implements OnInit {

  public tickerItems: string[] = [
    'Soccer from 6pm to 7:45pm',
    'Terrorist attack planned for 8pm',
    'No power on some stations due to a tsunami',
    'Smart City Cockpit not operational due to a database issue. Technician is informed.'
  ];

  constructor() { }

  ngOnInit() { }

}
