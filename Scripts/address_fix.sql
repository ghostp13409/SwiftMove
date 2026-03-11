SELECT setval (
        'addresses_id_seq', (
            SELECT MAX(id)
            FROM addresses
        )
    );
