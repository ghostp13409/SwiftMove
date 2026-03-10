import faker
from faker import Faker
from faker_vehicle import VehicleProvider
import bcrypt
import os

fake = Faker()
fake.add_provider(VehicleProvider)

# Real-ish addresses for geocoding friendliness
real_addresses = [
    {"line1": "1600 Amphitheatre Parkway", "city": "Mountain View", "state": "CA", "zip": "94043", "country": "USA", "lat": 37.422, "lon": -122.084},
    {"line1": "1 Infinite Loop", "city": "Cupertino", "state": "CA", "zip": "95014", "country": "USA", "lat": 37.331, "lon": -122.031},
    {"line1": "350 5th Ave", "city": "New York", "state": "NY", "zip": "10118", "country": "USA", "lat": 40.748, "lon": -73.985},
    {"line1": "233 S Wacker Dr", "city": "Chicago", "state": "IL", "zip": "60606", "country": "USA", "lat": 41.878, "lon": -87.635},
    {"line1": "100 Universal City Plaza", "city": "Universal City", "state": "CA", "zip": "91608", "country": "USA", "lat": 34.138, "lon": -118.353},
    {"line1": "2000 Post St", "city": "San Francisco", "state": "CA", "zip": "94115", "country": "USA", "lat": 37.785, "lon": -122.432},
    {"line1": "1060 West Addison Street", "city": "Chicago", "state": "IL", "zip": "60613", "country": "USA", "lat": 41.948, "lon": -87.655},
    {"line1": "700 Boylston St", "city": "Boston", "state": "MA", "zip": "02116", "country": "USA", "lat": 42.349, "lon": -71.078},
    {"line1": "1111 S Figueroa St", "city": "Los Angeles", "state": "CA", "zip": "90015", "country": "USA", "lat": 34.043, "lon": -118.267},
    {"line1": "600 E Grand Ave", "city": "Chicago", "state": "IL", "zip": "60611", "country": "USA", "lat": 41.891, "lon": -87.609}
]

# Generate addresses
addresses = []
for i in range(1, 201):
    if i <= len(real_addresses):
        ra = real_addresses[i-1]
        addr = {
            'id': i,
            'line1': ra['line1'],
            'line2': '',
            'city': ra['city'],
            'state_or_province': ra['state'],
            'country': ra['country'],
            'postal_or_zip_code': ra['zip'],
            'lat': ra['lat'],
            'lon': ra['lon']
        }
    else:
        # Use more realistic faker data
        addr = {
            'id': i,
            'line1': fake.street_address(),
            'line2': fake.secondary_address() if fake.boolean(chance_of_getting_true=20) else '',
            'city': fake.city(),
            'state_or_province': fake.state_abbr(),
            'country': 'USA',
            'postal_or_zip_code': fake.zipcode(),
            'lat': None,
            'lon': None
        }
    addresses.append(addr)

# Specific Test Driver in Waterloo
waterloo_address = {
    'id': 201,
    'line1': '75 University Ave W',
    'line2': '',
    'city': 'Waterloo',
    'state_or_province': 'ON',
    'country': 'Canada',
    'postal_or_zip_code': 'N2L 3C5',
    'lat': 43.4723,
    'lon': -80.5449
}
addresses.append(waterloo_address)

# Generate users
users = []
roles = ['CLIENT', 'DRIVER', 'ADMIN']
for i in range(1, 81):
    role = fake.random_element(roles)
    pwd_hash = bcrypt.hashpw(b"test", bcrypt.gensalt()).decode('utf-8')
    user = {
        'id': i,
        'username': fake.user_name(),
        'password_hash': pwd_hash,
        'f_name': fake.first_name(),
        'l_name': fake.last_name(),
        'email': fake.email(),
        'dob': fake.date_of_birth(minimum_age=18, maximum_age=80),
        'rating': round(fake.random.uniform(1, 5), 1) if fake.boolean(chance_of_getting_true=70) else None,
        'role': role,
        'address_id': fake.random_int(1, 200)
    }
    users.append(user)

# Add Manual Entries
pwd_hash_test = bcrypt.hashpw(b"test", bcrypt.gensalt()).decode('utf-8')
admin_user = {'id': 81, 'username': 'admin', 'password_hash': pwd_hash_test, 'f_name': 'Test', 'l_name': 'Admin', 'email': 'test@admin.com', 'dob': '1990-01-01', 'rating': None, 'role': 'ADMIN', 'address_id': 1}
driver_user = {'id': 82, 'username': 'driver', 'password_hash': pwd_hash_test, 'f_name': 'Test', 'l_name': 'Driver', 'email': 'test@driver.com', 'dob': '1990-01-01', 'rating': 4.5, 'role': 'DRIVER', 'address_id': 2}
client_user = {'id': 83, 'username': 'client', 'password_hash': pwd_hash_test, 'f_name': 'Test', 'l_name': 'Client', 'email': 'test@client.com', 'dob': '1990-01-01', 'rating': 4.8, 'role': 'CLIENT', 'address_id': 3}

test_driver_user = {
    'id': 84,
    'username': 'test_driver',
    'password_hash': pwd_hash_test,
    'f_name': 'test',
    'l_name': 'driver',
    'email': 'testdriver@move.com',
    'dob': '1995-05-05',
    'rating': 5.0,
    'role': 'DRIVER',
    'address_id': 201
}
users.extend([admin_user, driver_user, client_user, test_driver_user])

