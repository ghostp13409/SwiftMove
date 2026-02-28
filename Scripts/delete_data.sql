DELETE FROM move_trips;

DELETE FROM move_offers;

DELETE FROM luggage_entries;

DELETE FROM move_requests;

DELETE FROM vehicles;

DELETE FROM driver_infos;

DELETE FROM users;

DELETE FROM addresses;

DELETE FROM vehicle_types;

DELETE FROM luggage_types;

-- ensure user IDs start back at 1 so our internally generated
-- references will match the auto-generated values
ALTER SEQUENCE users_id_seq RESTART WITH 1;
-- reset other sequences in case explicit IDs are used later
ALTER SEQUENCE driver_infos_id_seq RESTART WITH 1;

ALTER SEQUENCE vehicles_id_seq RESTART WITH 1;

ALTER SEQUENCE move_requests_id_seq RESTART WITH 1;

ALTER SEQUENCE move_offers_id_seq RESTART WITH 1;

ALTER SEQUENCE move_trips_id_seq RESTART WITH 1;
