# SentiFed Frontend — Federated Sentiment Analysis Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14-a855f7?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-a855f7?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-a855f7?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-a855f7?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

Next.js frontend dashboard for **[SentiFed](https://github.com/maida-maryam06/SentiFed)** — a federated learning sentiment analysis system implementing the AT-FedAvg aggregation strategy. Connects to the FastAPI backend to visualize training progress, trust scores, and run live sentiment predictions.

---

## Pages

### Dashboard `/`
- Global accuracy per round (line chart)
- Per-client trust score evolution (Trust-Based Aggregation visualization)
- Communication overhead per round (bar chart)
- Live metric cards — accuracy, rounds, clients, round duration
- Full round history table

### Predict `/predict`
- Text input with 5 quick example reviews
- Runs inference against the trained global BiLSTM model
- Shows Positive/Negative verdict with confidence % and animated probability bars

### Clients `/clients`
- Lists all registered federated clients with status badges
- Last seen timestamps
- Register new clients with ID + secret + device info
- Disconnect active clients

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS — dark glassmorphism design
- **Charts:** Recharts
- **Icons:** Lucide React
- **Fonts:** Syne · Inter · JetBrains Mono
- **Backend:** [SentiFed FastAPI](https://github.com/maida-maryam06/SentiFed)

---

## Setup

**Requirements:** Node.js 18+

```bash
git clone https://github.com/maida-maryam06/SentiFed-Frontend.git
cd SentiFed-Frontend
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the backend first:
```bash
# in SentiFed/
uvicorn api_server:app --reload --port 8000
```

Then run the frontend:
```bash
npm run dev
# → http://localhost:3000
```

---

## Connecting to Backend

All pages fetch data from the FastAPI backend. Both must be running simultaneously:

| Frontend Page | Backend Endpoint |
|---------------|-----------------|
| Dashboard | `GET /dashboard/summary` · `/dashboard/rounds` · `/dashboard/client-metrics` |
| Predict | `POST /predict` |
| Clients | `GET /clients` · `POST /clients/register` · `POST /clients/{id}/disconnect` |

---

## Deploy

### Frontend → Vercel

```bash
# push to GitHub, then:
# vercel.com → Import SentiFed-Frontend → Deploy
```

Add environment variable in Vercel dashboard:
```
NEXT_PUBLIC_API_URL = https://your-backend-url.com
```

### Backend → Railway / Render

See [SentiFed backend repo](https://github.com/maida-maryam06/SentiFed) for deployment instructions.

---

## Project Structure

```
sentifed-frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard
│   │   ├── predict/page.tsx   # Sentiment prediction
│   │   ├── clients/page.tsx   # Client management
│   │   ├── layout.tsx         # Root layout + fonts
│   │   └── globals.css        # Tailwind + glass utilities
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── MetricCard.tsx
│   │   ├── AccuracyChart.tsx
│   │   ├── TrustChart.tsx
│   │   ├── CommChart.tsx
│   │   └── ClientTime.tsx
│   └── lib/
│       └── api.ts             # All API calls + TypeScript types
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

---

## Related

- [SentiFed Backend](https://github.com/maida-maryam06/SentiFed) — PyTorch · Flower · FastAPI · AT-FedAvg

---

## Author

**Maida Maryam** — BS Computer Science, Bahria University Lahore (2026)
AI/ML · Federated Learning · NLP · AI Security

[![GitHub](https://img.shields.io/badge/GitHub-maida--maryam06-a855f7?style=flat-square&logo=github)](https://github.com/maida-maryam06)
