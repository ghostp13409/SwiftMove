1. Problem Overview
   The problem SwiftMove addresses is the lack of a seamless, transparent, and efficient way for people to coordinate moving services. Traditional moving processes are often fragmented, with limited visibility into pricing, driver availability, and service quality. As a result, users struggle to find reliable movers, compare offers, and manage the process from start to finish.

2. Solution Overview
   SwiftMove solves this problem by providing a unified platform that connects clients, drivers, and administrators through a role-based system. Built on a scalable microservice architecture, the platform enables real-time matching, transparent pricing, and full lifecycle management of move requests.

3. Demo Flow Overview
   The demo will walk through the complete user journey, showcasing how SwiftMove simplifies the moving experience from request creation to trip completion. The flow is structured to demonstrate both client and driver perspectives, highlighting key system interactions.

4. Step 1: User Authentication
   The demo begins with a client logging into the system through the dashboard. This establishes the entry point and demonstrates secure authentication using JWT-based login.
   • Shows login interface
   • Validates user credentials
   • Redirects to dashboard upon success
   Value: Ensures secure and seamless access to the platform.

5. Step 2: Client Dashboard & Move Request Creation
   Once logged in, the user is taken to the Client Dashboard, where they can manage their move requests. We demonstrate creating a new MoveRequest by entering pickup and destination details.
   • Input addresses and preferences
   • Automatic distance calculation
   • Budget and request details generated
   Value: Simplifies a complex manual process into a quick, intuitive workflow.

6. Step 3: Driver Perspective & Request Matching
   Next, the demo switches to the driver’s perspective. Drivers can view available move requests that match their vehicle capabilities and availability.
   • Display of filtered move requests
   • Matching based on vehicle type and requirements
   • Driver selects and submits an offer
   Value: Intelligent matching improves efficiency and ensures relevant opportunities.

7. Step 4: Offer Review & Acceptance (Client)
   We return to the client view, where submitted offers are displayed. The client can review and compare offers before deciding.
   • View multiple offers
   • Compare pricing and details
   • Accept a selected offer
   Value: Provides transparency and control to the user.

8. Step 5: Trip Creation & Confirmation
   Once an offer is accepted, the system automatically creates a MoveTrip, transitioning the request into an active service.
   • Offer status updated
   • MoveRequest status changes
   • Trip is created and scheduled
   Value: Seamless transition from planning to execution.

9. Step 6: Additional Features (System Completeness)
   The demo briefly highlights supporting features across roles:
   • Driver vehicle management
   • Driver profile updates
   • Admin dashboard for user management
   Value: Demonstrates a complete, scalable platform supporting all stakeholders.

10. Technical Highlight
    Throughout the demo, we emphasize the system’s architecture:
    • API Gateway routing requests
    • Microservices handling different domains
    • Real-time communication between services
    • Responsive React dashboard
    Value: Reinforces reliability, scalability, and production readiness.

11. Conclusion & Demo Readiness
    The demo concludes with an active trip, demonstrating the full end to end flow of the platform. SwiftMove delivers a cohesive, efficient, and user centered moving experience.
    All core features are fully implemented, integrated, and tested. The system is stable, polished, and ready for demonstration, clearly showcasing its value and real-world applicability.
