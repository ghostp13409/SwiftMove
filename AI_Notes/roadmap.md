# Implementation Roadmap for Request/Offer Matching & Distance Calculation

## Phase 1: Foundational Changes (Location & Data) - COMPLETED
1.  **Enhance Address Model:** Added `latitude` and `longitude` to `Address` entity in `location-service`.
2.  **Enhance DriverInfo Model:** Added `currentLatitude` and `currentLongitude` to `DriverInfo` in `driver-service`.
3.  **Implement Geocoding Integration:** Added Nominatim API call to `AddressService` in `location-service`.

## Phase 2: Core Logic Implementation - COMPLETED
1.  **Distance Calculation Engine:**
    *   Implemented **Haversine** logic in `DistanceUtils` (available in `client-service` and `trip-service`).
2.  **MoveRequest Enhancements:**
    *   Added `distance`, `fromLatitude`, `fromLongitude`, `toLatitude`, and `toLongitude` storage in `MoveRequest` (`client-service`).
    *   Updated `MoveRequestService` to calculate these values on creation and update.
3.  **Matching Logic (Strategy Pattern):**
    *   Created `MatchingStrategy` interface and several implementations (`CarActivation`, `Furniture`, `Range`, `Price`, `Capacity`).
    *   Combined into `MoveRequestMatcher` orchestrator in `trip-service`.

## Phase 3: Suggestion & Calculation Features - IN PROGRESS
1.  **Max Budget Suggestion Logic:**
    *   Implemented logic in `MoveSuggestionService` and exposed via `POST /trips/suggest-budget`.
2.  **Move Offer Price Validation:**
    *   (To Do) Update `MoveOfferService` in `driver-service` to use the price calculation logic.

## Phase 4: Integration & Optimization - IN PROGRESS
1.  **Driver Browsing Filter:** Added `GET /trips/browse-requests` to `trip-service` to filter available requests for drivers.
2.  **Performance Optimization:** (To Do) Move matching logic to database queries if scaling issues arise.
3.  **Caching:** (To Do) Implement caching for average `price_per_km`.

---

# Next Steps (Immediate)
1.  Update `MoveOfferService` in `driver-service` to use the price calculation logic.
2.  Test the `suggest-budget` and `browse-requests` endpoints.
3.  Implement caching for average `price_per_km`.
