# SwiftMove Presentation Script (v2 - Final)

## Presentation Structure (The "10-Minute Winning Flow")

1.  **The Hook (1 min):** Personal story / Relatable student struggle.
2.  **The Innovation (1.5 mins):** The "Fair Marketplace" & Blind Negotiation.
3.  **The Architecture (2 mins):** Microservices, DDD, and the Strategy Matching Pattern.
4.  **The Live Demo (4.5 mins):** The "Golden Path" (Request → Match → Offer → Trip).
5.  **The Wrap-Up (1 min):** Scalability, Sustainability, and Q&A.

---

## Members

- Parth Gajjar
- Annlin George
- Carlos Flores

---

## The Presentation Script

### 1. Introduction: Team and Project Introduction (Slide 1 & 2) (Parth Gajjar)

"Hello Judges. We are Group 4, and today we’re excited to introduce **SwiftMove**—a decentralized, fair marketplace designed to revolutionize how we move houses. Built for students, by students, SwiftMove puts the power back into the hands of the people actually doing the work."

**Transition**: (Slide 3) "So let us start by introducing ourselves..."

### 2. Team Introduction (Slide 3) (Parth, Annlin, and Carlos)

- **Parth**: "I'm Parth, and I'm responsible for Core System Design and Service Integrations."
- **Carlos**: "I'm Carlos, and I'm responsible for R&D and Frontend Development."
- **Annlin**: "And I'm Annlin, and I'm responsible for core Backend Development."

**Transition**: (Slide 4) "I'm sure we’ve all experienced the unique chaos of moving day. So, let us start with that one experience that started it all"

### 3. The Problem: The "Moving Trap" (Slide 5-6) (Annlin George)

"Last year, I had to move just 7 kilometers. Since I don't have a license, I couldn't rent a U-Haul and Professional movers quoted me hundreds of dollars. So My only option? Booking an Uber XL.

But when the driver arrived and saw my boxes, the dynamic changed. He demanded a $40 'off-app tip' or threatened to cancel the ride right there. Stuck with my belongings on the sidewalk, I had no choice but to pay. I ended up paying $70 for a 10-minute drive.

This isn't just a bad experience; it’s a systemic failure caused by three core issues:" (Slide 6)

1.  **Predatory Fees**: Mainstream platforms take up to 40% from drivers. This forces drivers to 'extort' tips just to break even, while clients pay inflated prices.
2.  **Lack of Control**: Neither the driver nor the client sets the price. An algorithm does, often ignoring the actual complexities of moving.
3.  **Zero Transparency**: Drivers don't know the luggage volume until they arrive; clients don't know if the car can actually handle their furniture. This leads to cancellations and stress.

**Transition**: (Slide 7) Parth: "We knew there had to be a better way. A way that prioritizes transparency over platform profit. That solution is SwiftMove, A fair Marketplace specifically designed for moving houses"

### 4. The Solution: A Fair Marketplace (Slide 7) (Parth Gajjar)

"SwiftMove is an open marketplace where we the platform don't set the rates. **You do.**"

It has 4 core features:

- **Decentralized Pricing**: Drivers set their 'Price per KM' based on their vehicle costs. Clients set their 'Max Budget' based on what they can afford.
- **Blind Negotiation**: To prevent price gouging, we've implemented a blind matching system. Clients don't see driver rates, and drivers don't see client budgets. Moves only happen when the math works for _both_ parties.
- **Assured Compatibility**: Our system validates luggage volume against vehicle capacity _before_ an offer is even made. No more 'will it fit?' anxiety.
- **Sustainability First**: Built on a lean microservices architecture, SwiftMove requires minimal overhead, allowing us to keep platform fees near zero.

**Transition** : (Slide 8) "So without further ado, let's jump straight into the demo and see how it works in action."

### 5. The Demo (Video Walkthrough) (Annlin as a Client, Carlos as a Driver, and Parth as a Narrator)

Parth: (Slide 9)
"SwiftMove works with a simple flow. Client makes a Move Request with all the details of the move. Drivers can send Move Offers on the Request, and Finally once the client accepts an offer, A Move Trip is created which acts as a contract between the client and the driver where they can see and manage the Move."

**Transition** : "Now, Let's head to Annlin to see how the client can book a move with SwiftMove..."

Annlin:
"Let's assume I'm a client and I need to make a similar move that I had to make last year, but this time, with SwiftMove... Here you can see I'm in the client dashboard, where I can easily see all my relevent info like my upcoming trips or available offers. First, I will create a new move request with all my move details so drivers can see it and make offers."
"In order to that, I will first go to the Move Request Section, and Click on the 'Create Move Request' button. Here, I will enter my pickup and dropoff locations, and the Date and time of the move. Additionally, I will also select if I have any furniture with me and then select the maximum budget that i can afford. If you are not sure how much budget you should set, SwiftMove can suggest you a rough estimate of what would be an appropriate amount to maximize your chances of getting a good deals based on the distance of your move."
"Then, I will click next and and add my luggage details in the next screen, If you are not sure about what kind of boxes you have, you can click the the chart button to see what how the boxes are categorized and how much volume they take. [Enter Luggage Entries]. Here I can also add any note that i want to share with the driver."

"Finally, I will Click Submit the move reqeust and wait for the offers to come in."

Parth: "While Annlin is waiting for the offers, let's switch to Carlos, and see how the drivers can see move requests and make offers to the drivers..."

Carlos:
"Here, I'm in the driver dashboard, where i can see how much money I'm making, my upcoming trips, and the newly available move requests."

"Let's try to find some Move Request. To do that, First, I will head to "browse move requests" section where I can see all the available move requests. Hmm, I can see a new move request has just come in from someone named Annlin. Let me click on it and see more details about the move. Okay, everything looks good, and now that i'm interested in this move, I can Select the Vehicle from my available vehicles that I want to use for this move. Swiftmove will automatically preselect a vehicle which would make me the most money while still being compatible enough for the move, but I can also change it to a different vehicle if I have a preference or simply want to be more competitive with my offer."
"From here, I can also see and suggest a different date and time for the move if I want to, but for now I will just keep it as it is so that I can have the best chance of getting this move and finally, I will click on Send Offer and wait for the client to accept it."

Annlin:
"Ah, I can See a new offer has just come in! I can see all the available offers on my move request with the details about the car as well as the driver's name."
"I will click on Accept Offer, then make the payment in order to finalize the move. Once I have paid, the Move trip is Scheduled. and I can see all the details available for the move in the Trip Section.

Parth: "on the day of the move, Driver can start the move, and once completed, they can mark it as completed. Once, the client also confirms the move is completed, the payment will be released to the driver and both parties can rate each other."

<!-- TODO: ADD SECITON 6 AND 7 OVER HERE -->

### 8. Conclusion and Wrap-up (Slide 12) (Parth)

"In summary, SwiftMove isn't just another moving app. It’s a blueprint for how marketplaces _should_ work. By removing the predatory middleman and replacing 'black-box' algorithms with transparent matching logic, we’ve created a system that is sustainable, scalable, and most importantly, fair.

We are SwiftMove. Thank you for your time. We’re now open for your questions."
