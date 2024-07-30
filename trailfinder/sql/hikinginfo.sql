drop table userprofile; 
drop table equipment; 



cut
CREATE TABLE userprofile
  (UserID  INTEGER,
  Name varchar(50), 
  Email varchar(320), 
  ProfilePicture BLOB,
  TrailsHiked		INTEGER		DEFAULT 0,
  ExperienceLvl	INTEGER		DEFAULT 0,
  NumberOfFriends INTEGER DEFAULT 0,
  PRIMARY KEY (UserID));cut

grant select on userprofile to public;

cut
CREATE TABLE equipment
  (EquipmentID INTEGER,
  UserID INTEGER, 
  Type varchar(50), 
  Brand varchar(50), 
  Amount INTEGER, 
  Weight FLOAT, 
  PRIMARY KEY (EquipmentID), 
  FOREIGN KEY (UserID) references userprofile);cut

grant select on equipment to public; 



