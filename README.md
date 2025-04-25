## Lightning Web App (LWA)

Your go-to React web application integrating WebLN for seamless Lightning Network payments.

###  Project Overview

LWA demonstrates core WebLN functionalities with a modern, responsive React frontend. Built with hooks for clean, modular code, it showcases:

- **sendPayment**: Send sats using WebLN’s `sendPayment()` method.
- **keysend**: Push spontaneous payments to any Lightning address.
- **Auto-payment on Scroll**: Pay 1 sat on every user scroll—yes, really! 💸
- **getInfo**: Display wallet details (balance, node alias, pubkey).
- **makeInvoice**: Generate LN invoices on the fly.
- **Pay via WebLN**: Accept sats amount + LN address; call `sendPayment()`.

**Bonus Features**:

- Dark mode support 
- QR code scanner for invoice scanning 📷
- Fiat ⇄ sats converter in payment fields 💱
- Leveraging [alby-js](https://github.com/alby-dev/alby-js) packages

###  Directory Structure

```bash
lambaaryan011-alby-lightning-web/
├── Public/
└── src/
    ├── components/
    │   └── ui/
    ├── hooks/
    ├── libs/
    ├── pages/
    └── utils/

```



###  Tech Stack

- **React** (v18+) with functional components & hooks
- **Tailwind CSS** for utility-first styling
- **alby-js** for WebLN interactions
- **react-qr-reader** for invoice scanning
- **TypeScript** for type safety

###  Installation

1. **Clone** the repo:
   ```bash
   git clone https://github.com/yourusername/lambaaryan011-alby-lightning-web.git
   cd lambaaryan011-alby-lightning-web
   ```
2. **Install** dependencies:
   ```bash
   npm install
   # or yarn install
   ```
3. **Configure** environment:
   - Copy `.env.example` to `.env`
   - Set `REACT_APP_LIGHTNING_RPC` if using local node
4. **Run** locally:
   ```bash
   npm start
   ```

###  Usage

- **Send Payment:** Enter amount and click **Send**.
- **Keysend:** Input destination pubkey and sats, then **Keysend**.
- **Scroll** to trigger 1 sat payments automatically.
- **Wallet Info:** Click **Get Info** to fetch balance & node data.
- **Invoice:** Enter sats, click **Create Invoice**, copy & pay.
- **QR Scanner:** Switch to camera view and scan invoice QR.
- **Converter:** Type fiat or sats; get live conversion.

###  Code Structure

```plaintext
src/
├── components/      # Reusable UI & WebLN logic
├── hooks/           # Custom hooks (useWebLN, useScrollPay)
├── pages/           # Main views
├── utils/           # Helpers (formatter, converter)
└── App.tsx          # Entry point
```

###  Production Build

```bash
npm run build
# Deploy `build/` to any static host (Netlify, Vercel, GitHub Pages)
```

###  Contributing

1. Fork the repo
2. Create a feature branch `git checkout -b feat/your-feature`
3. Commit your changes
4. Push to `your-branch`
5. Open a PR & describe your improvements

###  License

MIT © 2025 Aryan lamba
