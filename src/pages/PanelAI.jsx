import React, { useState, useEffect, useRef, useReducer, useCallback, useMemo } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Design tokens — "Modern" palette: charcoal / warm gray / sage-cream */
/* ------------------------------------------------------------------ */
const TOKENS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  :root{
    --black:#14161A; --black-soft:#1E2125;
    --gray:#6E7178; --gray-light:#A9ACB2;
    --cream:#EDF0E1; --white:#F7F8F2;
    --moss:#4A5A40; --moss-light:#6B7F5C;
    --danger:#A6453A;
  }
  .pai{
    --font-display:'Space Grotesk',sans-serif;
    --font-body:'Inter',sans-serif;
    --font-mono:'IBM Plex Mono',monospace;
    background:var(--cream);
    color:var(--black);
    font-family:var(--font-body);
    min-height:100vh;
    width:100%;
    position:relative;
    overflow-x:hidden;
  }
  .pai *{box-sizing:border-box;}
  .pai h1,.pai h2,.pai h3{font-family:var(--font-display);letter-spacing:-0.02em;margin:0;}
  .pai .mono{font-family:var(--font-mono);}

  /* diagonal signature stripes */
  .pai-stripes{position:absolute;inset:0;overflow:hidden;pointer-events:none;opacity:0.9;z-index:0;}
  .pai-stripe{position:absolute;top:-10%;height:130%;width:14%;transform:skewX(-12deg);}

  .pai-shell{position:relative;z-index:1;max-width:920px;margin:0 auto;padding:48px 24px 80px;}

  .pai-topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;}
  .pai-brand{display:flex;align-items:center;gap:10px;}
  .pai-brand .dot{width:10px;height:10px;background:var(--moss);border-radius:1px;transform:rotate(45deg);}
  .pai-nav{display:flex;gap:6px;}
  .pai-nav button{
    font-family:var(--font-mono);font-size:12px;letter-spacing:.05em;text-transform:uppercase;
    background:transparent;border:1px solid var(--black);color:var(--black);
    padding:8px 14px;cursor:pointer;transition:all .15s ease;
  }
  .pai-nav button:hover, .pai-nav button.active{background:var(--black);color:var(--cream);}
  .pai-nav button:focus-visible{outline:2px solid var(--moss);outline-offset:2px;}

  .pai-card{background:var(--white);border:1px solid var(--black);padding:32px;}

  /* landing */
  .pai-hero h1{font-size:clamp(40px,7vw,68px);line-height:0.95;}
  .pai-hero .eyebrow{font-family:var(--font-mono);font-size:12px;text-transform:uppercase;letter-spacing:.12em;color:var(--moss);margin-bottom:14px;display:block;}
  .pai-hero p.lede{font-size:17px;color:var(--gray);max-width:52ch;margin-top:16px;line-height:1.55;}

  .role-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;margin-top:32px;}
  .role-btn{
    text-align:left;background:var(--white);border:1px solid var(--gray-light);
    padding:16px;cursor:pointer;font-family:var(--font-body);font-size:14px;color:var(--black);
    transition:border-color .15s ease, transform .1s ease;
  }
  .role-btn:hover{border-color:var(--black);}
  .role-btn.selected{border-color:var(--moss);background:var(--cream);box-shadow:inset 0 0 0 1px var(--moss);}
  .role-btn:focus-visible{outline:2px solid var(--moss);outline-offset:2px;}
  .role-btn .role-label{font-weight:600;display:block;}
  .role-btn .role-sub{color:var(--gray);font-size:12px;margin-top:2px;display:block;}

  .custom-role{margin-top:16px;display:flex;gap:8px;}
  .custom-role input{
    flex:1;border:1px solid var(--gray-light);background:var(--white);
    padding:12px 14px;font-family:var(--font-body);font-size:14px;color:var(--black);
  }
  .custom-role input:focus{outline:none;border-color:var(--moss);}

  .btn-primary{
    font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.06em;font-size:13px;
    background:var(--black);color:var(--cream);border:1px solid var(--black);
    padding:14px 28px;cursor:pointer;transition:transform .12s ease, background .15s ease;
  }
  .btn-primary:hover:not(:disabled){background:var(--moss);border-color:var(--moss);}
  .btn-primary:disabled{opacity:0.35;cursor:not-allowed;}
  .btn-primary:focus-visible{outline:2px solid var(--moss);outline-offset:2px;}

  .btn-ghost{
    font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.06em;font-size:12px;
    background:transparent;color:var(--black);border:1px solid var(--gray-light);
    padding:10px 18px;cursor:pointer;
  }
  .btn-ghost:hover{border-color:var(--black);}

  /* interview */
  .progress-row{display:flex;gap:8px;margin-bottom:24px;}
  .progress-seg{flex:1;height:4px;background:var(--gray-light);}
  .progress-seg.done{background:var(--moss);}
  .progress-seg.current{background:var(--black);}

  .persona-card{border:1px solid var(--black);background:var(--white);position:relative;overflow:hidden;}
  .persona-head{display:flex;align-items:center;gap:14px;padding:20px 24px;border-bottom:1px solid var(--black);position:relative;}
  .persona-avatar{width:44px;height:44px;flex-shrink:0;display:flex;align-items:center;justify-content:center;
    font-family:var(--font-display);font-weight:700;font-size:16px;color:var(--white);}
  .persona-meta .name{font-weight:700;font-size:16px;}
  .persona-meta .role{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--gray);}
  .timer{margin-left:auto;font-family:var(--font-mono);font-size:13px;color:var(--gray);}
  .timer.low{color:var(--danger);}

  .persona-body{padding:24px;min-height:110px;}
  .question-text{font-size:17px;line-height:1.6;}
  .cursor-blink{display:inline-block;width:8px;height:16px;background:var(--black);margin-left:2px;animation:blink 1s step-end infinite;vertical-align:middle;}
  @keyframes blink{50%{opacity:0;}}

  .answer-zone{padding:0 24px 24px;}
  textarea.answer-input{
    width:100%;min-height:120px;border:1px solid var(--gray-light);background:var(--cream);
    padding:14px;font-family:var(--font-body);font-size:14px;color:var(--black);resize:vertical;line-height:1.5;
  }
  textarea.answer-input:focus{outline:none;border-color:var(--moss);}
  .answer-actions{display:flex;justify-content:space-between;align-items:center;margin-top:12px;}
  .char-count{font-family:var(--font-mono);font-size:11px;color:var(--gray-light);}

  /* results */
  .verdict-banner{background:var(--black);color:var(--cream);padding:28px 32px;margin-bottom:24px;}
  .verdict-banner .eyebrow{font-family:var(--font-mono);font-size:12px;color:var(--moss-light);text-transform:uppercase;letter-spacing:.1em;display:block;margin-bottom:10px;}
  .verdict-banner p{font-size:16px;line-height:1.6;margin:0;}

  .results-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:24px;margin-top:24px;}
  @media (max-width:760px){.results-grid{grid-template-columns:1fr;}}

  .sw-list h3{font-size:13px;font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;}
  .sw-list ul{margin:0 0 20px;padding-left:18px;}
  .sw-list li{margin-bottom:6px;font-size:14px;line-height:1.5;}

  .history-row{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--gray-light);}
  .history-row:last-child{border-bottom:none;}
  .history-role{font-weight:600;}
  .history-date{font-family:var(--font-mono);font-size:11px;color:var(--gray);}
  .history-score{font-family:var(--font-mono);font-size:20px;font-weight:700;color:var(--moss);}

  .empty-state{text-align:center;padding:60px 20px;color:var(--gray);}
  .loading-dots::after{content:'...';animation:dots 1.4s steps(4,end) infinite;}
  @keyframes dots{0%,20%{content:'.';}40%{content:'..';}60%,100%{content:'...';}}
