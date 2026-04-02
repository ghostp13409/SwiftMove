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
('93869 Benson Mews Suite 371','','Collierchester','BC','Canada','C6C5B4',NULL,NULL),
('1133 Laura Road Suite 203','','Andreahaven','NT','Canada','N5K 3B2',NULL,NULL),
('0237 Ronnie Bypass','','North Kristy','NU','Canada','L1A 6G9',NULL,NULL),
('9922 Daniel Common','Suite 518','Mooreville','ON','Canada','B3R 2P1',NULL,NULL),
('005 Jack Walks Suite 518','','East Tracy','AB','Canada','B3M 5B1',NULL,NULL),
('56568 Ronald Harbor Suite 742','','New Anne','NU','Canada','N9B1K5',NULL,NULL),
('32429 Larson Hill','','East Bobby','YT','Canada','K1T 4R3',NULL,NULL),
('45782 Villarreal Corners','Apt. 430','Webertown','YT','Canada','T4P 4C8',NULL,NULL),
('3091 Robinson Shore','','Lopezchester','BC','Canada','X5X 1E6',NULL,NULL),
('90913 Amanda Hill Suite 757','Suite 716','Cristianhaven','ON','Canada','E6B4L3',NULL,NULL),
('3916 Jason Turnpike Suite 868','Suite 660','Mariastad','NT','Canada','G4C5S8',NULL,NULL),
('2894 Catherine Pine','','Johnsonburgh','NL','Canada','G8L6N9',NULL,NULL),
('7275 Marco Mountain Suite 729','','New Joseph','NT','Canada','B2C1V5',NULL,NULL),
('1034 Robinson Pass','','East Anthony','AB','Canada','C1G 6V2',NULL,NULL),
('883 Rachel Ferry Apt. 985','','East Christopher','NS','Canada','B9K5G9',NULL,NULL),
('7255 Yoder Street','','Adamfurt','NT','Canada','V4P 2H8',NULL,NULL),
('8834 Joseph Ports Apt. 408','','Lake Elizabethfort','MB','Canada','C9R 3P3',NULL,NULL),
('99892 James Throughway Apt. 806','','Olsonmouth','SK','Canada','A2E2L8',NULL,NULL),
('493 Nichols Port','','Jeremystad','AB','Canada','X2K7Y3',NULL,NULL),
('0738 Morales Circles','','Jessicastad','NS','Canada','P3G 7S4',NULL,NULL),
('08790 Kyle Circles Suite 467','','New Darren','NT','Canada','Y8Y 8X2',NULL,NULL),
('155 Kirk Trace Apt. 845','','West Jakeshire','PE','Canada','S4K 3R1',NULL,NULL),
('62695 Victoria Cape Apt. 906','','West Charles','MB','Canada','B9V1N1',NULL,NULL),
('050 Jonathan Villages Suite 384','','Port Ronaldchester','PE','Canada','M1L8H3',NULL,NULL),
('20354 Luna Oval','','Markchester','MB','Canada','B1T 5A4',NULL,NULL),
('57877 Pratt Squares Suite 086','','Saundersport','BC','Canada','R3K9H1',NULL,NULL),
('9874 Rodriguez Causeway Apt. 452','Apt. 480','Ellisburgh','MB','Canada','X3G 3E4',NULL,NULL),
('0837 Ronald Wall','','West Michael','QC','Canada','V6E5H6',NULL,NULL);

