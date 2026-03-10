# Move Request/Offer Matching Logic

**Trigger:** When driver clicks on Browse Move Requests

**Overview:**
The Move Request/Offers will be matched based on the moverequest locations, driver location, driver's range, move request's luggage entires' total volume and weight, and the vehicle's capacity. The price of the move offer would be determined by the move request's to/from distance and the driver's vehicle's price per km.

**Note:** For implementing it, Strategy design pattern can be considered to separate the matching logic into different strategies for each filtering criteria (luggage, location, furniture, price) and then combine the results to determine the final matches.

### Car Activation Filtering:

1. Check if the driver's car is active.
2. If the car is active, the driver is considered a match, otherwise it is not a match.

### Luggage Filtering:

1. Calculate the total volume and weight of the move request's luggage entries.
2. Check if the total volume and weight of the move request's luggage entries are within the driver's vehicle capacity.
3. If within the capaticity, the vehicle for this move request is considered a match, otherwise it is not a match.

### Location Filtering:

1. Calculate the distance between the move request's from and to locations and the driver's current location.
2. Check if both the from and to distances are within the driver's range.
3. If both distances are within the driver's range, the driver is considered a match, otherwise it is not a match.

### Furniture Filtering:

1. Check if the move request has any furniture entries.
2. If there are furniture entries, check if the driver's vehicle has can carry furniture.
3. If the driver's vehicle can carry furniture, the driver is considered a match, otherwise it is not a match.

### Price Filtering:

1. Calculate the price of the move offer based on the move request's to/from distance and the driver's vehicle's price per km.
2. Check if the calculated price is within the move request's budget.
3. If the price is within the budget, the move offer is considered a match, otherwise it is not a match.

### Things to consider:

- What should be the order of applying the filters? Should it be based on the most restrictive filter first to reduce the number of matches early on?
- What would be the most optimal and efficient way to implement the matching logic, especially when there are a large number of move requests and drivers? Should we consider using a database query with appropriate indexing to filter the matches instead of doing it in memory?
- Do we need a new service to handle the matching logic, or should it belong to trip-service?

---

# Move Request Max Budget Suggestion Logic:

**Trigger:** When client puts in Move Request To/From locations

**Overview:**
The system will suggest a max budget for the move request based on the distance between the to/from locations and the average price per km for the driver's vehicles that are active and can carry the move request's luggage and furniture entries. (we should'd do the average price per km everytime we create a move request, system should calculate and store the average price in some kind of cache or database table and update it periodically to avoid performance issues)

### Steps:

1. Calculate the distance between the move request's from and to locations.
2. Retrieve the average price per km for the driver's vehicles that are active and can carry the move request's luggage and furniture entries.
3. Calculate the suggested max budget by multiplying the distance with the average price per km.
4. Suggest the calculated max budget to the client when they input the to/from locations for the move request.

### Things to consider:

- How frequently should the average price per km be updated in the cache or database table to ensure that the suggested max budget is accurate and reflects the current market conditions?
- How do we implement the logic to get distance between two locations? Should we use a third-party API like Google Maps or Mapbox? Is there any free option with acceptable accuracy and limits?

# Current State of the Logic & Next Steps:

**Current System:**

- Client puts the to/from locations by a form field. there is no location autocomplete or validation for the locations, so the addresses might conflict while getting coordinates for distance calculation.
- There is no implementation of calculating distance for Move Request
- There is no implementation of calculating price for Move Request
- There is no implementation of matching logic for Move Request/Offers
- Driver can see all Move Requests when they click on Browse Move Requests, regardless of the matching criteriaj
- Client can input any max budget for their Move Request
- There is no suggestion for max budget when client inputs to/from locations for Move Request
- Driver can manually set move offer price when they create a move offer.
- Driver can see Max Budget of the Move Request.

**Next Steps:**

1. Implement distance calculation logic for Move Requests.
2. Implement matching logic for the Move Request/Offers based on the criteria mentioned above.
3. Implement max budget suggestion logic for Move Requests based on the distance and average price per km for the driver's vehicles.
4. Implement price calculation logic for Move Requests.

**Constraints:**

- The distance calculation api should be reliable, and completely free.
- the price calculation and matching logic should be efficient and optimized to handle a large number of move requests and drivers without performance issues.
- The distance calculation should be accurate and should consider edge cases such as invalid addresses or locations that are not serviceable.

# Additional Instructions for AI:

- It's a huge task, so we can break it down into smaller tasks and implement them iteratively.
- You can create a roadmap for implementing the logic, and prioritize the tasks based on their dependencies and importance.
- after creating a roadmap and your current understanding of the system, you should create a comprehensive documentation for quickly reading and understanding the current state of the system, the current progression and the next steps for implementing the logic. The aim of this documentation is to help you catch up to your previous session and help you understand what you need to do so make sure you create it that way. You can store this documentation in a markdown file in a new folder called AI_Notes.
- Take notes and update documentation after finishing each part of the logic.
