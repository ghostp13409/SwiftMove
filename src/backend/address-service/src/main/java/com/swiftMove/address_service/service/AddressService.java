package com.swiftMove.address_service.service;

import com.swiftMove.address_service.dto.AddressDTO;
import com.swiftMove.address_service.dto.NominatimResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.swiftMove.address_service.repo.Query;

@Service
@RequiredArgsConstructor
public class AddressService implements Query<Long, AddressDTO> {


    private final RestTemplate restTemplate = new RestTemplate();
    @Override
    public ResponseEntity<AddressDTO> execute(Long id) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "swiftMove-address-service/1.0 (your@email.com)");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String url = "https://nominatim.openstreetmap.org/reverse" +
                "?lat=43.479390&lon=-80.517885&format=json&addressdetails=1";

        ResponseEntity<NominatimResponse> response =
                restTemplate.exchange(url, HttpMethod.GET, entity, NominatimResponse.class);

        NominatimResponse body = response.getBody();

        AddressDTO dto = mapToAddressDTO(body);

        return ResponseEntity.ok(dto);
    }
    // mapper Method

    private AddressDTO mapToAddressDTO(NominatimResponse response) {

        if (response == null || response.getAddress() == null) {
            throw new RuntimeException("Invalid response from Nominatim");
        }

        NominatimResponse.Address addr = response.getAddress();

        // Line1: house number + road (if available)
        String line1 = "";
        if (addr.getHouse_number() != null) {
            line1 += addr.getHouse_number() + " ";
        }
        if (addr.getRoad() != null) {
            line1 += addr.getRoad();
        }

        // Nominatim may return city OR town OR village
        String city = firstNonNull(
                addr.getCity(),
                addr.getTown(),
                addr.getVillage()
        );

        return new AddressDTO(
                line1.isBlank() ? null : line1.trim(),
                null, // line2 (Nominatim doesn't usually provide it)
                city,
                addr.getState(),
                addr.getCountry(),
                addr.getPostcode()
        );
    }
    private String firstNonNull(String... values) {
        for (String v : values) {
            if (v != null && !v.isBlank()) {
                return v;
            }
        }
        return null;
    }


}