INSERT INTO users (username, password_hash, f_name, l_name, email, dob, rating, role, address_id) VALUES
('test','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Test','Admin','test@admin.com','1990-01-01',NULL,'ADMIN',1),
('driver','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','John','Driver','driver@swiftmove.com','1985-06-15',4.5,'DRIVER',2),
('client','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Jane','Client','client@swiftmove.com','1992-03-22',4.8,'CLIENT',3),
('test_driver','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Dave','Professional','dave@swiftmove.com','1988-11-05',5.0,'DRIVER',4),
('sguerrero','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','James','Morales','apriljames@example.com','1998-08-09',4.5,'DRIVER',12),
('lori75','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Vicki','Brown','costajacob@example.com','2005-07-11',4.0,'CLIENT',12),
('iortiz','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Jasmine','Perkins','mariahrice@example.org','1976-03-31',4.9,'CLIENT',10),
('deborahjacobs','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Lisa','Cooper','monica80@example.org','1996-12-12',3.7,'CLIENT',19),
('imendoza','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Phillip','Duncan','iwood@example.org','1973-11-19',4.5,'CLIENT',9),
('belindahowe','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Tammy','Nunez','morgan68@example.org','1963-03-15',NULL,'DRIVER',16),
('linda76','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Amber','Rowland','prichards@example.org','2003-11-16',3.5,'CLIENT',16),
('erica76','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Andrea','Atkins','tinaberry@example.net','1999-10-15',3.9,'DRIVER',16),
('isaacfuller','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Heather','Stone','bblackwell@example.com','1996-03-16',NULL,'DRIVER',6),
('blopez','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Dana','Perry','nbrown@example.com','2006-04-02',4.6,'DRIVER',18),
('mmontgomery','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Adriana','Lang','shanegallagher@example.org','1962-04-14',4.4,'CLIENT',19),
('millersuzanne','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Paige','Wagner','lisawashington@example.org','1972-08-02',3.9,'CLIENT',18),
('pwright','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Maria','Davis','laura73@example.org','1967-03-17',3.5,'CLIENT',2),
('richardmatthews','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Lindsey','Rogers','carolynhoover@example.com','1988-10-13',4.7,'CLIENT',12),
('wcontreras','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Jessica','Newton','fpalmer@example.net','1958-02-07',4.1,'DRIVER',9),
('brittany72','$2b$12$70WSC.S5aqhENgFddmAWdeE1CqVEzgRLbsx7/oj71g12TneuK7Usy','Mary','Bennett','ashley29@example.org','1962-08-12',3.6,'DRIVER',9);

INSERT INTO driver_infos (driving_experience, range, driving_license, user_id, current_latitude, current_longitude) VALUES
(10,500,'kS335916',2,43.4723,-80.5449),
(4,500,'Yr050182',4,43.4516,-80.4925),
(2,298,'Kj949839',5,43.3917,-80.4031),
(2,133,'sL279528',10,NULL,NULL),
(10,187,'Py409066',12,NULL,NULL),
(15,61,'xF955438',13,43.4501,-80.4895),
(2,130,'ir214150',14,NULL,NULL),
(3,255,'FI700661',19,43.4604,-80.5401),
(6,217,'bO544721',20,43.4604,-80.5401);

INSERT INTO vehicles (model, make, year, color, price_per_km, is_active, can_carry_furniture, driver_id, vehicle_type_id) VALUES
('Transit','Ford',2023,'White',10,true,true,1,5),
('Transit','Ford',2023,'White',10,true,true,2,5),
('Accent','Honda','2019','AliceBlue',11,true,true,3,5),
('Suburban 3500HD','Ford','2002','MediumPurple',8,true,true,4,5),
('CLA-Class','Acura','2014','LightGreen',7,true,true,5,5),
('A6','Toyota','2019','Lime',11,true,true,6,5),
('Kizashi','Dodge','1998','Snow',15,true,true,7,5),
('Elantra','Jeep','2009','NavajoWhite',15,true,true,8,5),
('Topaz','Toyota','2019','Red',8,true,true,9,5);

INSERT INTO move_requests (move_date, max_budget, client_id, from_address_id, to_address_id, distance, from_latitude, from_longitude, to_latitude, to_longitude, status, has_furniture, note) VALUES
('2026-04-08 19:49:07',114,3,7,3,7.02,43.4632,-80.5201,43.4643,-80.5204,'CREATED',true,'Demo request 1'),
('2026-04-25 19:49:07',169,7,3,8,13.13,43.4643,-80.5204,43.4521,-80.4912,'CREATED',true,'Demo request 2'),
('2026-04-27 19:49:07',225,18,2,8,6.83,43.4723,-80.5449,43.4521,-80.4912,'CREATED',false,'Demo request 3'),
('2026-04-05 19:49:07',393,3,6,12,7.35,43.4501,-80.4895,43.3917,-80.4031,'CREATED',true,'Demo request 4');

INSERT INTO luggage_entries (quantity, move_request_id, luggage_type_id) VALUES
(4,1,1),
(5,1,2),
(5,2,5),
(4,2,3),
(3,2,3),
(2,2,4),
(3,3,5),
(4,3,5),
(2,3,2),
(4,4,2),
(4,4,4);

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
