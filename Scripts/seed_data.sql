TRUNCATE TABLE move_trips, move_offers, luggage_entries, move_requests, vehicles, driver_infos, users, addresses, luggage_types, vehicle_types RESTART IDENTITY CASCADE;

INSERT INTO vehicle_types (type, max_weight, capacity) VALUES
('SEDAN',340,67),('SUV',589,120),('HATCHBACK',362,50),('MINIVAN',544,140),('VAN',1088,294),('TRUCK',589,70);

INSERT INTO luggage_types (type, name, volume, weight) VALUES
('SMALL','Small Box',1,6),('MEDIUM','Medium Box',2,9),('LARGE','Large Box',3,13),('EXTRA_LARGE','Extra Large Box',3,22),('EXTRA_EXTRA_LARGE','Extra Extra Large Box',5,27);

INSERT INTO addresses (line1, line2, city, state_or_province, country, postal_or_zip_code, latitude, longitude) VALUES
('75 University Ave W','','Waterloo','ON','Canada','N2L 3C5',43.4738,-80.5275),
('200 University Ave W','','Waterloo','ON','Canada','N2L 3G1',43.4723,-80.5449),
('100 Regina St S','','Waterloo','ON','Canada','N2J 4A8',43.4643,-80.5204),
('200 King St W','','Kitchener','ON','Canada','N2G 4G7',43.4516,-80.4925),
('51 Breithaupt St','','Kitchener','ON','Canada','N2H 5G5',43.4529,-80.4876),
('10 King St W','','Kitchener','ON','Canada','N2G 1A3',43.4501,-80.4895),
('25 Regina St S','','Waterloo','ON','Canada','N2J 1R8',43.4632,-80.5201),
('43 Weber St W','','Kitchener','ON','Canada','N2H 3Z1',43.4521,-80.4912),
('50 Westmount Rd N','','Waterloo','ON','Canada','N2L 2R5',43.4604,-80.5401),
('80 King St S','','Waterloo','ON','Canada','N2J 1P5',43.4612,-80.5198),
('150 Main St','','Cambridge','ON','Canada','N1R 6P5',43.3595,-80.313),
('299 Doon Valley Dr','','Kitchener','ON','Canada','N2G 4M4',43.3917,-80.4031),
('909 Joseph Tunnel','','Yangberg','SK','Canada','J7K 6N7',NULL,NULL),
('46965 David Squares Suite 237','Apt. 267','Billyport','BC','Canada','Y4P7C4',NULL,NULL),
('780 Mike Corners','','South Angela','YT','Canada','Y3M3Y5',NULL,NULL),
('16902 Hector Place Apt. 168','','Laurabury','BC','Canada','J7J 9X3',NULL,NULL),
('9157 Huang Harbors Apt. 970','','Cooleyton','NB','Canada','T2A6R5',NULL,NULL),
('3039 Stevenson Forest','Apt. 828','East Patrick','NU','Canada','V9X 2B6',NULL,NULL),
('7316 Kimberly Loop Apt. 267','','East Brooke','ON','Canada','X9V4V2',NULL,NULL),
('188 Jessica Lodge','Apt. 116','Tamaramouth','BC','Canada','T9B 7T9',NULL,NULL),
('752 Austin Lodge Apt. 138','','Lake Brett','NT','Canada','S2J 2V6',NULL,NULL),
('60326 Johnson Extensions Apt. 419','','Port Benjamin','NT','Canada','R6C5S2',NULL,NULL),
('390 Jones Orchard Apt. 487','','West Dawnville','ON','Canada','V1E 1M4',NULL,NULL),
('35071 Sergio Island','Apt. 504','New Ronaldhaven','NS','Canada','G3L 3T1',NULL,NULL),
('7901 Douglas Shores','','Grantmouth','AB','Canada','M3Y 4X6',NULL,NULL),
('850 Danielle Brooks Apt. 554','Apt. 494','Sylviaborough','NU','Canada','E8X 8H9',NULL,NULL),
('94015 Bailey Garden Suite 677','','West Brian','NU','Canada','L9T 9B3',NULL,NULL),
('114 Calvin Courts','','Davischester','NS','Canada','T7L 4J9',NULL,NULL),
('541 Charles Trail Apt. 782','Apt. 054','Halestad','YT','Canada','Y1M7P2',NULL,NULL),
('3798 Cameron Mall Suite 871','','South Rachelton','QC','Canada','G1P 4C4',NULL,NULL),
('4917 Charles Place Apt. 658','','East Leonardbury','NB','Canada','P6K8T6',NULL,NULL),
('426 Steven Road Suite 648','','Kennethfurt','AB','Canada','J5E3E2',NULL,NULL),
('26503 Margaret Street Suite 679','','Carrieville','BC','Canada','R6G2C7',NULL,NULL),
('1283 Wall Roads','','Mendezstad','SK','Canada','B2R 5L5',NULL,NULL),
('4399 Adam Roads','','West Wayne','BC','Canada','A1B6L7',NULL,NULL),
('933 Melissa Dale','','North Caitlyn','NB','Canada','B3H4E3',NULL,NULL),
('4948 Faith Lock','','New Markchester','NB','Canada','J1S 5S2',NULL,NULL),
('75206 George Mountains Apt. 216','Suite 796','Karenberg','PE','Canada','A4J 7M4',NULL,NULL),
('0463 Alexandria Lodge Apt. 638','','Angelahaven','SK','Canada','A3Y 6V4',NULL,NULL),
('7263 Jacob Passage','Apt. 125','New Thomas','AB','Canada','G1R6P1',NULL,NULL);

