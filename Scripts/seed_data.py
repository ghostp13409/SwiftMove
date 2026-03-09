import faker
from faker import Faker
import bcrypt

fake = Faker()

# Generate Query for deleteing all existing data


# Generate addresses
addresses = []
for i in range(1, 201):
    addr = {
        'id': i,
        'line1': fake.street_address(),
        'line2': fake.secondary_address() if fake.boolean() else '',
        'city': fake.city(),
        'state_or_province': fake.state(),
        'country': 'USA',
        'postal_or_zip_code': fake.zipcode()
    }
    addresses.append(addr)

# Generate users (ids are generated internally for relationship purposes but not inserted explicitly, database will auto-assign)
users = []
roles = ['CLIENT', 'DRIVER', 'ADMIN']
for i in range(1, 81):
    role = fake.random_element(roles)
    # bcrypt hash for constant password 'test'
    pwd_hash = bcrypt.hashpw(b"test", bcrypt.gensalt()).decode('utf-8')
    user = {
        'id': i,  # used internally for references; will not be written into SQL
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
#  Add Manual Entries for Admin, Driver and Client Test Users
admin_user = {
    'id': 81,  # used internally for references; will not be written into SQL
    'username': 'admin',
    'password_hash': bcrypt.hashpw(b"test", bcrypt.gensalt()).decode('utf-8'),
    'f_name': 'Test',
    'l_name': 'Admin',
    'email': 'test@admin.com',
    'dob': fake.date_of_birth(minimum_age=30, maximum_age=50),
    'rating': None,
    'role': 'ADMIN',
    'address_id': fake.random_int(1, 200)
}
driver_user = {
    'id': 82,  # used internally for references; will not be written into SQL
    'username': 'admin_user',
    'password_hash': bcrypt.hashpw(b"test", bcrypt.gensalt()).decode('utf-8'),
    'f_name': 'Test',
    'l_name': 'Driver',
    'email': 'test@driver.com',
    'dob': fake.date_of_birth(minimum_age=30, maximum_age=50),
    'rating': None,
    'role': 'DRIVER',
    'address_id': fake.random_int(1, 200)
}
client_user = {
    'id': 83,  # used internally for references; will not be written into SQL
    'username': 'admin_client',
    'password_hash': bcrypt.hashpw(b"test", bcrypt.gensalt()).decode('utf-8'),
    'f_name': 'Test',
    'l_name': 'Client',
    'email': 'test@client.com',
    'dob': fake.date_of_birth(minimum_age=30, maximum_age=50),
    'rating': None,
    'role': 'CLIENT',
    'address_id': fake.random_int(1, 200)
}
users.extend([admin_user, driver_user, client_user])

# Driver infos
drivers = [u for u in users if u['role'] == 'DRIVER']
driver_infos = []
for idx, d in enumerate(drivers, 1):
    di = {
        'id': idx,
        'driving_experience': fake.random_int(1, 40),
        'range': fake.random_int(100, 1000),
        'driving_license': fake.license_plate(),
        'user_id': d['id']
    }
    driver_infos.append(di)

# Vehicles
vehicles = []
vid = 1
for d in driver_infos:
    num_veh = fake.random_int(1, 3)
    for _ in range(num_veh):
        veh = {
            'id': vid,
            'model': fake.word().capitalize(),
            'make': fake.company(),
            'year': fake.year(),
            'color': fake.color_name(),
            'price_per_km': fake.random_int(5, 50),
            'is_active': fake.boolean(),
            'can_carry_furniture': fake.boolean(),
            'driver_id': d['id'],
            'vehicle_type_id': fake.random_int(1, 6)
        }
        vehicles.append(veh)
        vid += 1

# Move requests
clients = [u for u in users if u['role'] == 'CLIENT']
move_requests = []
mrid = 1
# statuses defined for reference but not used directly in generation
mr_statuses = ['CREATED', 'OFFER_AVAILABLE', 'ACCEPTED', 'CANCELLED']
mo_statuses = ['OFFER_SENT', 'ACCEPTED', 'REJECTED', 'CANCELLED']
trip_statuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']

for c in clients:
    num_req = fake.random_int(1, 5)
    for _ in range(num_req):
        # initial request
        mr = {
            'id': mrid,
            'move_date': fake.date_time_this_year(),
            'max_budget': fake.random_int(100, 5000),
            'client_id': c['id'],
            'from_address_id': fake.random_int(1, 200),
            'to_address_id': fake.random_int(1, 200),
            'status': 'CREATED',
            'has_furniture': fake.boolean()
        }
        move_requests.append(mr)
        mrid += 1

# Luggage entries - at most one entry per luggage type, max 5 per request
luggage_entries = []
leid = 1
for mr in move_requests:
    # sample between 1 and 5 distinct luggage types
    types = fake.random_elements(elements=[1, 2, 3, 4, 5], length=fake.random_int(1, 5), unique=True)
    for lt in types:
        le = {
            'id': leid,
            'quantity': fake.random_int(1, 20),
            'move_request_id': mr['id'],
            'luggage_type_id': lt
        }
        luggage_entries.append(le)
        leid += 1

# Move offers and associated status transitions
# precompute driver and vehicle id lists for selection
drivers_list = [d['id'] for d in drivers]
vehicles_list = [v['id'] for v in vehicles]

move_offers = []
moid = 1
# we will create trips only for accepted offers
move_trips = []
mtid = 1

for mr in move_requests:
    # decide if request will be cancelled immediately (before offers)
    if fake.boolean(chance_of_getting_true=10):
        mr['status'] = 'CANCELLED'
        continue

    # generate offers for this request
    num_off = fake.random_int(1, 5)
    offers_for_request = []
    accepted_offer = None

    for _ in range(num_off):
        driver_id = fake.random_element(drivers_list)
        veh_for_driver = [v for v in vehicles if v['driver_id'] == driver_id]
        if veh_for_driver:
            veh_id = fake.random_element(veh_for_driver)['id']
        else:
            veh_id = fake.random_element(vehicles_list)

        mo = {
            'id': moid,
            'price': fake.random_int(50, mr['max_budget']),
            'offered_date': fake.date_time_this_year(before_now=True),
            'move_request_id': mr['id'],
            'driver_id': driver_id,
            'vehicle_id': veh_id,
            'status': 'OFFER_SENT'
        }
        offers_for_request.append(mo)
        move_offers.append(mo)
        moid += 1

    if offers_for_request:
        # at least one offer means request moves to OFFER_AVAILABLE
        mr['status'] = 'OFFER_AVAILABLE'
        # decide if request will eventually be cancelled after offers with some chance
        if fake.boolean(chance_of_getting_true=10):
            mr['status'] = 'CANCELLED'
            # mark all offers as cancelled
            for o in offers_for_request:
                o['status'] = 'CANCELLED'
        else:
            # randomly accept one of the offers with a modest chance
            if fake.boolean(chance_of_getting_true=30):
                accepted_offer = fake.random_element(offers_for_request)
                accepted_offer['status'] = 'ACCEPTED'
                mr['status'] = 'ACCEPTED'
                # mark the other offers as rejected or cancelled
                for o in offers_for_request:
                    if o is not accepted_offer:
                        o['status'] = fake.random_element(['REJECTED', 'CANCELLED'])

                # create a move trip for the accepted offer
                trip = {
                    'id': mtid,
                    'move_request_id': mr['id'],
                    'move_offer_id': accepted_offer['id'],
                    'status': 'SCHEDULED'
                }
                # progress the trip randomly
                if fake.boolean(chance_of_getting_true=50):
                    trip['status'] = 'IN_PROGRESS'
                    if fake.boolean(chance_of_getting_true=50):
                        trip['status'] = fake.random_element(['COMPLETED', 'CANCELLED'])
                move_trips.append(trip)
                mtid += 1
            else:
                # no offer accepted: transition all offers off of OFFER_SENT
                for o in offers_for_request:
                    o['status'] = fake.random_element(['REJECTED', 'CANCELLED'])
    # if we never accepted an offer and didn't cancel request, status remains OFFER_AVAILABLE

# end generate offers/trips

# Write to SQL file
# determine output path relative to this script so running from anywhere works
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
output_file = os.path.join(script_dir, 'seed_data.sql')

# ensure parent directory exists (should already, but safe)
os.makedirs(script_dir, exist_ok=True)

with open(output_file, 'w') as f:
    f.write("-- Seed data generated by seed_data.py\n\n")

    # clean up existing rows to avoid foreign key issues
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

    # Addresses (include explicit id to guarantee referential integrity)
    f.write("INSERT INTO addresses (id, line1, line2, city, state_or_province, country, postal_or_zip_code) VALUES\n")
    addr_values = []
    for a in addresses:
        line2 = f"'{a['line2']}'" if a['line2'] else 'NULL'
        val = f"({a['id']}, '{a['line1']}', {line2}, '{a['city']}', '{a['state_or_province']}', '{a['country']}', '{a['postal_or_zip_code']}')"
        addr_values.append(val)
    f.write(",\n".join(addr_values) + ";\n\n")

    # Users (omit id column; database will auto-generate)
    f.write("INSERT INTO users (username, password_hash, f_name, l_name, email, dob, rating, role, address_id) VALUES\n")
    user_values = []
    for u in users:
        rating = str(u['rating']) if u['rating'] else 'NULL'
        val = f"('{u['username']}', '{u['password_hash']}', '{u['f_name']}', '{u['l_name']}', '{u['email']}', '{u['dob']}', {rating}, '{u['role']}', {u['address_id']})"
        user_values.append(val)
    f.write(",\n".join(user_values) + ";\n\n")

    # Driver infos
    f.write("INSERT INTO driver_infos (driving_experience, range, driving_license, user_id) VALUES\n")
    di_values = []
    for di in driver_infos:
        val = f"({di['driving_experience']}, {di['range']}, '{di['driving_license']}', {di['user_id']})"
        di_values.append(val)
    f.write(",\n".join(di_values) + ";\n\n")

    # Vehicles
    f.write("INSERT INTO vehicles (model, make, year, color, price_per_km, is_active, can_carry_furniture, driver_id, vehicle_type_id) VALUES\n")
    veh_values = []
    for v in vehicles:
        val = f"('{v['model']}', '{v['make']}', {v['year']}, '{v['color']}', {v['price_per_km']}, {str(v['is_active']).lower()}, {str(v['can_carry_furniture']).lower()}, {v['driver_id']}, {v['vehicle_type_id']})"
        veh_values.append(val)
    f.write(",\n".join(veh_values) + ";\n\n")

    # Move requests
    f.write("INSERT INTO move_requests (move_date, max_budget, client_id, from_address_id, to_address_id, status, has_furniture) VALUES\n")
    mr_values = []
    for mr in move_requests:
        val = f"('{mr['move_date']}', {mr['max_budget']}, {mr['client_id']}, {mr['from_address_id']}, {mr['to_address_id']}, '{mr['status']}', {str(mr['has_furniture']).lower()})"
        mr_values.append(val)
    f.write(",\n".join(mr_values) + ";\n\n")

    # Luggage entries
    f.write("INSERT INTO luggage_entries (quantity, move_request_id, luggage_type_id) VALUES\n")
    le_values = []
    for le in luggage_entries:
        val = f"({le['quantity']}, {le['move_request_id']}, {le['luggage_type_id']})"
        le_values.append(val)
    f.write(",\n".join(le_values) + ";\n\n")

    # Move offers
    f.write("INSERT INTO move_offers (price, offered_date, move_request_id, driver_id, vehicle_id, status) VALUES\n")
    mo_values = []
    for mo in move_offers:
        val = f"({mo['price']}, '{mo['offered_date']}', {mo['move_request_id']}, {mo['driver_id']}, {mo['vehicle_id']}, '{mo['status']}')"
        mo_values.append(val)
    f.write(",\n".join(mo_values) + ";\n\n")

    # Move trips
    f.write("INSERT INTO move_trips (move_request_id, move_offer_id, status) VALUES\n")
    mt_values = []
    for mt in move_trips:
        val = f"({mt['move_request_id']}, {mt['move_offer_id']}, '{mt['status']}')"
        mt_values.append(val)
    f.write(",\n".join(mt_values) + ";\n\n")

print(f"Seed data generated in {output_file}")
