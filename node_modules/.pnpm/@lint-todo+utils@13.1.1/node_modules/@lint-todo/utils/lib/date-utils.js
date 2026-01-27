"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = exports.differenceInDays = exports.getDatePart = exports.isExpired = void 0;
/**
 * Evaluates whether a date is expired (earlier than today)
 *
 * @param date - The date to evaluate
 * @param today - A number representing a date (UNIX Epoch - milliseconds)
 * @returns true if the date is earlier than today, otherwise false
 */
function isExpired(date, today = getDatePart().getTime()) {
    return date !== undefined && today > date;
}
exports.isExpired = isExpired;
/**
 * Converts a date to include year, month, and day values only (time is zeroed out).
 *
 * @param date - The date to convert
 * @returns Date - A date with the time zeroed out eg. '2021-01-01T08:00:00.000Z'
 */
function getDatePart(date = new Date()) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
}
exports.getDatePart = getDatePart;
/**
 * Returns the difference in days between two dates.
 *
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns a number representing the days between the dates
 */
function differenceInDays(startDate, endDate) {
    const millisecondsPerDay = 86400000;
    return Math.round((getDatePart(endDate).getTime() - getDatePart(startDate).getTime()) / millisecondsPerDay);
}
exports.differenceInDays = differenceInDays;
/**
 * Formats the date in short form, eg. 2021-01-01
 *
 * @param date - The date to format
 * @returns A string representing the formatted date
 */
function format(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return getDatePart(date).toISOString().split('T')[0];
}
exports.format = format;
//# sourceMappingURL=date-utils.js.map