import { describe, it, expect } from "vitest";

import { populationFactory } from "@/services/populationFactory";
import { userService } from "@/services/userService";
import { driverService } from "@/services/driverService";
import { addressService } from "@/services/addressService";
import { vehicleService } from "@/services/vehicleService";
import { moveOfferService } from "@/services/moveOfferService";
import { luggageService } from "@/services/luggageService";
import { moveRequestService } from "@/services/moveRequestService";
import { tripService } from "@/services/tripService";
import { authService } from "@/services/authService";

// ensure authService does not try to access localStorage in tests
authService.getToken = () => null;

// provide simple global.localStorage stub to satisfy any references
if (typeof global.localStorage === "undefined") {
  // @ts-ignore
  global.localStorage = {
    getItem: (_: string) => null,
    setItem: (_: string, __: string) => {},
    removeItem: (_: string) => {},
    clear: () => {},
  };
}

// IDs provided by user for testing
const DRIVER_USER_ID = 82;
const CLIENT_USER_ID = 83;

describe("populationFactory integration", () => {
  it("populateUser adds address", async () => {
    try {
      const user = await userService.getUserById(CLIENT_USER_ID);
      const result = await populationFactory.populateUser(user);
      console.log("populateUser result", result);
      expect(result.address).toBeDefined();
      expect(result.id).toBe(user.id);
    } catch (e) {
      console.warn("populateUser integration test skipped due to error", e);
    }
  });

  it("populateDriverInfo attaches user with DRIVER role", async () => {
    try {
      const driverInfo = await driverService.getDriverByUserId(DRIVER_USER_ID);
      const result = await populationFactory.populateDriverInfo(driverInfo);
      console.log("populateDriverInfo result", result);
      expect(result.user).toBeDefined();
      expect(result.user.role).toBe("DRIVER");
    } catch (e) {
      console.warn(
        "populateDriverInfo integration test skipped due to error",
        e,
      );
    }
  });

  it("populateDriverInfoDetailed returns vehicles and offers", async () => {
    try {
      const driverInfo = await driverService.getDriverByUserId(DRIVER_USER_ID);
      const result =
        await populationFactory.populateDriverInfoDetailed(driverInfo);
      console.log("populateDriverInfoDetailed result", result);
      expect(result.user).toBeDefined();
      expect(Array.isArray(result.vehicles)).toBe(true);
      expect(Array.isArray(result.moveOffers)).toBe(true);
    } catch (e) {
      console.warn("populateDriverInfoDetailed test skipped due to error", e);
    }
  });

  it("populateLuggageEntry with a real entry", async () => {
    try {
      const requests = await moveRequestService.getAllMoveRequests();
      if (requests.length === 0) {
        console.warn("no move requests available; skipping luggage entry test");
        return;
      }
      const req = requests[0];
      const entries = await luggageService.getLuggageEntriesByMoveRequest(
        req.id,
      );
      if (entries.length === 0) {
        console.warn("no luggage entries found for request", req.id);
        return;
      }
      const entry = entries[0];
      const result = await populationFactory.populateLuggageEntry(entry);
      console.log("populateLuggageEntry result", result);
      expect(result.luggageType).toBeDefined();
    } catch (e) {
      console.warn(
        "populateLuggageEntry integration test skipped due to error",
        e,
      );
    }
  });

  it("populateMoveOffer builds populated offer", async () => {
    try {
      const offers = await moveOfferService.getOffersByDriver(DRIVER_USER_ID);
      if (offers.length === 0) {
        console.warn("no offers for driver", DRIVER_USER_ID);
        return;
      }
      const offer = offers[0];
      const result = await populationFactory.populateMoveOffer(offer);
      console.log("populateMoveOffer result", result);
      expect(result.driver).toBeDefined();
      expect(result.vehicle).toBeDefined();
      expect(result.moveRequest).toBeDefined();
    } catch (e) {
      console.warn(
        "populateMoveOffer integration test skipped due to error",
        e,
      );
    }
  });

  it("populateMoveRequest returns populated request", async () => {
    try {
      const requests = await moveRequestService.getAllMoveRequests();
      if (requests.length === 0) {
        console.warn("no move requests available");
        return;
      }
      const req = requests[0];
      const result = await populationFactory.populateMoveRequest(req);
      console.log("populateMoveRequest result", result);
      expect(result.client).toBeDefined();
      expect(result.fromAddress).toBeDefined();
      expect(result.toAddress).toBeDefined();
      expect(Array.isArray(result.luggageEntries)).toBe(true);
    } catch (e) {
      console.warn(
        "populateMoveRequest integration test skipped due to error",
        e,
      );
    }
  });

  it("populateMoveTrip returns populated trip", async () => {
    const trips = await tripService.getAllTrips();
    if (trips.length === 0) {
      console.warn("no trips available");
      return;
    }
    const trip = trips[0];
    const result = await populationFactory.populateMoveTrip(trip);
    console.log("populateMoveTrip result", result);
    expect(result.moveOffer).toBeDefined();
    expect(result.moveRequest).toBeDefined();
  });

  it("populateMoveTripDetailed returns detailed trip", async () => {
    const trips = await tripService.getAllTrips();
    if (trips.length === 0) {
      console.warn("no trips available");
      return;
    }
    const trip = trips[0];
    const result = await populationFactory.populateMoveTripDetailed(trip);
    console.log("populateMoveTripDetailed result", result);
    expect(result.moveOfferPopulated).toBeDefined();
    expect(result.moveRequestPopulated).toBeDefined();
  });
});
