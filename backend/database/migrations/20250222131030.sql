create table repeatable_todos_new (
    id integer primary key,
    type text not null,
    interval integer not null,
    active integer not null default 1
) strict;

insert into repeatable_todos_new (
    id,
    type,
    interval,
    active)
select
    id,
    type,
    interval,
    active
from repeatable_todos;

drop table repeatable_todos;
alter table repeatable_todos_new rename to repeatable_todos;
pragma foreign_key_check;
