drop table equipment;
drop table transportationtolocation;
drop table retailerfeaturesgear;
drop table userhikestrail;
drop table transportation;
drop table retailer2;
drop table retailer1;
drop table preview2;
drop table preview1;
drop table gear;
drop table review;
drop table photo;
drop table friends;
drop table ugc;
drop table trail;
drop table location;
drop table userprofile;
drop sequence user_id_seq;



CREATE TABLE userprofile (
    userid          NUMBER          PRIMARY KEY,
    name            VARCHAR2(50),
    email           VARCHAR2(320)   UNIQUE,
    password        VARCHAR2(72),
    trailshiked     INTEGER         DEFAULT 0,
    experiencelevel INTEGER         DEFAULT 0,
    profilepicture  BLOB,
    numberoffriends INTEGER         DEFAULT 0
);

CREATE TABLE equipment (
    equipmentid     INTEGER         PRIMARY KEY,
    userid          INTEGER,
    type            VARCHAR(50),
    brand           VARCHAR(50),
    amount          INTEGER,
    weight          FLOAT,
    FOREIGN KEY (userid) REFERENCES userprofile
        ON DELETE CASCADE
);

grant select on equipment to public;

CREATE TABLE transportation (
    transportid     INTEGER         PRIMARY KEY,
    type            VARCHAR(50),
    transportcost   FLOAT
);

grant select on transportation to public; 

CREATE TABLE retailer1 (
    retailername VARCHAR2(50)   PRIMARY KEY,
    retailerwebsite    VARCHAR2(100)
);

grant select on retailer1 to public; 

CREATE TABLE retailer2 (
    retailerid      INTEGER         PRIMARY KEY,
    retailername    VARCHAR2(50),
    FOREIGN KEY (retailername) REFERENCES retailer1
);

grant select on retailer2 to public; 

CREATE TABLE location (
    locationname    VARCHAR(50),
    latitude        DECIMAL(8, 6),
    longitude       DECIMAL(9, 6),
    weather         VARCHAR(30),
    PRIMARY KEY (locationname, latitude, longitude)
);

grant select on location to public; 

CREATE TABLE trail (
    locationname    VARCHAR(50)     NOT NULL,
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50),
    timetocomplete  INTERVAL DAY TO SECOND,
    description     VARCHAR(3000),
    hazards         VARCHAR(100),
    difficulty      INTEGER,
    PRIMARY KEY (locationname, latitude, longitude, trailname),
    FOREIGN KEY (locationname, latitude, longitude) REFERENCES location
        ON DELETE CASCADE
);

grant select on trail to public;


CREATE TABLE gear (
    gearname        VARCHAR(50)     PRIMARY KEY,
    geartype        VARCHAR(50),
    locationname    VARCHAR(50),
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50),
    FOREIGN KEY (locationname, latitude, longitude, trailname) REFERENCES trail
        ON DELETE SET NULL
);

grant select on gear to public;

CREATE TABLE preview1 (
    previewid       INTEGER	        PRIMARY KEY,
    image           BLOB
);

grant select on preview1 to public; 

CREATE TABLE preview2 (
    locationname    VARCHAR(50)     NOT NULL,
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50)     NOT NULL,
    previewid       INTEGER,
    PRIMARY KEY (locationname, latitude, longitude, trailname, previewid),
    FOREIGN KEY (locationname, latitude, longitude, trailname) REFERENCES trail
        ON DELETE CASCADE,
    FOREIGN KEY (previewid) REFERENCES preview1
);

grant select on preview2 to public; 

CREATE TABLE ugc (
    ugcid           INTEGER         PRIMARY KEY,
    userid          INTEGER         NOT NULL,
    locationname    VARCHAR(50)     NOT NULL,
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50)     NOT NULL,
    dateposted      DATE,
    FOREIGN KEY (userid) REFERENCES userprofile
        ON DELETE CASCADE,
    FOREIGN KEY (locationname, latitude, longitude) REFERENCES Location
        ON DELETE CASCADE,
    FOREIGN KEY (locationname, latitude, longitude, trailname) REFERENCES trail
        ON DELETE CASCADE 
);

grant select on ugc to public; 

CREATE TABLE review (
    ugcid           INTEGER         PRIMARY KEY,
    rating          INTEGER,
    description     VARCHAR(500),    FOREIGN KEY (ugcid) REFERENCES ugc
        ON DELETE CASCADE
);

grant select on review to public; 

CREATE TABLE photo (
    ugcid           INTEGER         PRIMARY KEY,
    image           BLOB,
    FOREIGN KEY (ugcid) REFERENCES ugc
        ON DELETE CASCADE
);

grant select on photo to public; 

CREATE TABLE friends (
    userid          INTEGER,
    friendid        INTEGER,
    datefriended    DATE,
    PRIMARY KEY (userid, friendid),
    FOREIGN KEY (userid) REFERENCES userprofile
        ON DELETE CASCADE
);

grant select on friends to public; 

