import {
  DriverInfo,
  DriverInfoDetailed,
  DriverInfoPopulated,
  LuggageEntry,
  LuggageEntryPopulated,
  MoveOffer,
  MoveOfferPopulated,
  MoveRequest,
  MoveRequestPopulated,
  MoveTrip,
  MoveTripDetailed,
  MoveTripPopulated,
  User,
  UserWithAddress,
} from "@/types";
import { addressService } from "./addressService";
import { userService } from "./userService";
import { vehicleService } from "./vehicleService";
import { moveOfferService } from "./moveOfferService";
import { luggageService } from "./luggageService";
import { moveRequestService } from "./moveRequestService";
import { driverService } from "./driverService";

export const populationFactory = {
  populateUser: async (User: User): Promise<UserWithAddress> => {
    try {
      const address = await addressService.getAddress(User.addressId);
      if (!address) {
        throw new Error("Address not found for user");
      }
      const userWithAddress: UserWithAddress = {
        ...User,
        address: address,
      };
      return userWithAddress;
    } catch (error) {
      console.error("Failed to populate user with address:", error);
      throw error;
    }
  },
  //   Populate DriverInfo with User
  populateDriverInfo: async (
    driverInfo: DriverInfo,
  ): Promise<DriverInfoPopulated> => {
    try {
      const user = await userService.getUserById(driverInfo.userId);
      if (!user) {
        throw new Error("User not found for driver info");
      }
      const populatedDriverInfo: DriverInfoPopulated = {
        ...driverInfo,
        user: {
          ...user,
          role: "DRIVER",
        },
      };
      return populatedDriverInfo;
    } catch (error) {
      console.error("Failed to populate driver info with user:", error);
      throw error;
    }
  },

  populateDriverInfoDetailed: async (
    driverInfo: DriverInfo,
  ): Promise<DriverInfoDetailed> => {
    try {
      const user = await userService.getUserById(driverInfo.userId);
      if (!user) {
        throw new Error("User not found for driver info");
      }
      const vehicles = await vehicleService.getVehiclesByDriver(driverInfo.id);
      const moveOffers = await moveOfferService.getOffersByDriver(
        driverInfo.id,
      );
      const populatedDriverInfo: DriverInfoDetailed = {
        ...driverInfo,
        user: {
          ...user,
          role: "DRIVER",
        },
        vehicles,
        moveOffers,
      };
      return populatedDriverInfo;
    } catch (error) {
      console.error(
        "Failed to populate driver info with detailed data:",
        error,
      );
      throw error;
    }
  },

  //   populate luggage entry with luggage type
  populateLuggageEntry: async (
    entry: LuggageEntry,
  ): Promise<LuggageEntryPopulated> => {
    try {
      const luggageType = await luggageService.getLuggageTypeById(
        entry.luggageTypeId,
      );
      const populatedEntry: LuggageEntryPopulated = {
        ...entry,
        luggageType,
      };
      return populatedEntry;
    } catch (error) {
      console.error("Failed to populate luggage entry with type:", error);
      throw error;
    }
  },

  //   populate move offer with driver info populated, vehicle and move request

  populateMoveOffer: async (offer: MoveOffer): Promise<MoveOfferPopulated> => {
    try {
      const driverInfo = await driverService.getDriverByUserId(offer.driverId);
      const populatedDriverInfo =
        await populationFactory.populateDriverInfo(driverInfo);
      const vehicle = await vehicleService.getVehicleById(offer.vehicleId);
      const moveRequest = await moveRequestService.getMoveRequestById(
        offer.moveRequestId,
      );
      const populatedOffer: MoveOfferPopulated = {
        ...offer,
        driver: populatedDriverInfo,
        vehicle,
        moveRequest,
      };
      return populatedOffer;
    } catch (error) {
      console.error("Failed to populate move offer with related data:", error);
      throw error;
    }
  },

  //   populate move request with to/ from addresses, luggage entries and client
  populateMoveRequest: async (
    moveRequest: MoveRequest,
  ): Promise<MoveRequestPopulated> => {
    try {
      const fromAddress = await addressService.getAddress(
        moveRequest.fromAddressId,
      );
      const toAddress = await addressService.getAddress(
        moveRequest.toAddressId,
      );
      const luggageEntries =
        await luggageService.getLuggageEntriesByMoveRequest(moveRequest.id);
      const populatedLuggageEntries = await Promise.all(
        luggageEntries.map(populationFactory.populateLuggageEntry),
      );
      const client = await userService.getUserById(moveRequest.clientId);

      const populatedMoveRequest: MoveRequestPopulated = {
        ...moveRequest,
        fromAddress,
        toAddress,
        luggageEntries: populatedLuggageEntries,
        client: {
          ...client,
          role: "CLIENT",
        },
      };
      return populatedMoveRequest;
    } catch (error) {
      console.error(
        "Failed to populate move request with related data:",
        error,
      );
      throw error;
    }
  },

  //   populate move trip with move offer and move request
  populateMoveTrip: async (moveTrip: MoveTrip): Promise<MoveTripPopulated> => {
    try {
      const moveOffer = await moveOfferService.getMoveOfferById(
        moveTrip.moveOfferId,
      );
      const moveRequest = await moveRequestService.getMoveRequestById(
        moveOffer.moveRequestId,
      );
      const populatedMoveTrip: MoveTripPopulated = {
        ...moveTrip,
        moveOffer: moveOffer,
        moveRequest: moveRequest,
      };
      return populatedMoveTrip;
    } catch (error) {
      console.error("Failed to populate move trip with related data:", error);
      throw error;
    }
  },

  //   populate move trip with detailed move offer and move request
  populateMoveTripDetailed: async (
    moveTrip: MoveTrip,
  ): Promise<MoveTripDetailed> => {
    try {
      const moveOffer = await moveOfferService.getMoveOfferById(
        moveTrip.moveOfferId,
      );
      const populatedMoveOffer =
        await populationFactory.populateMoveOffer(moveOffer);
      const moveRequest = await moveRequestService.getMoveRequestById(
        moveOffer.moveRequestId,
      );
      const populatedMoveRequest =
        await populationFactory.populateMoveRequest(moveRequest);
      const populatedMoveTrip: MoveTripDetailed = {
        ...moveTrip,
        moveOfferPopulated: populatedMoveOffer,
        moveRequestPopulated: populatedMoveRequest,
      };
      return populatedMoveTrip;
    } catch (error) {
      console.error(
        "Failed to populate move trip with detailed related data:",
        error,
      );
      throw error;
    }
  },
};
