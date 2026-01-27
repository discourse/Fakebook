/**
 * Evaluates whether a date is expired (earlier than today)
 *
 * @param date - The date to evaluate
 * @param today - A number representing a date (UNIX Epoch - milliseconds)
 * @returns true if the date is earlier than today, otherwise false
 */
export declare function isExpired(date: number | undefined, today?: number): boolean;
/**
 * Converts a date to include year, month, and day values only (time is zeroed out).
 *
 * @param date - The date to convert
 * @returns Date - A date with the time zeroed out eg. '2021-01-01T08:00:00.000Z'
 */
export declare function getDatePart(date?: Date): Date;
/**
 * Returns the difference in days between two dates.
 *
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns a number representing the days between the dates
 */
export declare function differenceInDays(startDate: Date, endDate: Date): number;
/**
 * Formats the date in short form, eg. 2021-01-01
 *
 * @param date - The date to format
 * @returns A string representing the formatted date
 */
export declare function format(date: string | number | Date): string;
//# sourceMappingURL=date-utils.d.ts.map