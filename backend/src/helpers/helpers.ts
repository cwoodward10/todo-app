// https://dev.to/dillionmegida/how-to-calculate-the-difference-of-days-between-two-dates-in-javascript-chd
export function DateDifference(start: Date, end: Date) {
    const firstDateInMs = start.getTime();
    const secondDateInMs = end.getTime();

    const differenceBtwDates = secondDateInMs - firstDateInMs;

    const aDayInMs = 24 * 60 * 60 * 1000;

    return Math.round(differenceBtwDates / aDayInMs);
}

// https://stackoverflow.com/questions/6355063/how-to-validate-date-if-is-the-last-day-of-the-month-with-javascript
export function IsLastDayOfMonth(date: Date) {
    // check if adding 1 day to the date results in the first of the next month
    return new Date(date.getTime() + 86400000).getDate() === 1;
}

// https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
export function DaysIntoYear(date: Date){
    return (
        Date.UTC(
            date.getFullYear(), 
            date.getMonth(), 
            date.getDate()
        ) - Date.UTC(date.getFullYear(), 0, 0)
    ) / 24 / 60 / 60 / 1000;
}