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
    let currentDate = this.parseNativeDate(new Date(dateString), dateStruct);
    // a bit of magic - necessary to solve timezone paradox
    currentDate.setUTCHours(currentDate.getUTCHours() + 1);
    return DateParserService.cutTimezoneInformation(currentDate);
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
   * @param {string} dateString: holds current date
   * @returns {NgbDateStruct} output, holds date from dateString as NgbDateStruct
   */
  parseString(dateString: string): NgbDateStruct {
    const date = new Date(dateString);
    const ngbStruct =  {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    return ngbStruct;
  }

  /**
   * @param {Date} date holds current date
   * @returns {NgbDateStruct} output, holds date as NgbDateStruct
   */
  convertDateToNgbDateStruct(date: Date): NgbDateStruct {
    return {year: date.getFullYear(), month:date.getMonth() + 1, day: date.getDate()};
  }

  /**
   * @param {Date} date holds current date
   * @returns {NgbTimeStruct} output, holds time of current date as NgbTimeStruct
   */
  convertDateToNgbTimeStruct(date: Date): NgbTimeStruct {
    return {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
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
    return DateParserService.cutTimezoneInformation(currentDate);
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

  public static cutTimezoneInformation(input: Date): string {
    let date = input.toISOString();
    // cuts the last character 'Z' to obtain the right date format
    return date.substr(0, date.length - 2);
  }

  /**
   * The timeStruct is only valid, if it contains a date that has not passed already
   * @param {NgbTimeStruct} timeStruct
   * @returns {boolean}
   */
  public isBeforeDate(now: Date, timeStruct: NgbDateStruct): boolean {
    return(now.getFullYear() < timeStruct.year
      || (now.getFullYear() === timeStruct.year && now.getMonth()+1 < timeStruct.month)
      ||(now.getFullYear() === timeStruct.year && now.getMonth()+1 ===  timeStruct.month && now.getDate() <= timeStruct.day));
  }

  /**
   * The timeStruct is only valid, if it contains a time that has not passed already
   * @param {NgbDateStruct} dateStruct
   * @param {NgbTimeStruct} timeStruct
   * @returns {boolean}
   */
  public isBeforeTime(now: Date, dateStruct: NgbDateStruct, timeStruct: NgbTimeStruct): boolean {
    // The time can only be invalid for a current date
    // All times choosen for future dates are valid
    return this.isBeforeDate(now, dateStruct)
    && (!(now.getFullYear() === dateStruct.year && now.getMonth()+1 === dateStruct.month && now.getDate() === dateStruct.day)
      || !(now.getHours() > timeStruct.hour  || (now.getHours() === timeStruct.hour && now.getMinutes() > timeStruct.minute)));
  }

}
