drop table UserProfile3;
drop table UserProfile1;
drop table Equipment6;
drop table Equipment1; 
drop table UserProfile6;
drop table Equipment5;
drop table Equipment3;
drop table UserProfile5;
drop table Transportation;
drop table Retailer1;
drop table Retailer2;
drop table Trail2;
drop table Trail1;
drop table Location; 



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
PRIMARY KEY (Name, Email)
);

grant select on UserProfile5 to public;

CREATE TABLE UserProfile6 (
UserID 		INTEGER		PRIMARY KEY,
Name 			VARCHAR(50),
Email 			VARCHAR(320),
FOREIGN KEY (Name, Email) REFERENCES UserProfile5
);

grant select on UserProfile6 to public;

CREATE TABLE Equipment6 (
Equipment 		INTEGER 		PRIMARY KEY,
UserID			INTEGER,
FOREIGN KEY (UserID) REFERENCES UserProfile6
ON DELETE CASCADE
);

grant select on Equipment6 to public; 

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


CREATE TABLE Transportation (
TransportID 		INTEGER 		PRIMARY KEY,
Type 			VARCHAR(50),
TransportCost 	FLOAT
);

grant select on Transportation to public; 

CREATE TABLE Retailer1 (
RetailerWebsite 	VARCHAR(100)	PRIMARY KEY,
RetailerName 	VARCHAR(50)
);

grant select on Retailer1 to public; 

CREATE TABLE Retailer2 (
RetailerID 		INTEGER 		PRIMARY KEY,
RetailerName 	VARCHAR(50)
);

grant select on Retailer2 to public; 

CREATE TABLE Location (
LocationName 	VARCHAR(50),
Latitude 		Decimal(8, 6),
Longitude		Decimal(9, 6),
Weather 		VARCHAR(30),
PRIMARY KEY (LocationName, Latitude, Longitude)
);

grant select on Location to public; 

CREATE TABLE Trail1 (
LocationName 	VARCHAR(50) 		NOT NULL,
Latitude 		Decimal(8, 6)	NOT NULL,
Longitude		Decimal(9, 6)	NOT NULL,
TrailName 		VARCHAR(50),
TimeToComplete 	INTEGER,
Description 		VARCHAR(3000),
Hazards 		VARCHAR(100),
PRIMARY KEY (LocationName, Latitude, Longitude, TrailName),
FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
ON DELETE CASCADE
);

grant select on Trail1 to public; 

CREATE TABLE Trail2 (
LocationName 	VARCHAR(50) 		NOT NULL,
Latitude 		Decimal(8, 6)	NOT NULL,
Longitude		Decimal(9, 6)	NOT NULL,
TrailName 		VARCHAR(50),
Difficulty		INTEGER,
PRIMARY KEY (LocationName, Latitude, Longitude, TrailName),
FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
ON DELETE CASCADE,
FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail1
);


grant select on Trail2 to public; 