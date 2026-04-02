import faker
from faker import Faker
from faker_vehicle import VehicleProvider
import bcrypt
import os
import random
from datetime import datetime, date, timedelta

fake = Faker('en_CA')
fake.add_provider(VehicleProvider)

def sql_val(val):
    """Robust SQL value escaping and quoting."""
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "true" if val else "false"
    if isinstance(val, (int, float)):
        return str(val)
    # Quote everything else (strings, dates, datetimes)
    return "'" + str(val).replace("'", "''") + "'"

# Real Waterloo/Kitchener addresses
real_addresses = [
    {"line1": "75 University Ave W", "city": "Waterloo", "state": "ON", "zip": "N2L 3C5", "country": "Canada", "lat": 43.4738, "lon": -80.5275},
    {"line1": "200 University Ave W", "city": "Waterloo", "state": "ON", "zip": "N2L 3G1", "country": "Canada", "lat": 43.4723, "lon": -80.5449},
    {"line1": "100 Regina St S", "city": "Waterloo", "state": "ON", "zip": "N2J 4A8", "country": "Canada", "lat": 43.4643, "lon": -80.5204},
    {"line1": "200 King St W", "city": "Kitchener", "state": "ON", "zip": "N2G 4G7", "country": "Canada", "lat": 43.4516, "lon": -80.4925},
    {"line1": "51 Breithaupt St", "city": "Kitchener", "state": "ON", "zip": "N2H 5G5", "country": "Canada", "lat": 43.4529, "lon": -80.4876},
    {"line1": "10 King St W", "city": "Kitchener", "state": "ON", "zip": "N2G 1A3", "country": "Canada", "lat": 43.4501, "lon": -80.4895},
    {"line1": "25 Regina St S", "city": "Waterloo", "state": "ON", "zip": "N2J 1R8", "country": "Canada", "lat": 43.4632, "lon": -80.5201},
    {"line1": "43 Weber St W", "city": "Kitchener", "state": "ON", "zip": "N2H 3Z1", "country": "Canada", "lat": 43.4521, "lon": -80.4912},
    {"line1": "50 Westmount Rd N", "city": "Waterloo", "state": "ON", "zip": "N2L 2R5", "country": "Canada", "lat": 43.4604, "lon": -80.5401},
    {"line1": "80 King St S", "city": "Waterloo", "state": "ON", "zip": "N2J 1P5", "country": "Canada", "lat": 43.4612, "lon": -80.5198},
    {"line1": "150 Main St", "city": "Cambridge", "state": "ON", "zip": "N1R 6P5", "country": "Canada", "lat": 43.3595, "lon": -80.3130},
    {"line1": "299 Doon Valley Dr", "city": "Kitchener", "state": "ON", "zip": "N2G 4M4", "country": "Canada", "lat": 43.3917, "lon": -80.4031},
]

addresses = []
for i in range(1, 41):
    if i <= len(real_addresses):
        ra = real_addresses[i-1]
        addr = {'line1': ra['line1'], 'line2': '', 'city': ra['city'], 'state': ra['state'], 'zip': ra['zip'], 'country': ra['country'], 'lat': ra['lat'], 'lon': ra['lon']}
    else:
        addr = {'line1': fake.street_address(), 'line2': fake.secondary_address() if fake.boolean(chance_of_getting_true=20) else '', 'city': fake.city(), 'state': fake.province_abbr(), 'country': 'Canada', 'zip': fake.postcode(), 'lat': None, 'lon': None}
    addresses.append(addr)

