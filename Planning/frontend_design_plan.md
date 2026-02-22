# Client Dashboard

## Sidebar Sections

- Dashboard
- Move Requests
- Move Trips
- Profile

## Section Content

### Dashboard

- Overview of upcoming moves, recent activity.
- List of Move Offers on current Move Request.
- Quick access buttons for creating new Move Request, viewing active Move Trip, etc.

### Move Requests

- Add New Move Request Button
- List of all Move Requests with status badge (Pending, Accepted, Completed). (selectable to view details)
- Currently selected Move Request details:
  - Move Request information (Start/End Locations, Preffered Date/Time, Max Budget, Luggage Details, etc.)
  - List of Move Offers with details (driver name, car, price, driver ratings, Option to accept/reject a Move Offer.)

### New Move Request Form

- Start Location (input field with location autocomplete)
- End Location (input field with location autocomplete)
- Map showing route between start and end locations (optional)
- Preferred Date and Time (date and time picker)
- Max Budget (input field with currency symbol, pre-filled based on distance between start and end locations but editable)
- Luggage Cart
  - Number of Small Luggage (input field with increment/decrement buttons)
  - Number of Medium Luggage (input field with increment/decrement buttons)
  - Number of Large Luggage (input field with increment/decrement buttons)
  - Option to indicate if furniture is included (checkbox)
  - option to see luggage type chart with dimension and weight limits for each type
- Additional Notes (textarea for any special instructions or details)
- Submit Button

### Move Trips

- Currently Active Move Trip details (if any):
  - Move Trip information (Start/End Locations, Date/Time, Driver Details, etc.)
  - Option to contact driver (call or message).
  - Option to rate driver after trip completion.
- List of all Move Trips with status badge. (selectable to view details)
- Currently selected Move Trip details:
  - Move Trip information (Start/End Locations, Date/Time, Driver Details, etc.)
  - Option to contact driver (message).

# Driver Dashboard

## Sidebar Sections

- Dashboard
- Browse Move Requests
- Vehicles
- Move Offers
- Move Trips

## Section Content

### Dashboard

- Overview of upcoming trips, vehicles, recent activity.
- List of Move Offers on current Move Trips.

### Browse Move Requests

- List of all Move Requests with details (Start/End Locations, Preffered Date/Time, Max Budget, Luggage Details, etc.) (selectable to view details)
- Currently selected Move Request details:
  - Move Request information (Start/End Locations, Preffered Date/Time, Max Budget, Luggage Details, contains furniture badge etc.)
  - Option to make a Move Offer (option to select vehicles if multiple, price fixed based on selected vehicle, offered time(by default move request preffered time)).

### Vehicles

- List of all registered vehicles with details (Vehicle Cards) (Make/Model, Year, License Plate, Capacity, etc.) (selectable to view details)
- Add New Vehicle Button
- Currently selected Vehicle details: (pop up)
  - Vehicle information (Make/Model, Year, License Plate, Capacity, etc.)
  - Option to edit or delete vehicle.

### Add Vehicle Page

- Vehicle information fields (Make/Model, Year, License Plate)
- Select Vehicle Type
  - option to see vehicle type chart with capacity for each type
- option to select allow furniture (+2 dollars if selected)
- Price/km field (pre-filled based on selected vehicle type but editable)
- Option to add multiple vehicles in one go (add another vehicle button)
- Submit Button

### Move Offers

- List of all Move Offers with status badge (Pending, Accepted, Rejected). (selectable to view details)
- Currently selected Move Offer details:
  - Move Offer information (Move Request details, Offered Price, Offered Time, etc.)
  - Option to edit or delete Move Offer (only if status is Pending).
- Option to view Move Request details from Move Offer details.

### Move Trips

- Currently Active Move Trip details (if any):
  - Move Trip information (Start/End Locations, Date/Time, Client Details, etc.)
  - Option to contact client (call or message).
  - Option to rate client after trip completion.
