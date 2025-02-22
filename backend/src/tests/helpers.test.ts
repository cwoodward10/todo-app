import { expect, test } from 'vitest';
import { DateDifference, DaysIntoYear, IsLastDayOfMonth } from '../helpers/helpers.js';

const date1 = new Date(2025, 0, 1, 5, 10, 25);
const date2 = new Date(2025, 0, 4, 15, 12, 36);
const date3 = new Date(2025, 0, 28, 2, 3, 57);
const date4 = new Date(2025, 1, 28, 2, 3, 57);
const date5 = new Date(2025, 8, 30, 2, 3, 57);
const date6 = new Date(2016, 0, 28, 2, 3, 57);
const date7 = new Date(2016, 1, 29, 2, 3, 57);

test('tests Date difference', () => {
    expect(DateDifference(date1, date2)).toBe(3);
    expect(DateDifference(date1, date3)).toBe(27);

    expect(DateDifference(date2, date2)).toBe(0);

    expect(DateDifference(date2, date1)).toBe(-3);
})

test('tests last day of the month', () => {
    expect(IsLastDayOfMonth(date1)).toBe(false);
    expect(IsLastDayOfMonth(date4)).toBe(true);
    expect(IsLastDayOfMonth(date5)).toBe(true);
    
    expect(IsLastDayOfMonth(date6)).toBe(false);
    expect(IsLastDayOfMonth(date7)).toBe(true);
})

test('tests day of the year', () => {
    expect(DaysIntoYear(date1)).toBe(1);
    expect(DaysIntoYear(date2)).toBe(4);
    expect(DaysIntoYear(date7)).toBe(60);
})