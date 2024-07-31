drop table Equipment6;
drop table Equipment5;
drop table Equipment3;
drop table Equipment1;
drop table UserProfile6;
drop table UserProfile5;
drop table UserProfile3;
drop table UserProfile1;


CREATE TABLE UserProfile1 (
TrailsHiked		INTEGER		DEFAULT 0		PRIMARY KEY,
ExperienceLvl	INTEGER		DEFAULT 0);

grant select on UserProfile1 to public;

CREATE TABLE UserProfile3 (
Email 			VARCHAR(320) 	PRIMARY KEY,
ProfilePicture 	BLOB, 
TrailsHiked 		INTEGER		DEFAULT 0,
FOREIGN KEY (TrailsHiked) REFERENCES UserProfile1
);

grant select on UserProfile3 to public;

CREATE TABLE UserProfile5 (
Name 			VARCHAR(50),
Email 			VARCHAR(320), 
NumberOfFriends	INTEGER		DEFAULT 0,
PRIMARY KEY (Name, Email),
FOREIGN KEY (Email) REFERENCES UserProfile3
);

grant select on UserProfile5 to public;

CREATE TABLE UserProfile6 (
UserID 		INTEGER		PRIMARY KEY,
Name 			VARCHAR(50),
Email 			VARCHAR(320),
FOREIGN KEY (Name, Email) REFERENCES UserProfile5
);

grant select on UserProfile6 to public;

CREATE TABLE Equipment1 (
UserID	 		INTEGER 		PRIMARY KEY,
Amount 		INTEGER,
FOREIGN KEY (UserID) REFERENCES UserProfile6
ON DELETE CASCADE
);

grant select on Equipment1 to public; 

CREATE TABLE Equipment3 (
EquipmentID 		INTEGER 		PRIMARY KEY,
Type 			VARCHAR(50),
Brand 			VARCHAR(50)
);

grant select on Equipment3 to public; 

CREATE TABLE Equipment5 (
EquipmentID 		INTEGER 		PRIMARY KEY,
Weight 		FLOAT,
FOREIGN KEY (EquipmentID) REFERENCES Equipment3
);

grant select on Equipment5 to public;

CREATE TABLE Equipment6 (
Equipment 		INTEGER 		PRIMARY KEY,
UserID			INTEGER,
FOREIGN KEY (UserID) REFERENCES UserProfile6
    ON DELETE CASCADE
);

grant select on Equipment6 to public;
