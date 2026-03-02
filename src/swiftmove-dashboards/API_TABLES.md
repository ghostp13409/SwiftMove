# SwiftMove Dashboards API Reference

This document provides a summary of backend API endpoints invoked by services within the `swiftmove-dashboards` project. Each table lists the HTTP method, path (relative to the base URL), and a brief description of its purpose.

---

## authService

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/auth/login`        | Email/password login             |
| POST   | `/auth/register`     | Email/password register          |
| GET    | `/auth/google-login` | Redirect to Google OAuth login   |
| GET    | `/auth/check`        | Validate JWT and get auth status |
| GET    | `/auth/me`           | Fetch current user info          |
| POST   | `/auth/logout`       | Invalidate token / logout        |

---

## addressService

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| GET    | `/address/all`           | Get all addresses  |
| GET    | `/address/{id}`          | Get address by ID  |
| POST   | `/address/addNewAddress` | Create new address |
| PUT    | `/address/update/{id}`   | Update address     |
| DELETE | `/address/delete/{id}`   | Delete address     |

---

## driverService

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/drivers/me`            | Get current driver (JWT) |
| GET    | `/drivers/user/{userId}` | Get driver by user ID    |
| POST   | `/drivers/add`           | Create driver profile    |
| DELETE | `/drivers/{id}`          | Delete driver            |
| GET    | `/drivers/all`           | Get all drivers (admin)  |

---

## vehicleService

| Method | Endpoint                         | Description                     |
| ------ | -------------------------------- | ------------------------------- |
| GET    | `/vehicle/`                      | Get all vehicles (admin)        |
| GET    | `/vehicle/driver/{driverInfoId}` | Vehicles for a specific driver  |
| POST   | `/vehicle/`                      | Create new vehicle              |
| DELETE | `/vehicle/{id}`                  | Delete vehicle                  |
| PATCH  | `/vehicle/{id}/toggle-active`    | Toggle active status of vehicle |
| GET    | `/api/vehicle-types`             | Get all vehicle types           |

---

## moveOfferService

| Method | Endpoint                                           | Description                        |
| ------ | -------------------------------------------------- | ---------------------------------- |
| GET    | `/move-offer/move-offers/test`                     | Get all move offers (test/admin)   |
| GET    | `/move-offer/move-requests/{moveRequestId}/offers` | Offers for a specific move request |
| GET    | `/move-offer/driver/{driverId}`                    | Offers by driver                   |
| POST   | `/move-offer/offers`                               | Create move offer                  |
| PUT    | `/move-offer/offers/{id}`                          | Update move offer                  |
| PUT    | `/move-offer/offers/{id}/accept`                   | Accept a move offer                |
| DELETE | `/move-offer/{id}`                                 | Delete move offer                  |

---

## tripService

| Method | Endpoint                   | Description            |
| ------ | -------------------------- | ---------------------- |
| GET    | `/trips/allTrips`          | Get all trips (admin)  |
| GET    | `/trips/{id}`              | Get trip by ID         |
| GET    | `/trips/client/{clientId}` | Get trips for a client |
| GET    | `/trips/driver/{driverId}` | Get trips for a driver |

---

## clientService

| Method | Endpoint                             | Description                   |
| ------ | ------------------------------------ | ----------------------------- |
| GET    | `/client/allClients`                 | Get all clients (admin)       |
| GET    | `/client/getClient/{id}`             | Get specific client           |
| GET    | `/client/{id}/move-requests/active`  | Client's active move requests |
| GET    | `/client/{id}/move-requests/history` | Client's move request history |
| POST   | `/client/{clientId}/addMoveRequest`  | Add move request for a client |

---

## luggageService

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| GET    | `/api/luggage-types` | Get all luggage types |

---

## moveRequestService

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| GET    | `/move-request/get`         | Get all move requests   |
| GET    | `/move-request/{id}`        | Get move request by ID  |
| POST   | `/move-request/add`         | Create new move request |
| PUT    | `/move-request/edit/{id}`   | Update move request     |
| DELETE | `/move-request/delete/{id}` | Delete move request     |

---

## rentalService

| Method | Endpoint                          | Description                     |
| ------ | --------------------------------- | ------------------------------- |
| GET    | `/rental`                         | Get all rentals                 |
| GET    | `/rental/{id}`                    | Get rental by ID                |
| GET    | `/rental/active`                  | Get active rentals              |
| GET    | `/rental/completed`               | Get completed rentals           |
| GET    | `/rental/overdue`                 | Get overdue rentals (admin)     |
| GET    | `/rental/equipment/{equipmentId}` | Get equipment rental history    |
| POST   | `/rental/issue`                   | Issue equipment (create rental) |
| POST   | `/rental/return`                  | Return equipment                |
| PUT    | `/rental/{rentalId}`              | Extend rental (admin)           |
| DELETE | `/rental/{rentalId}`              | Cancel rental (admin)           |

---

## userService

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| GET    | `/users/all`              | Get all users (admin)     |
| GET    | `/users/allUsers`         | Alternative get all users |
| POST   | `/users/addUser`          | Create new user           |
| PUT    | `/users/iam/profile/{id}` | Update user profile       |
| GET    | `/users/userAddress/{id}` | Get user's address        |
| DELETE | `/users/iam/delete/{id}`  | Delete user               |

---

_Generated from the service definitions in the `swiftmove-dashboards` frontend project._
