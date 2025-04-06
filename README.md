# Stripe Payment Integration

This server provides endpoints for handling Stripe one-time payments.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory and add your Stripe secret key:
```
STRIPE_SECRET_KEY=your_stripe_secret_key_here
PORT=3000
```

3. Start the server:
```bash
node index.js
```

## API Endpoints

### Create Payment Intent
- **POST** `/create-payment-intent`
- **Body**: 
```json
{
  "amount": 100 // Amount in dollars
}
```
- **Response**: Returns a client secret for the payment intent

### Success Payment
- **GET** `/success-payment?payment_intent=pi_xxx`
- **Query Parameters**: 
  - `payment_intent`: The payment intent ID
- **Response**: Returns payment status and details

## Usage Example

1. Create a payment intent:
```javascript
const response = await fetch('http://localhost:3000/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: 100 // $100.00
  })
});
const { clientSecret } = await response.json();
```

2. After successful payment, redirect to success page:
```javascript
window.location.href = `http://localhost:3000/success-payment?payment_intent=${paymentIntentId}`;
``` 