users = []
pwd_hash_test = bcrypt.hashpw(b"test", bcrypt.gensalt()).decode('utf-8')
users.append({'username': 'test', 'password_hash': pwd_hash_test, 'f_name': 'Test', 'l_name': 'Admin', 'email': 'test@admin.com', 'dob': '1990-01-01', 'rating': None, 'role': 'ADMIN', 'address_id': 1})
users.append({'username': 'driver', 'password_hash': pwd_hash_test, 'f_name': 'John', 'l_name': 'Driver', 'email': 'driver@swiftmove.com', 'dob': '1985-06-15', 'rating': 4.5, 'role': 'DRIVER', 'address_id': 2})
users.append({'username': 'client', 'password_hash': pwd_hash_test, 'f_name': 'Jane', 'l_name': 'Client', 'email': 'client@swiftmove.com', 'dob': '1992-03-22', 'rating': 4.8, 'role': 'CLIENT', 'address_id': 3})
users.append({'username': 'test_driver', 'password_hash': pwd_hash_test, 'f_name': 'Dave', 'l_name': 'Professional', 'email': 'dave@swiftmove.com', 'dob': '1988-11-05', 'rating': 5.0, 'role': 'DRIVER', 'address_id': 4})

for _ in range(16):
    role = fake.random_element(['CLIENT', 'DRIVER'])
    users.append({'username': fake.user_name(), 'password_hash': pwd_hash_test, 'f_name': fake.first_name(), 'l_name': fake.last_name(), 'email': fake.email(), 'dob': fake.date_of_birth(minimum_age=18, maximum_age=70), 'rating': round(random.uniform(3.5, 5.0), 1) if fake.boolean(chance_of_getting_true=80) else None, 'role': role, 'address_id': random.randint(1, 20)})

driver_infos = []
for idx, u in enumerate(users, 1):
    if u['role'] == 'DRIVER':
        drange = 500 if 'driver' in u['username'] else random.randint(50, 300)
        addr = addresses[u['address_id']-1]
        driver_infos.append({'driving_experience': random.randint(2, 15), 'range': drange, 'license': fake.bothify(text='??######'), 'user_id': idx, 'lat': addr['lat'], 'lon': addr['lon']})

vehicles = []
for idx, d in enumerate(driver_infos, 1):
    is_special = users[d['user_id']-1]['username'] in ['driver', 'test_driver']
    vehicles.append({'model': 'Transit' if is_special else fake.vehicle_model(), 'make': 'Ford' if is_special else fake.vehicle_make(), 'year': 2023 if is_special else fake.vehicle_year(), 'color': 'White' if is_special else fake.color_name(), 'price': 10 if is_special else random.randint(5, 15), 'active': True, 'furniture': True, 'driver_id': idx, 'v_type': 5})

move_requests = []
clients = [i for i, u in enumerate(users, 1) if u['role'] == 'CLIENT']
for i in range(1, 5):
    f_addr_idx = random.randint(0, len(real_addresses)-1)
    t_addr_idx = random.choice([x for x in range(len(real_addresses)) if x != f_addr_idx])
    move_requests.append({'date': (datetime.now() + timedelta(days=random.randint(1, 30))).strftime('%Y-%m-%d %H:%M:%S'), 'budget': random.randint(100, 500), 'client_id': random.choice(clients), 'from_id': f_addr_idx+1, 'to_id': t_addr_idx+1, 'dist': round(random.uniform(5.0, 25.0), 2), 'f_lat': real_addresses[f_addr_idx]['lat'], 'f_lon': real_addresses[f_addr_idx]['lon'], 't_lat': real_addresses[t_addr_idx]['lat'], 't_lon': real_addresses[t_addr_idx]['lon'], 'status': 'CREATED', 'furniture': fake.boolean(), 'note': f'Demo request {i}'})

luggage = []
for i, mr in enumerate(move_requests, 1):
    for _ in range(random.randint(2, 4)):
        luggage.append({'qty': random.randint(1, 5), 'mr_id': i, 'type_id': random.randint(1, 5)})

