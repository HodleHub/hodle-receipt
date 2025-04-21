# Lightning Receipt

A Next.js application for verifying and generating receipts for Lightning Network payments with cryptographic proof.

## Features

- Verify payment cryptographically by:
  - Parsing BOLT11 invoices
  - Verifying payment preimages against payment hashes
  - Extracting node public keys from signatures
- Display QR codes and payment details
- Copy and share receipts with all payment details
- Orange and white design theme

## Getting Started

First, install the dependencies:

```bash
npm install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- light-bolt11-decoder for BOLT11 invoice parsing
- secp256k1 for cryptographic verification
- Web Crypto API for hash calculation

## How It Works

1. Enter a BOLT11 invoice and preimage
2. The app verifies the payment by:
   - Decoding the BOLT11 invoice
   - Hashing the preimage with SHA-256
   - Comparing the hash with the payment hash in the invoice
3. The app extracts the node's public key from the signature for verification
4. Users can share the receipt with a direct link

For more information on how BOLT11 proof of payment works, see [this documentation](https://faq.blink.sv/blink-and-other-wallets/how-to-prove-that-a-lightning-invoice-was-paid).

## License

MIT
