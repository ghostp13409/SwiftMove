# TODOs:

# Current Scope:

1. Drivers should be able to recieve all move requests
2. Drivers should be able to set the price for the move offer (no automatic price calculation based on vehicle and distance)
3. On the frontend, driver should be able to see a send offer button for each move request, and when they click on it, a pop up should appear where they can enter the price and send the offer to the client. (no automatic price calculation based on vehicle and distance)
4. Clients should be able to see all the offers they recieved for their move request, and they should be able to accept an offer or reject it. When they accept an offer, the move request status should be updated to "ACCEPTED" and the offer status should be updated to "ACCEPTED". When they reject an offer, the offer status should be updated to "REJECTED". (no automatic price calculation based on vehicle and distance). Also a new MoveTrip should be created with with moveOfferId and moveRequestId and status of "SCHEDULED"
5. Both Clients and Drivers should be able to see all of their move trips, and the move trip should have the move request and move offer details. (no automatic price calculation based on vehicle and distance)
6. When Driver tries to browse the move requst, it sends call to backend api that sends the all the move requests for the current client. which in this case is a driver which doesn't have any, so it neeeds to show all active move requests that are in the db. and have status "CREATED" OR "OFFER_AVAILABLE"
7. Vehicle panel on the fronend, has soo many bugs, new vehicle form doesn't even show new vehicles
