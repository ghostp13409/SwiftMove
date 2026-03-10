package com.swiftmove.tripservice.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DistanceUtilsTest {

    @Test
    void calculateDistance_SameCoordinates_ReturnsZero() {
        double lat = 40.7128;
        double lon = -74.0060;

        double distance = DistanceUtils.calculateDistance(lat, lon, lat, lon);

        assertEquals(0.0, distance, 0.001);
    }

    @Test
    void calculateDistance_DifferentCoordinates_ReturnsCorrectDistance() {
        // New York City
        double lat1 = 40.7128;
        double lon1 = -74.0060;

        // Los Angeles
        double lat2 = 34.0522;
        double lon2 = -118.2437;

        double distance = DistanceUtils.calculateDistance(lat1, lon1, lat2, lon2);

        // Approximate distance between NYC and LA is ~3935 km
        assertTrue(distance > 3900 && distance < 4000, "Distance should be approx 3935 km, was: " + distance);
    }
}