INSERT INTO users (username, password_hash, f_name, l_name, email, dob, rating, role, address_id) VALUES
('test','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Test','Admin','test@admin.com','1990-01-01',NULL,'ADMIN',1),
('driver','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','John','Driver','driver@swiftmove.com','1985-06-15',4.5,'DRIVER',2),
('client','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Jane','Client','client@swiftmove.com','1992-03-22',4.8,'CLIENT',3),
('test_driver','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Dave','Professional','dave@swiftmove.com','1988-11-05',5.0,'DRIVER',4),
('crhodes','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Dean','Jordan','elizabethellison@example.com','1972-01-14',NULL,'CLIENT',20),
('jeromefuller','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Tonya','Thornton','rebeccawatson@example.net','1958-04-12',3.8,'CLIENT',14),
('kmoreno','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Carrie','Davis','fmccormick@example.net','2001-01-27',4.6,'DRIVER',2),
('dbaker','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Tammy','Harris','shannonperez@example.org','2007-04-24',4.5,'DRIVER',1),
('nathanieltodd','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Kevin','Hahn','rickygoodman@example.org','1959-07-21',4.0,'CLIENT',19),
('reneemiller','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Nicole','Gonzalez','marksmichelle@example.org','1989-11-19',4.7,'DRIVER',19),
('danielsimmons','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Toni','Butler','nalvarado@example.org','1966-04-06',4.9,'DRIVER',18),
('harrismichael','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Kathy','Sanchez','wandabowers@example.com','2006-02-28',4.4,'DRIVER',2),
('othompson','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Joseph','Davidson','erik23@example.com','1993-03-28',3.5,'CLIENT',3),
('donna93','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Sara','Johnson','careywilliam@example.net','1958-10-11',4.9,'DRIVER',3),
('carmen13','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Melissa','Cannon','johnathansantiago@example.org','1963-10-06',3.7,'DRIVER',4),
('travisrivera','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Paula','Solomon','marcus88@example.org','1991-09-26',NULL,'DRIVER',13),
('martin06','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Kristen','Christensen','zacharysimpson@example.net','1992-04-09',4.5,'CLIENT',12),
('beaton','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Franklin','Watson','thomaswhite@example.org','2004-07-23',3.6,'CLIENT',10),
('pricebrandon','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Wayne','Buck','cherylsanchez@example.net','1973-06-21',3.9,'DRIVER',9),
('amanda27','$2b$12$Vv.BowHizetOswsoB.heU.eNkkVl.nmnJREgOhahugYKD1GJoB.4q','Jason','Parsons','victoria22@example.com','1989-10-06',4.8,'DRIVER',12);

