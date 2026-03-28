Presentation Structure (The "10-Minute Winning Flow")

1.  The Hook (1 min): Personal story/Relatable problem.
2.  The Innovation (1.5 mins): The "Fair Marketplace" concept (Blind Negotiation).
3.  The Architecture (2 mins): Microservices, DDD, and Strategy Pattern.
4.  The Live Demo (4.5 mins): The "Golden Path" (Request → Match → Offer → Trip).
5.  The Wrap-Up (1 min): Production readiness & Q&A.

---

The Presentation Script

1. Introduction: The Problem (Slide 1-2)
   "Good morning. We are the team behind SwiftMove. Everyone here has moved house, and everyone knows it’s a nightmare. You’re stuck between expensive, rigid
   companies and unreliable 'man-with-a-van' ads. There’s no transparency, and someone always feels cheated. We decided to fix that—not with just another app, but
   with a fair, decentralized marketplace."

2. The Solution: Innovation (Slide 3)
   "What makes SwiftMove unique is our Fairness-by-Design model. Unlike Uber or TaskRabbit, we don't set the price. Drivers set their 'Price per KM' based on their
   vehicle costs, and Clients set their 'Max Budget.' Crucially, we use a Blind Negotiation model—neither party sees the other’s numbers initially. This forces the
   market to find a true, fair value, removing the stress of haggling while protecting the margins of independent drivers."

3. Technical Deep Dive (Slide 4-5)
   "To power this, we didn't just build a monolith. We implemented a Microservices Architecture using Java 21 and Spring Boot. We followed Domain-Driven Design
   (DDD) principles to isolate logic into bounded contexts like Trip, Location, and Luggage.

For our core matching engine, we utilized the Strategy Design Pattern. This allows the system to dynamically filter thousands of requests based on vehicle
capacity, driver range, and luggage volume in milliseconds. It’s a production-grade backend designed for high-concurrency and horizontal scaling."

4. The Demo (Live Walkthrough)

- Step 1 (Client): "Let's start as a Client. I need to move from Downtown to the Suburbs. As I enter the address, our Location Service handles real-time
  geocoding. I add my luggage—notice the system automatically calculates the volume. Based on current market data, the system suggests a budget for me. I’ll
  submit this request."
- Step 2 (Driver/Matching): "Now, let's switch to the Driver’s dashboard. Notice the driver doesn't see every request. Our Matching Strategy has already
  filtered out requests that exceed this truck's weight limit or are outside the driver’s 50km range. The driver sees a match, reviews the inventory, and
  submits an offer."
- Step 3 (The Trip): "Back on the Client side, I see the offer. I can compare multiple drivers based on ratings and price. Once I click 'Accept,' the system
  orchestrates a complex state change across three services to create the Move Trip. The request is now an active mission."

5. Conclusion (Slide 7-8)
   "SwiftMove is more than a prototype. It’s a resilient system built with a Zinc-and-Emerald UI for professional clarity. We’ve focused on Technical
   Integrity—using API Gateways, Eureka discovery, and strict type-safety. We are ready to revolutionize how people move, making it fair, transparent, and
   stress-free. Thank you, and we’re ready for your questions."

---

3 Tips for the Demo Day

1.  The "Power Move" for Judges: When they ask about the matching logic, mention the Strategy Pattern again. Judges love hearing about Design Patterns being used
    for real business problems (e.g., "We used the Strategy Pattern so we could easily swap from 'Cheapest Match' to 'Fastest Match' without refactoring the
    whole service.")
2.  Handle the "Free Map" Question: You mentioned using a free API. If asked about accuracy, say: "We currently use Nominatim for geocoding to keep overhead low,
    but our Location Service is abstracted so we can plug in Google Maps or OSRM for road-routing with a single config change."
3.  Visuals: Keep your demo data "clean." Use real-looking addresses and realistic luggage items (e.g., "3 Bedroom House" rather than "test1"). It makes the app
    feel "alive."
