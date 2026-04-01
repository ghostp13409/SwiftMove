# Payment Logic

## Overview

The payment logic is responsible for handling all payment-related operations in the system. This includes processing payments, managing payment methods, and ensuring secure transactions. The main method of payment processing is planned to be through a third-party payment gateway, which will handle the actual transaction and provide feedback on the success or failure of the payment.

## Payment Processing

**Provider:** Stripe

**Integration:** The system will integrate with Stripe's API to process payments. This will involve sending payment details to Stripe and handling the response to confirm whether the payment was successful or if there were any issues.
**Security:** All payment information will be handled securely, adhering to PCI DSS standards. Sensitive data will not be stored on our servers, and all communication with the payment gateway will be encrypted.

## Payment Methods

The system will support multiple payment methods, including credit/debit cards and digital wallets. Users will have the option to save their payment methods for future transactions, which will be securely stored using Stripe's customer management features.

## Error Handling

In the event of a payment failure, the system will provide clear feedback to the user, indicating the reason for the failure (e.g., insufficient funds, invalid card details). The system will also log all payment attempts and their outcomes for auditing and troubleshooting purposes.

## Payment Logic:

- When client accepts the move offer, the client will make payment to us, we will process the payment through Stripe and then confirm the payment status to the client.
- If the payment is successful, we will proceed with the move scheduling and notify the mover.
- If the payment fails, we will notify the client of the failure and provide options to retry the payment or use a different payment method.
- Once the move is completed, we will release the payment to the mover, ensuring that they receive their payment for the service provided.

## Payment Cuts:

- We will charge a small percentage(for now 2%) of the trip fee on top of the driver's fee as our service fee. This will be the amount that the client pays in addition to the driver's fee, and it will be included in the total amount charged to the client during the payment process.
- The remaining amount after deducting our service fee will be released to the driver once the move is completed and confirmed by both parties.
- The total price of the move offer that the client sees should include both the driver's fee and our service fee, so that the client is aware of the total cost they will be paying for the move.

## Payment UI:

The payment UI will be designed to be user-friendly and intuitive, guiding users through the payment process with clear instructions and feedback. It will include fields for entering payment details, options for selecting saved payment methods, and visual indicators of the payment status. The UI will also be responsive, ensuring a seamless experience across different devices.

### Requirements:

- The payment UI must be secure and compliant with PCI DSS standards.
- The payment UI must provide clear feedback to users regarding the status of their payment.
- The payment UI must allow users to manage their saved payment methods.
- The payment UI must be integrated with Stripe's API for processing payments.
- We are not storing any sensitive payment information on our servers, and all payment processing will be handled through Stripe to ensure security and compliance.

### Current Scope:

- We are using Stripe's sandbox environment for testing payment processing, and we will not be handling real payments during development. The payment logic will be implemented to simulate the payment process, allowing us to test the flow of the move scheduling and completion without actual financial transactions with fake credit card details provided by Stripe for testing purposes. This will allow us to ensure that the payment logic is functioning correctly before integrating with the live payment environment.

- Create a step by step guide of how do i set up my stripe account to integrate our system and test the payment processing in the development environment. This guide should include instructions on how to use Stripe's sandbox environment for testing payments. We alraedy have the Stripe API Keys in our .env file, so we can use those for testing purposes. The guide should also include instructions on how to simulate payment processing using Stripe's test card numbers and how to verify the payment status in our system after processing the payment through Stripe. This will help us ensure that the payment logic is working correctly before we go live with real payments.
