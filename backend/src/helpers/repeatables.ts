import { db } from "../../database/db.js";
import { DateDifference, IsLastDayOfMonth } from "./helpers.js";

const VALID_TYPES = [ 'days', 'weekly', 'monthly', 'yearly']

//#region GET
/**
 * @param type expects 'active' | 'inactive' | 'all'; defaults to 'active'
 * @returns 
 */
export async function GetRepeatables(type: string = 'active') {
    try {
        let params: any = type === 'all' ? {} : { active: !(type === 'inactive') };

        return await db.repeatable_todos.many(params);
    } catch (e) {
        throw new Error(`Error getting${type} repeatables`, { cause: e });
    }
}

export async function GetRepeatableById(id: number) {
    try {
        return await db.repeatable_todos.get({ id });
    } catch (e) {
        throw new Error(`Error getting repeatable with ID: ${id}`, { cause: e });
    }
}
//#endregion GET

//#region INSERT
export async function AddRepeatable(repeatable: any | any[]) {
    try {
        const toInsert = Array.isArray(repeatable) ? repeatable : [ repeatable ];
        await db.repeatable_todos.insertMany(toInsert);
        return true;
    } catch (e) {
        throw new Error('Error inserting repeatable(s)', { cause: e });
    }
}
//#region INSERT

//#region UPDATE
export async function UpdateRepeatable(id: number, params: any) {
    try {
        return await db.repeatable_todos.update({ id }, { ...params });
    } catch (e) {
        const message = `Error updating repeatable ID: ${id}, params: ${ JSON.stringify(params)}`;
        throw new Error(message, { cause: e});
    }
}

/**
 * Calls the UpdateRepeatable function to turn 'active' to false
 * @param id 
 * @returns 
 */
export async function ArchiveRepeatable(id: number) {
    try {
        return await UpdateRepeatable(id, { active: false });
    } catch (e) {
        throw new Error(`Error archiving repeatable ID: ${id}`), { cause: e};
    }
}
//#region UPDATE

//#region DELETE
/**
 * Avoid using this function
 * @param id 
 * @returns 
 */
export async function DeleteRepeatable(id: number) {
    try {
        return await db.repeatable_todos.remove({ id });
    } catch (e) {
        throw new Error(`Error updating repeatable ID: ${id}`), { cause: e};
    }
}
//#region DELETE

//#region UTILITIES
/**
 * Takes in a date and returns the new to-dos for the day.
 * @param today 
 * @returns 
 */
export async function CheckTriggeredRepeatables(today: Date) {
    const activeRepeatables = await GetRepeatables('active');
    
    const newTodos = activeRepeatables
        .filter(r => checkRepeatable(r, today))
        .flatMap(r => {
            return {
                content: r.content,
                created: Date.now(),
                category: 'Today',
                repeatable: r.id
            }
        }
    )

    return newTodos;
}

export function checkRepeatable(repeatable: any, today: Date): boolean {
    let start;
    let interval: number = repeatable.interval;
    switch (repeatable.type) {
        case 'days':
        default:
            start = new Date(repeatable.start);
            const daysBetween = DateDifference(start, today);
            return daysBetween % interval === 0;

        case 'weekly':
            start = Number.parseInt(repeatable.start);
            return start === today.getDay();
            
        case 'monthly':
            start = Number.parseInt(repeatable.start);

            const todayIsMonthEnd = IsLastDayOfMonth(today);
            if (todayIsMonthEnd) {
                return start >= today.getDate();
            } else {
                return start === today.getDate();
            }
            
        case 'yearly':
            start = new Date(repeatable.start);
            return (
                start.getMonth() === today.getMonth() &&
                start.getDate() === today.getDate()
            )
    }
}

//#endregion UTILITIES