- List of all Move Trips with status badge. (selectable to view details)
- Currently selected Move Trip details:
  - Move Trip information (Start/End Locations, Date/Time, Client Details, etc.)
  - Option to contact client (message).

# Admin Dashboard

## Sidebar Sections

- Dashboard
- Users
- Move Requests
- Move Offers
- Move Trips
- Vehicles

## Section Content

### Dashboard

- Overview of platform activity (number of users, move requests, move offers, active move trips, vehicles, finished move trips etc.)
- Recent activity feed (new users, new move requests, new move offers, new move trips, etc.)
- Data visualizations (charts/graphs) showing trends in move requests, move offers, move trips, user growth, etc.

### Users

- List of all users with details (Name, Email, Role, Status) (selectable to view details)
- Currently selected User details:
  - User information (Name, Email, Role, Status, Registration Date, etc.)
  - Option to edit user role or status (active/inactive).
  - Option to view user's move requests, move offers, move trips.
  - Option to delete user.
  - Option to reset user password.

### Move Requests

- List of all Move Requests with details (Start/End Locations, Preffered Date/Time, Max Budget, Luggage Details, Status) (selectable to view details)
- Currently selected Move Request details:
  - Move Request information (Start/End Locations, Preffered Date/Time, Max Budget, Luggage Details, Status, Client Details, etc.)
  - Option to edit or delete Move Request.
  - Option to view associated Move Offers and Move Trips.

### Move Offers

- List of all Move Offers with details (Move Request details, Offered Price, Offered Time, Status) (selectable to view details)
- Currently selected Move Offer details:
  - Move Offer information (Move Request details, Offered Price, Offered Time, Status, Driver Details, etc.)
  - Option to edit or delete Move Offer.
  - Option to view associated Move Request and Move Trip.
- Option to filter Move Offers by status (Pending, Accepted, Rejected).

### Move Trips

- List of all Move Trips with details (Start/End Locations, Date/Time, Driver Details, Client Details, Status) (selectable to view details)
- Currently selected Move Trip details:
  - Move Trip information (Start/End Locations, Date/Time, Driver Details, Client Details, Status, etc.)
  - Option to edit or delete Move Trip.
- Option to filter Move Trips by status (Active, Completed, Cancelled).

### Vehicles

- List of all registered vehicles with details (Vehicle Cards) (Make/Model, Year, License Plate, Capacity, Driver Details, etc.) (selectable to view details)
- Currently selected Vehicle details: (pop up)
  - Vehicle information (Make/Model, Year, License Plate, Capacity, Driver Details, etc.)
  - Option to edit or delete vehicle.
  - Option to view associated Driver details and Move Offers using the vehicle.
  - Option to filter Vehicles by make/model, year, capacity, etc.
  - Option to view all vehicles associated with a specific driver.
  - Option to view all move offers associated with a specific vehicle.
  - Option to view all move trips associated with a specific vehicle.
  - Option to view all move requests associated with a specific vehicle.

# Common Features

### Profile Section (Side Panel)

- Profile Section at the bottom of side panel
  - View and edit profile information (name, email, password, etc.)
  - Option to log out.

### Profile Page

- Profile information fields (Name, Email, Phone Number, etc.)
- Option to edit profile information
- Option to change password

### Auth Pages

- Login Page
  - Email and password fields
  - OAuth login options (Google)
  - Option to log in as client, driver, or admin
  - Link to registration page
- Registration Page
  - user_info fields (Name, email, username, password, gender, etc.)
  - Role selection (client or driver)
  - OAuth registration options (Google)
  - Link to login page
- Driver Registration Page (if driver role selected)
  - Additional fields for driver_info registration (license number, add first vehicle, location etc.)
- Client Registration Page (if client role selected)
  - Additional fields for client_info registration (location etc.)
- Password Reset Page
  - Email field to receive password reset instructions
  - Link to login page