`;

/* ------------------------------------------------------------------ */
/*  Personas                                                          */
/* ------------------------------------------------------------------ */
const PERSONAS = [
  {
    id: "tech",
    name: "Adeel Raza",
    role: "Technical Lead",
    color: "var(--gray)",
    initial: "AR",
    system: (jobRole) =>
      `You are Adeel Raza, a strict, no-nonsense Technical Lead interviewing a candidate for a ${jobRole} position. Ask exactly one sharp, specific technical question relevant to ${jobRole}. Be terse and professional, no pleasantries. Output only the question, nothing else.`,
  },
  {
    id: "hr",
    name: "Sana Malik",
    role: "HR Manager",
    color: "var(--moss)",
    initial: "SM",
    system: (jobRole) =>
      `You are Sana Malik, a warm and friendly HR Manager interviewing a candidate for a ${jobRole} position. Ask exactly one behavioral or situational question (STAR-style) relevant to workplace conduct. Keep it warm but professional. Output only the question, nothing else.`,
  },
  {
    id: "mgr",
    name: "Farhan Iqbal",
    role: "Senior Manager",
    color: "var(--black)",
    initial: "FI",
    system: (jobRole) =>
      `You are Farhan Iqbal, a skeptical, pressure-testing Senior Manager interviewing a candidate for a ${jobRole} position. Ask exactly one situational question about prioritization, conflict, or handling pressure. Be direct and slightly challenging. Output only the question, nothing else.`,
  },
];

const ROLES = [
  { label: "Frontend Developer", sub: "React, UI, performance" },
  { label: "Backend Developer", sub: "APIs, databases, systems" },
  { label: "Data Analyst", sub: "SQL, dashboards, insight" },
  { label: "Product Manager", sub: "roadmaps, tradeoffs" },
  { label: "UI/UX Designer", sub: "flows, usability" },
  { label: "DevOps Engineer", sub: "CI/CD, infra, reliability" },
];

/* ------------------------------------------------------------------ */
/*  Groq API helpers — free tier, OpenAI-compatible endpoint          */
/*                                                                     */
/*  The Groq key lives ONLY in server.js (server-side) now — never in   */
/*  this file. The browser calls our own local proxy at GROQ_URL below, */
/*  and the proxy attaches the real key before forwarding to Groq.      */
/*  See server.js for setup: npm install express cors dotenv, then      */
/*  node server.js.                                                     */
/* ------------------------------------------------------------------ */
const GROQ_MODEL = "llama-3.3-70b-versatile";
// Relative path — same-origin, so there's no CORS at all. Works locally with
// `vercel dev` and automatically in production once deployed on Vercel.
const GROQ_URL = "/api/chat";

async function streamClaude(systemPrompt, userText, onDelta) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 300,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
      stream: true,
    }),
  });
  if (!response.ok || !response.body) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Groq request failed (${response.status}): ${errText || "check your API key"}`);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === "[DONE]") continue;
      try {
        const evt = JSON.parse(raw);
        const delta = evt.choices && evt.choices[0] && evt.choices[0].delta;
        if (delta && delta.content) {
          full += delta.content;
          onDelta(full);
        }
      } catch (_) {}
    }
  }
  return full.trim();
}

