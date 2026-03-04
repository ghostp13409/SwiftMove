import type {
  User, Address, DriverInfo, Vehicle, MoveRequest, MoveOffer, MoveTrip, DashboardStats, LuggageType, VehicleType,
} from "@/types";

export const VEHICLE_TYPES: VehicleType[] = [
  { type: "SEDAN", volume: 340.19, maxWeight: 67.08 },
  { type: "SUV", volume: 589.6, maxWeight: 120 },
  { type: "HATCHBACK", volume: 362.8, maxWeight: 50.5 },
  { type: "MINIVAN", volume: 544.31, maxWeight: 140.61 },
  { type: "VAN", volume: 1088.62, maxWeight: 294.4 },
  { type: "TRUCK", volume: 589.67, maxWeight: 70 },
];

export const LUGGAGE_TYPES: LuggageType[] = [
  { type: "SMALL", name: "Small Box", volume: 1.38, weight: 6.8 },
  { type: "MEDIUM", name: "Medium Box", volume: 2.99, weight: 9.07 },
  { type: "LARGE", name: "Large Box", volume: 3.4, weight: 13.6 },
  { type: "EXTRA_LARGE", name: "Extra Large Box", volume: 3.75, weight: 22.67 },
  { type: "EXTRA_EXTRA_LARGE", name: "Extra Extra Large Box", volume: 5.83, weight: 27 },
];

const addr = (id: number, line1: string, city: string, state: string, postal: string): Address => ({
  id, line1, line2: "", city, state, country: "Canada", postalCode: postal,
});

export const mockAddresses: Address[] = [
  addr(1, "123 Maple St", "Toronto", "ON", "M5V 2T6"),
  addr(2, "456 Oak Ave", "Mississauga", "ON", "L5B 3C7"),
  addr(3, "789 Pine Rd", "Vancouver", "BC", "V6B 1A1"),
  addr(4, "321 Elm Dr", "Calgary", "AB", "T2P 1J9"),
  addr(5, "654 Cedar Ln", "Ottawa", "ON", "K1A 0B1"),
  addr(6, "987 Birch Blvd", "Montreal", "QC", "H2X 1Y4"),
];

export const mockUsers: User[] = [
  { id: 1, username: "jdoe", email: "john@example.com", userType: "CLIENT", firstName: "John", lastName: "Doe", dob: "1990-05-15", address: mockAddresses[0], rating: 4.5, phone: "416-555-0101", createdAt: "2025-11-01", status: "active" },
  { id: 2, username: "asmith", email: "alice@example.com", userType: "CLIENT", firstName: "Alice", lastName: "Smith", dob: "1988-09-22", address: mockAddresses[1], rating: 4.8, phone: "905-555-0202", createdAt: "2025-11-05", status: "active" },
  { id: 3, username: "mdriver", email: "mike@example.com", userType: "DRIVER", firstName: "Mike", lastName: "Johnson", dob: "1985-03-10", address: mockAddresses[2], rating: 4.7, phone: "604-555-0303", createdAt: "2025-10-15", status: "active" },
  { id: 4, username: "sjones", email: "sarah@example.com", userType: "DRIVER", firstName: "Sarah", lastName: "Jones", dob: "1992-07-18", address: mockAddresses[3], rating: 4.9, phone: "403-555-0404", createdAt: "2025-10-20", status: "active" },
  { id: 5, username: "admin1", email: "admin@swiftmove.com", userType: "ADMIN", firstName: "Admin", lastName: "User", dob: "1980-01-01", address: mockAddresses[4], rating: 5.0, phone: "613-555-0505", createdAt: "2025-09-01", status: "active" },
  { id: 6, username: "bwilson", email: "bob@example.com", userType: "CLIENT", firstName: "Bob", lastName: "Wilson", dob: "1995-12-03", address: mockAddresses[5], rating: 4.2, phone: "514-555-0606", createdAt: "2025-12-01", status: "inactive" },
];

export const mockDrivers: DriverInfo[] = [
  { id: 1, userId: 3, drivingExperience: 8, range: 150, drivingLicense: "DL-BC-12345", user: mockUsers[2] },
  { id: 2, userId: 4, drivingExperience: 5, range: 200, drivingLicense: "DL-AB-67890", user: mockUsers[3] },
];

export const mockVehicles: Vehicle[] = [
  { id: 1, driverId: 1, model: "Transit", make: "Ford", year: 2022, color: "White", vehicleType: "VAN", pricePerKm: 2.5, isActive: true, canCarryFurniture: true, licensePlate: "VAN-1234" },
  { id: 2, driverId: 1, model: "F-150", make: "Ford", year: 2023, color: "Blue", vehicleType: "TRUCK", pricePerKm: 3.0, isActive: true, canCarryFurniture: true, licensePlate: "TRK-5678" },
  { id: 3, driverId: 2, model: "Sienna", make: "Toyota", year: 2021, color: "Silver", vehicleType: "MINIVAN", pricePerKm: 2.0, isActive: true, canCarryFurniture: false, licensePlate: "MIN-9012" },
  { id: 4, driverId: 2, model: "RAV4", make: "Toyota", year: 2023, color: "Red", vehicleType: "SUV", pricePerKm: 1.8, isActive: false, canCarryFurniture: false, licensePlate: "SUV-3456" },
];

