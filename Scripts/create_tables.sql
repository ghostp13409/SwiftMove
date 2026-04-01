-- Create ENUM types if needed (assuming values based on context)
-- Note: Adjust enum values as per actual requirements

-- Drop all if exist

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS move_trips CASCADE;

DROP TABLE IF EXISTS move_offers CASCADE;

DROP TABLE IF EXISTS luggage_entries CASCADE;

DROP TABLE IF EXISTS move_requests CASCADE;

DROP TABLE IF EXISTS vehicles CASCADE;

DROP TABLE IF EXISTS driver_infos CASCADE;

DROP TABLE IF EXISTS users CASCADE;

DROP TABLE IF EXISTS luggage_types CASCADE;

DROP TABLE IF EXISTS vehicle_types CASCADE;

DROP TABLE IF EXISTS addresses CASCADE;

-- Drop ENUM types
DROP TYPE IF EXISTS move_status_enum CASCADE;

DROP TYPE IF EXISTS luggage_type_enum CASCADE;

DROP TYPE IF EXISTS vehicle_type_enum CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;

-- TYPES

-- Create
CREATE TYPE user_role AS ENUM ('CLIENT', 'DRIVER', 'ADMIN');

CREATE TYPE vehicle_type_enum AS ENUM ('SEDAN', 'SUV', 'HATCHBACK', 'MINIVAN', 'VAN', 'TRUCK');

CREATE TYPE luggage_type_enum AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE', 'EXTRA_EXTRA_LARGE');

CREATE TYPE move_status_enum AS ENUM ('CREATED', 'OFFER_SENT', 'OFFER_AVAILABLE', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'SCHEDULED', 'IN_PROGRESS', 'DRIVER_COMPLETED', 'COMPLETED_BY_DRIVER', 'COMPLETED', 'PENDING', 'CONFIRMED', 'PAYMENT_COMPLETED', 'PAYMENT_PENDING', 'REFUNDED');

-- Create tables

CREATE TABLE addresses (
    id BIGSERIAL PRIMARY KEY,
    line1 VARCHAR(255),
    line2 VARCHAR(255),
    city VARCHAR(100),
    state_or_province VARCHAR(100),
    country VARCHAR(100),
    postal_or_zip_code VARCHAR(20),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_types (
    id BIGSERIAL PRIMARY KEY,
    type vehicle_type_enum NOT NULL,
    max_weight REAL,
    capacity REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE luggage_types (
    id BIGSERIAL PRIMARY KEY,
    type luggage_type_enum NOT NULL,
    name VARCHAR(100),
    volume REAL,
    weight REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    f_name VARCHAR(100) NOT NULL,
    l_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    dob DATE,
    rating REAL,
    role user_role NOT NULL,
    address_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES addresses (id)
);

CREATE TABLE driver_infos (
    id BIGSERIAL PRIMARY KEY,
    driving_experience INTEGER,
    range REAL,
    driving_license VARCHAR(50),
    user_id BIGINT NOT NULL,
    current_latitude DOUBLE PRECISION,
    current_longitude DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    model VARCHAR(100),
    make VARCHAR(100),
    year INTEGER,
    color VARCHAR(50),
    price_per_km BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    can_carry_furniture BOOLEAN DEFAULT FALSE,
    driver_id BIGINT NOT NULL,
    vehicle_type_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES driver_infos (id),
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types (id)
);

CREATE TABLE move_requests (
    id BIGSERIAL PRIMARY KEY,
    move_date TIMESTAMP,
    max_budget BIGINT,
    client_id BIGINT NOT NULL,
    from_address_id BIGINT NOT NULL,
    to_address_id BIGINT NOT NULL,
    distance DOUBLE PRECISION,
    from_latitude DOUBLE PRECISION,
    from_longitude DOUBLE PRECISION,
    to_latitude DOUBLE PRECISION,
    to_longitude DOUBLE PRECISION,
    status move_status_enum NOT NULL,
    has_furniture BOOLEAN DEFAULT FALSE,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users (id),
    FOREIGN KEY (from_address_id) REFERENCES addresses (id),
    FOREIGN KEY (to_address_id) REFERENCES addresses (id)
);

CREATE TABLE luggage_entries (
    id BIGSERIAL PRIMARY KEY,
    quantity INTEGER,
    move_request_id BIGINT NOT NULL,
    luggage_type_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (move_request_id) REFERENCES move_requests (id),
    FOREIGN KEY (luggage_type_id) REFERENCES luggage_types (id)
);

CREATE TABLE move_offers (
    id BIGSERIAL PRIMARY KEY,
    price BIGINT,
    offered_date TIMESTAMP,
    move_request_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    status move_status_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (move_request_id) REFERENCES move_requests (id),
    FOREIGN KEY (driver_id) REFERENCES users (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);

CREATE TABLE move_trips (
    id BIGSERIAL PRIMARY KEY,
    move_request_id BIGINT NOT NULL,
    move_offer_id BIGINT NOT NULL,
    status move_status_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (move_request_id) REFERENCES move_requests (id),
    FOREIGN KEY (move_offer_id) REFERENCES move_offers (id)
);
