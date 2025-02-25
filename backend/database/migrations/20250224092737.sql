create table repeatable_todos (
    id integer primary key,
    type text not null,
    start text not null,
    interval integer not null,
    active integer not null default 1,
    content text not null
) strict;

create table todos (
    id integer primary key,
    content text not null,
    category text not null,
    created text not null default (date() || 'T' || time() || '.000Z'),
    completed text,
    repeatable integer references repeatable_todos
) strict;

create view completed_todos as
select 
    id,
    content,
    category,
    created,
    completed,
    repeatable from todos where completed is not null;

create view open_todos as
select 
    id,
    content,
    category,
    created,
    completed,
    repeatable from todos where completed is null;

