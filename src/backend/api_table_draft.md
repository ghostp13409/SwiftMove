# Auth Microservice

| Method | Path          | Description       | Auth | Roles       |
| ------ | ------------- | ----------------- | ---- | ----------- |
| POST   | /iam/register | Register new user | No   | -           |
| POST   | /iam/login    | User login        | No   | -           |
| POST   | /iam/logout   | User logout       | Yes  | User, Admin |

# User Microservice

| Method | Path         | Description              | Auth | Roles       |
| ------ | ------------ | ------------------------ | ---- | ----------- |
| GET    | /iam/profile | Get current user profile | Yes  | User, Admin |
| POST   | /user        | Create new user          | No   | -           |
| PUT    | /iam/profile | Update user profile      | Yes  | User, Admin |

# Driver Management Microservice (Driver Info + Vehicles + MoveOffers)

## Driver Info

| Method | Path          | Description           | Auth | Roles         |
| ------ | ------------- | --------------------- | ---- | ------------- |
| GET    | /drivers/{id} | Get driver info       | Yes  | Driver, Admin |
| GET    | /drivers/me   | Get current driver    | Yes  | Driver, Admin |
| PUT    | /drivers/{id} | Update driver info    | Yes  | Driver, Admin |
| POST   | /drivers      | Create driver profile | Yes  | User          |

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

| Method | Path                       | Description             | Auth | Roles         |
| ------ | -------------------------- | ----------------------- | ---- | ------------- |
| GET    | /offers                    | Get offers for driver   | Yes  | Driver, Admin |
| POST   | /offers                    | Create offer on request | Yes  | Driver, Admin |
| PUT    | /offers/{id}               | Update offer            | Yes  | Driver, Admin |
| GET    | /move-requests/{id}/offers | Get offers for request  | Yes  | Client, Admin |
| PUT    | /offers/{id}/accept        | Accept offer            | Yes  | Client, Admin |

# Client Management Microservice (Client Info + Move Requests)

| Method | Path                                | Description                           | Auth | Roles       |
| ------ | ----------------------------------- | ------------------------------------- | ---- | ----------- |
| GET    | /clients                            | Get all clients                       | Yes  | Admin       |
| GET    | /clients/{id}                       | Get client by ID                      | Yes  | User, Admin |
| GET    | /clients/{id}/move-requests/history | Get move requests for a client        | Yes  | User, Admin |
| GET    | /clients/{id}/move-requests/active  | Get active move requests for a client | Yes  | User, Admin |
| POST   | /clients/{id}/move-requests         | Create a move request for a client    | Yes  | User, Admin |

# Move Request

| Method | Path                | Description                  | Auth | Roles         |
| ------ | ------------------- | ---------------------------- | ---- | ------------- |
| GET    | /move-requests      | Get move requests for client | Yes  | Client, Admin |
| POST   | /move-requests      | Create move request          | Yes  | Client, Admin |
| GET    | /move-requests/{id} | Get move request details     | Yes  | Client, Admin |
| PUT    | /move-requests/{id} | Update move request          | Yes  | Client, Admin |
| DELETE | /move-requests/{id} | Cancel move request          | Yes  | Client, Admin |

# Trip Management Microservice

| Method | Path               | Description              | Auth | Roles         |
| ------ | ------------------ | ------------------------ | ---- | ------------- |
| GET    | /trips             | Get all trips            | Yes  | Admin         |
| GET    | /trips/me          | Get current user's trips | Yes  | User, Admin   |
| GET    | /trips/{id}        | Get trip details         | Yes  | User, Admin   |
| PATCH  | /trips/{id}/status | Update trip status       | Yes  | Driver, Admin |

# Payment Microservice

| Method | Path           | Description              | Auth | Roles         |
| ------ | -------------- | ------------------------ | ---- | ------------- |
| POST   | /payments      | Process payment for trip | Yes  | Client, Admin |
| GET    | /payments/{id} | Get payment status       | Yes  | User, Admin   |

# Notification Microservice

| Method | Path                     | Description               | Auth | Roles       |
| ------ | ------------------------ | ------------------------- | ---- | ----------- |
| GET    | /notifications           | Get user notifications    | Yes  | User, Admin |
| PUT    | /notifications/{id}/read | Mark notification as read | Yes  | User, Admin |

# Map Service Microservice

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
