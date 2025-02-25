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
