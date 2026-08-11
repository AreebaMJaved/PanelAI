# 🎙️ Panel AI

### The interview panel is waiting.

Face a **Technical Lead**, an **HR Manager**, and a **Senior Manager** — back to back, live, streamed in real time — then get scored honestly by an AI verdict at the end.

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="Groq" src="https://img.shields.io/badge/Groq-Llama%203.3%2070B-F55036?style=for-the-badge&logo=lightning&logoColor=white" />
  <img alt="Vercel" src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-4A5A40?style=for-the-badge" />
</p>

<p align="center">
  <img alt="Made with love" src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red?style=flat-square" />
  <img alt="Status" src="https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square" />
  <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-blueviolet?style=flat-square" />
</p>

---

## 📖 About

**Panel AI** is a mock interview simulator that puts you in front of three distinct AI personas, one after another — each with their own personality, question style, and pressure level. It's not a chatbot. It's a rehearsal.

At the end, all three interviewers' impressions are aggregated into one **panel verdict**: a radar chart of your scores, your strengths, your weak spots, and an honest overall read.

> Built to show off real React patterns — state machines, streaming UI, custom hooks, and live scoring — wrapped in a project people actually want to use.

---

## ✨ Features

| 🎯 Feature | 📝 Description |
|---|---|
| 🧑‍💼 **3 Distinct Personas** | Technical Lead, HR Manager, Senior Manager — each with a different tone and question style |
| ⚡ **Live Streaming Responses** | Questions type themselves out in real time via streamed API responses |
| ⏱️ **Timed Answers** | 90-second countdown per question, auto-submits on timeout |
| 📊 **Radar Chart Scoring** | Confidence, clarity, technical depth, communication, and problem-solving — visualized |
| 💾 **Persistent History** | Past interviews saved locally, browsable anytime |
| 🎨 **Custom Design System** | Hand-picked palette and typography — no default AI-generated look |
| 🆓 **100% Free to Run** | Powered by Groq's free tier — no card, no paid API required |
| 🔒 **Secure by Design** | API key never touches the browser — routed through a serverless function |

---

## 🛠️ Tech Stack

<p align="left">
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img alt="Vercel Functions" src="https://img.shields.io/badge/Vercel_Serverless-000000?style=flat-square&logo=vercel&logoColor=white" />
  <img alt="Recharts" src="https://img.shields.io/badge/Recharts-22B5BF?style=flat-square" />
  <img alt="Groq" src="https://img.shields.io/badge/Groq_API-F55036?style=flat-square" />
</p>

- **React 18** — hooks-driven UI, no class components
- **Vite** — dev server + build tool
- **Recharts** — radar chart for the final verdict
- **Groq API** (`llama-3.3-70b-versatile`) — free-tier LLM inference, OpenAI-compatible
- **Vercel Serverless Functions** — keeps the API key server-side, zero CORS issues

---

## 🧠 React Concepts Used

| Concept | Where |
|---|---|
| `useReducer` | Interview state machine (`setup → question → answering → evaluating → results`) |
| `useState` | Local UI state (role selection, answer text, view toggles) |
| `useEffect` | Kicking off streamed API calls per round |
| `useRef` | Guarding against duplicate API calls, tracking countdown expiry |
| `useCallback` | Stable history-append function |
| Custom Hooks | `usePersistentHistory()`, `useCountdown()` |
| Streaming UI | Manual `ReadableStream` + SSE parsing for the typing effect |
| Controlled Components | Role picker, custom-role input, answer textarea |

---

## 🎨 Design System

**Palette — "Modern": charcoal, warm gray, sage-cream**

| Swatch | Name | Hex |
|---|---|---|
| ⬛ | Charcoal Black | `#14161A` |
| ◾ | Warm Gray | `#6E7178` |
| 🟩 | Sage Cream | `#EDF0E1` |
| ⬜ | Soft White | `#F7F8F2` |
| 🌿 | Moss (accent) | `#4A5A40` |

**Typography**

- **Display:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — headings
- **Body:** [Inter](https://fonts.google.com/specimen/Inter) — everything else
- **Mono:** [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) — timers, scores, labels

---

## 📂 Project Structure

```
panel-ai/
├── api/
│   └── chat.js          # Vercel serverless function — proxies Groq, keeps key server-side
├── src/
│   └── PanelAI.jsx       # Main app component
├── package.json
├── vite.config.js
├── .env                  # local only — GROQ_API_KEY (never committed)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/panel-ai.git
cd panel-ai
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Get a free Groq API key

1. Go to [console.groq.com](https://console.groq.com) and sign up — no card required
2. **API Keys** → **Create API Key**
3. Copy the key (starts with `gsk_`) — shown only once

### 4️⃣ Set up your environment variable

Create a `.env` file in the project root:

```dotenv
GROQ_API_KEY=gsk_your_key_here
```

### 5️⃣ Run locally

```bash
npm install -g vercel
vercel dev
```

This runs the frontend **and** the `/api/chat` serverless function together on one port — no separate backend server needed, no CORS issues.

---

## ☁️ Deploying to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your repo
3. Vercel auto-detects the Vite framework — no config needed
4. Before deploying, add your environment variable:
   - **Settings → Environment Variables**
   - Name: `GROQ_API_KEY`
   - Value: your `gsk_...` key
5. Click **Deploy** 🎉

Your app goes live at `your-project.vercel.app` — frontend and API on the same domain, so there's zero CORS friction in production.

> ⚠️ **Never** prefix this variable with `VITE_` — that would expose it to the browser. Keep it as plain `GROQ_API_KEY`, read only inside `api/chat.js`.

---

## 🔐 Security Notes

- ✅ API key lives only in `api/chat.js` (server-side) — never shipped to the browser
- ✅ `.env` is gitignored — never commit real keys
- ✅ Frontend calls a relative `/api/chat` path — same-origin, no CORS exposure
- ❌ Don't hardcode keys directly inside `PanelAI.jsx` for any real deployment

---

## 🗺️ Roadmap

- [ ] 🎙️ Voice input via Web Speech API
- [ ] 🌗 Dark mode toggle
- [ ] 📄 Export interview transcript as PDF
- [ ] 🌍 Multi-language interview support
- [ ] 🔁 Follow-up questions based on previous answers

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<p align="center">
  Built with ⚛️ React, ⚡ Groq, and a little bit of interview anxiety.
</p>
