create table repeatable_todos (
    id integer primary key,
    type text not null,
    interval integer not null,
    active integer not null default true,
    content text not null
);

create table todos (
    id integer primary key,
    content text not null,
    category text not null,
    created date not null default now(),
    completed date,
    repeatable integer references repeatable_todos
);
