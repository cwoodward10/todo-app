create view open_todos as
select * from todos where completed is null;