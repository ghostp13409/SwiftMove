cat create_tables.sql | docker exec -i postgres  psql -U postgres -d postgres
cat delete_data.sql | docker exec -i postgres  psql -U postgres -d postgres
cat seed_data.sql | docker exec -i postgres  psql -U postgres -d postgres
cat address_fix.sql | docker exec -i postgres  psql -U postgres -d postgres
