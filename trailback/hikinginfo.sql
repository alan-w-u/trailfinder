drop table User3;
drop table User1;
drop table User6;
drop table User5;




CREATE TABLE User1 (
TrailsHiked		INTEGER		DEFAULT 0		PRIMARY KEY,
ExperienceLvl	INTEGER		DEFAULT 0);

grant select on User1 to public;

CREATE TABLE User3 (
Email 			VARCHAR(320) 	PRIMARY KEY,
ProfilePicture 	BLOB, 
TrailsHiked 		INTEGER		DEFAULT 0,
FOREIGN KEY (TrailsHiked) REFERENCES User1
);

grant select on User3 to public;

CREATE TABLE User5 (
Name 			VARCHAR(50),
Email 			VARCHAR(320), 
NumberOfFriends	INTEGER		DEFAULT 0,
PRIMARY KEY (Name, Email)
);

grant select on User5 to public;

CREATE TABLE User6 (
UserID 		INTEGER		PRIMARY KEY,
Name 			VARCHAR(50),
Email 			VARCHAR(320),
FOREIGN KEY (Name, Email) REFERENCES User5
);

grant select on User6 to public;
