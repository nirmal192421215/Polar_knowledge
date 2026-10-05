"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "ai";
  text: string;
};

type Tab = "chat" | "generate";

// Quick science prompts shown in empty state
const QUICK_PROMPTS = [
  "What are India's research stations in Antarctica?",
  "Tell me about the South Pole NOAA observations",
  "What expeditions has India done in the Arctic?",
  "What is the current temperature at South Pole?",
];

// Content generation presets for social media outreach
const GENERATE_PRESETS = [
  { icon: "🐦", label: "Tweet", prompt: "Write an engaging tweet (under 280 characters) about India's polar research programme for NCPOR's Twitter/X account. Make it factual, inspiring, and include relevant hashtags like #IndianPolarResearch #NCPOR #Antarctica." },
  { icon: "📸", label: "Instagram", prompt: "Write an Instagram caption for a photo from India's Bharati Antarctic research station. Make it visually evocative, include relevant emojis, and add 5 appropriate hashtags." },
  { icon: "📰", label: "Press Release", prompt: "Write a short press release paragraph (100 words) announcing India's latest polar research activities and achievements for the Ministry of Earth Sciences website." },
  { icon: "🎓", label: "Student Explainer", prompt: "Explain India's polar research programme in simple terms for school students (age 14-16). Include why polar research matters for India, what scientists study, and what career opportunities exist." },
  { icon: "💼", label: "LinkedIn Post", prompt: "Write a professional LinkedIn post about India's contributions to global polar science, highlighting NCPOR's role, key achievements, and future goals." },
  { icon: "📧", label: "Newsletter", prompt: "Write a 150-word newsletter section about the latest developments in India's polar science programme, suitable for NCPOR's monthly institutional newsletter." },
];

