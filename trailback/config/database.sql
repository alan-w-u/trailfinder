drop table Equipment;
drop table TransportationToLocation;
drop table RetailerFeaturesGear;
drop table UserHikesTrail;
drop table Transportation;
drop table Retailer2;
drop table Retailer1;
drop table Preview2;
drop table Preview1;
drop table Gear2;
drop table Gear1;
drop table Review;
drop table Photo;
drop table Friends;
drop table UGC;
drop table Trail2;
drop table Trail1;
drop table Location;
-- drop table UserProfile6;
-- drop table UserProfile5;
-- drop table UserProfile3;
-- drop table UserProfile1;
drop table UserProfile;
drop sequence user_id_seq;


-- CREATE TABLE UserProfile1 (
--     TrailsHiked	    INTEGER         DEFAULT 0       PRIMARY KEY,
--     ExperienceLvl   INTEGER         DEFAULT 0
-- );
--
-- grant select on UserProfile1 to public;
--
-- CREATE TABLE UserProfile3 (
--     Email           VARCHAR(320)    PRIMARY KEY,
--     ProfilePicture  BLOB,
--     TrailsHiked     INTEGER         DEFAULT 0,
--     FOREIGN KEY (TrailsHiked) REFERENCES UserProfile1
-- );
--
-- grant select on UserProfile3 to public;
--
-- CREATE TABLE UserProfile5 (
--     Name            VARCHAR(50),
--     Email           VARCHAR(320),
--     Password        VARCHAR(50),
--     NumberOfFriends	INTEGER         DEFAULT 0,
--     PRIMARY KEY (Name, Email)
-- );
--
-- grant select on UserProfile5 to public;
--
-- CREATE TABLE UserProfile6 (
--     UserID          INTEGER         PRIMARY KEY,
--     Name            VARCHAR(50),
--     Email           VARCHAR(320),
--     Password        VARCHAR(50),
--     FOREIGN KEY (Name, Email, Password) REFERENCES UserProfile5
-- );
--
-- grant select on UserProfile6 to public;


CREATE TABLE UserProfile (
    userID NUMBER PRIMARY KEY,
    name VARCHAR2(50),
    email VARCHAR2(320) UNIQUE,
    password VARCHAR2(72),  -- Hashed password
    trailsHiked INTEGER DEFAULT 0,
    experienceLevel INTEGER DEFAULT 0,
    profilePicture BLOB,
    numberOfFriends INTEGER DEFAULT 0
);

CREATE TABLE Equipment (
    EquipmentID     INTEGER         PRIMARY KEY,
    UserID          INTEGER,
    Type            VARCHAR(50),
    Brand           VARCHAR(50),
    Amount          INTEGER,
    Weight          FLOAT,
    FOREIGN KEY (UserID) REFERENCES UserProfile
        ON DELETE CASCADE
);

grant select on Equipment to public;

CREATE TABLE Transportation (
    TransportID     INTEGER         PRIMARY KEY,
    Type            VARCHAR(50),
    TransportCost   FLOAT
);

grant select on Transportation to public; 

CREATE TABLE Retailer1 (
    RetailerWebsite VARCHAR(100)    PRIMARY KEY,
    RetailerName    VARCHAR(50)
);

grant select on Retailer1 to public; 

CREATE TABLE Retailer2 (
    RetailerID      INTEGER         PRIMARY KEY,
    RetailerName    VARCHAR(50),
    FOREIGN KEY (RetailerName) REFERENCES Retailer1
);

grant select on Retailer2 to public; 

CREATE TABLE Location (
    LocationName    VARCHAR(50),
    Latitude        Decimal(8, 6),
    Longitude       Decimal(9, 6),
    Weather         VARCHAR(30),
    PRIMARY KEY (LocationName, Latitude, Longitude)
);

grant select on Location to public; 

CREATE TABLE Trail1 (
    LocationName    VARCHAR(50)     NOT NULL,
    Latitude        Decimal(8, 6)   NOT NULL,
    Longitude       Decimal(9, 6)   NOT NULL,
    TrailName       VARCHAR(50),
    TimeToComplete  INTEGER,
    Description     VARCHAR(3000),
    Hazards         VARCHAR(100),
    PRIMARY KEY (LocationName, Latitude, Longitude, TrailName),
    FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
        ON DELETE CASCADE
);

