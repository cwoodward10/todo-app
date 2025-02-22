import { expect, test } from 'vitest';
import { checkRepeatable } from '../helpers/repeatables.js';

const date1 = new Date(2025, 0, 1, 5, 10, 25);
const date2 = new Date(2025, 0, 4, 15, 12, 36);
const date3 = new Date(2025, 0, 16, 2, 3, 57);

const date4 = new Date(2025, 1, 28, 2, 3, 57);
const date5 = new Date(2025, 3, 26, 2, 3, 57);
const date6 = new Date(2016, 1, 29, 2, 3, 57);
const date7 = new Date(2024, 1, 29, 2, 3, 57);
const date8 = new Date(2025, 1, 29, 2, 3, 57);

const repeatable1 = {
    type: 'days',
    start: date1.toDateString(),
    interval: 5
}
const repeatable2 = {
    type: 'weekly',
    start: 6,
    interval: 1
}
const repeatable3 = {
    type: 'monthly',
    start: 16,
    interval: 1
}
const repeatable4 = {
    type: 'monthly',
    start: 31,
    interval: 1
}

const repeatable5 = {
    type: 'yearly',
    start: date3.toDateString(),
    interval: 1
}
const repeatable6 = {
    type: 'yearly',
    start: date6.toDateString(),
    interval: 1
}

test('check our daily repeatable', () => {
    expect(checkRepeatable(repeatable1, date2)).toBe(false);
    expect(checkRepeatable(repeatable1, date3)).toBe(true);
})

test('check our weekly repeatable', () => {
    expect(checkRepeatable(repeatable2, date4)).toBe(false);
    expect(checkRepeatable(repeatable2, date5)).toBe(true);
})

test('check our monthly repeatable', () => {
    expect(checkRepeatable(repeatable3, date1)).toBe(false);
    expect(checkRepeatable(repeatable3, date3)).toBe(true);
    expect(checkRepeatable(repeatable3, date4)).toBe(false);

    expect(checkRepeatable(repeatable4, date4)).toBe(true);
})

test('check our yearly repeatable', () => {
    expect(checkRepeatable(repeatable5, date1)).toBe(false);
    expect(checkRepeatable(repeatable5, date3)).toBe(true);
    expect(checkRepeatable(repeatable5, date4)).toBe(false);

    expect(checkRepeatable(repeatable6, date7)).toBe(true);
    expect(checkRepeatable(repeatable6, date8)).toBe(false);
})