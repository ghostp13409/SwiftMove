# Client Microservice:

### Client

| Method | Path                                | Description                               |
| ------ | ----------------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| GET    | /clients/                           | Get all clients                           |
| GET    | /clients/{id}                       | Get client by ID                          |
| GET    | /clients/me                         | Get Current Client                        |
| GET    | /clients/move-requests              | Get move requests for current client      |
| GET    | /clients/move-requests/all          | Get all move requests                     |
| GET    | /clients/move-requests/{id}         | Get MoveRequest by moveRequestId          |
| POST   | /clients/move-requests              | Create MoveRequest for the Current Client | (will need Auth Headers) (with driverId param for client) |
| PUT    | /clients/move-requests/{id}         | Edit MoveRequest                          |
| DELETE | /clients/move-requests/{id}         | Delete MoveRequest                        |
| GET    | /clients/{id}/move-requests/active  | Get active move requests for a client     |
| GET    | /clients/move-requests/luggage      | Get luggage entires by moveRequestId      | (moveRequestId Request Param)                             |
| POST   | /clients/move-requests/luggage      | Create luggage entry by moveRequestId     | (moveRequestId Request Param)                             |
| PUT    | /clients/move-requests/luggage/{id} | Update luggage entry by luggageId         | (UpdateLuggageEntry Body)                                 |

# Driver Microservice:

| Method | Path                       | Description                                |
| ------ | -------------------------- | ------------------------------------------ | ------------------------------- |
| GET    | /drivers                   | Get all drivers                            |                                 |
| GET    | /drivers/{id}              | Get driver by ID                           |
| GET    | /driver/me                 | Get the current Driver (User)              |
| POST   | /drivers                   | Create driver                              | Not implemented                 |
| DELETE | /drivers/{id}              | Delete driver                              |
| GET    | /drivers/info              | Get all driver info                        |
| GET    | /drivers/info/me           | Get current driver info                    |
| GET    | /drivers/info/{id}         | Get driver info by ID                      |
| GET    | /drivers/info/by-user      | Get driver info by driver ID               | (driverId Request Param)        |
| POST   | /drivers/info              | Create driver info                         |
| PUT    | /drivers/info/{id}         | Update driver info                         |
| GET    | /drivers/move-offers       | Get all move offers                        |
| GET    | /drivers/move-offers       | Get all move offers for a move-request     | (moveRequestId Request Param)   |
| GET    | /drivers/move-offers       | Get all move offers for a driver           | (driverId Request Param)        |
| GET    | /drivers/move-offers/me    | Get all move offers for the current driver |
| GET    | /drivers/move-offers/{id}  | Get move offer by id                       |
| POST   | /drivers/move-offers       | create a move offer for current driver     | (with driverId param for admin) |
| PUT    | /drivers/move-offers/{id}  | Edit a move offer                          |
| DELETE | /drivers/move-offers/{id}  | Delete a move offer                        |
| GET    | /drivers/vehicles          | Get all vehicles                           |
| GET    | /drivers/vehicles          | Get all vehicles for a driver              | (driverId Request Param)        |
| GET    | /drivers/vehicles/me       | Get all vehicles for the current driver    |
| GET    | /drivers/vehicles/{id}     | Get vehicle by id                          |
| POST   | /drivers/vehicles          | Add a vehicle for current driver           | (with driverId param for admin) |
| PUT    | /drivers/vehicles/{id}     | Edit a vehicle                             |
| DELETE | /drivers/vehicles/{id}     | Delete a vehicle                           |
| GET    | /drivers/vehicles/types    | Get all vehicle types                      |
| GET    | /drivers/vehicles/get-type | Get a vehicle type by vehicle              | (vehicleId Request Param)       |
