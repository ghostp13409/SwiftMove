# SwiftMove Frontend Implementation Plan

## Overview

This plan outlines the complete frontend implementation for the SwiftMove application, including three separate dashboards for Clients, Drivers, and Admins, along with shared authentication and profile pages.

## Project Structure

```
src/frontend/src/
├── pages/
│   ├── AuthPages/
│   │   ├── SignIn.tsx (enhanced with role selection)
│   │   ├── SignUp.tsx (enhanced with role-specific registration)
│   │   └── AuthPageLayout.tsx
│   ├── Dashboard/
│   │   ├── Home.tsx (role-based dashboard)
│   │   ├── ClientDashboard.tsx
│   │   ├── DriverDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── ClientPages/
│   │   ├── MoveRequests.tsx
│   │   ├── MoveTrips.tsx
│   │   ├── MoveRequestForm.tsx
│   │   └── MoveOffersList.tsx
│   ├── DriverPages/
│   │   ├── BrowseMoveRequests.tsx
│   │   ├── Vehicles.tsx
│   │   ├── VehicleForm.tsx
│   │   ├── MoveOffers.tsx
│   │   └── MoveTrips.tsx
│   ├── AdminPages/
│   │   ├── Users.tsx
│   │   ├── MoveRequests.tsx
│   │   ├── MoveOffers.tsx
│   │   ├── MoveTrips.tsx
│   │   └── Vehicles.tsx
│   └── Profile/
│       └── ProfilePage.tsx
├── services/
│   ├── apiClient.ts (✓ exists)
│   ├── authService.ts (✓ exists)
│   ├── moveRequestService.ts (NEW)
│   ├── moveOfferService.ts (NEW)
│   ├── vehicleService.ts (NEW)
│   ├── driverService.ts (NEW)
│   ├── clientService.ts (NEW)
│   ├── tripService.ts (NEW)
│   ├── userService.ts (NEW)
│   ├── addressService.ts (NEW)
│   └── luggageService.ts (NEW)
├── components/
│   ├── common/
│   │   ├── StatusBadge.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   ├── forms/
│   │   ├── MoveRequestForm.tsx
│   │   ├── VehicleForm.tsx
│   │   ├── AddressForm.tsx
│   │   └── MoveOfferForm.tsx
│   ├── tables/
│   │   ├── MoveRequestTable.tsx (✓ exists partial)
│   │   ├── MoveOffersTable.tsx
│   │   ├── UsersTable.tsx
│   │   ├── VehiclesTable.tsx
│   │   └── TripsTable.tsx
│   ├── cards/
│   │   ├── MoveRequestCard.tsx
│   │   ├── VehicleCard.tsx
│   │   ├── MoveOfferCard.tsx
│   │   └── TripCard.tsx
│   └── modals/
│       ├── MoveRequestDetailsModal.tsx
│       ├── VehicleDetailsModal.tsx
│       └── OfferDetailsModal.tsx
├── types/
│   ├── index.ts (NEW - centralized types)
│   ├── move-request.ts (NEW)
│   ├── move-offer.ts (NEW)
│   ├── vehicle.ts (NEW)
│   ├── user.ts (NEW)
│   ├── trip.ts (NEW)
│   └── address.ts (NEW)
└── hooks/
    ├── useFetch.ts (NEW - generic fetch hook)
    ├── useAsync.ts (NEW - async operations)
    └── useFormValidation.ts (NEW - form validation)
```

## Implementation Phases

### Phase 1: Core Infrastructure

1. **API Service Layer** - Create service files for all backend endpoints
   - moveRequestService.ts
   - moveOfferService.ts
   - vehicleService.ts
   - driverService.ts
   - clientService.ts
   - tripService.ts
   - userService.ts
   - addressService.ts
   - luggageService.ts

2. **Type Definitions** - Define TypeScript interfaces for all data models
   - MoveRequest, MoveOffer, Vehicle, Driver, Client, Trip, User, Address, LuggageEntry

3. **Custom Hooks** - Create reusable hooks
   - useFetch() - for data fetching
   - useAsync() - for async operations
   - useFormValidation() - for form validation

### Phase 2: Common Components & Pages

1. **UI Components**
   - StatusBadge.tsx
   - ConfirmModal.tsx
   - LoadingSpinner.tsx
   - ErrorBoundary.tsx

2. **Forms**
   - MoveRequestForm.tsx
   - VehicleForm.tsx
   - AddressForm.tsx
   - MoveOfferForm.tsx

3. **Tables**
   - MoveRequestTable.tsx
   - MoveOffersTable.tsx
   - UsersTable.tsx
   - VehiclesTable.tsx
   - TripsTable.tsx

4. **Cards & Modals**
   - Various card components for displaying data
   - Modal components for detailed views and confirmations

5. **Profile Page**
   - ProfilePage.tsx with edit functionality

### Phase 3: Client Dashboard

1. **Dashboard Page** - Overview of upcoming moves, recent activity
2. **Move Requests** - List, create, edit, delete move requests
3. **Move Trips** - View and manage move trips
4. **Move Offers** - View offers on move requests, accept/reject

### Phase 4: Driver Dashboard

1. **Dashboard Page** - Overview of upcoming trips and vehicles
2. **Browse Move Requests** - View available move requests
3. **Vehicles** - CRUD operations for vehicles
4. **Move Offers** - Create, manage, delete offers
5. **Move Trips** - View and manage move trips

