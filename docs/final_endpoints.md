# Client Microservice:

### Client

# Client Microservice

| Method   | Path                          | Description                                           | Returns           |
| -------- | ----------------------------- | ----------------------------------------------------- | ----------------- |
| GET(all) | /clients                      | get all users                                         | List<User>        |
| GET {id} | /clients/{id}                 | Get current user profile                              | User              |
| GET      | /clients/move-requests/active | Get active move requests for the current user(client) | List<MoveRequest> |
| GET      | /clients/move-requests        | Get all move requests for the current user(client)    | List<MoveRequest> |
| GET      | /clients/move-trips           | Get all move trips for the current user(client)       | List<MoveTrip>    |
| POST     | /clients/move-requests        | Create a move request for the current user(client)    | NI                |
| PUT      | /clients/move-requests/{id}   | Update a move request                                 | NI                |
| DELETE   | /clients/move-requests/{id}   | Cancel a move request                                 | void              |
