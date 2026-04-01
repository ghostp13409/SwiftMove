# Demo Flow

This document outlines the instructions for how the system should be work for the demo and the changes that are needed to make it work.

## Overall Changes:

- Payment logic needs to be implemented.
- Might need to change the status logic for move request, offer and trip. some new statuses might be needed to added or if already present, we might need to change the flow of how they are implemented.

## Payment Logic

Currently, the payment logic is not implemented and some level of implementation was done in the payment-integration branch. However, for the demo, we can implement it again here. The payment logic will be simplified for the demo, and we will simulate the payment process using Stripe's sandbox environment. This will allow us to test the flow of the move scheduling and completion without actual financial transactions.

The api keys are provided in the .env file, so you can observe the name and implement it in the code.

Currently, an template service has been created for the payment logic, named payment-service in the backend.

## Move Status Logic

### Accepting the move Offer:

When client accepts the move offer, they should be redirected to make the payment with an option to pay later.

- Once Client accepts the move offer, a move trip should be created with the status "Payment Pending".
- If client pays successfully, the move trip status should be updated to "Scheduled".
- If client chooses to pay later or if the payment fails, the move trip status should remain "Payment Pending".
- Until move trip has payment-pending status, The move trip should show an option to make the payment for the client.
- Once the payment is successful, the move trip status should be updated to "Scheduled". This indicates that the move has been scheduled and is awaiting the move date.

### Finishing the move:

For the Demo purpose, we can skip the date and time logic for finishing the move and we give the driver and the client the option to mark the move as completed.

- Once the Move Trip Status is "Scheduled", Show driver the option to start the Move.
  - Once the driver starts the move, the move trip status should be updated to "In Progress".
- Once the move is in progress, show the driver the option to mark the move as completed.
- Once the driver marks the move as completed, the move trip status should be updated to "Driver Completed".
- Once the move trip status is "Driver Completed", show the client the option to mark the move as completed.
- Once the client marks the move as completed, the move trip status should be updated to "Completed".
- Once the move trip status is "Completed", The payment should be released to the driver, and both the driver and client should be prompted to rate each other.

**Note:** Simulate the driver recieved payment as driver's payment info is not implemented yet, so we can just show a message to the driver that they have received the payment for the move once the move is marked as completed by the client.

### Required Changes:

These are some of the areas which should be considered to implement the above flow: (might or might not need changes in all of these areas, but these are the areas that should be looked into to implement the above flow)

- DB Table Creation and Seeding Script
- Appropriate Microservices and their methods
- API Routes and their handlers
- Frontend UI changes
  - Pages might needed to be added or removed based on the flow changes.
  - Payment UI for the client to make the payment after accepting the move offer.
  - Option for the driver to start the move and mark it as completed.
  - Option for the client to mark the move as completed after the driver has marked it as completed.