grant select on Trail1 to public; 

CREATE TABLE Trail2 (
    LocationName    VARCHAR(50)     NOT NULL,
    Latitude        Decimal(8, 6)   NOT NULL,
    Longitude       Decimal(9, 6)   NOT NULL,
    TrailName       VARCHAR(50),
    Difficulty      INTEGER,
    PRIMARY KEY (LocationName, Latitude, Longitude, TrailName),
    FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
        ON DELETE CASCADE,
    FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail1
);


grant select on Trail2 to public; 

CREATE TABLE Gear1 (
    GearName        VARCHAR(50)     PRIMARY KEY,
    GearType        VARCHAR(50)
);

grant select on Gear1 to public; 

CREATE TABLE Gear2 (
    GearName        VARCHAR(50)     PRIMARY KEY,
    LocationName    VARCHAR(50),
    Latitude        Decimal(8, 6)   NOT NULL,
    Longitude       Decimal(9, 6)   NOT NULL,
    TrailName       VARCHAR(50),
    FOREIGN KEY (GearName) REFERENCES Gear1,
    FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
        ON DELETE SET NULL,
    FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail1
        ON DELETE SET NULL
);

grant select on Gear2 to public; 

CREATE TABLE Preview1 (
    PreviewID       INTEGER	    PRIMARY KEY,
    Image           BLOB
);

grant select on Preview1 to public; 

CREATE TABLE Preview2 (
    LocationName    VARCHAR(50)     NOT NULL,
    Latitude        Decimal(8, 6)   NOT NULL,
    Longitude       Decimal(9, 6)   NOT NULL,
    TrailName       VARCHAR(50)     NOT NULL,
    PreviewID       INTEGER,
    PRIMARY KEY (LocationName, Latitude, Longitude, TrailName, PreviewID),
    FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
        ON DELETE CASCADE,
    FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail1
        ON DELETE CASCADE,
    FOREIGN KEY (PreviewID) REFERENCES Preview1
);

grant select on Preview2 to public; 

CREATE TABLE UGC (
    UGCID           INTEGER         PRIMARY KEY,
    UserID          INTEGER         NOT NULL,
    LocationName    VARCHAR(50)     NOT NULL,
    Latitude        Decimal(8, 6)   NOT NULL,
    Longitude       Decimal(9, 6)   NOT NULL,
    TrailName       VARCHAR(50)     NOT NULL,
    DatePosted      DATE,
    FOREIGN KEY (UserID) REFERENCES UserProfile
        ON DELETE CASCADE,
    FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
        ON DELETE CASCADE,
    FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail1
        ON DELETE CASCADE 
);

grant select on UGC to public; 

CREATE TABLE Review (
    UGCID           INTEGER         PRIMARY KEY,
    Rating          INTEGER,
    Description     VARCHAR(500),
    FOREIGN KEY (UGCID) REFERENCES UGC
        ON DELETE CASCADE
);

grant select on Review to public; 

CREATE TABLE Photo (
    UGCID           INTEGER         PRIMARY KEY,
    Image           BLOB,
    FOREIGN KEY (UGCID) REFERENCES UGC
        ON DELETE CASCADE
);

grant select on Photo to public; 

CREATE TABLE Friends (
    UserID          INTEGER,
    FriendID        INTEGER,
    DateFriended    DATE,
    PRIMARY KEY (UserID, FriendID),
    FOREIGN KEY (UserID) REFERENCES UserProfile
        ON DELETE CASCADE
);

grant select on Friends to public; 

CREATE TABLE TransportationToLocation (
    TransportID     INTEGER,
    LocationName    VARCHAR(50),
    Latitude        Decimal(8, 6)   NOT NULL,
    Longitude       Decimal(9, 6)   NOT NULL,
    Duration        INTEGER,
    TripCost        FLOAT,
    PRIMARY KEY (TransportID, LocationName, Latitude, Longitude),
    FOREIGN KEY (TransportID) REFERENCES Transportation
        ON DELETE CASCADE,
    FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
        ON DELETE CASCADE
);

grant select on TransportationToLocation to public;

