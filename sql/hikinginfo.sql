drop table User1; 




CREATE TABLE User1
  (TrailsHiked		INTEGER		DEFAULT 0,
  ExperienceLvl	INTEGER		DEFAULT 0,
  primary key (TrailsHiked));

grant select on User1 to public;


insert into User1
values
(15, 3);