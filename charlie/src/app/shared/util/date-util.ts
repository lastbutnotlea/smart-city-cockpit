import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

export class DateUtil {
  /**
   * @param {string} dateString: input string, holds the old date
   * @param {NgbDateStruct} dateStruct: holds a new year, month and day
   * @returns {string} output string, holds the new date
   */
  static parseDate(dateString: string, dateStruct: NgbDateStruct): string {
    let currentDate = DateUtil.parseNativeDate(new Date(dateString), dateStruct);
    // a bit of magic - necessary to solve timezone paradox
    // not sure if this is needed anymore
    return DateUtil.cutTimezoneInformation(currentDate);
  }

  /**
   * @param {Date} current: input, holds the old/current date
   * @param {NgbDateStruct} dateStruct: holds a new year, month and day
   * @returns {Date} output, holds the new date with the old time
   */
  static parseNativeDate(current: Date, dateStruct: NgbDateStruct): Date {
    current = new Date(current);
    current.setFullYear(dateStruct.year);
    current.setMonth(dateStruct.month - 1);
    current.setDate(dateStruct.day);
    return current;
  }

  /**
   * @param {Date} date holds current date
   * @returns {NgbDateStruct} output, holds date as NgbDateStruct
   */
  static convertDateToNgbDateStruct(date: Date): NgbDateStruct {
    return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
  }

  /**
   * @param {Date} date holds current date
   * @returns {NgbTimeStruct} output, holds time of current date as NgbTimeStruct
   */
  static convertDateToNgbTimeStruct(date: Date): NgbTimeStruct {
    return {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
  }

  /**
   * @param {Date} current: input, holds the old/current date
   * @param {NgbTimeStruct} timeStruct: holds a new time
   * @returns {Date} output, holds the old date with the new time
   */
  static parseNativeTime(current: Date, timeStruct: NgbTimeStruct): Date {
    current = new Date(current);
    current.setHours(timeStruct.hour);
    current.setMinutes(timeStruct.minute);
    return current;
  }

  public static cutTimezoneInformation(input: Date): string {
    // reverse the timezone offset because 'toISOString' always uses UTC...
    let date = DateUtil.addToDate(input, -input.getTimezoneOffset()).toISOString();
    // cuts the last character 'Z' to obtain the right date format
    return date.substr(0, date.length - 2);
  }

  private static addToDate(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  /**
   * The timeStruct is only valid, if it contains a date that has not passed already
   * @param {NgbTimeStruct} timeStruct
   * @param {Date} now
   * @returns {boolean}
   */
  public static isBeforeDate(now: Date, timeStruct: NgbDateStruct): boolean {
    return (now.getFullYear() < timeStruct.year
      || (now.getFullYear() === timeStruct.year && now.getMonth() + 1 < timeStruct.month)
      || (now.getFullYear() === timeStruct.year && now.getMonth() + 1 === timeStruct.month && now.getDate() <= timeStruct.day));
  }
}
