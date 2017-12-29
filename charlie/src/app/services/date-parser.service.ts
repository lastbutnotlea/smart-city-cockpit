import {Injectable} from '@angular/core';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DateParserService {

  /**
   * @param {string} dateString: input string, holds the old date
   * @param {NgbDateStruct} dateStruct: holds a new year, month and day
   * @returns {string} output string, holds the new date
   */
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

  /**
   * @param {string} timeString: input string, holds the old date
   * @param {NgbTimeStruct} timeStruct: holds a new time
   * @returns {string} output string, holds the new date
   */
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
