package com.swiftMove.address_service.repo;

import com.swiftMove.address_service.dto.AddressDTO;
import org.springframework.http.ResponseEntity;

public interface Query <L,O>{
    ResponseEntity<AddressDTO> execute(L input);
}
