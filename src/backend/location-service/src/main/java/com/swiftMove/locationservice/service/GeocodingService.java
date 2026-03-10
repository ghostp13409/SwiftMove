package com.swiftMove.locationservice.service;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.swiftMove.locationservice.model.Address;

import lombok.RequiredArgsConstructor;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GeocodingService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

    public void setCoordinates(Address address) {
        if (address.getLatitude() != null && address.getLongitude() != null) {
            return;
        }

        // Try with full address first
        if (fetchAndSet(address, buildQuery(address, true))) {
            return;
        }
        
        // If failed, try with simpler address (city, state, country)
        System.out.println("Full address geocoding failed, trying simpler query...");
        fetchAndSet(address, buildQuery(address, false));
    }

    private String buildQuery(Address address, boolean full) {
        List<String> parts = new ArrayList<>();
        if (full && address.getLine1() != null && !address.getLine1().trim().isEmpty()) parts.add(address.getLine1());
        if (address.getCity() != null && !address.getCity().trim().isEmpty()) parts.add(address.getCity());
        if (address.getStateOrProvince() != null && !address.getStateOrProvince().trim().isEmpty()) parts.add(address.getStateOrProvince());
        if (address.getCountry() != null && !address.getCountry().trim().isEmpty()) parts.add(address.getCountry());

        return parts.stream()
                    .filter(s -> s != null && !s.trim().isEmpty())
                    .collect(Collectors.joining(", "));
    }

    private boolean fetchAndSet(Address address, String query) {
        if (query.isEmpty()) return false;
        
        try {
            System.out.println("Geocoding query: [" + query + "]");

            URI uri = UriComponentsBuilder.fromUriString(NOMINATIM_URL)
                    .queryParam("q", query)
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .build()
                    .toUri();

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "SwiftMove-App-Geocoding-Service-v3 (contact: ghostp134@gmail.com)");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Fetch as String to avoid Jackson deserialization issues with abstract JsonNode
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                
                if (root.isArray() && root.size() > 0) {
                    JsonNode location = root.get(0);
                    
                    String latStr = location.get("lat").asText();
                    String lonStr = location.get("lon").asText();
                    
                    address.setLatitude(Double.parseDouble(latStr));
                    address.setLongitude(Double.parseDouble(lonStr));
                    
                    System.out.println("Successfully geocoded: " + query + " -> Lat: " + address.getLatitude() + ", Lon: " + address.getLongitude());
                    return true;
                } else {
                    System.err.println("Nominatim returned 200 but no results for: " + query);
                }
            } else {
                System.err.println("Nominatim returned error: " + response.getStatusCode());
            }
        } catch (Exception e) {
            System.err.println("Geocoding request failed for [" + query + "]: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }
}
