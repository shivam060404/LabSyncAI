# LabSync AI

**LabSync AI** is a comprehensive medical report management and analysis platform. It empowers users to securely manage health data, analyze medical reports with AI, visualize trends, and receive personalized recommendations. The platform supports multi-language, low-resource mode, SMS/voice notifications, and regional reference ranges for a global user base.

---

## ✨ Features

- **User Authentication & Profile Management** (JWT-based)
- **Medical Report Upload & Management** (PDF, image, etc.)
- **AI-Powered Report Analysis** (integrates Gemini, Azure Health, Google Cloud Vision, and more)
- **Health Trend Visualization** (charts, graphs, and trend analysis)
- **Personalized Health Recommendations**
- **Multi-language Support** (dynamic language selection)
- **Low-Resource Mode** (optimized for limited connectivity/devices)
- **SMS & Voice Notifications** (Twilio or similar integration)
- **Regional Reference Ranges** (customizable for different geographies)
- **Compression & File Utilities** (efficient uploads and storage)
- **Admin/Test Utilities** (test user, connection scripts)

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API Routes (RESTful endpoints)
- **Database:** MongoDB (local or Atlas)
- **Authentication:** Custom JWT
- **AI Integration:** Gemini, Azure Health, Google Cloud Vision APIs
- **Notifications:** SMS/Voice (Twilio or similar)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/labsyncai.git
   cd labsyncai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=/api
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=labsyncai
   GEMINI_API_KEY=your_gemini_api_key
   AZURE_HEALTH_API_KEY=your_azure_health_api_key
   GOOGLE_CLOUD_VISION_API_KEY=your_google_cloud_vision_api_key
   HEALTH_AI_ENDPOINT=your_health_ai_endpoint
   # Add SMS/Voice API keys if needed
   # TWILIO_ACCOUNT_SID=your_twilio_sid
   # TWILIO_AUTH_TOKEN=your_twilio_token
   ```
   Replace placeholders with your actual credentials.

4. **Initialize the database**
   ```bash
   npm run init-db
   # or
   yarn init-db
   ```
   This sets up collections, indexes, and a test user:
   - Email: `test@example.com`
   - Password: `Test@123`

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

- `src/app` — Next.js app router pages & API routes
- `src/components` — Reusable React components (UI, layouts, features)
- `src/lib` — Utility libraries, DB connection, context providers
- `src/types` — TypeScript type definitions
- `src/utils` — Helper functions (auth, file, date, medical, mock data)
- `src/scripts` — DB initialization, test scripts
- `docs/` — Feature documentation (low-resource mode, MongoDB, multilanguage)

---

## 📜 Usage & Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run init-db` — Initialize MongoDB with collections and test user

---

## 🧩 Key Features Explained

- **AI Analysis:** Upload reports/images for instant AI-powered health insights.
- **Trend Analysis:** Visualize health data over time with interactive charts.
- **SMS/Voice:** Test and configure notifications in dashboard settings.
- **Low-Resource Mode:** Toggle for optimized experience on slow networks/devices.
- **Regional Reference Ranges:** Customize health ranges for your region.
- **Multi-language:** Change language in settings; supports dynamic translation.

---

## 🐞 Troubleshooting

- Ensure MongoDB is running and accessible.
- Check `.env.local` for correct API keys and DB URI.
- For SMS/voice, ensure credentials are set and service is enabled.
- For AI features, verify external API keys and quotas.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

MIT License — see the LICENSE file for details.
