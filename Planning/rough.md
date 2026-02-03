# Auth Service

| Method | Path           | Description       |
| ------ | -------------- | ----------------- |
| GET    | /auth/login    | User login        |
| POST   | /auth/register | User registration |
| POST   | /auth/logout   | User logout       |

# User Service

| Method | Path        | Description      | Auth | Roles       |
| ------ | ----------- | ---------------- | ---- | ----------- |
| GET    | /users      | Get all users    | Yes  | Admin       |
| GET    | /users/me   | Get current user | Yes  | User, Admin |
| GET    | /users/{id} | Get user by ID   | Yes  | User, Admin |
| PUT    | /users/{id} | Update user by   | Yes  | User, Admin |
| DELETE | /users/{id} | Delete user by   | Yes  | Admin       |

# Client Service

| Method | Path                                | Description                           | Auth | Roles       |
| ------ | ----------------------------------- | ------------------------------------- | ---- | ----------- |
| GET    | /clients                            | Get all clients                       | Yes  | Admin       |
| GET    | /clients/{id}                       | Get client by ID                      | Yes  | User, Admin |
| GET    | /clients/{id}/move-requests/history | Get move requests for a client        | Yes  | User, Admin |
| GET    | /clients/{id}/move-requests/active  | Get active move requests for a client | Yes  | User, Admin |
| POST   | /clients/{id}/move-requests         | Create a move request for a client    | Yes  | User, Admin |
| POST   | /clients/                           |

# Driver Service

| Method | Path | Description | Auth | Roles |
| ------ | ---- | ----------- | ---- | ----- |