async function callClaudeJSON(systemPrompt, userText) {
  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userText },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Groq request failed (${response.status}): ${errText || "check your API key"}`);
  }
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

/* ------------------------------------------------------------------ */
/*  Custom hooks                                                      */
/* ------------------------------------------------------------------ */
// Persists interview history across sessions using the browser's own
// localStorage — works in any real deployed site, not just inside Claude.ai.
const HISTORY_KEY = "panelai:history";

function usePersistentHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return []; // localStorage unavailable (private browsing, etc.) — stay in-memory
    }
  });

  const addEntry = useCallback((entry) => {
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 20);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch (_) {
        // storage full or blocked — history still works for this session
      }
      return next;
    });
  }, []);

  return [history, addEntry];
}

function useCountdown(seconds, active, onExpire) {
  const [left, setLeft] = useState(seconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setLeft(seconds);
    expiredRef.current = false;
  }, [seconds, active]);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1 && !expiredRef.current) {
          expiredRef.current = true;
          clearInterval(id);
          onExpireRef.current && onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [active]);
  return left;
}

/* ------------------------------------------------------------------ */
/*  Reducer — interview state machine                                 */
/* ------------------------------------------------------------------ */
const initialState = {
  stage: "setup", // setup -> question -> answering -> evaluating -> results
  role: null,
  round: 0, // index into PERSONAS
  qa: [], // {persona, question, answer}
  currentQuestion: "",
  isStreaming: false,
  error: null,
  verdict: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.role };
    case "START":
      return { ...initialState, role: state.role, stage: "question", round: 0 };
    case "STREAM_DELTA":
      return { ...state, currentQuestion: action.text, isStreaming: true, stage: "question" };
    case "STREAM_DONE":
      return { ...state, isStreaming: false };
    case "SUBMIT_ANSWER": {
      const persona = PERSONAS[state.round];
      const qa = [...state.qa, { persona: persona.id, question: state.currentQuestion, answer: action.answer }];
      const nextRound = state.round + 1;
      if (nextRound >= PERSONAS.length) {
        return { ...state, qa, stage: "evaluating", currentQuestion: "" };
      }
      return { ...state, qa, round: nextRound, stage: "question", currentQuestion: "" };
    }
    case "SET_VERDICT":
      return { ...state, verdict: action.verdict, stage: "results" };
    case "ERROR":
      return { ...state, error: action.error, isStreaming: false };
    case "RESET":
      return { ...initialState, role: state.role };
    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  UI pieces                                                         */
/* ------------------------------------------------------------------ */
function Stripes() {
  return (
    <div className="pai-stripes">
      <div className="pai-stripe" style={{ left: "8%", background: "var(--black)", opacity: 0.06 }} />
      <div className="pai-stripe" style={{ left: "24%", background: "var(--gray)", opacity: 0.08 }} />
      <div className="pai-stripe" style={{ left: "70%", background: "var(--moss)", opacity: 0.07 }} />
    </div>
  );
}

function TopBar({ view, setView, hasHistory }) {
  return (
    <div className="pai-topbar">
      <div className="pai-brand">
        <span className="dot" />
        <h3 style={{ fontSize: 18 }}>Panel AI</h3>
      </div>
      <div className="pai-nav">
        <button className={view === "home" ? "active" : ""} onClick={() => setView("home")}>Interview</button>
        <button className={view === "history" ? "active" : ""} onClick={() => setView("history")}>History</button>
      </div>
    </div>
  );
}

function Landing({ role, setRole, customRole, setCustomRole, onStart }) {
  return (
    <>
      <div className="pai-hero">
        <span className="eyebrow">03 personas · 01 verdict</span>
        <h1>The panel is<br />waiting.</h1>
        <p className="lede">
          Face a Technical Lead, an HR Manager, and a Senior Manager back to back — real questions,
          streamed live, scored honestly at the end. Pick a role to begin.
        </p>
      </div>
      <div className="role-grid">
        {ROLES.map((r) => (
          <button
            key={r.label}
            className={"role-btn" + (role === r.label ? " selected" : "")}
            onClick={() => { setRole(r.label); setCustomRole(""); }}
          >
            <span className="role-label">{r.label}</span>
            <span className="role-sub">{r.sub}</span>
          </button>
        ))}
      </div>
      <div className="custom-role">
        <input
          placeholder="Or type a custom role…"
          value={customRole}
          onChange={(e) => { setCustomRole(e.target.value); if (e.target.value) setRole(null); }}
        />
      </div>
      <div style={{ marginTop: 28 }}>
        <button
          className="btn-primary"
          disabled={!role && !customRole}
          onClick={() => onStart(customRole || role)}
        >
          Start Interview →
        </button>
      </div>
    </>
  );
}

function PersonaCard({ persona, question, isStreaming, timeLeft, active }) {
  return (
    <div className="persona-card">
      <div className="persona-head">
        <div className="persona-avatar" style={{ background: persona.color }}>{persona.initial}</div>
        <div className="persona-meta">
          <div className="name">{persona.name}</div>
          <div className="role">{persona.role}</div>
        </div>
        {active && (
          <div className={"timer mono" + (timeLeft <= 10 ? " low" : "")}>
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        )}
      </div>
      <div className="persona-body">
        {question ? (
          <p className="question-text">{question}{isStreaming && <span className="cursor-blink" />}</p>
        ) : (
          <p className="question-text mono loading-dots" style={{ color: "var(--gray)" }}>Thinking</p>
        )}
      </div>
    </div>
  );
}

function InterviewScreen({ state, dispatch, jobRole }) {
  const persona = PERSONAS[state.round];
  const [answer, setAnswer] = useState("");
  const streamStarted = useRef(-1);

  const timeLeft = useCountdown(90, state.stage === "question" && !!state.currentQuestion, () => {
    if (!state.isStreaming) handleSubmit(true);
  });

  useEffect(() => {
    if (state.stage !== "question") return;
    if (streamStarted.current === state.round) return;
    streamStarted.current = state.round;
    dispatch({ type: "STREAM_DELTA", text: "" });
    streamClaude(persona.system(jobRole), "Ask your interview question now.", (text) => {
      dispatch({ type: "STREAM_DELTA", text });
    })
      .then(() => dispatch({ type: "STREAM_DONE" }))
      .catch((e) => dispatch({ type: "ERROR", error: String(e.message || e) }));
  }, [state.round, state.stage]);

  function handleSubmit(auto) {
    const finalAnswer = answer.trim() || (auto ? "(No answer provided in time.)" : "");
    if (!finalAnswer) return;
    setAnswer("");
    streamStarted.current = -1;
    dispatch({ type: "SUBMIT_ANSWER", answer: finalAnswer });
  }

  return (
    <>
      <div className="progress-row">
        {PERSONAS.map((p, i) => (
          <div key={p.id} className={"progress-seg" + (i < state.round ? " done" : i === state.round ? " current" : "")} />
        ))}
      </div>
      <PersonaCard
        persona={persona}
        question={state.currentQuestion}
        isStreaming={state.isStreaming}
        timeLeft={timeLeft}
        active={!state.isStreaming && !!state.currentQuestion}
      />
      {!state.isStreaming && state.currentQuestion && (
        <div className="answer-zone" style={{ marginTop: 4 }}>
          <textarea
            className="answer-input"
            placeholder="Type your answer…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            autoFocus
          />
          <div className="answer-actions">
            <span className="char-count mono">{answer.length} chars</span>
            <button className="btn-primary" disabled={!answer.trim()} onClick={() => handleSubmit(false)}>
              {state.round === PERSONAS.length - 1 ? "Finish Interview" : "Submit Answer →"}
            </button>
          </div>
        </div>
      )}
      {state.error && <p style={{ color: "var(--danger)", marginTop: 16 }} className="mono">{state.error}</p>}
    </>
  );
}

function Evaluating({ state, dispatch, jobRole, onDone }) {
  const called = useRef(false);
  useEffect(() => {
    if (called.current) return;
    called.current = true;
    const transcript = state.qa
      .map((qa, i) => {
        const p = PERSONAS.find((pp) => pp.id === qa.persona);
        return `Q${i + 1} (${p.role}): ${qa.question}\nAnswer: ${qa.answer}`;
      })
      .join("\n\n");
    const sys = `You are an impartial interview panel aggregating three interviewers' impressions for a ${jobRole} candidate. Score the candidate 0-100 on each of: confidence, clarity, technicalDepth, communication, problemSolving. Also give 3 short strengths, 3 short weaknesses, and a 2-sentence overallVerdict. Respond with ONLY valid JSON in this exact shape: {"scores":{"confidence":0,"clarity":0,"technicalDepth":0,"communication":0,"problemSolving":0},"strengths":["",""],"weaknesses":["",""],"overallVerdict":""}`;
    callClaudeJSON(sys, transcript)
      .then((verdict) => {
        dispatch({ type: "SET_VERDICT", verdict });
        onDone(jobRole, verdict);
      })
      .catch((e) => dispatch({ type: "ERROR", error: "Could not score interview: " + String(e.message || e) }));
  }, []);
  return (
    <div className="empty-state">
      <p className="mono loading-dots" style={{ fontSize: 14 }}>The panel is deliberating</p>
    </div>
  );
}

