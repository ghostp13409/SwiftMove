# SwiftMove Presentation Script

## Presentation Structure (The "10-Minute Winning Flow")

1.  The Hook (1 min): Personal story/Relatable problem.
2.  The Innovation (1.5 mins): The "Fair Marketplace" concept (Blind Negotiation).
3.  The Architecture (2 mins): Microservices, DDD, and Strategy Pattern.
4.  The Live Demo (4.5 mins): The "Golden Path" (Request → Match → Offer → Trip).
5.  The Wrap-Up (1 min): Production readiness & Q&A.

---

## Members

- Parth Gajjar
- Annlin George
- Carlos Flores

## The Presentation Script

<!-- NOTE: Can be improved -->

1. Introduction: Team and Project Introduction (Slide 1 & 2) (Parth Gajjar)
   "Hi, We are group 4, and we are here to present SwiftMove. It’s a fair, decentralized marketplace for moving houses. Made For Student, by Students."

   **Transition** : (Slide 3) "Speaking of which, let us introduce ourselves."

2. Team Introduction (Slide 3) (Parth, Annlin and Carlos)
   Parth: "I'm Parth and i'm a student"
   Carlos: "I'm Carlos and i'm a student"
   Annlin: "I'm Annlin and I'm also a student..."

   **Transition** : (Slide 4) "...and we students tend to move houses a lot, especially in our first year. And to introduce the problem(or and to explain why we are making this app), let me share a quick story about my last move."

3. The Problem (Slide 5-6) (Annlin George)
      <!-- FIXME: This part needs improvement, it looks very clumsy and unprofessional. This part's objective is to clearly emphasize the core problems provided in the next part -->

   (Slide 5)
   "As a student without a license, I couldn't book a U-Haul. Booking those expensive moving services wasn't an option for me either, so my only option was booking an Uber XL for a fairly short route (7 km placeholder). At the time of the ride, the driver called me and asked for an additional tip or threaten to cancel the ride otherwise. As I didn't had any other option, I ended up paying 70 dollars for the move. This is a common problem that a lot of students face while moving house."

   **Key Story Points:**
   - Uber xl drivers refused to give me rides
   - Most of the drivers request tips
   - Couldn't find a service that fit my needs and even if it did, too expensive
   - No driving license

   (Slide 6)
   "So the core of all these hurdles comes down to 3 core problems:
   **Predatory Fees**: Platforms like Uber and Lyft takes upto 40% in commissions from the drivers, which inflates the prices and causes further problems like extortion tips
   **Lack of Control**: The price is decided by the platform rather than the drivers and the clients who are actually involved in the process
   **No Transparency**: As these solutions are not designed for moving houses, there is no way for getting a relevant information for the move. Drivers don't know how much luggage the client is gonna have, the clients don't know if driver is okay with furniture or not."

**Transition** : (Slide 7) Parth: "So, What's the solution? A fair Marketplace specifically designed for moving houses, and that's exactly what SwiftMove is..."

4. The Solution: SwiftMove (Slide 7) (Parth Gajjar)
   <!-- NOTE: Can be improved -->

   "It's an open marketplace where unlike our competitors, we don't set the price. Driver decides the price they can afford per km and the clients set their budget. This way both can be assured that the transaction is fair for both parties."

   "We have also implemented blind negotiation, meaning the clients can't see what's the usual rate for the drivers and the drivers cannot see what's the maximum a client is willing to pay. This way no one can take advantage of the system and manipulate the market."

   "We make sure that the relevant details and conditions of the move have been already agreed and acknowledged by both parties. Clients can be assured the luggage will fit and the driver can knows all the details about the luggage in advance."

   "Finally, we have build it with sustainability in mind. Meaning, we the platform doesn't need to pass on massive maintenance costs to users."

**Transition** : (Slide 8) "So without further ado, let's jump straight into the demo and see how it works in action."