### Phase 5: Admin Dashboard

1. **Dashboard Page** - Platform overview with analytics
2. **Users** - Manage all users (CRUD)
3. **Move Requests** - Manage all move requests
4. **Move Offers** - Manage all move offers
5. **Move Trips** - Manage all move trips
6. **Vehicles** - Manage all vehicles

### Phase 6: Authentication & Navigation

1. **Enhance Auth Pages** - Role selection, registration variations
2. **Update Sidebar Navigation** - Role-based menu items
3. **Route Protection** - Ensure routes are protected by role

### Phase 7: Integration & Testing

1. **API Integration** - Connect all services to components
2. **Error Handling** - Implement proper error handling
3. **Loading States** - Add loading indicators
4. **Testing** - Manual testing with backend

## Key Features by Role

### Client Features

- Create/edit/delete move requests
- View move requests (active & history)
- Browse driver offers on their requests
- Accept/reject move offers
- View move trips
- Rate drivers after trip completion
- Manage profile

### Driver Features

- View available move requests
- Create move offers on requests
- Manage move offers (edit, delete)
- Manage vehicles (CRUD)
- View move trips
- Rate clients after trip completion
- Update driver profile (range, driving experience)
- Manage profile

### Admin Features

- View and manage all users
- View and manage all move requests
- View and manage all move offers
- View and manage all move trips
- View and manage all vehicles
- Dashboard with analytics
- User activity monitoring
- Filter and search capabilities

## Backend API Endpoints Used

### Authentication

- POST `/users/addUser` - Register new user
- POST `/users/iam/profile/{id}` - Update user profile
- GET `/users/all` - Get all users (admin)

### Clients

- GET `/client/allClients` - Get all clients (admin)
- GET `/client/getClient/{id}` - Get specific client
- GET `/client/{id}/move-requests/active` - Get active move requests
- GET `/client/{id}/move-requests/history` - Get move history

### Move Requests

- POST `/client/{id}/addMoveRequest` - Create move request
- POST `/move-request/add` - Create move request (alt)
- GET `/move-request/get` - Get all move requests
- GET `/move-request/{id}` - Get specific move request
- PUT `/move-request/edit/{id}` - Edit move request
- DELETE `/move-request/delete/{id}` - Delete move request

### Move Offers

- POST `/move-offer/offers` - Create move offer
- PUT `/move-offer/offers/{id}` - Update move offer
- GET `/move-offer/move-requests/{id}/offers` - Get offers for move request
- PUT `/move-offer/offers/{id}/accept` - Accept move offer
- DELETE `/move-offer/{id}` - Delete move offer

### Drivers

- GET `/drivers/me` - Get current driver profile
- POST `/drivers/add` - Create driver profile
- DELETE `/drivers/{id}` - Delete driver

### Vehicles

- POST `/vehicle/` - Add vehicle
- DELETE `/vehicle/{id}` - Delete vehicle
- PATCH `/vehicle/{id}/toggle-active` - Toggle vehicle active status
- GET `/api/vehicle-types` - Get vehicle types

### Address

- GET `/address/all` - Get all addresses
- GET `/address/{id}` - Get specific address
- POST `/address/addNewAddress` - Add new address
- PUT `/address/update/{id}` - Update address
- DELETE `/address/delete/{id}` - Delete address

### Other

- GET `/api/luggage-types` - Get luggage types
- GET `/trips/allTrips` - Get all trips
- GET `/trips/{id}` - Get specific trip

## Technology Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Charts**: ApexCharts (for admin dashboard)
- **Calendar**: FullCalendar (for moves/trips)
- **Form Validation**: Custom hooks

## Data Flow Architecture

```
┌─────────────────────────────────────────┐
│         React Components (Pages)        │
├─────────────────────────────────────────┤
│         State & Context (Auth/Sidebar)  │
├─────────────────────────────────────────┤
│      Service Layer (API Calls)          │
├─────────────────────────────────────────┤
│       API Client (Axios + Interceptors) │
├─────────────────────────────────────────┤
│       Backend API (Multiple Services)   │
└─────────────────────────────────────────┘
```

## Response Structure

All services should return consistent response structures:

```typescript
interface ApiResponse<T> {
  data?: T;
  status: number;
  message?: string;
  error?: string;
}
```

## Error Handling Strategy

1. Try-catch blocks in services
2. Error boundary component for React errors
3. Toast notifications for user feedback
4. Fallback UI for loading states
5. Proper HTTP status code handling (401, 403, 404, 500)

## Authentication Flow

1. User logs in via Google OAuth
2. Backend returns JWT token
3. Token stored in localStorage with role and userId
4. Token added to all API requests via interceptor
5. UI adapts based on user role
6. Role-based access to routes and features

## Validation Strategy

1. Client-side form validation using custom hook
2. Real-time feedback on form fields
3. Server-side validation handled by backend
4. Display server errors in UI

## Performance Considerations

1. Lazy loading of pages
2. Memoization of expensive components
3. Pagination for large lists
4. Search and filter capabilities
5. Debounced API calls for search/autocomplete

## Next Steps

1. Review and approve this plan
2. Switch to Code mode for implementation
3. Start with Phase 1 (Core Infrastructure)
4. Progress through phases sequentially
5. Test each phase before moving to next
