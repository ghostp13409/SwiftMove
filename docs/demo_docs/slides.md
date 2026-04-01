---

Slide 1: Title – SwiftMove
Header: SwiftMove: Your Ride. Your
Content:

- Sub-headline: A Transparent, Decentralized Open Marketplace for Moving Services.
- Core Value: Connecting Clients and Drivers through Intelligent Matching & Fair Pricing.
- Architecture: Enterprise-grade Microservices & Domain-Driven Design.
  Speaker Notes: "Good morning/afternoon. Today we present SwiftMove. Most moving services are fragmented and expensive. SwiftMove isn't just a booking app; it's a
  fair, transparent marketplace built on a resilient, scalable backend."

---

Slide 2: The Problem – The "Moving" Pain
Header: Why is Moving So Stressful?
Content:

- Lack of Transparency: Hidden fees and 'black-box' pricing models.
- Inefficiency: Manual coordination between clients and drivers.
- Inaccessibility: High costs for students and freelancers; low margins for independent drivers.
- Safety & Trust: No standardized way to verify vehicle capacity or driver reliability.
  Speaker Notes: "Moving is one of life's most stressful events. The current market is broken: clients feel overcharged, and drivers feel underpaid, with zero
  transparency in between."

---

Slide 3: The Unique Solution – A Fair Marketplace
Header: The SwiftMove Difference: Fairness by Design
Content:

- Open Marketplace: Unlike competitors, we don't set prices. Drivers set their price per km; Clients set their max budget.
- Blind Negotiation: Clients can't see driver rates, and drivers can't see client budgets until a match occurs. This prevents price gouging and ensures
  authentic, competitive offers.
- Sustainability over Profit: Designed as a low-commission, service-first platform that empowers the community.
  Speaker Notes: "We've built a 'Fair by Design' system. By hiding the budget and rate during the initial phase, we force an honest market value to emerge,
  benefiting both the student on a budget and the professional driver."

---

Slide 4: Intelligent Matching – The "Secret Sauce"
Header: Automated Matching & Budgeting
Content:

- Strategy Pattern Logic: Real-time filtering based on:
  - Capacity: Total volume and weight vs. Vehicle limits.
  - Range: Driver’s travel radius vs. Pickup/Destination locations.
  - Capabilities: Furniture-specific handling requirements.
- Smart Budgeting: Automatic budget suggestions based on real-time market averages (Price/KM × Distance).
  Speaker Notes: "Our matching engine uses the Strategy Design Pattern. It doesn't just look at distance; it validates luggage weight, vehicle volume, and driver
  range in real-time to ensure every offer is physically and financially viable."

---

Slide 5: Technical Architecture – Enterprise Scalability
Header: Modern Microservices Infrastructure
Content:

- Tech Stack: Java 21, Spring Boot 3.4, React 18, PostgreSQL.
- Service Mesh:
  - API Gateway: Centralized routing and security.
  - Eureka Discovery: Dynamic service registration.
  - Config Server: Centralized environment management.
- Domain-Driven Design (DDD): Isolated Bounded Contexts (Auth, Location, Trip, Luggage) for independent scaling.
  Speaker Notes: "Under the hood, SwiftMove is an enterprise-ready system. We utilized a Microservices architecture to ensure that the 'Trip Service' can scale
  independently from the 'User Service' during peak moving seasons."

---

Slide 6: The User Journey (The Demo)
Header: Seamless End-to-End Flow
Content:

1.  Request: Client creates a move request with automated address geocoding (Nominatim).
2.  Match: System filters requests; only compatible drivers see the opportunity.
3.  Offer: Drivers submit competitive bids.
4.  Acceptance: Client compares transparent offers and accepts.
5.  Trip: System transitions to an active 'Move Trip' with real-time status tracking.
    Speaker Notes: "Our demo will walk you through this lifecycle. From the first geocoded address to the final trip confirmation, the system handles the complexity
    so the users don't have to."

---

Slide 7: Why SwiftMove Wins
Header: Technically Sound. Socially Responsible.
Content:

- Resilience: Built to survive low-traffic organic growth without high overhead.
- Extensibility: Open-source ready architecture.
- Accuracy: Transitioning from Haversine (Air) to OSRM (Road) distance calculations for 100% pricing accuracy.
- UX/UI: A "Zinc & Emerald" aesthetic inspired by Supabase—minimalist, professional, and accessible.
  Speaker Notes: "SwiftMove wins because it combines a unique business model with a high-quality technical implementation. It’s not just a prototype; it’s a
  scalable foundation for a real-world service."

---

Slide 8: Conclusion
Header: SwiftMove: Moving Simplified.
Content:

- Ready for Deployment.
- Scalable by Design.
- Fair for Everyone.
- Thank You – Questions?

---

Bonus: Technical "Punch" for Q&A
If the judges ask about scalability or bottlenecks, mention:

- "We use a 'Database per Service' approach to ensure data sovereignty and prevent cascading failures."
- "The matching logic is abstracted via the Strategy Pattern, allowing us to swap in AI-driven matching or OSRM road-routing without touching the core business
  logic."