5. The Demo (Video Walkthrough) (Annlin as a Client, Carlos as a Driver, and Parth as a Narrator)

   Parth: (Slide 9)
   "SwiftMove works with a simple flow. Client makes a Move Request with all the details of the move that driver needs to know, Then drivers can see and make the Move Offers on the Request, and Finally when the client accepts an offer, A Move Trip is created which acts as a contract between the client and the driver where they can see all the details for the move and manage it."

   **Transition** : "Now, Let's head to Annlin to see how the client can book a move with SwiftMove..."

   Annlin:
   "Let's assume I'm a client and I need to make a similar move that I had to make last year, but this time, with SwiftMove... Here you can see I'm in the client dashboard, where I can easily see all my relevent info like my upcoming trips or available offers. First, I will create a new move request with all my move details so drivers can see it and make offers."
   "In order to that, I will first go to the Move Request Section, and Click on the 'Create Move Request' button. Here, I will enter my pickup and dropoff locations, and the Date and time of the move. Additionally, I will also select if I have any furniture with me and then select the maximum budget that i can afford. I you are not sure how much budget you should set, SwiftMove can suggest you a rough estimate of what would be an appropriate amount to maximize your chances of getting a good deals based on the distance of your move."
   "Then, I will click next and and add my luggage details in the next screen, If you are not sure about what kind of boxes you have, you can click the the chart button to see what how the boxes are categorized and how much volume they take. [Enter Luggage Entries]. Here I can also add any note to the driver that I wish to share with driver."
   "Finally, I will Click Submit the move reqeust and wait for the offers to come in."

   Parth: "While Annlin is waiting for the offers, let's switch to Carlos, and see how the drivers can see move requests and make offers to the drivers..."

   Carlos:
   "Here, I'm in the driver dashboard, where i can see how much money I'm making, my upcoming trips, and the newly available move requests."

   "Let's try to find some Move Request. To do that, First, I will head to "browse move requests" section where I can see all the available move requests. Hmm, I can see a new move request has just come in from someone named Annlin. Let me click on it and see more details about the move. Okay, everything looks good, and now that i'm interested in this move, I can Select the Vehicle from my available vehicles that I want to use for this move. Swiftmove will automatically preselect a vehicle which would make me the most money while still being compatible enough for the move, but I can also change it to a different vehicle if I have a preference or simply want to be more competitive with my offer."
   "From here, I can also see and suggest a different date and time for the move if I want to, but for now I will just keep it as it is so that I can have the best chance of getting this move and finally, I will click on Send Offer and wait for the client to accept it."

   Annlin:
   "Ah, I can See a new offer has just come in! I can see all the available offers on my move request with the details about the car as well as the driver's name."
   "I will click on Accept Offer, then make the payment in order to finalize the move. Once I have paid, the Move trip is Scheduled. and I can see all the details available for the move in the Trip Section.

   Parth: "One the Day of the move, Driver can start the move, and once completed, they can mark it as completed. Once, the client also confirms the move is completed, the payment will be released to the driver and both parties can rate each other."

6. Unique Value Proposition (Carlos) (Slide 10)

   "Behind the scenes, SwiftMove does all the heavy lifting for you so that you see only the things that are relevant to you weather you are a client or a driver."
   "Once the move request is created, it matches move request's to and from location with driver's location and range."

   "then it checks if your luggage is compatible with driver's available vehicles."

   "Finally, It checks if driver's price per km is within your budget."

   "This makes sure that only the relevant drivers see your request and in turn, you only get relevant offers"

7. The Technical Architecture (Slide 11) (Carlos)

   <!-- TODO: This Part is still work in progress, and needs to be completed -->

   "Now Let's see under the hood, what makes SwiftMove a truly sustainable and powerful platform..."

   <!-- Points -->

   **Things to Highlight:**
   - In this section, we need to highlight how swiftmove is highly sustainable with low maintenance and deployment costs where we can run the platform for as little as 2% cut from the move regardless of the size of the userbase, and how we have used the best practices to achieve that. We also need to highlight how its Highly scalable and maintainable with the use of microservices and CI/CD pipilines with Github Actions.
   - Technical Info: Spring boot, Java microservices for the backend, React with Typescript ShadcnUI for frontend, Serverless Database with neon, Open Street Map API for free Geocoding and routing, and all the other things we have been using for the project.
   - Basically, mention everything that this project includes that would help us to win in terms of "Best Technical Architecture".

8. Conclusion and Wrap-up (Slide 12) (Parth)

<!-- TODO: Summary Section is still work in progress, and needs to be completed-->

"And that's swiftmove, A decentralized, transparent and fair marketplace for moving houses, which aims to give control back to the users from the platform."

"Thank you for your attention, we hope you enjoyed SwiftMove."

---
