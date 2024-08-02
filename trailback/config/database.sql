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
drop table Trail;
drop table Location;
drop table UserProfile;
drop sequence user_id_seq;



CREATE TABLE UserProfile (
    userID NUMBER PRIMARY KEY,
    name VARCHAR2(50),
    email VARCHAR2(320) UNIQUE,
    password VARCHAR2(72),
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
    RetailerWebsite VARCHAR2(100)    PRIMARY KEY,
    RetailerName    VARCHAR2(50)
);

grant select on Retailer1 to public; 

CREATE TABLE Retailer2 (
    RetailerID      INTEGER         PRIMARY KEY,
    RetailerName    VARCHAR2(50),
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

CREATE TABLE Trail (
    LocationName    VARCHAR(50)     NOT NULL,
    Latitude        Decimal(8, 6)   NOT NULL,
    Longitude       Decimal(9, 6)   NOT NULL,
    TrailName       VARCHAR(50),
    TimeToComplete  INTERVAL DAY TO SECOND,
    Description     VARCHAR(3000),
    Hazards         VARCHAR(100),
    Difficulty      INTEGER,
    PRIMARY KEY (LocationName, Latitude, Longitude, TrailName),
    FOREIGN KEY (LocationName, Latitude, Longitude) REFERENCES Location
        ON DELETE CASCADE
);

grant select on Trail to public;

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
    FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail
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
    FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail
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
    FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail
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
    FOREIGN KEY (LocationName, Latitude, Longitude, TrailName) REFERENCES Trail
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


INSERT ALL
    INTO UserProfile (UserID, Name, Email, Password, ProfilePicture, TrailsHiked, experienceLevel, NumberOfFriends) VALUES
    (1, 'John Doe', 'john.doe@email.com', '$2b$10$ymRAycGV5EegDAsSVLyrh.qa6Om2ahTPHRpVsHd7Lzmyz/XLza9MG', EMPTY_BLOB(), 15, 3, 7)
    INTO UserProfile (UserID, Name, Email, Password, ProfilePicture, TrailsHiked, experienceLevel, NumberOfFriends) VALUES
    (2, 'Jane Smith', 'jane.smith@email.com', '$2b$10$3Ist2BK.9IdeHLcw1uiA7eabIx7j4H0W/6T3QDZHsu06cN64sijje', EMPTY_BLOB(), 8, 2, 5)
    INTO UserProfile (UserID, Name, Email, Password, ProfilePicture, TrailsHiked, experienceLevel, NumberOfFriends) VALUES
    (3, 'Mike Johnson', 'mike.johnson@email.com', '$2b$10$/K9BkOSJB8PI4wj2IpM4HuKsXKwsSIfUeznS56Z4KvYqGi9jtKfMG', EMPTY_BLOB(), 25, 4, 12)
    INTO UserProfile (UserID, Name, Email, Password, ProfilePicture, TrailsHiked, experienceLevel, NumberOfFriends) VALUES
    (4, 'Emily Brown', 'emily.brown@email.com', '$2b$10$.42a6Cwng0dU.XnCpQAOousfZtYrgV167Z4.BxJvwVQQx0wPVOegm', EMPTY_BLOB(), 5, 1, 3)
    INTO UserProfile (UserID, Name, Email, Password, ProfilePicture, TrailsHiked, experienceLevel, NumberOfFriends) VALUES
    (5, 'David Lee', 'david.lee@email.com', '$2b$10$ZmHZlgWCjOTe69MHLgar/ejkZQIVaorvk2wo10MzkQhvyhPwrmLIq', EMPTY_BLOB(), 20, 3, 9)
SELECT * FROM DUAL;

INSERT ALL
    INTO Equipment (EquipmentID, UserID, Type, Brand, Amount, Weight) VALUES
    (1, 1, 'Hiking Boots', 'Merrell', 1, 2.5)
    INTO Equipment (EquipmentID, UserID, Type, Brand, Amount, Weight) VALUES
    (2, 1, 'Backpack', 'Osprey', 1, 1.8)
    INTO Equipment (EquipmentID, UserID, Type, Brand, Amount, Weight) VALUES
    (3, 2, 'Trekking Poles', 'Black Diamond', 2, 0.5)
    INTO Equipment (EquipmentID, UserID, Type, Brand, Amount, Weight) VALUES
    (4, 3, 'Tent', 'REI', 1, 3.2)
    INTO Equipment (EquipmentID, UserID, Type, Brand, Amount, Weight) VALUES
    (5, 4, 'Sleeping Bag', 'The North Face', 1, 1.5)
SELECT * FROM DUAL;

INSERT ALL
    INTO Transportation (TransportID, Type, TransportCost) VALUES
    (1, 'Car', 0.15)
    INTO Transportation (TransportID, Type, TransportCost) VALUES
    (2, 'Bus', 2.50)
    INTO Transportation (TransportID, Type, TransportCost) VALUES
    (3, 'Train', 5.00)
    INTO Transportation (TransportID, Type, TransportCost) VALUES
    (4, 'Bicycle', 0.00)
    INTO Transportation (TransportID, Type, TransportCost) VALUES
    (5, 'Shuttle', 10.00)
SELECT * FROM DUAL;

INSERT ALL
    INTO Retailer1 (RetailerName, RetailerWebsite) VALUES
    ('Mountain Outfitters', 'www.mountainoutfitters.com')
    INTO Retailer1 (RetailerName, RetailerWebsite) VALUES
    ('Trail Blazer Gear', 'www.trailblazergear.com')
    INTO Retailer1 (RetailerName, RetailerWebsite) VALUES
    ('Summit Supply Co.', 'www.summitsupply.com')
    INTO Retailer1 (RetailerName, RetailerWebsite) VALUES
    ('Campsite Essentials', 'www.campsiteessentials.com')
    INTO Retailer1 (RetailerName, RetailerWebsite) VALUES
    ('Wilderness Comfort', 'www.wildernesscomfort.com')
SELECT * FROM DUAL;



CREATE SEQUENCE user_id_seq
    START WITH 6
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;

COMMIT;