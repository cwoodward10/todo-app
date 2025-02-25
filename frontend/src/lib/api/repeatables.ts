export type RepeatType =  'days' | 'weekly' | 'monthly' | 'yearly';

export type RepeatableTodo = {
    id: number;
    type: RepeatType;
    start: string;
    interval: number;
    active: number;
    content: string;
}