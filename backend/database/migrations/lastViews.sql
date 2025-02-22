create view completed_todos as
select * from todos where completed is not null;

create view open_todos as
select * from todos where completed is null;