CREATE TABLE UserHikesTrail (
    UserID          INTEGER,
    LocationName    VARCHAR(50),
    Latitude        Decimal(8, 6)   NOT NULL,
    Longitude       Decimal(9, 6)   NOT NULL,
    TrailName       VARCHAR(50),
    DateHiked       DATE,
    TimeToComplete  INTEGER,
    PRIMARY KEY (UserID, LocationName, Latitude, Longitude, TrailName),
    FOREIGN KEY (UserID) REFERENCES UserProfile
        ON DELETE CASCADE,
    FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
        ON DELETE CASCADE,
    FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail1
        ON DELETE CASCADE
);

grant select on UserHikesTrail to public;

CREATE TABLE RetailerFeaturesGear (
    RetailerID      INTEGER,
    GearType        VARCHAR(50),
    ProductName     VARCHAR(50),
    ProductWebsite  VARCHAR(100), 
    PRIMARY KEY (RetailerID, GearType),
    FOREIGN KEY (RetailerID) REFERENCES Retailer2
        ON DELETE CASCADE,
    FOREIGN KEY (GearType) REFERENCES Gear1
        ON DELETE CASCADE
);

grant select on RetailerFeaturesGear to public;




-- INSERT INTO UserProfile1 (TrailsHiked, ExperienceLvl) VALUES (15, 3);
-- INSERT INTO UserProfile1 (TrailsHiked, ExperienceLvl) VALUES (8, 2);
-- INSERT INTO UserProfile1 (TrailsHiked, ExperienceLvl) VALUES (25, 4);
-- INSERT INTO UserProfile1 (TrailsHiked, ExperienceLvl) VALUES (5, 1);
-- INSERT INTO UserProfile1 (TrailsHiked, ExperienceLvl) VALUES (20, 3);
--
-- INSERT INTO UserProfile3 (Email, ProfilePicture, TrailsHiked) VALUES ('john.doe@email.com', EMPTY_BLOB(), 15);
-- INSERT INTO UserProfile3 (Email, ProfilePicture, TrailsHiked) VALUES ('jane.smith@email.com', EMPTY_BLOB(), 8);
-- INSERT INTO UserProfile3 (Email, ProfilePicture, TrailsHiked) VALUES ('mike.johnson@email.com', EMPTY_BLOB(), 25);
-- INSERT INTO UserProfile3 (Email, ProfilePicture, TrailsHiked) VALUES ('emily.brown@email.com', EMPTY_BLOB(), 5);
-- INSERT INTO UserProfile3 (Email, ProfilePicture, TrailsHiked) VALUES ('david.lee@email.com', EMPTY_BLOB(), 20);
--
--
-- INSERT INTO UserProfile5 (Name, Email, NumberOfFriends) VALUES ('John Doe', 'john.doe@email.com', 7);
-- INSERT INTO UserProfile5 (Name, Email, NumberOfFriends) VALUES ('Jane Smith', 'jane.smith@email.com', 5);
-- INSERT INTO UserProfile5 (Name, Email, NumberOfFriends) VALUES ('Mike Johnson', 'mike.johnson@email.com', 12);
-- INSERT INTO UserProfile5 (Name, Email, NumberOfFriends) VALUES ('Emily Brown', 'emily.brown@email.com', 3);
-- INSERT INTO UserProfile5 (Name, Email, NumberOfFriends) VALUES ('David Lee', 'david.lee@email.com', 9);
--
-- INSERT INTO USERProfile6 (UserID, Name, Email) VALUES (1, 'John Doe', 'john.doe@email.com');
-- INSERT INTO USERProfile6 (UserID, Name, Email) VALUES (2, 'Jane Smith', 'jane.smith@email.com');
-- INSERT INTO USERProfile6 (UserID, Name, Email) VALUES (3, 'Mike Johnson', 'mike.johnson@email.com');
-- INSERT INTO USERProfile6 (UserID, Name, Email) VALUES (4, 'Emily Brown', 'emily.brown@email.com');
-- INSERT INTO USERProfile6 (UserID, Name, Email) VALUES (5, 'David Lee', 'david.lee@email.com');


CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

DECLARE
    highest_user_id NUMBER;
BEGIN
    SELECT NVL(MAX(userID), 1) INTO highest_user_id FROM userprofile;
    EXECUTE IMMEDIATE 'ALTER SEQUENCE user_id_seq RESTART START WITH ' || (highest_user_id + 1);
END;
/