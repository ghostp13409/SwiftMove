# Auth Microservice

| Method | Path          | Description           | Auth | Roles       |
| ------ | ------------- | --------------------- | ---- | ----------- |
| GET    | /iam/check    | Check auth status     | Yes  | User, Admin |
| GET    | /iam/me       | Get current user info | Yes  | User, Admin |
| POST   | /iam/register | Register new user     | No   | -           |
| POST   | /iam/login    | User login            | No   | -           |
| POST   | /iam/logout   | User logout           | Yes  | User, Admin |

## **Entry Point: http://localhost:8000** [API GATEWAY]

# User Microservice (Current)

| Method   | Path                    | Description                     | Auth | Roles       | Consumer |
| -------- | ----------------------- | ------------------------------- | ---- | ----------- | -------- |
| GET(all) | /users/allUsers         | get all users                   |      |             | Admin    |
| GET {id} | users/iam/profile/{id}  | Get current user profile        | Yes  | User, Admin |          |
| POST     | /users/addUser          | Create new user                 | No   | -           | Auth     |
| PUT      | /users/iam/profile/{id} | Update user profile             | Yes  | User, Admin | User     |
| GET      | /users/userAddress/1    | get the address based on userId | Yes  | User, Admin |          |
| DELTE    | /users/iam/delete/{id}  | delete based on userId          | Yes  | Admin       |          |

### Changes:

| Method  | Current                  | Proposed    | Description    |
| ------- | ------------------------ | ----------- | -------------- |
| GET     | /users/allUsers          | /users      |                |
| GET     | users/miam/profile/{id}  | /users/me   |                |
| GET     | (New)                    | /users/{id} | Get user by ID |
| ~~GET~~ | ~~/users/userAddress/1~~ | (Delete)    |                |
| POST    | /users/addUser           | /users      |                |
| PUT     | /users/iam/profile/{id}  | /users/{id} |                |
| DELETE  | /users/iam/delete/{id}   | /users/{id} |                |

# Driver Management Microservice (Driver Info + Vehicles + MoveOffers)

## Driver Info

| Method | Path          | Description           | Auth | Roles         |
| ------ | ------------- | --------------------- | ---- | ------------- |
| GET    | /drivers/{id} | Get driver info       | Yes  | Driver, Admin |
| GET    | /drivers/me   | Get current driver    | Yes  | Driver, Admin |
| PUT    | /drivers/{id} | Update driver info    | Yes  | Driver, Admin |
| POST   | /drivers/add  | Create driver profile | Yes  | User          |

### Changes:

| Method | Current      | Proposed  | Description |
| ------ | ------------ | --------- | ----------- |
| POST   | /drivers/add | /drivers/ |             |

## Vehicle

| Method | Path                         | Description              | Auth | Roles         |
| ------ | ---------------------------- | ------------------------ | ---- | ------------- |
| GET    | /vehicles                    | Get vehicles for driver  | Yes  | Driver, Admin |
| POST   | /vehicles                    | Add vehicle              | Yes  | Driver, Admin |
| PUT    | /vehicles/{id}               | Update vehicle           | Yes  | Driver, Admin |
| PATCH  | /vehicles/{id}               | Partially update vehicle | Yes  | Driver, Admin |
| PATCH  | /vehicles/{id}/toogle-active | Deactivate vehicle       | Yes  | Driver, Admin |
| DELETE | /vehicles/{id}               | Delete vehicle           | Yes  | Driver, Admin |

### Changes:

| Method | Current                      | Proposed                     | Description |
| ------ | ---------------------------- | ---------------------------- | ----------- |
| PATCH  | /vehicles/{id}/toogle-active | /vehicles/toggle-active/{id} |             |

## MoveOffer

| Method | Path                                  | Description             | Auth | Roles         |
| ------ | ------------------------------------- | ----------------------- | ---- | ------------- |
| GET    | /move-offer/offers                    | Get offers for driver   | Yes  | Driver, Admin |
| POST   | /move-offer/offers                    | Create offer on request | Yes  | Driver, Admin |
| PUT    | /move-offer/offers/{id}               | Update offer            | Yes  | Driver, Admin |
| GET    | /move-offer/move-requests/{id}/offers | Get offers for request  | Yes  | Client, Admin |
| PUT    | /move-offer/offers/{id}/accept        | Accept offer            | Yes  | Client, Admin |

### Changes:

| Method | Current                               | Proposed                    | Description                   |
| ------ | ------------------------------------- | --------------------------- | ----------------------------- |
| GET    | (New)                                 | /move-offers?driverId={id}  | Get offers by driver          |
| GET    | /move-offer/offers                    | /move-offers/me             | Get offers for current driver |
| GET    | (New)                                 | /move-offers/{id}           | Get offer by id               |
| GET    | /move-offer/move-requests/{id}/offers | /move-offers?requestId={id} | Get offers by move-request    |
| POST   | /move-offer/offers                    | /move-offers/               | Create offer on request       |
| PUT    | /move-offer/offers/{id}               | /move-offers/{id}           | Update offer                  |
| PUT    | /move-offer/offers/{id}/accept        | /move-offer/send-offer      | Send offer to client          |

