# Move Status Flow

## Move Statuses:

**MoveRequest:** "CREATED" -> "OFFER_AVAILABLE" -> "ACCEPTED" or "CANCELLED"

**MoveOffer:** "OFFER_SENT" -> "ACCEPTED" or "REJECTED" or "CANCELLED"

**MoveTrip:** "SCHEDULED" -> "IN_PROGRESS" -> "COMPLETED" or "CANCELLED"

## Flow:

1. Client creates a MoveRequest ( Move Request status: "CREATED")
2. Driver Sends an offer to the MoveRequest ( Move Offer status: "OFFER_SENT", Move Request status: "OFFER_AVAILABLE")
3. client accepts the offer ( Move Offer status: "ACCEPTED", Move Request status: "ACCEPTED", Move Trip status: "SCHEDULED")
4. On the day and time of the move, ( Move Trip status: "IN_PROGRESS")
