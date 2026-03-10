# Current State of the System (Updated)

## Entities & Services

| Service | Entity | Key Fields |
| :--- | :--- | :--- |
| **client-service** | `MoveRequest` | `max_budget`, `from_address_id`, `to_address_id`, `distance`, `from_latitude`, `from_longitude`, `to_latitude`, `to_longitude`, `has_furniture`, `status`. |
| | `LuggageEntry` | `luggage_type_id`, `quantity`, `move_request_id`. |
| | `LuggageType` | `volume`, `weight`, `type`. |
| **driver-service** | `MoveOffer` | `price`, `move_request_id`, `driver_id`, `vehicle_id`, `status`. |
| | `Vehicle` | `price_per_km`, `is_active`, `can_carry_furniture`, `driver_id`, `vehicle_type_id`. |
| | `VehicleType` | `max_weight`, `capacity`, `type`. |
| | `DriverInfo` | `driving_experience`, `range`, `driving_license`, `user_id`, `current_latitude`, `current_longitude`. |
| **location-service**| `Address` | `line1`, `line2`, `city`, `state_or_province`, `country`, `postal_or_zip_code`, `latitude`, `longitude`. |
| **trip-service** | `MoveTrip` | Created after `MoveOffer` is accepted. |

## Progress Made

1.  **Address Coordinates:** `Address` model now includes `latitude` and `longitude`.
2.  **Geocoding Integration:** `location-service` now uses **Nominatim** to fetch coordinates when an address is created or updated.
3.  **Driver Current Location:** `DriverInfo` now includes `current_latitude` and `current_longitude`.
4.  **Distance Calculation:** **Haversine** logic implemented in `DistanceUtils` (available in `client-service` and `trip-service`).
5.  **Matching Logic (Strategy Pattern):**
    *   Implemented `CarActivationMatchingStrategy`.
    *   Implemented `FurnitureMatchingStrategy`.
    *   Implemented `RangeMatchingStrategy` (Location-based).
    *   Implemented `PriceMatchingStrategy` (Budget vs. Vehicle `price_per_km`).
    *   Implemented `CapacityMatchingStrategy` (Luggage volume/weight).
    *   Orchestrated via `MoveRequestMatcher` in `trip-service`.
6.  **Budget Suggestion:** Logic implemented in `MoveSuggestionService` and exposed via `POST /trips/suggest-budget`.
7.  **Filtered Browsing:** Drivers can now browse matching requests via `GET /trips/browse-requests?driverId=...`.

## Next Steps

1.  **Frontend Integration:** Update the React dashboards to use the new `suggest-budget` and `browse-requests` endpoints.
2.  **Caching:** Implement caching for average `price_per_km` to avoid repeated full-table scans.
3.  **OSRM Integration:** (Optional) Switch from Haversine to OSRM for final price calculations if road distance accuracy is critical.
4.  **Validation:** Exhaustive testing of the matching logic with edge cases (e.g., zero volume vehicles, very long distances).
