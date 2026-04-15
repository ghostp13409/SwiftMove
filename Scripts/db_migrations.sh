cat create_tables.sql | docker exec -i postgres  psql -U postgres -d swiftmove
cat delete_data.sql | docker exec -i postgres  psql -U postgres -d swiftmove
cat seed_data.sql | docker exec -i postgres  psql -U postgres -d swiftmove
cat address_fix.sql | docker exec -i postgres  psql -U postgres -d swiftmove