CREATE TABLE transportationtolocation (
    transportid     INTEGER,
    locationname    VARCHAR(50),
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    duration        INTEGER,
    tripcost        FLOAT,
    PRIMARY KEY (transportid, locationname, latitude, longitude),
    FOREIGN KEY (transportid) REFERENCES transportation
        ON DELETE CASCADE,
    FOREIGN KEY (locationname, latitude, longitude) REFERENCES Location
        ON DELETE CASCADE
);

grant select on transportationtolocation to public;

CREATE TABLE userhikestrail (
    userid          INTEGER,
    locationname    VARCHAR(50),
    latitude        DECIMAL(8, 6)   NOT NULL,
    longitude       DECIMAL(9, 6)   NOT NULL,
    trailname       VARCHAR(50),
    datehiked       DATE,
    timetocomplete  INTEGER,
    PRIMARY KEY (userid, locationname, latitude, longitude, trailname),
    FOREIGN KEY (userid) REFERENCES userprofile
        ON DELETE CASCADE,
    FOREIGN KEY (locationname, latitude, longitude) REFERENCES Location
        ON DELETE CASCADE,
    FOREIGN KEY (locationname, latitude, longitude, trailname) REFERENCES trail
        ON DELETE CASCADE
);

grant select on userhikestrail to public;

CREATE TABLE retailerfeaturesgear (
    retailerid      INTEGER,
    gearname        VARCHAR(50),
    productname     VARCHAR(50),
    productwebsite  VARCHAR(100), 
    PRIMARY KEY (retailerid, gearname),
    FOREIGN KEY (retailerid) REFERENCES retailer2
        ON DELETE CASCADE,
    FOREIGN KEY (gearname) REFERENCES gear
        ON DELETE CASCADE
);

grant select on retailerfeaturesgear to public;


INSERT ALL
    INTO userprofile (userid, name, email, password, profilepicture, trailsHiked, experienceLevel, numberoffriends) VALUES
    (1, 'John Doe', 'john.doe@email.com', '$2b$10$ymRAycGV5EegDAsSVLyrh.qa6Om2ahTPHRpVsHd7Lzmyz/XLza9MG', EMPTY_BLOB(), 15, 3, 7)
    INTO userprofile (userid, name, email, password, profilepicture, trailsHiked, experienceLevel, numberoffriends) VALUES
    (2, 'Jane Smith', 'jane.smith@email.com', '$2b$10$3Ist2BK.9IdeHLcw1uiA7eabIx7j4H0W/6T3QDZHsu06cN64sijje', EMPTY_BLOB(), 8, 2, 5)
    INTO userprofile (userid, name, email, password, profilepicture, trailsHiked, experienceLevel, numberoffriends) VALUES
    (3, 'Mike Johnson', 'mike.johnson@email.com', '$2b$10$/K9BkOSJB8PI4wj2IpM4HuKsXKwsSIfUeznS56Z4KvYqGi9jtKfMG', EMPTY_BLOB(), 25, 4, 12)
    INTO userprofile (userid, name, email, password, profilepicture, trailsHiked, experienceLevel, numberoffriends) VALUES
    (4, 'Emily Brown', 'emily.brown@email.com', '$2b$10$.42a6Cwng0dU.XnCpQAOousfZtYrgV167Z4.BxJvwVQQx0wPVOegm', EMPTY_BLOB(), 5, 1, 3)
    INTO userprofile (userid, name, email, password, profilepicture, trailsHiked, experienceLevel, numberoffriends) VALUES
    (5, 'David Lee', 'david.lee@email.com', '$2b$10$ZmHZlgWCjOTe69MHLgar/ejkZQIVaorvk2wo10MzkQhvyhPwrmLIq', EMPTY_BLOB(), 20, 3, 9)
SELECT * FROM DUAL;

INSERT ALL
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (1, 1, 'Hiking Boots', 'Merrell', 1, 2.5)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (2, 1, 'Backpack', 'Osprey', 1, 1.8)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (3, 2, 'Trekking Poles', 'Black Diamond', 2, 0.5)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (4, 3, 'Tent', 'REI', 1, 3.2)
    INTO equipment (equipmentid, userid, type, brand, amount, weight) VALUES
    (5, 4, 'Sleeping Bag', 'The North Face', 1, 1.5)
SELECT * FROM DUAL;

