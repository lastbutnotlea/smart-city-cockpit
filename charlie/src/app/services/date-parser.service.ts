import {Injectable} from '@angular/core';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DateParserService {

  parseDate(dateString: string, dateStruct: NgbDateStruct): string {
    let currentDate = new Date(dateString);
    currentDate.setUTCFullYear(dateStruct.year);
    currentDate.setUTCMonth(dateStruct.month - 1);
    currentDate.setUTCDate(dateStruct.day);
    // a bit of magic - necessary to solve timezone paradox
    currentDate.setHours(currentDate.getHours() + 1);

    let newDate = currentDate.toISOString();
    // cuts the last character 'Z' to obtain the right date format
    newDate = newDate.substr(0, newDate.length - 2);
    return newDate;
  }

  parseTime(timeString: string, timeStruct: NgbTimeStruct): string {
    let currentDate = new Date(timeString);
    currentDate.setUTCHours(timeStruct.hour);
    currentDate.setUTCMinutes(timeStruct.minute);
    // no magic needed here - don't ask why

    let newDate = currentDate.toISOString();
    // cuts the last character 'Z' to obtain the right date format
    newDate = newDate.substr(0, newDate.length - 2);
    return newDate;
  }

}
