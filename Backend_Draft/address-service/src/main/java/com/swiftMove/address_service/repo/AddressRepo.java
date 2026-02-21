package com.swiftMove.address_service.repo;

import com.swiftMove.address_service.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepo extends JpaRepository<Address, Long> {
}
