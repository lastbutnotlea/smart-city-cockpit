import {Injectable} from '@angular/core';
import {NgbDateAdapter, NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class DateParserService {
  /**
   * @param {string} dateString: input string, holds the old date
   * @param {NgbDateStruct} dateStruct: holds a new year, month and day
   * @returns {string} output string, holds the new date
   */
  parseDate(dateString: string, dateStruct: NgbDateStruct): string {
    let currentDate = this.parseNativeDate(new Date(dateString), dateStruct);
    // a bit of magic - necessary to solve timezone paradox
    currentDate.setUTCHours(currentDate.getUTCHours() + 1);
    return this.cutTimezoneInformation(currentDate);
  }

  /**
   * @param {Date} current: input, holds the old/current date
   * @param {NgbDateStruct} dateStruct: holds a new year, month and day
   * @returns {Date} output, holds the new date with the old time
   */
  parseNativeDate(current: Date, dateStruct: NgbDateStruct): Date {
    current = new Date(current);
    current.setFullYear(dateStruct.year);
    current.setMonth(dateStruct.month - 1);
    current.setDate(dateStruct.day);
    return current;
  }

  /**
   * @param {string} timeString: input string, holds the old date
   * @param {NgbTimeStruct} timeStruct: holds a new time
   * @returns {string} output string, holds the new date
   */
  parseTime(timeString: string, timeStruct: NgbTimeStruct): string {
    let currentDate = this.parseNativeTime(new Date(timeString), timeStruct);
    // a bit of magic - necessary to solve timezone paradox
    currentDate.setUTCHours(currentDate.getUTCHours() + 1);
    return this.cutTimezoneInformation(currentDate);
  }

  /**
   * @param {Date} current: input, holds the old/current date
   * @param {NgbTimeStruct} timeStruct: holds a new time
   * @returns {Date} output, holds the old date with the new time
   */
  parseNativeTime(current: Date, timeStruct: NgbTimeStruct): Date {
    current = new Date(current);
    current.setHours(timeStruct.hour);
    current.setMinutes(timeStruct.minute);
    return current;
  }

  private cutTimezoneInformation(input: Date): string {
    let date = input.toISOString();
    // cuts the last character 'Z' to obtain the right date format
    return date.substr(0, date.length - 2);
  }
}