# Driver infos
drivers = [u for u in users if u['role'] == 'DRIVER']
driver_infos = []
for idx, d in enumerate(drivers, 1):
    drange = 500 if d['username'] == 'test_driver' else fake.random_int(50, 500)
    # Get lat/lon from address
    addr = next((a for a in addresses if a['id'] == d['address_id']), None)
    di = {
        'id': idx,
        'driving_experience': fake.random_int(1, 20),
        'range': drange,
        'driving_license': fake.bothify(text='??######'),
        'user_id': d['id'],
        'lat': addr['lat'] if addr else None,
        'lon': addr['lon'] if addr else None
    }
    driver_infos.append(di)

# Vehicles
vehicles = []
vid = 1
for d in driver_infos:
    num_veh = 1 if users[d['user_id']-1]['username'] == 'test_driver' else fake.random_int(1, 2)
    for _ in range(num_veh):
        is_test_driver = users[d['user_id']-1]['username'] == 'test_driver'
        # use faker's vehicle provider for realistic makes/models
        vehicle_make = 'Mercedes' if is_test_driver else fake.vehicle_make()
        vehicle_model = 'Sprinter' if is_test_driver else fake.vehicle_model()
        veh = {
            'id': vid,
            'model': vehicle_model,
            'make': vehicle_make,
            'year': 2022 if is_test_driver else fake.vehicle_year(),
            'color': 'White' if is_test_driver else fake.color_name(),
            'price_per_km': 5 if is_test_driver else fake.random_int(2, 20),
            'is_active': True,
            'can_carry_furniture': True if is_test_driver else fake.boolean(),
            'driver_id': d['id'],
            'vehicle_type_id': 5 if is_test_driver else fake.random_int(1, 6)
        }
        vehicles.append(veh)
        vid += 1

# Move requests, Luggage entries, Move offers, Move trips are commented out
move_requests = []
luggage_entries = []
move_offers = []
move_trips = []

# Write to SQL file
script_dir = os.path.dirname(os.path.abspath(__file__))
output_file = os.path.join(script_dir, 'seed_data.sql')

with open(output_file, 'w') as f:
    f.write("-- Seed data generated by seed_data.py\n\n")
    f.write("TRUNCATE TABLE move_trips, move_offers, luggage_entries, move_requests, vehicles, driver_infos, users, addresses, luggage_types, vehicle_types RESTART IDENTITY CASCADE;\n\n")

    # Vehicle types
    f.write("INSERT INTO vehicle_types (type, max_weight, capacity) VALUES\n")
    vt_values = [
        "('SEDAN', 340.19, 67.08)",
        "('SUV', 589.6, 120)",
        "('HATCHBACK', 362.8, 50.50)",
        "('MINIVAN', 544.31, 140.61)",
        "('VAN', 1088.62, 294.4)",
        "('TRUCK', 589.67, 70.0)"
    ]
    f.write(",\n".join(vt_values) + ";\n\n")

    # Luggage types
    f.write("INSERT INTO luggage_types (type, name, volume, weight) VALUES\n")
    lt_values = [
        "('SMALL', 'Small Box', 1.38, 6.80)",
        "('MEDIUM', 'Medium Box', 2.99, 9.07)",
        "('LARGE', 'Large Box', 3.40, 13.60)",
        "('EXTRA_LARGE', 'Extra Large Box', 3.75, 22.67)",
        "('EXTRA_EXTRA_LARGE', 'Extra Extra Large Box', 5.83, 27.0)"
    ]
    f.write(",\n".join(lt_values) + ";\n\n")

    # Addresses
    f.write("INSERT INTO addresses (id, line1, line2, city, state_or_province, country, postal_or_zip_code, latitude, longitude) VALUES\n")
    addr_values = []
    for a in addresses:
        line2 = f"'{a['line2']}'" if a['line2'] else 'NULL'
        lat = str(a['lat']) if a['lat'] else 'NULL'
        lon = str(a['lon']) if a['lon'] else 'NULL'
        val = f"({a['id']}, '{a['line1']}', {line2}, '{a['city']}', '{a['state_or_province']}', '{a['country']}', '{a['postal_or_zip_code']}', {lat}, {lon})"
        addr_values.append(val)
    f.write(",\n".join(addr_values) + ";\n\n")

    # Users
    f.write("INSERT INTO users (username, password_hash, f_name, l_name, email, dob, rating, role, address_id) VALUES\n")
    user_values = []
    for u in users:
        rating = str(u['rating']) if u['rating'] else 'NULL'
        val = f"('{u['username']}', '{u['password_hash']}', '{u['f_name']}', '{u['l_name']}', '{u['email']}', '{u['dob']}', {rating}, '{u['role']}', {u['address_id']})"
        user_values.append(val)
    f.write(",\n".join(user_values) + ";\n\n")

    # Driver infos
    f.write("INSERT INTO driver_infos (driving_experience, range, driving_license, user_id, current_latitude, current_longitude) VALUES\n")
    di_values = []
    for di in driver_infos:
        lat = str(di['lat']) if di['lat'] else 'NULL'
        lon = str(di['lon']) if di['lon'] else 'NULL'
        val = f"({di['driving_experience']}, {di['range']}, '{di['driving_license']}', {di['user_id']}, {lat}, {lon})"
        di_values.append(val)
    f.write(",\n".join(di_values) + ";\n\n")

    # Vehicles
    f.write("INSERT INTO vehicles (model, make, year, color, price_per_km, is_active, can_carry_furniture, driver_id, vehicle_type_id) VALUES\n")
    veh_values = []
    for v in vehicles:
        val = f"('{v['model']}', '{v['make']}', {v['year']}, '{v['color']}', {v['price_per_km']}, {str(v['is_active']).lower()}, {str(v['can_carry_furniture']).lower()}, {v['driver_id']}, {v['vehicle_type_id']})"
        veh_values.append(val)
    f.write(",\n".join(veh_values) + ";\n\n")

print(f"Seed data generated in {output_file}")