# Client Management Microservice (Client Info + Move Requests)

| Method | Path                                | Description                           | Auth | Roles       |
| ------ | ----------------------------------- | ------------------------------------- | ---- | ----------- |
| GET    | /client/allClients                  | Get all clients                       | Yes  | Admin       |
| GET    | /client/getClient/{id}              | Get client by ID                      | Yes  | User, Admin |
| GET    | /client//{id}/move-requests/history | Get move requests for a client        | Yes  | User, Admin |
| GET    | /client/{id}/move-requests/active   | Get active move requests for a client | Yes  | User, Admin |
| POST   | /client/{id}/addMoveRequest         | Create a move request for a client    | Yes  | User, Admin |

### Changes:

| Method   | Current                                 | Proposed      | Description        |
| -------- | --------------------------------------- | ------------- | ------------------ |
| GET      | /client/allClients                      | /clients      | Get all clients    |
| GET      | /client/getClient/{id}                  | /clients/{id} | Get client by ID   |
| GET      | (New)                                   | /clients/me   | Get current client |
| ~~GET~~  | ~~/client//{id}/move-requests/history~~ | (Delete)      |                    |
| ~~GET~~  | ~~/client/{id}/move-requests/active~~   | (Delete)      |                    |
| ~~POST~~ | ~~/client/{id}/addMoveRequest~~         | (Delete)      |                    |

# Move Request

| Method | Path                      | Description                  | Auth | Roles         |
| ------ | ------------------------- | ---------------------------- | ---- | ------------- |
| GET    | /move-request/get         | Get move requests for client | Yes  | Client, Admin |
| POST   | /move-request/add         | Create move request          | Yes  | Client, Admin |
| GET    | /move-requests/{id}       | Get move request details     | Yes  | Client, Admin |
| PUT    | /move-requests/edit/{id}  | Update move request          | Yes  | Client, Admin |
| DELETE | /move-request/delete/{id} | Cancel move request          | Yes  | Client, Admin |

### Changes:

| Method | Current             | Proposed                     | Description                          |
| ------ | ------------------- | ---------------------------- | ------------------------------------ |
| GET    | (New)               | /move-requests               | Get All MoveRequests                 |
| GET    | (New)               | /move-requests/me            | Get move requests for current client |
| GET    | (New)               | /move-requests?clientId={id} | Get move requests by client          |
| GET    | /move-requests/{id} | /move-requests/{id}          | Get move request details             |
| POST   | /move-request/add   | /move-requests               | Create move request                  |

| GET | /move-offer/move-requests/{id}/offers | /move-requests/{id}/offers | Get offers for request |

# Trip Management Microservice

| Method | Path                   | Description              | Auth | Roles         |
| ------ | ---------------------- | ------------------------ | ---- | ------------- |
| GET    | /trips/allTrips        | Get all trips            | Yes  | Admin         |
| GET    | /trips/me [NA]         | Get current user's trips | Yes  | User, Admin   |
| GET    | /trips/{id}            | Get trip details         | Yes  | User, Admin   |
| PATCH  | /trips/{id}/status[NA] | Update trip status       | Yes  | Driver, Admin |

### Changes:

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

# Location Microservice (Maps + Addresses)

## Map

| Method | Path           | Description                          | Auth | Roles |
| ------ | -------------- | ------------------------------------ | ---- | ----- |
| GET    | /maps/distance | Calculate distance between addresses | No   |       |

## Address

| Method   | Path                   | Description         |
| -------- | ---------------------- | ------------------- |
| GET(all) | /address/all           | get all addresses   |
| GET {id} | /address/{id}          | Get current address |
| POST     | /address/addNewAddress | Create new address  |
| PUT      | /address/update/{id}   | Update address      |
| DELETE   | /address/delete/{id}   | remove address      |

### Changes:

| Method | Current                | Proposed        | Description |
| ------ | ---------------------- | --------------- | ----------- |
| GET    | /address/all           | /addresses      |             |
| GET    | /address/{id}          | /addresses/{id} |             |
| POST   | /address/addNewAddress | /addresses      |             |
| PUT    | /address/update/{id}   | /addresses/{id} |             |
| DELETE | /address/delete/{id}   | /addresses/{id} |             |

# Microservices

- Auth Microservice
- User Microservice
- Driver Management Microservice (Driver Info + Vehicles + MoveOffers)
- Client Management Microservice (Client Info + Move Requests)
- Trip Management Microservice (Move Trips)
- Payment Microservice
- Notification Microservice
- Map Service Microservice
