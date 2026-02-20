package com.swiftMove.address_service.service;

import com.swiftMove.address_service.dto.AddressDTO;
import lombok.RequiredArgsConstructor;
import com.swiftMove.address_service.model.Address;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.swiftMove.address_service.repo.Query;

@Service
@RequiredArgsConstructor
public class AddressService implements Query<Long, AddressDTO> {

    private final String URL="https://nominatim.openstreetmap.org/reverse?lat=43.479390&lon=-80.517885&format=json&addressdetails=1";
    private final RestTemplate restTemplate = new RestTemplate();
    @Override
    public ResponseEntity<AddressDTO> execute(Long id) {
        String line1=restTemplate.getForObject(URL+id,AddressDTO.class).getLine1();
        String line2=restTemplate.getForObject(URL+id,AddressDTO.class).getLine2();
        String city=restTemplate.getForObject(URL+id,AddressDTO.class).getCity();
        String stateOrProvince=restTemplate.getForObject(URL+id,AddressDTO.class).getStateOrProvince();
        String country=restTemplate.getForObject(URL+id,AddressDTO.class).getCountry();
        String postalOrZipCode=restTemplate.getForObject(URL+id,AddressDTO.class).getPostalOrZipCode();
        AddressDTO addressDTO=new AddressDTO(line1,line2,city,stateOrProvince,country,postalOrZipCode);


        return ResponseEntity.ok(addressDTO);
    }
}
