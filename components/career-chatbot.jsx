"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Bot, ChevronDown, Send, Sparkles, X } from "lucide-react";

const pageMeta = {
  "/dashboard": {
    label: "Dashboard Buddy",
    subtitle: "Ask about trends, next steps, and where to focus.",
    prompts: [
      "What should I focus on this week?",
      "Summarize my industry insights",
      "Suggest a growth plan",
    ],
  },
  "/resume": {
    label: "Resume Buddy",
    subtitle: "Get quick edits, bullet ideas, and stronger wording.",
    prompts: [
      "Improve this resume bullet",
      "Make my summary stronger",
      "What skills should I highlight?",
    ],
  },
  "/interview": {
    label: "Interview Buddy",
    subtitle: "Practice answers and build confidence fast.",
    prompts: [
      "Ask me a behavioral question",
      "Help me answer tell me about yourself",
      "Rate my interview answer",
    ],
  },
  "/ai-cover-letter": {
    label: "Cover Letter Buddy",
    subtitle: "Draft warmer, sharper cover letters in seconds.",
    prompts: [
      "Write a cover letter intro",
      "Make this paragraph more personal",
      "Tailor this for a tech role",
    ],
  },
};

const starterMessages = [
  {
    role: "assistant",
    content:
      "Hi, I am your Career Buddy. I can help with resumes, interviews, cover letters, and career planning. What are we working on today?",
  },
];

function getPageMeta(pathname) {
  if (!pathname) {
    return {
      label: "Career Buddy",
      subtitle: "A cute AI assistant for your job search.",
      prompts: [
        "Give me a career roadmap",
        "Review my resume",
        "Help me prep for interviews",
      ],
    };
  }

  const matchedEntry = Object.entries(pageMeta).find(([route]) =>
    pathname.startsWith(route),
  );

  if (matchedEntry) {
    return matchedEntry[1];
  }

  return {
    label: "Career Buddy",
    subtitle: "A cute AI assistant for your job search.",
    prompts: [
      "Give me a career roadmap",
      "Review my resume",
      "Help me prep for interviews",
    ],
  };
}

export default function CareerChatbot() {
  const pathname = usePathname();
  const panelMeta = useMemo(() => getPageMeta(pathname), [pathname]);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(starterMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const isAuthPage =
    pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-up");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages(starterMessages);
    setError("");
    setIsLoading(false);
  }, [pathname]);

  const sendMessage = async (messageText) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const nextMessages = [
      ...messages,
      {
        role: "user",
        content: trimmedMessage,
      },
    ];

    setError("");
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          path: pathname,
          pageLabel: panelMeta.label,
          history: nextMessages.slice(-8),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "The bot could not answer right now.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (chatError) {
      setError(chatError.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await sendMessage(input);
  };

  if (isAuthPage) {
    return null;
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {isOpen ? (
        <div className="w-[min(92vw,22rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1020]/95 text-white shadow-[0_30px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500 px-4 py-4">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -left-3 bottom-0 h-10 w-10 rounded-full bg-white/10 blur-xl" />

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 shadow-inner ring-1 ring-white/20">
                  <Bot className="h-6 w-6 text-white" />
                </div>

                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
                    <Sparkles className="h-4 w-4" />
                    {panelMeta.label}
                  </p>
                  <p className="text-xs text-white/80">{panelMeta.subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-white/90 transition hover:bg-white/15 hover:text-white"
                aria-label="Close chatbot"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div className="max-h-[18rem] space-y-3 overflow-y-auto pr-1">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      message.role === "user"
                        ? "rounded-br-md bg-gradient-to-r from-cyan-500 to-sky-500 text-white"
                        : "rounded-bl-md border border-white/10 bg-white/5 text-slate-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isLoading ? (
                <div className="flex justify-start">
                  <div className="rounded-3xl rounded-bl-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-300 [animation-delay:-0.2s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-sky-300 [animation-delay:-0.1s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-300" />
                      <span className="ml-2 text-xs text-slate-300">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>

            <div className="flex flex-wrap gap-2">
              {panelMeta.prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-100">
                {error}
              </div>
            ) : null}

            <SignedIn>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-2 shadow-inner">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask your career buddy anything..."
                    className="min-h-[4.5rem] w-full resize-none border-0 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-0"
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  Send to Career Buddy
                </button>
              </form>
            </SignedIn>

            <SignedOut>
              <div className="space-y-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-center">
                <p className="text-sm text-slate-200">
                  Sign in to chat with your career buddy and get personalized
                  advice.
                </p>
                <SignInButton>
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:scale-[1.01]"
                  >
                    Sign in to continue
                  </button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>
        </div>
      ) : null}

      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full border border-white/10 bg-[#0b1020]/95 px-4 py-3 text-left text-white shadow-[0_22px_60px_rgba(15,23,42,0.35)] backdrop-blur-xl transition hover:scale-[1.02]"
          aria-label="Open career chatbot"
        >
          <span className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-500 shadow-lg shadow-cyan-500/20">
            <Bot className="h-6 w-6 text-white" />
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-300 text-[10px] font-bold text-slate-900 shadow-sm">
              <Sparkles className="h-3 w-3" />
            </span>
          </span>

          <span className="pr-2">
            <span className="flex items-center gap-2 text-sm font-semibold tracking-wide">
              Career Buddy
              <ChevronDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
            </span>
            <span className="block text-xs text-slate-300">
              Cute AI help for your next career move
            </span>
          </span>
        </button>
      ) : null}
    </div>
  );
}