INSERT INTO driver_infos (driving_experience, range, driving_license, user_id, current_latitude, current_longitude) VALUES
(14,500,'NB490735',2,43.4723,-80.5449),
(10,500,'ne973717',4,43.4516,-80.4925),
(11,110,'Af026232',7,43.4723,-80.5449),
(5,56,'Op930375',8,43.4738,-80.5275),
(4,169,'MK093918',10,NULL,NULL),
(6,170,'xU758772',11,NULL,NULL),
(8,207,'aC906607',12,43.4723,-80.5449),
(3,299,'tO505267',14,43.4643,-80.5204),
(2,73,'Mj374713',15,43.4516,-80.4925),
(7,262,'ZT894134',16,NULL,NULL),
(15,260,'Wb844142',19,43.4604,-80.5401),
(9,145,'Iw675078',20,43.3917,-80.4031);

INSERT INTO vehicles (model, make, year, color, price_per_km, is_active, can_carry_furniture, driver_id, vehicle_type_id) VALUES
('Transit','Ford',2023,'White',10,true,true,1,5),
('Transit','Ford',2023,'White',10,true,true,2,5),
('T100 Xtracab','Lexus','2012','LemonChiffon',9,true,true,3,5),
('E-Class','Cadillac','2015','Wheat',14,true,true,4,5),
('F150 SuperCrew Cab','GMC','2019','Yellow',12,true,true,5,5),
('Quattroporte','Buick','2003','Cornsilk',11,true,true,6,5),
('ELR','Honda','2017','Sienna',13,true,true,7,5),
('Ram 1500 Quad Cab','Chevrolet','1994','Purple',15,true,true,8,5),
('XC70','Chevrolet','2007','DarkOliveGreen',8,true,true,9,5),
('Ram Wagon B250','Audi','2007','Violet',10,true,true,10,5),
('Forester','Ram','2007','Linen',5,true,true,11,5),
('Express 3500 Cargo','Ford','1993','DeepSkyBlue',6,true,true,12,5);

INSERT INTO move_requests (move_date, max_budget, client_id, from_address_id, to_address_id, distance, from_latitude, from_longitude, to_latitude, to_longitude, status, has_furniture, note) VALUES
('2026-04-20 15:37:33',236,6,3,4,8.39,43.4643,-80.5204,43.4516,-80.4925,'CREATED',false,'Demo request 1'),
('2026-05-03 15:37:33',497,9,12,3,22.43,43.3917,-80.4031,43.4643,-80.5204,'CREATED',true,'Demo request 2'),
('2026-05-09 15:37:33',266,3,9,5,6.53,43.4604,-80.5401,43.4529,-80.4876,'CREATED',false,'Demo request 3'),
('2026-05-08 15:37:33',196,6,7,1,15.94,43.4632,-80.5201,43.4738,-80.5275,'CREATED',true,'Demo request 4');

INSERT INTO luggage_entries (quantity, move_request_id, luggage_type_id) VALUES
(5,1,5),
(3,1,2),
(2,1,1),
(1,1,2),
(1,2,5),
(1,2,1),
(4,2,4),
(1,2,1),
(3,3,2),
(2,3,2),
(2,3,4),
(4,4,3),
(1,4,4),
(2,4,2),
(1,4,1);

-- Sync sequences
SELECT setval(pg_get_serial_sequence('addresses', 'id'), COALESCE((SELECT MAX(id) FROM addresses), 0) + 1);
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 0) + 1);
SELECT setval(pg_get_serial_sequence('driver_infos', 'id'), COALESCE((SELECT MAX(id) FROM driver_infos), 0) + 1);
SELECT setval(pg_get_serial_sequence('vehicles', 'id'), COALESCE((SELECT MAX(id) FROM vehicles), 0) + 1);
SELECT setval(pg_get_serial_sequence('move_requests', 'id'), COALESCE((SELECT MAX(id) FROM move_requests), 0) + 1);
SELECT setval(pg_get_serial_sequence('luggage_entries', 'id'), COALESCE((SELECT MAX(id) FROM luggage_entries), 0) + 1);
SELECT setval(pg_get_serial_sequence('vehicle_types', 'id'), COALESCE((SELECT MAX(id) FROM vehicle_types), 0) + 1);
SELECT setval(pg_get_serial_sequence('luggage_types', 'id'), COALESCE((SELECT MAX(id) FROM luggage_types), 0) + 1);
SELECT setval(pg_get_serial_sequence('move_offers', 'id'), COALESCE((SELECT MAX(id) FROM move_offers), 0) + 1);
SELECT setval(pg_get_serial_sequence('move_trips', 'id'), COALESCE((SELECT MAX(id) FROM move_trips), 0) + 1);