export const mockMoveRequests: MoveRequest[] = [
  { id: 1, clientId: 1, clientName: "John Doe", fromAddress: mockAddresses[0], toAddress: mockAddresses[1], moveDate: "2026-03-15", maxBudget: 500, status: "PENDING", luggageEntries: [{ luggageType: "MEDIUM", quantity: 5 }, { luggageType: "LARGE", quantity: 2 }], hasFurniture: true, notes: "Fragile items included", createdAt: "2026-02-20", offersCount: 3 },
  { id: 2, clientId: 2, clientName: "Alice Smith", fromAddress: mockAddresses[2], toAddress: mockAddresses[3], moveDate: "2026-03-20", maxBudget: 800, status: "ACCEPTED", luggageEntries: [{ luggageType: "SMALL", quantity: 10 }, { luggageType: "EXTRA_LARGE", quantity: 1 }], hasFurniture: false, createdAt: "2026-02-18", offersCount: 5 },
  { id: 3, clientId: 1, clientName: "John Doe", fromAddress: mockAddresses[4], toAddress: mockAddresses[5], moveDate: "2026-04-01", maxBudget: 350, status: "PENDING", luggageEntries: [{ luggageType: "SMALL", quantity: 3 }], hasFurniture: false, notes: "Small move, just boxes", createdAt: "2026-02-21", offersCount: 1 },
  { id: 4, clientId: 6, clientName: "Bob Wilson", fromAddress: mockAddresses[1], toAddress: mockAddresses[4], moveDate: "2026-02-28", maxBudget: 600, status: "COMPLETED", luggageEntries: [{ luggageType: "MEDIUM", quantity: 8 }, { luggageType: "LARGE", quantity: 4 }], hasFurniture: true, createdAt: "2026-02-10", offersCount: 4 },
  { id: 5, clientId: 2, clientName: "Alice Smith", fromAddress: mockAddresses[5], toAddress: mockAddresses[0], moveDate: "2026-03-25", maxBudget: 450, status: "PENDING", luggageEntries: [{ luggageType: "MEDIUM", quantity: 3 }, { luggageType: "SMALL", quantity: 6 }], hasFurniture: false, createdAt: "2026-02-22", offersCount: 0 },
];

export const mockMoveOffers: MoveOffer[] = [
  { id: 1, moveRequestId: 1, driverId: 1, driverName: "Mike Johnson", driverRating: 4.7, vehicleId: 1, vehicleInfo: "Ford Transit (VAN)", price: 420, offeredTime: "2026-03-15T09:00:00", status: "PENDING", createdAt: "2026-02-20" },
  { id: 2, moveRequestId: 1, driverId: 2, driverName: "Sarah Jones", driverRating: 4.9, vehicleId: 3, vehicleInfo: "Toyota Sienna (MINIVAN)", price: 380, offeredTime: "2026-03-15T10:00:00", status: "PENDING", createdAt: "2026-02-20" },
  { id: 3, moveRequestId: 2, driverId: 1, driverName: "Mike Johnson", driverRating: 4.7, vehicleId: 2, vehicleInfo: "Ford F-150 (TRUCK)", price: 720, offeredTime: "2026-03-20T08:00:00", status: "ACCEPTED", createdAt: "2026-02-19" },
  { id: 4, moveRequestId: 3, driverId: 2, driverName: "Sarah Jones", driverRating: 4.9, vehicleId: 3, vehicleInfo: "Toyota Sienna (MINIVAN)", price: 280, offeredTime: "2026-04-01T11:00:00", status: "PENDING", createdAt: "2026-02-22" },
  { id: 5, moveRequestId: 4, driverId: 1, driverName: "Mike Johnson", driverRating: 4.7, vehicleId: 1, vehicleInfo: "Ford Transit (VAN)", price: 550, offeredTime: "2026-02-28T07:00:00", status: "ACCEPTED", createdAt: "2026-02-11" },
];

export const mockMoveTrips: MoveTrip[] = [
  { id: 1, moveRequestId: 2, moveOfferId: 3, clientName: "Alice Smith", driverName: "Mike Johnson", fromAddress: mockAddresses[2], toAddress: mockAddresses[3], startTime: "2026-03-20T08:00:00", status: "SCHEDULED", price: 720 },
  { id: 2, moveRequestId: 4, moveOfferId: 5, clientName: "Bob Wilson", driverName: "Mike Johnson", fromAddress: mockAddresses[1], toAddress: mockAddresses[4], startTime: "2026-02-28T07:00:00", endTime: "2026-02-28T14:00:00", status: "COMPLETED", price: 550 },
];

export const mockAdminStats: DashboardStats = {
  totalUsers: 6,
  totalDrivers: 2,
  totalClients: 3,
  totalMoveRequests: 5,
  activeMoveTrips: 1,
  completedTrips: 1,
  totalVehicles: 4,
  totalRevenue: 1270,
};

export const recentActivity = [
  { id: 1, action: "New move request created", user: "John Doe", time: "2 hours ago", type: "request" as const },
  { id: 2, action: "Move offer submitted", user: "Sarah Jones", time: "3 hours ago", type: "offer" as const },
  { id: 3, action: "Move trip completed", user: "Mike Johnson", time: "5 hours ago", type: "trip" as const },
  { id: 4, action: "New user registered", user: "Bob Wilson", time: "1 day ago", type: "user" as const },
  { id: 5, action: "Vehicle added", user: "Mike Johnson", time: "2 days ago", type: "vehicle" as const },
];
