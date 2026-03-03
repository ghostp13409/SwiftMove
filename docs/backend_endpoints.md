# Auth Microservice

| Method | Path           | Description       | Auth | Roles       |
| ------ | -------------- | ----------------- | ---- | ----------- |
| POST   | /auth/register | Register new user | No   | -           |
| POST   | /auth/login    | User login        | No   | -           |
| POST   | /auth/logout   | User logout       | Yes  | User, Admin |
| GET    | /auth/me       | Get current user  | Yes  | User, Admin |
| GET    | /auth/check    | check auth        | Yes  | Admin       |

## **Entry Point: http://localhost:8000** [API GATEWAY]

# User Microservice

| Method   | Path        | Description            |
| -------- | ----------- | ---------------------- |
| GET(all) | /users      | get all users          |
| GET {id} | /users/{id} | Get user by id         |
| POST     | /users      | Create new user        |
| PUT      | /users/{id} | Update user profile    |
| DELTE    | /users/{id} | delete based on userId |

<!-- | GET      | /users/1    | get the address based on userId | -->

### User Model:

```json
{
  "id": 81,
  "username": "admin",
  "firstName": "Test",
  "lastName": "Admin",
  "email": "test@admin.com",
  "passwordHash": "$2b$12$MostfNR5DwkEBn025Aohu.kmpOicVg/XbJnzWT01lZZ4fwo2QGLE2",
  "dob": "1983-05-07",
  "rating": null,
  "role": "ADMIN",
  "addressId": 180,
  "createdAt": "2026-02-28",
  "updatedAt": "2026-02-28"
}
```

# Address Microservice

| Method   | Path                   | Description         |
| -------- | ---------------------- | ------------------- |
| GET(all) | /address/all           | get all addresses   |
| GET {id} | /address/{id}          | Get current address |
| POST     | /address/addNewAddress | Create new address  |
| PUT      | /address/update/{id}   | Update address      |
| DELETE   | /address/delete/{id}   | remove address      |

# Driver Management Microservice (Driver Info + Vehicles + MoveOffers)

## Driver Info

| Method | Path          | Description           | Auth | Roles         |
| ------ | ------------- | --------------------- | ---- | ------------- |
| GET    | /drivers/{id} | Get driver info       | Yes  | Driver, Admin |
| GET    | /drivers/me   | Get current driver    | Yes  | Driver, Admin |
| PUT    | /drivers/{id} | Update driver info    | Yes  | Driver, Admin |
| POST   | /drivers/add  | Create driver profile | Yes  | User          |

## Vehicle

| Method | Path                         | Description              | Auth | Roles         |
| ------ | ---------------------------- | ------------------------ | ---- | ------------- |
| GET    | /vehicles                    | Get vehicles for driver  | Yes  | Driver, Admin |
| POST   | /vehicles                    | Add vehicle              | Yes  | Driver, Admin |
| PUT    | /vehicles/{id}               | Update vehicle           | Yes  | Driver, Admin |
| PATCH  | /vehicles/{id}               | Partially update vehicle | Yes  | Driver, Admin |
| PATCH  | /vehicles/{id}/toogle-active | Deactivate vehicle       | Yes  | Driver, Admin |
| DELETE | /vehicles/{id}               | Delete vehicle           | Yes  | Driver, Admin |

## MoveOffer

| Method | Path                                  | Description             | Auth | Roles         |
| ------ | ------------------------------------- | ----------------------- | ---- | ------------- |
| GET    | /move-offer/offers                    | Get offers for driver   | Yes  | Driver, Admin |
| POST   | /move-offer/offers                    | Create offer on request | Yes  | Driver, Admin |
| PUT    | /move-offer/offers/{id}               | Update offer            | Yes  | Driver, Admin |
| GET    | /move-offer/move-requests/{id}/offers | Get offers for request  | Yes  | Client, Admin |
| PUT    | /move-offer/offers/{id}/accept        | Accept offer            | Yes  | Client, Admin |

# Client Management Microservice (Client Info + Move Requests)

| Method | Path                                | Description                           | Auth | Roles       |
| ------ | ----------------------------------- | ------------------------------------- | ---- | ----------- |
| GET    | /client/allClients                  | Get all clients                       | Yes  | Admin       |
| GET    | client/getClient/{id}               | Get client by ID                      | Yes  | User, Admin |
| GET    | /client//{id}/move-requests/history | Get move requests for a client        | Yes  | User, Admin |
| GET    | /client/{id}/move-requests/active   | Get active move requests for a client | Yes  | User, Admin |
| POST   | /client/{id}/addMoveRequest         | Create a move request for a client    | Yes  | User, Admin |

# Move Request

| Method | Path                      | Description                  | Auth | Roles         |
| ------ | ------------------------- | ---------------------------- | ---- | ------------- |
| GET    | /move-request/get         | Get move requests for client | Yes  | Client, Admin |
| POST   | /move-request/add         | Create move request          | Yes  | Client, Admin |
| GET    | /move-requests/{id}       | Get move request details     | Yes  | Client, Admin |
| PUT    | /move-requests/edit/{id}  | Update move request          | Yes  | Client, Admin |
| DELETE | /move-request/delete/{id} | Cancel move request          | Yes  | Client, Admin |

# Trip Management Microservice

| Method | Path                   | Description              | Auth | Roles         |
| ------ | ---------------------- | ------------------------ | ---- | ------------- |
| GET    | /trips/allTrips        | Get all trips            | Yes  | Admin         |
| GET    | /trips/me [NA]         | Get current user's trips | Yes  | User, Admin   |
| GET    | /trips/{id}            | Get trip details         | Yes  | User, Admin   |
| PATCH  | /trips/{id}/status[NA] | Update trip status       | Yes  | Driver, Admin |

# Payment Microservice [NA]

| Method | Path           | Description              | Auth | Roles         |
| ------ | -------------- | ------------------------ | ---- | ------------- |
| POST   | /payments      | Process payment for trip | Yes  | Client, Admin |
| GET    | /payments/{id} | Get payment status       | Yes  | User, Admin   |

# Notification Microservice [NA]

| Method | Path                     | Description               | Auth | Roles       |
| ------ | ------------------------ | ------------------------- | ---- | ----------- |
| GET    | /notifications           | Get user notifications    | Yes  | User, Admin |
| PUT    | /notifications/{id}/read | Mark notification as read | Yes  | User, Admin |

# Map Service Microservice[NA]

| Method | Path           | Description                          | Auth | Roles |
| ------ | -------------- | ------------------------------------ | ---- | ----- |
| GET    | /maps/distance | Calculate distance between addresses | No   |       |

# Microservices

- Auth Microservice
- User Microservice
- Driver Management Microservice (Driver Info + Vehicles + MoveOffers)
- Client Management Microservice (Client Info + Move Requests)
- Trip Management Microservice (Move Trips)
- Payment Microservice
- Notification Microservice
- Map Service Microservice

```

```
