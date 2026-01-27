-- Create ENUM types if needed (assuming values based on context)
-- Note: Adjust enum values as per actual requirements

CREATE TYPE user_role AS ENUM ('CLIENT', 'DRIVER', 'ADMIN');

CREATE TYPE vehicle_type_enum AS ENUM ('SEDAN', 'SUV', 'HACHBACKS', 'MINIVAN', 'VAN', 'TRUCK');

CREATE TYPE luggage_type_enum AS ENUM ('SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE', 'EXTRA_EXTRA_LARGE');

CREATE TYPE move_status_enum AS ENUM ('CREATED', 'OFFER_SENT', 'OFFER_AVAILABLE', 'PENDING', 'CONFIRMED', 'PAYMENT_COMPLETED', 'IS_IN_TRANSIT', 'COMPLETED', 'CANCELLED', 'REFUNDED');

-- Create tables

CREATE TABLE address (
    id BIGINT PRIMARY KEY,
    line1 VARCHAR(255),
    line2 VARCHAR(255),
    city VARCHAR(100),
    state_or_province VARCHAR(100),
    country VARCHAR(100),
    postal_or_zip_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_type (
    id BIGINT PRIMARY KEY,
    type vehicle_type_enum NOT NULL,
    max_weight REAL,
    capacity REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE luggage_type (
    id BIGINT PRIMARY KEY,
    type luggage_type_enum NOT NULL,
    name VARCHAR(100),
    volume REAL,
    weight REAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "user" (
    id BIGINT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    f_name VARCHAR(100),
    l_name VARCHAR(100),
    dob DATE,
    rating REAL,
    role user_role NOT NULL,
    address_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES address (id)
);

CREATE TABLE driver_info (
    id BIGINT PRIMARY KEY,
    driving_experience INTEGER,
    range REAL,
    driving_license VARCHAR(50),
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "user" (id)
);

CREATE TABLE vehicle (
    id BIGINT PRIMARY KEY,
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
    FOREIGN KEY (driver_id) REFERENCES "user" (id),
    FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_type (id)
);

CREATE TABLE move_request (
    id BIGINT PRIMARY KEY,
    move_date TIMESTAMP,
    max_budget BIGINT,
    client_id BIGINT NOT NULL,
    from_address_id BIGINT NOT NULL,
    to_address_id BIGINT NOT NULL,
    status move_status_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES "user" (id),
    FOREIGN KEY (from_address_id) REFERENCES address (id),
    FOREIGN KEY (to_address_id) REFERENCES address (id)
);

CREATE TABLE luggage_entry (
    id BIGINT PRIMARY KEY,
    quantity INTEGER,
    move_request_id BIGINT NOT NULL,
    luggage_type_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (move_request_id) REFERENCES move_request (id),
    FOREIGN KEY (luggage_type_id) REFERENCES luggage_type (id)
);

CREATE TABLE move_offer (
    id BIGINT PRIMARY KEY,
    price BIGINT,
    offered_date TIMESTAMP,
    move_request_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    status move_status_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (move_request_id) REFERENCES move_request (id),
    FOREIGN KEY (driver_id) REFERENCES "user" (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicle (id)
);

CREATE TABLE move_trip (
    id BIGINT PRIMARY KEY,
    move_request_id BIGINT NOT NULL,
    move_offer_id BIGINT NOT NULL,
    status move_status_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (move_request_id) REFERENCES move_request (id),
    FOREIGN KEY (move_offer_id) REFERENCES move_offer (id)
);