output_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'seed_data.sql')
with open(output_file, 'w') as f:
    f.write("TRUNCATE TABLE move_trips, move_offers, luggage_entries, move_requests, vehicles, driver_infos, users, addresses, luggage_types, vehicle_types RESTART IDENTITY CASCADE;\n\n")

    f.write("INSERT INTO vehicle_types (type, max_weight, capacity) VALUES\n('SEDAN',340,67),('SUV',589,120),('HATCHBACK',362,50),('MINIVAN',544,140),('VAN',1088,294),('TRUCK',589,70);\n\n")
    f.write("INSERT INTO luggage_types (type, name, volume, weight) VALUES\n('SMALL','Small Box',1,6),('MEDIUM','Medium Box',2,9),('LARGE','Large Box',3,13),('EXTRA_LARGE','Extra Large Box',3,22),('EXTRA_EXTRA_LARGE','Extra Extra Large Box',5,27);\n\n")

    f.write("INSERT INTO addresses (line1, line2, city, state_or_province, country, postal_or_zip_code, latitude, longitude) VALUES\n")
    f.write(",\n".join([f"({sql_val(a['line1'])},{sql_val(a['line2'])},{sql_val(a['city'])},{sql_val(a['state'])},{sql_val(a['country'])},{sql_val(a['zip'])},{sql_val(a['lat'])},{sql_val(a['lon'])})" for a in addresses]) + ";\n\n")

    f.write("INSERT INTO users (username, password_hash, f_name, l_name, email, dob, rating, role, address_id) VALUES\n")
    f.write(",\n".join([f"({sql_val(u['username'])},{sql_val(u['password_hash'])},{sql_val(u['f_name'])},{sql_val(u['l_name'])},{sql_val(u['email'])},{sql_val(u['dob'])},{sql_val(u['rating'])},{sql_val(u['role'])},{sql_val(u['address_id'])})" for u in users]) + ";\n\n")

    f.write("INSERT INTO driver_infos (driving_experience, range, driving_license, user_id, current_latitude, current_longitude) VALUES\n")
    f.write(",\n".join([f"({sql_val(d['driving_experience'])},{sql_val(d['range'])},{sql_val(d['license'])},{sql_val(d['user_id'])},{sql_val(d['lat'])},{sql_val(d['lon'])})" for d in driver_infos]) + ";\n\n")

    f.write("INSERT INTO vehicles (model, make, year, color, price_per_km, is_active, can_carry_furniture, driver_id, vehicle_type_id) VALUES\n")
    f.write(",\n".join([f"({sql_val(v['model'])},{sql_val(v['make'])},{sql_val(v['year'])},{sql_val(v['color'])},{sql_val(v['price'])},{sql_val(v['active'])},{sql_val(v['furniture'])},{sql_val(v['driver_id'])},{sql_val(v['v_type'])})" for v in vehicles]) + ";\n\n")

    f.write("INSERT INTO move_requests (move_date, max_budget, client_id, from_address_id, to_address_id, distance, from_latitude, from_longitude, to_latitude, to_longitude, status, has_furniture, note) VALUES\n")
    f.write(",\n".join([f"({sql_val(mr['date'])},{sql_val(mr['budget'])},{sql_val(mr['client_id'])},{sql_val(mr['from_id'])},{sql_val(mr['to_id'])},{sql_val(mr['dist'])},{sql_val(mr['f_lat'])},{sql_val(mr['f_lon'])},{sql_val(mr['t_lat'])},{sql_val(mr['t_lon'])},{sql_val(mr['status'])},{sql_val(mr['furniture'])},{sql_val(mr['note'])})" for mr in move_requests]) + ";\n\n")

    f.write("INSERT INTO luggage_entries (quantity, move_request_id, luggage_type_id) VALUES\n")
    f.write(",\n".join([f"({sql_val(l['qty'])},{sql_val(l['mr_id'])},{sql_val(l['type_id'])})" for l in luggage]) + ";\n\n")

    f.write("-- Sync sequences\n")
    for t in ["addresses", "users", "driver_infos", "vehicles", "move_requests", "luggage_entries", "vehicle_types", "luggage_types", "move_offers", "move_trips"]:
        f.write(f"SELECT setval(pg_get_serial_sequence('{t}', 'id'), COALESCE((SELECT MAX(id) FROM {t}), 0) + 1);\n")

print(f"Seed data generated in {output_file}")
