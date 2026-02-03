# Identity and Access Management (IAM) Microservice

| Method | Path          | Description              | Auth | Roles       |
| ------ | ------------- | ------------------------ | ---- | ----------- |
| POST   | /iam/register | Register new user        | No   | -           |
| POST   | /iam/login    | User login               | No   | -           |
| POST   | /iam/logout   | User logout              | Yes  | User, Admin |
| GET    | /iam/profile  | Get current user profile | Yes  | User, Admin |
| PUT    | /iam/profile  | Update user profile      | Yes  | User, Admin |

# Driver Management Microservice

| Method | Path          | Description           | Auth | Roles         |
| ------ | ------------- | --------------------- | ---- | ------------- |
| GET    | /drivers/{id} | Get driver info       | Yes  | Driver, Admin |
| GET    | /drivers/me   | Get current driver    | Yes  | Driver, Admin |
| PUT    | /drivers/{id} | Update driver info    | Yes  | Driver, Admin |
| POST   | /drivers      | Create driver profile | Yes  | User          |

# Vehicle Management Microservice

| Method | Path           | Description             | Auth | Roles         |
| ------ | -------------- | ----------------------- | ---- | ------------- |
| GET    | /vehicles      | Get vehicles for driver | Yes  | Driver, Admin |
| POST   | /vehicles      | Add vehicle             | Yes  | Driver, Admin |
| PUT    | /vehicles/{id} | Update vehicle          | Yes  | Driver, Admin |
| DELETE | /vehicles/{id} | Deactivate vehicle      | Yes  | Driver, Admin |

# Move Request Management Microservice

| Method | Path                | Description                  | Auth | Roles         |
| ------ | ------------------- | ---------------------------- | ---- | ------------- |
| GET    | /move-requests      | Get move requests for client | Yes  | Client, Admin |
| POST   | /move-requests      | Create move request          | Yes  | Client, Admin |
| GET    | /move-requests/{id} | Get move request details     | Yes  | Client, Admin |
| PUT    | /move-requests/{id} | Update move request          | Yes  | Client, Admin |
| DELETE | /move-requests/{id} | Cancel move request          | Yes  | Client, Admin |

# Offer Management Microservice

| Method | Path                       | Description             | Auth | Roles         |
| ------ | -------------------------- | ----------------------- | ---- | ------------- |
| GET    | /offers                    | Get offers for driver   | Yes  | Driver, Admin |
| POST   | /offers                    | Create offer on request | Yes  | Driver, Admin |
| PUT    | /offers/{id}               | Update offer            | Yes  | Driver, Admin |
| GET    | /move-requests/{id}/offers | Get offers for request  | Yes  | Client, Admin |
| PUT    | /offers/{id}/accept        | Accept offer            | Yes  | Client, Admin |

# Trip Management Microservice

| Method | Path               | Description        | Auth | Roles         |
| ------ | ------------------ | ------------------ | ---- | ------------- |
| GET    | /trips             | Get trips for user | Yes  | User, Admin   |
| GET    | /trips/{id}        | Get trip details   | Yes  | User, Admin   |
| PUT    | /trips/{id}/status | Update trip status | Yes  | Driver, Admin |

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

# Admin Management Microservice

| Method | Path                      | Description      | Auth | Roles |
| ------ | ------------------------- | ---------------- | ---- | ----- |
| GET    | /admin/users              | Get all users    | Yes  | Admin |
| PUT    | /admin/users/{id}         | Update user      | Yes  | Admin |
| DELETE | /admin/users/{id}         | Delete user      | Yes  | Admin |
| GET    | /admin/move-requests      | Get all requests | Yes  | Admin |
| PUT    | /admin/move-requests/{id} | Update request   | Yes  | Admin |
| DELETE | /admin/move-requests/{id} | Delete request   | Yes  | Admin |
| GET    | /admin/offers             | Get all offers   | Yes  | Admin |
| PUT    | /admin/offers/{id}        | Update offer     | Yes  | Admin |
| DELETE | /admin/offers/{id}        | Delete offer     | Yes  | Admin |
| GET    | /admin/trips              | Get all trips    | Yes  | Admin |
| PUT    | /admin/trips/{id}         | Update trip      | Yes  | Admin |
| DELETE | /admin/trips/{id}         | Delete trip      | Yes  | Admin |
| GET    | /admin/vehicles           | Get all vehicles | Yes  | Admin |
| PUT    | /admin/vehicles/{id}      | Update vehicle   | Yes  | Admin |
| DELETE | /admin/vehicles/{id}      | Delete vehicle   | Yes  | Admin |
