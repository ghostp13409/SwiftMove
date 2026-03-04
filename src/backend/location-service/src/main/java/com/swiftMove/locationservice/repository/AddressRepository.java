package com.swiftmove.locationservice.repository;

import com.swiftmove.locationservice.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
