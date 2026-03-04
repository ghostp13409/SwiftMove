package com.swiftMove.locationservice.repository;
import com.swiftMove.locationservice.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
