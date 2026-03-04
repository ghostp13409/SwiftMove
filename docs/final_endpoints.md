# Client Microservice:

### Client

| Method | Path                               | Description                               |
| ------ | ---------------------------------- | ----------------------------------------- | ----------------------------- |
| GET    | /clients/                          | Get all clients                           |
| GET    | /clients/{id}                      | Get client by ID                          |
| GET    | /clients/me                        | Get Current Client                        |
| GET    | /clients/move-requests             | Get move requests for a client            |
| GET    | /clients/move-request/{id}         | Get MoveRequest by moveRequestId          |
| POST   | /clients/move-request              | Create MoveRequest for the Current Client | (will need Auth Headers)      |
| PUT    | /clients/move-request/{id}         | Edit MoveRequest                          |
| DELETE | /clients/move-request/{id}         | Delete MoveRequest                        |
| GET    | /clients/{id}/move-requests/active | Get active move requests for a client     |
| GET    | /clients/move-request/luggage      | Get luggage entires by moveRequestId      | (moveRequestId Request Param) |
| POST   | /clients/move-request/luggage      | Create luggage entry by moveRequestId     | (moveRequestId Request Param) |
| PUT    | /client/move-request/luggage/{id}  | Update luggage entry by luggageId         | (UpdateLuggageEntry Body)     |
