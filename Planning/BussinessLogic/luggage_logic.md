# Luggage Logic

**Overview:**
Luggages are categorized into 5 types of LuggageType enities. Each Luggagetype would have volume and weight attributes to them. These Luggagetypes would be assosiated with move requests with a join table called LuggageEntries which would contain the moveRequestId, luggageTypeId and quantity of that luggage type. This would allow us to calculate the total volume and weight of the move request.

- Each MoveRequest can have at max 5 LuggageEntries (1 for each LuggageType)
- Each LuggageEntry would have a quantity of that luggage type for that move request.

### Luggage Type:

```javascript
LuggageType {
  id: number,
  type: string,
  luggageTypeEnum: "SMALL" | "MEDIUM" | "LARGE" | "EXTRA_LARGE" | "EXTRA_EXTRA_LARGE",
  name: string,
  volume: number,
  weight: number,
}
```

### Luggage Entry:

```javascript
LuggageEntry {
  id: number,
  moveRequestId: number,
  luggageTypeId: number,
  quantity: number,
}
```
