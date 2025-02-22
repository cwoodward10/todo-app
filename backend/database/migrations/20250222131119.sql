drop view completed_todos;
drop view open_todos;


create table todos_new (
    id integer primary key,
    content text not null,
    category text not null,
    created text not null default (date() || 'T' || time() || '.000Z'),
    completed text,
    repeatable integer references repeatable_todos
) strict;

insert into todos_new (
    id,
    content,
    category,
    created,
    completed,
    repeatable)
select
    id,
    content,
    category,
    created,
    completed,
    repeatable
from todos;

drop table todos;
alter table todos_new rename to todos;
pragma foreign_key_check;


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