INSERT ALL
    INTO transportation (transportid, type, transportcost) VALUES
    (1, 'Car', 0.15)
    INTO transportation (transportid, type, transportcost) VALUES
    (2, 'Bus', 2.50)
    INTO transportation (transportid, type, transportcost) VALUES
    (3, 'Train', 5.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (4, 'Bicycle', 0.00)
    INTO transportation (transportid, type, transportcost) VALUES
    (5, 'Shuttle', 10.00)
SELECT * FROM DUAL;

INSERT ALL
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Mountain Outfitters', 'www.mountainoutfitters.com')
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Trail Blazer Gear', 'www.trailblazergear.com')
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Summit Supply Co.', 'www.summitsupply.com')
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Campsite Essentials', 'www.campsiteessentials.com')
    INTO retailer1 (retailername, retailerwebsite) VALUES
    ('Wilderness Comfort', 'www.wildernesscomfort.com')
SELECT * FROM DUAL;

INSERT ALL
    INTO retailer2 (retailerid, retailername) VALUES (1, 'Mountain Outfitters')
    INTO retailer2 (retailerid, retailername) VALUES (2, 'Trail Blazer Gear')
    INTO retailer2 (retailerid, retailername) VALUES (3, 'Summit Supply Co.')
    INTO retailer2 (retailerid, retailername) VALUES (4, 'Campsite Essentials')
    INTO retailer2 (retailerid, retailername) VALUES (5, 'Wilderness Comfort')
SELECT * FROM DUAL;

INSERT ALL
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Yosemite National Park', 37.865100, -119.538300, 'Sunny')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Rocky Mountain National Park', 40.342800, -105.683600, 'Partly Cloudy')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Grand Canyon National Park', 36.054400, -112.140100, 'Hot')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Yellowstone National Park', 44.428000, -110.588500, 'Rainy')
    INTO location (locationname, latitude, longitude, weather) VALUES
    ('Glacier National Park', 48.759600, -113.787000, 'Snowy')
SELECT * FROM DUAL;

INSERT ALL
    INTO trail (locationName, latitude, longitude, trailName, difficulty, timetocomplete, description, hazards) VALUES
    ('Yosemite National Park', 37.865100, -119.538300, 'Half Dome Trail', 5, INTERVAL '10:00:00' HOUR TO SECOND, 'Challenging hike with stunning views of Yosemite Valley', 'Steep cliffs, wildlife')
    INTO trail (locationName, latitude, longitude, trailName, difficulty, timetocomplete, description, hazards) VALUES
    ('Rocky Mountain National Park', 40.342800, -105.683600, 'Longs Peak Trail', 5, INTERVAL '12:00:00' HOUR TO SECOND, 'Difficult ascent to one of Colorados famous 14ers', 'Altitude sickness, lightning')
    INTO trail (locationName, latitude, longitude, trailName, difficulty, timetocomplete, description, hazards) VALUES
    ('Grand Canyon National Park', 36.054400, -112.140100, 'Bright Angel Trail', 4, INTERVAL '08:00:00' HOUR TO SECOND, 'Popular rim-to-river trail with rest houses along the way', 'Heat exhaustion, steep drop-offs')
    INTO trail (locationName, latitude, longitude, trailName, difficulty, timetocomplete, description, hazards) VALUES
    ('Yellowstone National Park', 44.428000, -110.588500, 'Lamar Valley Trail', 2, INTERVAL '03:00:00' HOUR TO SECOND, 'Easy trail known for wildlife viewing, especially wolves and bison', 'Wildlife encounters')
    INTO trail (locationName, latitude, longitude, trailName, difficulty, timetocomplete, description, hazards) VALUES
    ('Glacier National Park', 48.759600, -113.787000, 'Highline Trail', 3, INTERVAL '06:00:00' HOUR TO SECOND, 'Scenic trail along the Continental Divide with panoramic views', 'Narrow paths, grizzly bears')
SELECT * FROM DUAL;

INSERT ALL
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Hiking Boots', 'All-Terrain Hikers', 'Yosemite National Park', 37.865100, -119.538300, 'Half Dome Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Backpack', 'Mountaineer Pack', 'Rocky Mountain National Park', 40.342800, -105.683600, 'Longs Peak Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Trekking Poles', 'Ultralight Trekkers' , 'Grand Canyon National Park', 36.054400, -112.140100, 'Bright Angel Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Tent', 'Wilderness Shelter', 'Yellowstone National Park', 44.428000, -110.588500, 'Lamar Valley Trail')
    INTO gear (geartype, gearname, locationname, latitude, longitude, trailname) VALUES
    ('Sleeping Bag', 'Apine Dreamer', 'Glacier National Park', 48.759600, -113.787000, 'Highline Trail')
SELECT * FROM DUAL;

INSERT ALL
    INTO preview1 (previewid, image) VALUES
    (1, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (2, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (3, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (4, EMPTY_BLOB())
    INTO preview1 (previewid, image) VALUES
    (5, EMPTY_BLOB())
SELECT * FROM DUAL;

INSERT ALL
    INTO preview2 (locationName, latitude, longitude, trailname, previewid) VALUES
    ('Yosemite National Park', 37.865100, -119.538300, 'Half Dome Trail', 1)
    INTO preview2 (locationName, latitude, longitude, trailname, previewid) VALUES
    ('Rocky Mountain National Park', 40.342800, -105.683600, 'Longs Peak Trail', 2)
    INTO preview2 (locationName, latitude, longitude, trailname, previewid) VALUES
    ('Grand Canyon National Park', 36.054400, -112.140100, 'Bright Angel Trail', 3)
    INTO preview2 (locationName, latitude, longitude, trailname, previewid) VALUES
    ('Yellowstone National Park', 44.428000, -110.588500, 'Lamar Valley Trail', 4)
    INTO preview2 (locationName, latitude, longitude, trailname, previewid) VALUES
    ('Glacier National Park', 48.759600, -113.787000, 'Highline Trail', 5)
SELECT * FROM DUAL;

CREATE SEQUENCE user_id_seq
    START WITH 6
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;



COMMIT;