function Results({ state, dispatch }) {
  const v = state.verdict;
  if (!v) return null;
  const data = Object.entries(v.scores).map(([key, val]) => ({
    subject: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    value: val,
  }));
  const avg = Math.round(Object.values(v.scores).reduce((a, b) => a + b, 0) / Object.values(v.scores).length);

  return (
    <>
      <div className="verdict-banner">
        <span className="eyebrow">Panel Verdict · Overall {avg}/100</span>
        <p>{v.overallVerdict}</p>
      </div>
      <div className="results-grid">
        <div className="pai-card" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="72%">
              <PolarGrid stroke="#A9ACB2" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#14161A", fontSize: 11, fontFamily: "IBM Plex Mono" }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#A9ACB2", fontSize: 10 }} />
              <Radar dataKey="value" stroke="#4A5A40" fill="#4A5A40" fillOpacity={0.35} strokeWidth={2} />
              <Tooltip contentStyle={{ fontFamily: "IBM Plex Mono", fontSize: 12, border: "1px solid #14161A" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="pai-card sw-list">
          <h3>Strengths</h3>
          <ul>{v.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
          <h3>Watch Areas</h3>
          <ul>{v.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      </div>
      <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
        <button className="btn-primary" onClick={() => dispatch({ type: "RESET" })}>New Interview</button>
      </div>
    </>
  );
}

function History({ history }) {
  if (!history.length) {
    return <div className="empty-state">No interviews yet. Finish one and it'll show up here.</div>;
  }
  return (
    <div className="pai-card">
      {history.map((h, i) => (
        <div className="history-row" key={i}>
          <div>
            <div className="history-role">{h.role}</div>
            <div className="history-date mono">{h.date}</div>
          </div>
          <div className="history-score">{h.avg}</div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Root                                                               */
/* ------------------------------------------------------------------ */
export default function PanelAI() {
  const [view, setView] = useState("home");
  const [role, setRole] = useState(null);
  const [customRole, setCustomRole] = useState("");
  const [history, addHistoryEntry] = usePersistentHistory();
  const [state, dispatch] = useReducer(reducer, initialState);

  const jobRole = state.role;

  function handleStart(chosenRole) {
    dispatch({ type: "SET_ROLE", role: chosenRole });
    setTimeout(() => dispatch({ type: "START" }), 0);
  }

  function handleEvalDone(jr, verdict) {
    const avg = Math.round(Object.values(verdict.scores).reduce((a, b) => a + b, 0) / Object.values(verdict.scores).length);
    addHistoryEntry({ role: jr, date: new Date().toLocaleDateString(), avg });
  }

  return (
    <div className="pai">
      <style>{TOKENS}</style>
      <Stripes />
      <div className="pai-shell">
        <TopBar view={view} setView={setView} />
        {view === "history" ? (
          <History history={history} />
        ) : state.stage === "setup" ? (
          <Landing role={role} setRole={setRole} customRole={customRole} setCustomRole={setCustomRole} onStart={handleStart} />
        ) : state.stage === "question" || state.stage === "answering" ? (
          <InterviewScreen state={state} dispatch={dispatch} jobRole={jobRole} />
        ) : state.stage === "evaluating" ? (
          <Evaluating state={state} dispatch={dispatch} jobRole={jobRole} onDone={handleEvalDone} />
        ) : (
          <Results state={state} dispatch={dispatch} />
        )}
      </div>
    </div>
  );
}