export default function PolarAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Always light theme for enterprise corporate UI
  const isLight = true;

  // ---------------------------------------------------------
  // VOICE RECOGNITION (WEB SPEECH API)
  // ---------------------------------------------------------
  const toggleSpeechRecognition = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          setQuestion((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // ---------------------------------------------------------
  // SEND MESSAGE
  // ---------------------------------------------------------
  const sendMessage = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) return;

    const userMessage: Message = {
      role: "user",
      text: trimmedQuestion,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch("/api/polar-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedQuestion,
          // Send conversation history for multi-turn context
          history: updatedMessages.slice(-20), // last 20 messages
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "AI request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer,
        },
      ]);
    } catch (error) {
      console.error("POLAR AI error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            "Sorry, I couldn't connect to POLAR AI right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // ENTER KEY
  // ---------------------------------------------------------
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // START NEW CHAT
  const startNewChat = () => {
    setMessages([]);
    setQuestion("");
  };

  // COPY AI MESSAGE TO CLIPBOARD
  const copyMessage = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // clipboard not available
    }
  };

  // AUTO-SCROLL to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // LISTEN for navbar Polar AI trigger
  useEffect(() => {
    const handleOpen = (e: any) => {
      setIsOpen(true);
      setActiveTab("chat");
      if (e?.detail?.query) {
        setQuestion(e.detail.query);
      }
    };
    window.addEventListener("open-polar-ai", handleOpen as EventListener);
    return () => window.removeEventListener("open-polar-ai", handleOpen as EventListener);
  }, []);

  // SEND PRESET (content generation)
  const sendPreset = (prompt: string) => {
    setQuestion(prompt);
    setActiveTab("chat");
    // Small delay so tab switches first
    setTimeout(async () => {
      const trimmedQuestion = prompt.trim();
      if (!trimmedQuestion) return;
      const userMessage: Message = { role: "user", text: trimmedQuestion };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setQuestion("");
      setLoading(true);
      try {
        const response = await fetch("/api/polar-ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmedQuestion, history: updatedMessages.slice(-20) }),
        });
        const data = await response.json();
        if (!response.ok || !data.answer) {
          throw new Error(data?.error || "AI request failed");
        }
        setMessages((prev) => [...prev, { role: "ai", text: data.answer }]);
      } catch (err) {
        console.error("POLAR AI preset error:", err);
        setMessages((prev) => [
          ...prev,
          { role: "ai", text: "Sorry, I couldn't connect to POLAR AI right now. Please try again in a moment." },
        ]);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  // ---------------------------------------------------------
  // THEME COLORS (Pristine Enterprise Light Theme)
  // ---------------------------------------------------------
  const windowClass = "bg-[#F8FAFC] text-slate-800 border-slate-200 shadow-[0_20px_60px_rgba(15,23,42,0.15)]";
  const headerClass = "bg-white border-slate-200";
  const messagesClass = "bg-[#F8FAFC]";
  const inputAreaClass = "bg-white border-slate-200";
  const inputBoxClass = "bg-slate-50 border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100";
  const inputTextClass = "text-slate-900 placeholder:text-slate-400";
  const titleClass = "text-slate-900 font-bold";
  const buttonClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800";
  const emptyTitleClass = "text-slate-900 font-extrabold";
  const emptyDescriptionClass = "text-slate-600";
  const aiMessageClass = "bg-white text-slate-800 border-slate-200 shadow-xs";
  const loadingClass = "bg-white border-slate-200";
  const footerClass = "text-slate-500";
  const aiLabelClass = "text-blue-700 font-bold";
  const sendButtonClass = "text-blue-600 hover:text-blue-700";

  return (
    <>
      {/* =====================================================
          FLOATING POLAR AI BUTTON
      ====================================================== */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open POLAR AI Copilot"
          title="Open POLAR AI Copilot"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-xl sm:text-2xl text-white shadow-xl shadow-blue-600/30 transition-all duration-300 hover:scale-105 hover:shadow-blue-600/40 active:scale-95"
        >
          🤖
        </button>
      )}

      {/* =====================================================
          CHATBOT WINDOW
      ====================================================== */}

      {isOpen && (
        <div
          className={`
            fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50
            flex h-[560px] sm:h-[620px] w-[calc(100vw-24px)] sm:w-[390px]
            max-w-[400px] max-h-[calc(100dvh-24px)]
            flex-col overflow-hidden
            rounded-2xl sm:rounded-3xl border
            ${windowClass}
          `}
        >
          {/* HEADER */}
          <div className={`flex items-center gap-3 border-b px-5 py-4 ${headerClass}`}>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
              🤖
            </div>

            <div>
              <h3 className={`font-semibold ${titleClass}`}>POLAR AI</h3>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className={isLight ? "text-xs text-emerald-700" : "text-xs text-emerald-400"}>AI Assistant</span>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button type="button" onClick={startNewChat} aria-label="Start a new chat" title="New chat"
                className={`rounded-lg border px-3 py-2 text-xs transition-all duration-200 ${buttonClass}`}>
                New
              </button>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close POLAR AI" title="Close"
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg transition-all duration-200 ${buttonClass}`}>
                ×
              </button>
            </div>
          </div>

          {/* TAB BAR */}
          <div className={`flex border-b ${headerClass}`}>
            {(["chat", "generate"] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-700 font-bold bg-blue-50/50"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {tab === "chat" ? "💬 Chat" : "✨ Generate"}
              </button>
            ))}
          </div>

          {/* GENERATE PANEL */}
          {activeTab === "generate" && (
            <div className={`flex-1 overflow-y-auto p-4 ${messagesClass}`}>
              <p className="mb-4 text-xs text-slate-500">
                Generate outreach content for NCPOR&apos;s social media and communications channels.
              </p>
              <div className="grid gap-3">
                {GENERATE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => sendPreset(preset.prompt)}
                    disabled={loading}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left text-sm transition hover:border-blue-300 hover:bg-blue-50 disabled:opacity-40 shadow-2xs"
                  >
                    <span className="text-2xl">{preset.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-800">{preset.label}</div>
                      <div className="text-xs text-slate-500">Click to generate →</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CHAT PANEL */}
          {activeTab === "chat" && (
          <div className={`flex-1 overflow-y-auto p-4 ${messagesClass}`}>
            {messages.length === 0 ? (
              <div className="flex min-h-full flex-col items-center justify-center px-5 text-center">
                <div className="text-5xl">🤖</div>
                <h4 className={`mt-5 text-xl font-bold ${emptyTitleClass}`}>Hello! I&apos;m POLAR AI</h4>
                <p className={`mt-3 text-sm leading-6 ${emptyDescriptionClass}`}>
                  Ask me about polar science, expeditions, climate, datasets, or let me generate social media content.
                </p>
                {/* Quick Prompt Chips */}
                <div className="mt-6 flex flex-col gap-2 w-full">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendPreset(prompt)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-700 shadow-2xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* MESSAGE LIST */
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="group relative max-w-[88%]">
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                          message.role === "user"
                            ? "rounded-br-md bg-blue-600 text-white font-medium shadow-2xs"
                            : `rounded-bl-md border ${aiMessageClass}`
                        }`}
                      >
                        {message.role === "ai" && (
                          <div className={`mb-2 text-xs font-semibold ${aiLabelClass}`}>🤖 POLAR AI</div>
                        )}
                        {message.role === "ai" ? (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              em: ({ children }) => <em>{children}</em>,
                              h1: ({ children }) => <h1 className="mb-3 mt-4 text-lg font-bold">{children}</h1>,
                              h2: ({ children }) => <h2 className="mb-2 mt-3 text-base font-bold">{children}</h2>,
                              ul: ({ children }) => <ul className="mb-3 list-disc pl-5 space-y-1">{children}</ul>,
                              li: ({ children }) => <li>{children}</li>,
                              code: ({ children }) => <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-slate-800 border border-slate-200">{children}</code>,
                            }}
                          >
                            {message.text}
                          </ReactMarkdown>
                        ) : (
                          <p className="whitespace-pre-wrap">{message.text}</p>
                        )}
                      </div>

                      {/* COPY button — only on AI messages */}
                      {message.role === "ai" && (
                        <button
                          type="button"
                          onClick={() => copyMessage(message.text, index)}
                          className={`mt-1 text-[10px] transition ${
                            copiedIndex === index
                              ? "text-emerald-400"
                              : isLight ? "text-slate-400 hover:text-slate-600" : "text-slate-600 hover:text-slate-400"
                          }`}
                        >
                          {copiedIndex === index ? "✓ Copied!" : "📋 Copy"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* LOADING */}
                {loading && (
                  <div className="flex justify-start">
                    <div className={`rounded-2xl rounded-bl-md border px-4 py-3 ${loadingClass}`}>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "100ms" }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" style={{ animationDelay: "200ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                {/* Auto-scroll anchor */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          )} {/* end chat panel */}

          {/* INPUT */}
          <div className={`border-t p-3 ${inputAreaClass}`}>
            <div className={`flex overflow-hidden rounded-xl border ${inputBoxClass}`}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                placeholder={activeTab === "generate" ? "Or type a custom request..." : "Ask POLAR AI anything..."}
                className={`w-full bg-transparent px-4 py-3 text-sm outline-none ${inputTextClass}`}
              />
              {/* MICROPHONE BUTTON */}
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                aria-label={isListening ? "Stop listening" : "Voice input"}
                title={isListening ? "Listening... click to stop" : "Speak your query (Speech to Text)"}
                className={`px-3 text-lg transition flex items-center justify-center shrink-0 ${
                  isListening
                    ? "bg-rose-500 text-white animate-pulse"
                    : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {isListening ? "🔴" : "🎙️"}
              </button>

              <button
                type="button"
                onClick={sendMessage}
                disabled={loading || !question.trim()}
                aria-label="Send"
                title="Send"
                className={`px-4 text-xl transition disabled:opacity-40 shrink-0 ${sendButtonClass}`}
              >
                ➤
              </button>
            </div>
            <p className={`mt-2 text-center text-[10px] ${footerClass}`}>
              POLAR AI • Google Gemini • NCPOR Knowledge Assistant
            </p>
          </div>
        </div>
      )}
    </>
  );
}