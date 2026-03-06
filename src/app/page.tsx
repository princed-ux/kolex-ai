"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const KOLEX_LOGO =
  "data:image/png;base64,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";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isImage?: boolean;
};
type Chat = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
};
type Theme = "light" | "dark" | "system";

function generateId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function generateChatTitle(msg: string) {
  const words = msg.trim().split(" ").slice(0, 6).join(" ");
  return words.length < msg.trim().length ? words + "..." : words;
}

function isImageRequest(text: string) {
  const lower = text.toLowerCase();
  return (
    (/\b(generate|create|draw|make|paint|design|render|show|get)\b/.test(
      lower,
    ) &&
      /\b(image|picture|photo|illustration|artwork|art|portrait|landscape|logo|icon|wallpaper|painting|sketch)\b/.test(
        lower,
      )) ||
    /\b(image|picture|photo)\s+(of|showing|with)\b/.test(lower)
  );
}
const STORAGE_KEY = "kolex_chats";

// Replace your saveChats function with this:
function saveChats(chats: Chat[]) {
  try {
    // Because Pollinations AI returns a URL (not a heavy Base64 image), 
    // it's completely safe to store the raw chats array in localStorage.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch {}
}

function loadChats(): Chat[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={`copy-btn ${copied ? "copied" : ""}`}
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
}

// ── Code block renderer ──────────────────────────────
function MessageContent({ content, isStreaming }: { content: string; isStreaming?: boolean }) {
  const parts: React.ReactNode[] = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0, key = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index);
      parts.push(<FormattedText key={key++} text={text} />);
    }
    const lang = match[1] || "code";
    const code = match[2].trimEnd();
    parts.push(
      <div key={key++} className="code-block-wrap">
        <div className="code-block-header">
          <span className="code-lang">{lang}</span>
          <CopyButton code={code} />
        </div>
        <pre className="code-block"><code>{code}</code></pre>
      </div>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length)
    parts.push(<FormattedText key={key++} text={content.slice(lastIndex)} />);

  return <>{parts}{isStreaming && <span className="cursor-blink">▊</span>}</>;
}

function FormattedText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        // Heading: ### or ## or #
        const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const sizes = ["1.2em", "1.1em", "1em"];
          return <div key={i} style={{ fontWeight: 700, fontSize: sizes[level-1], margin: "10px 0 4px" }}>
            <InlineText text={headingMatch[2]} />
          </div>;
        }
        // Numbered list: 1. item
        const numMatch = line.match(/^(\d+)\.\s+(.+)/);
        if (numMatch) return (
          <div key={i} style={{ display: "flex", gap: 8, margin: "2px 0" }}>
            <span style={{ color: "var(--accent)", fontWeight: 600, minWidth: 18 }}>{numMatch[1]}.</span>
            <span><InlineText text={numMatch[2]} /></span>
          </div>
        );
        // Bullet: - item or * item
        const bulletMatch = line.match(/^[-*]\s+(.+)/);
        if (bulletMatch) return (
          <div key={i} style={{ display: "flex", gap: 8, margin: "2px 0" }}>
            <span style={{ color: "var(--accent)", fontWeight: 700, minWidth: 12 }}>•</span>
            <span><InlineText text={bulletMatch[1]} /></span>
          </div>
        );
        // Empty line = spacer
        if (line.trim() === "") return <div key={i} style={{ height: 8 }} />;
        // Normal line
        return <div key={i}><InlineText text={line} /></div>;
      })}
    </>
  );
}


function InlineText({ text }: { text: string }) {
  // Handle bold (**text**), italic (*text*), and inline code (`text`)
  const nodes: React.ReactNode[] = [];
  const r = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let last = 0, k = 0, m: RegExpExecArray | null;
  while ((m = r.exec(text)) !== null) {
    if (m.index > last) nodes.push(<span key={k++}>{text.slice(last, m.index)}</span>);
    if (m[1]) nodes.push(<strong key={k++}>{m[2]}</strong>);
    else if (m[3]) nodes.push(<em key={k++}>{m[4]}</em>);
    else if (m[5]) nodes.push(<code key={k++} className="inline-code">{m[6]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(<span key={k++}>{text.slice(last)}</span>);
  return <>{nodes}</>;
}

// ── Image with retry for HuggingFace cold starts ─────
function GeneratedImage({ src, prompt }: { src: string; prompt: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "retrying">("loading");
  const [imgSrc, setImgSrc] = useState(src);
  const retries = useRef(0);

  const retry = () => {
    if (retries.current >= 4) { setStatus("error"); return; }
    retries.current++;
    setStatus("retrying");
    setTimeout(() => {
      setImgSrc(`/api/image?prompt=${encodeURIComponent(prompt)}&r=${retries.current}`);
      setStatus("loading");
    }, 4000);
  };

  return (
    <div>
      {/* img is ALWAYS rendered so onLoad/onError can fire */}
      <img
        src={imgSrc}
        alt={prompt}
        className="generated-image"
        style={{ display: status === "ready" ? "block" : "none" }}
        onLoad={() => setStatus("ready")}
        onError={retry}
      />
      {(status === "loading" || status === "retrying") && (
        <div className="image-loading">
          <div className="spinner-ring" />
          <span>{status === "retrying" ? `Warming up... retry ${retries.current}/4` : "Generating with FLUX.1..."}</span>
        </div>
      )}
      {status === "error" && (
        <div className="image-loading">
          <span>⚠️ Generation failed.</span>
          <button className="copy-btn" onClick={() => {
            retries.current = 0;
            setImgSrc(`/api/image?prompt=${encodeURIComponent(prompt)}&r=reset`);
            setStatus("loading");
          }}>Retry</button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(
  typeof window !== "undefined" ? window.innerWidth > 768 : true
);
  const [isListening, setIsListening] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);

const autoResize = () => {
  const ta = inputRef.current;
  if (!ta) return;
  ta.style.height = "auto";
  ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
};
useEffect(() => { autoResize(); }, [inputValue]);


  const recognitionRef = useRef<any>(null);
  const chatsRef = useRef(chats);
  chatsRef.current = chats;

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const messages = activeChat?.messages ?? [];
  const hasMessages = messages.length > 0;

  // Load chats from localStorage on mount
  useEffect(() => {
    const saved = loadChats();
    if (saved.length > 0) {
      setChats(saved);
      setActiveChatId(saved[0].id);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) saveChats(chats);
  }, [chats]);

  // Theme resolution
  useEffect(() => {
    const saved = localStorage.getItem("kolex_theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("kolex_theme", theme);
    const apply = () => {
      if (theme === "system") {
        setResolvedTheme(
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light",
        );
      } else setResolvedTheme(theme);
    };
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth");
  }, [status, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update URL when chat has messages
  // REPLACE WITH: (use query param instead — no 404)
useEffect(() => {
  if (activeChatId && activeChat && activeChat.messages.length > 0) {
    window.history.replaceState(null, "", `/?chat=${activeChatId}`);
  } else {
    window.history.replaceState(null, "", "/");
  }
}, [activeChatId, activeChat?.messages.length]);

  const createNewChat = useCallback(() => {
    const id = generateId();
    const newChat: Chat = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
    setInputValue("");
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  useEffect(() => {
    if (status === "authenticated" && chats.length === 0) {
      createNewChat();
    }
  }, [status]);

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      if (updated.length === 0) {
        // Will trigger createNewChat via useEffect
        setTimeout(() => createNewChat(), 10);
      } else if (id === activeChatId) {
        setActiveChatId(updated[0].id);
      }
      if (updated.length === 0) localStorage.removeItem(STORAGE_KEY);
      return updated;
    });
  };

  const toggleVoice = () => {
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) { alert("Voice not supported. Use Chrome."); return; }

  if (isListening) {
    recognitionRef.current?.stop();
    setIsListening(false);
    return;
  }

  const rec = new SR();
  rec.continuous = true;       // keep recording until user stops
  rec.interimResults = true;
  rec.lang = "en-US";
  rec.onstart = () => setIsListening(true);
  rec.onend = () => {
    // Only stop if user manually stopped — otherwise restart
    if (isListening) rec.start();
  };
  rec.onerror = () => setIsListening(false);
  rec.onresult = (ev: any) => {
    // Only append finalized results, not interim
    let final = "";
    for (let i = ev.resultIndex; i < ev.results.length; i++) {
      if (ev.results[i].isFinal) final += ev.results[i][0].transcript + " ";
    }
    if (final) setInputValue((prev) => prev + final);
  };
  recognitionRef.current = rec;
  rec.start();
};

  const generateImage = async (prompt: string, assistantId: string, chatId: string) => {
  const clean = prompt
    .replace(/^(generate|create|draw|make|paint|render|design|show me|give me|can you|please|for me)\s*/gi, '')
    .replace(/\b(an?|the|please|for me)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim() || 'beautiful abstract art';

  // Use our proxy route instead of calling Pollinations directly
  const imageUrl = `/api/image?prompt=${encodeURIComponent(clean)}`;

  setChats(prev => prev.map(c => c.id !== chatId ? c : {
    ...c,
    messages: c.messages.map(m =>
      m.id === assistantId ? { ...m, content: imageUrl, isImage: true } : m
    )
  }));
  return true;
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    onSubmit(e as any);
  }
};

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !activeChatId) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
    };
    const isFirst = messages.length === 0;
    const title = isFirst ? generateChatTitle(inputValue) : activeChat!.title;
    const assistantId = (Date.now() + 1).toString();
    const currentInput = inputValue;
    const currentChatId = activeChatId;
    const doImage = isImageRequest(currentInput);

    setChats((prev) =>
      prev.map((c) =>
        c.id !== activeChatId
          ? c
          : {
              ...c,
              title,
              messages: [
                ...c.messages,
                userMsg,
                {
                  id: assistantId,
                  role: "assistant" as const,
                  content: "",
                  isImage: doImage,
                },
              ],
            },
      ),
    );
    setInputValue("");
    setIsLoading(true);

    try {
      if (doImage) {
        await generateImage(currentInput, assistantId, currentChatId);
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          for (const line of decoder
            .decode(value, { stream: true })
            .split("\n")) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const s = t.slice(5).trim();
            if (s === "[DONE]") break;
            try {
              const json = JSON.parse(s);
              if (json.type === "text-delta" && json.delta) {
  const chars = json.delta.split("");
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    await new Promise(r => setTimeout(r, 16)); // was 8
    setChats((prev) =>
      prev.map((c) =>
        c.id !== currentChatId
          ? c
          : {
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + char }
                  : m,
              ),
            },
      ),
    );
  }
}
            } catch {}
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const d = resolvedTheme === "dark";

  if (status === "loading")
    return (
      <div
        style={{
          minHeight: "100vh",
          background: d ? "#0f1117" : "#f7fbfb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <img
          src={KOLEX_LOGO}
          style={{
            width: 52,
            height: 52,
            objectFit: "contain",
            animation: "spin 1.4s linear infinite",
          }}
          alt="Kolex"
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div className={`root ${d ? "dark" : "light"}`}>
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>

        {/* Mobile overlay — closes sidebar when tapping outside */}
{sidebarOpen && (
  <div
    onClick={() => setSidebarOpen(false)}
    style={{
      display: 'none',
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 99,
    }}
    className="sidebar-overlay"
  />
)}

        <div className="sidebar-header">
          <div className="brand">
            <img src={KOLEX_LOGO} className="brand-logo" alt="Kolex" />
            {sidebarOpen && <span className="brand-name">Kolex</span>}
          </div>
          <button
            className="icon-btn"
            onClick={() => setSidebarOpen((p) => !p)}
            title="Toggle sidebar"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {sidebarOpen && (
          <button className="new-chat-btn" onClick={createNewChat}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Chat
          </button>
        )}

        {sidebarOpen && (
          <div className="chat-list">
            {chats
              .filter((c) => c.messages.length > 0)
              .map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item-wrap ${chat.id === activeChatId ? "active" : ""}`}
                >
                  <button
                    className="chat-item"
                    onClick={() => setActiveChatId(chat.id)}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ flexShrink: 0, opacity: 0.5 }}
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <div className="chat-item-info">
                      <span className="chat-item-title">{chat.title}</span>
                      <span className="chat-item-id">#{chat.id}</span>
                    </div>
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => deleteChat(chat.id, e)}
                    title="Delete chat"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              ))}
          </div>
        )}

        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="user-row">
              <div className="user-avatar">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  session?.user?.email?.[0]?.toUpperCase()
                )}
              </div>
              <div className="user-info">
                <span className="user-name">
                  {session?.user?.name ?? session?.user?.email?.split("@")[0]}
                </span>
                <span className="user-email">{session?.user?.email}</span>
              </div>
              <button
                className="icon-btn danger"
                onClick={() => signOut({ callbackUrl: "/auth" })}
                title="Sign out"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
  <button
    className="icon-btn"
    id="sidebar-toggle"
    onClick={() => setSidebarOpen(p => !p)}
    style={{ display: sidebarOpen ? 'none' : 'flex' }}
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  </button>
  {hasMessages && activeChat && (
    <>
      <span className="topbar-title">{activeChat.title}</span>
      <span className="chat-id-badge">#{activeChat.id}</span>
    </>
  )}
</div>
          <div className="topbar-right">
            <div className="theme-toggle">
              {(["light", "system", "dark"] as Theme[]).map((t) => (
                <button
                  key={t}
                  className={`theme-btn ${theme === t ? "active" : ""}`}
                  onClick={() => setTheme(t)}
                  title={t}
                >
                  {t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Content area - changes layout based on whether there are messages */}
        <div
          className={`content-area ${hasMessages ? "has-messages" : "empty"}`}
        >
          {/* Empty state - centered with input */}
          {!hasMessages && (
            <div className="center-layout">
              <img src={KOLEX_LOGO} className="center-logo" alt="Kolex" />
              <h2 className="center-title">How can I help you today?</h2>
              <p className="center-sub">
                Ask me anything, or say "generate an image of..."
              </p>

              <div className="center-input-wrap">
                <form onSubmit={onSubmit} className="input-form">
                  <div className="input-box">
                    <textarea
  ref={inputRef}
  className="input"
  value={inputValue}
  placeholder={isListening ? "🎙 Listening..." : "Message Kolex... (Shift+Enter for new line)"}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyDown={handleKeyDown}
  disabled={isLoading}
  rows={1}
/>
 <button
  type="button"
  className={`voice-btn ${isListening ? "listening" : ""}`}
  onClick={toggleVoice}
  title={isListening ? "Stop recording" : "Voice input"}
>
  {isListening ? (
    <div className="waveform">
      {Array.from({length: 28}).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  )}
</button>
                    <button
                      type="submit"
                      disabled={isLoading || !inputValue.trim()}
                      className="send-btn"
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    </button>
                  </div>
                </form>
              </div>

              <div className="suggestions">
                {[
                  { text: "Explain quantum computing", icon: "⚡" },
                  { text: "Write a Python web scraper", icon: "🐍" },
                  {
                    text: "Generate an image of a futuristic city",
                    icon: "🎨",
                  },
                ].map((s) => (
                  <button
                    key={s.text}
                    className="suggestion"
                    onClick={() => {
                      setInputValue(s.text);
                      inputRef.current?.focus();
                    }}
                  >
                    <span>{s.icon}</span>
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages view */}
          {hasMessages && (
            <>
              <div className="messages-wrap">
                <div className="messages">
                  {messages.map((m) => (
                    <div key={m.id} className={`msg-row ${m.role}`}>
                      <div className="msg-avatar">
                        {m.role === "assistant" ? (
                          <img
                            src={KOLEX_LOGO}
                            className={
                              isLoading &&
                              m.id === messages[messages.length - 1]?.id
                                ? "spin"
                                : ""
                            }
                            alt="Kolex"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              padding: 3,
                            }}
                          />
                        ) : session?.user?.image ? (
                          <img
                            src={session.user.image}
                            alt=""
                            style={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          session?.user?.email?.[0]?.toUpperCase()
                        )}
                      </div>
                      <div className="msg-body">
                        <div className="msg-meta">
                          {m.role === "user"
                            ? (session?.user?.name ?? "You")
                            : "Kolex"}
                        </div>
                        <div className="msg-content">
                          {m.isImage ? (
  m.content && m.content !== "[Image]" ? (
  <GeneratedImage src={m.content} prompt={m.content.split("prompt=")[1] ?? "image"} />
  ) : (
    <div className="image-loading">
      <img
        src={KOLEX_LOGO}
        className="spin"
        style={{
          width: 24,
          height: 24,
          opacity: 0.5,
        }}
        alt=""
      />
      <span>Generating image...</span>
    </div>
  )
) : (
  <MessageContent
    content={m.content}
    isStreaming={isLoading && m.role === "assistant" && m.id === messages[messages.length - 1]?.id}
  />
)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input at bottom only when chatting */}
              <div className="bottom-input-area">
                <form onSubmit={onSubmit} className="input-form">
                  <div className="input-box">
                    <textarea
  ref={inputRef}
  className="input"
  value={inputValue}
  placeholder={isListening ? "🎙 Listening..." : "Message Kolex... (Shift+Enter for new line)"}
  onChange={(e) => setInputValue(e.target.value)}
  onKeyDown={handleKeyDown}
  disabled={isLoading}
  rows={1}
/>
                    <button
  type="button"
  className={`voice-btn ${isListening ? "listening" : ""}`}
  onClick={toggleVoice}
  title={isListening ? "Stop recording" : "Voice input"}
>
  {isListening ? (
    <div className="waveform">
      {Array.from({length: 28}).map((_, i) => (
        <span key={i} />
      ))}
    </div>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="23"/>
      <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  )}
</button>
                    <button
                      type="submit"
                      disabled={isLoading || !inputValue.trim()}
                      className="send-btn"
                    >
                      {isLoading ? (
                        <img
                          src={KOLEX_LOGO}
                          className="spin"
                          style={{ width: 15, height: 15, opacity: 0.7 }}
                          alt=""
                        />
                      ) : (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
                <p className="input-hint">
                  Enter to send · "generate an image of..." for images · 🎙 mic
                  for voice
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        .light {
          --bg: #f7fbfb;
          --surface: #ffffff;
          --border: #e0eeee;
          --text: #1a2a2a;
          --text-muted: #778899;
          --text-subtle: #aabbcc;
          --accent: #00bcd4;
          --accent-light: #e8f9fb;
          --accent-hover: #00acc1;
          --user-bubble: #00bcd4;
          --user-text: #fff;
          --msg-bg: #ffffff;
          --sidebar-bg: #ffffff;
          --topbar-bg: #ffffff;
          --input-bg: #ffffff;
          --shadow: rgba(0, 188, 212, 0.1);
        }

        .dark {
          --bg: #0f1117;
          --surface: #1a1d27;
          --border: #252836;
          --text: #e2e8f0;
          --text-muted: #64748b;
          --text-subtle: #3a4a5a;
          --accent: #22d3ee;
          --accent-light: #0c1f2a;
          --accent-hover: #67e8f9;
          --user-bubble: #0e7490;
          --user-text: #fff;
          --msg-bg: #1a1d27;
          --sidebar-bg: #13161f;
          --topbar-bg: #13161f;
          --input-bg: #1a1d27;
          --shadow: rgba(0, 0, 0, 0.4);
        }

        .root {
          display: flex;
          height: 100vh;
          background: var(--bg);
          font-family: "Inter", system-ui, sans-serif;
          color: var(--text);
          overflow: hidden;
          transition:
            background 0.2s,
            color 0.2s;
        }

        /* SIDEBAR */
        .sidebar {
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition:
            width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
            min-width 0.25s;
          flex-shrink: 0;
        }
        .sidebar.open {
          width: 256px;
          min-width: 256px;
        }
        .sidebar.closed {
          width: 56px;
          min-width: 56px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 12px;
          border-bottom: 1px solid var(--border);
          min-height: 56px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
        }

        .brand-logo {
          width: 28px;
          height: 28px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .brand-name {
          font-size: 17px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .new-chat-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          margin: 10px 10px 4px;
          padding: 8px 12px;
          background: var(--accent);
          border: none;
          border-radius: 9px;
          color: white;
          font-family: "Inter", sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          width: calc(100% - 20px);
        }
        .new-chat-btn:hover {
          background: var(--accent-hover);
          box-shadow: 0 3px 10px var(--shadow);
        }

        .chat-list {
          flex: 1;
          overflow-y: auto;
          padding: 6px;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        .chat-item-wrap {
          display: flex;
          align-items: center;
          border-radius: 8px;
          margin-bottom: 2px;
          border: 1px solid transparent;
          transition: all 0.15s;
          overflow: hidden;
        }
        .chat-item-wrap:hover {
          background: var(--accent-light);
          border-color: var(--border);
        }
        .chat-item-wrap.active {
          background: var(--accent-light);
          border-color: var(--accent);
        }

        .chat-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 8px 8px 10px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          color: var(--text-muted);
          min-width: 0;
          font-family: "Inter", sans-serif;
        }
        .chat-item-wrap.active .chat-item {
          color: var(--accent);
        }

        .chat-item-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;
        }
        .chat-item-title {
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .chat-item-id {
          font-size: 9px;
          color: var(--text-subtle);
        }

        .delete-btn {
          background: none;
          border: none;
          padding: 8px 8px;
          color: var(--text-subtle);
          cursor: pointer;
          opacity: 0;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          border-radius: 6px;
          flex-shrink: 0;
        }
        .chat-item-wrap:hover .delete-btn {
          opacity: 1;
        }
        .delete-btn:hover {
          color: #ff4466;
          background: rgba(255, 68, 102, 0.08);
        }

        .sidebar-footer {
          padding: 10px;
          border-top: 1px solid var(--border);
        }

        .user-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          min-width: 28px;
          background: var(--accent-light);
          border: 1.5px solid var(--border);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: var(--accent);
          overflow: hidden;
        }

        .user-info {
          flex: 1;
          min-width: 0;
        }
        .user-name {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .user-email {
          display: block;
          font-size: 10px;
          color: var(--text-subtle);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .icon-btn {
          background: none;
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 6px;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .icon-btn:hover {
          background: var(--accent-light);
          color: var(--accent);
          border-color: var(--accent);
        }
        .icon-btn.danger:hover {
          background: rgba(255, 68, 102, 0.06);
          color: #ff4466;
          border-color: #ff6680;
        }

        /* MAIN */
        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          background: var(--topbar-bg);
          border-bottom: 1px solid var(--border);
          min-height: 56px;
          flex-shrink: 0;
          gap: 12px;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          min-width: 0;
        }
        .topbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .topbar-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-id-badge {
          font-size: 10px;
          color: var(--text-subtle);
          background: var(--accent-light);
          border: 1px solid var(--border);
          border-radius: 5px;
          padding: 2px 7px;
          font-weight: 500;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .theme-toggle {
          display: flex;
          background: var(--accent-light);
          border: 1px solid var(--border);
          border-radius: 9px;
          padding: 2px;
          gap: 1px;
        }
        .theme-btn {
          background: none;
          border: none;
          border-radius: 7px;
          padding: 4px 7px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s;
          opacity: 0.5;
        }
        .theme-btn.active {
          background: var(--surface);
          opacity: 1;
          box-shadow: 0 1px 3px var(--shadow);
        }

        /* CONTENT */
        .content-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .content-area.empty {
          justify-content: center;
          align-items: center;
        }

        /* CENTER LAYOUT (empty state) */
        .center-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
          max-width: 640px;
          padding: 20px;
        }

        .center-logo {
          width: 60px;
          height: 60px;
          object-fit: contain;
          margin-bottom: 4px;
        }
        .center-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text);
          margin: 0;
          letter-spacing: -0.5px;
          text-align: center;
        }
        .center-sub {
          font-size: 13px;
          color: var(--text-muted);
          margin: 0;
          text-align: center;
        }

        .center-input-wrap {
          width: 100%;
          margin-top: 8px;
        }

        .suggestions {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
          margin-top: 4px;
        }

        .suggestion {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-family: "Inter", sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .suggestion:hover {
          border-color: var(--accent);
          background: var(--accent-light);
          transform: translateY(-1px);
        }

        /* MESSAGES */
        .messages-wrap {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        .messages {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 700px;
          margin: 0 auto;
          width: 100%;
        }

        .msg-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .msg-row.user {
          flex-direction: row-reverse;
        }

        .msg-avatar {
          width: 30px;
          height: 30px;
          min-width: 30px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          background: var(--accent-light);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          overflow: hidden;
        }
        .msg-row.user .msg-avatar {
          background: rgba(0, 119, 170, 0.12);
          border-color: rgba(0, 119, 170, 0.25);
          color: #0099bb;
        }

        .msg-body {
          flex: 1;
          min-width: 0;
        }
        .msg-meta {
          font-size: 11px;
          font-weight: 600;
          color: var(--text-subtle);
          margin-bottom: 4px;
        }
        .msg-row.user .msg-meta {
          text-align: right;
        }

        .msg-content {
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.75;
          white-space: pre-wrap;
          word-break: break-word;
          display: inline-block;
          max-width: 100%;
        }
        .msg-row.assistant .msg-content {
  background: transparent;
  border: none;
  color: var(--text);
  padding-left: 0;
}
        .msg-row.user .msg-content {
          background: var(--user-bubble);
          color: var(--user-text);
          border-radius: 14px 4px 14px 14px;
          float: right;
        }

        .generated-image {
  max-width: 380px;
  width: 100%;
  border-radius: 12px;
  display: block;
}

        .image-loading {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 13px;
        }

        .cursor-blink {
          color: var(--accent);
          animation: blink 0.8s step-end infinite;
          margin-left: 1px;
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }

        /* INPUT */
        .bottom-input-area {
          padding: 10px 20px 16px;
          background: var(--topbar-bg);
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }

        .input-form {
          max-width: 700px;
          margin: 0 auto;
        }

        .input-box {
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1.5px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.2s;
        }
        .input-box:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0, 188, 212, 0.1);
        }

        .input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          padding: 13px 14px;
          color: var(--text);
          font-family: "Inter", sans-serif;
          font-size: 14px;
        }
        .input::placeholder {
          color: var(--text-subtle);
        }
        .input:disabled {
          opacity: 0.6;
        }

        .voice-btn {
          padding: 8px 10px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .voice-btn:hover {
          color: var(--accent);
        }
        .voice-btn.listening {
          color: #ff4466;
          animation: pulse-mic 1s ease-in-out infinite;
        }
        @keyframes pulse-mic {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }

        .send-btn {
          padding: 9px 13px;
          margin: 4px;
          background: var(--accent);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .send-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          transform: scale(1.05);
        }
        .send-btn:disabled {
          background: var(--border);
          cursor: not-allowed;
        }

        .input-hint {
          font-size: 10px;
          color: var(--text-subtle);
          margin: 6px 0 0;
          text-align: center;
        }

        :global(.spin) {
          animation: spin 1.2s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .waveform {
  display: flex;
  align-items: center;
  gap: 1.5px;
  height: 18px;
  width: 52px;
}
.waveform span {
  display: block;
  width: 2px;
  border-radius: 1px;
  background: #ff4466;
  animation: wave 0.6s ease-in-out infinite alternate;
  min-height: 2px;
}
.waveform span:nth-child(odd)  { animation-duration: 0.5s; }
.waveform span:nth-child(even) { animation-duration: 0.7s; }
.waveform span:nth-child(1)  { height: 4px;  animation-delay: 0.00s; }
.waveform span:nth-child(2)  { height: 10px; animation-delay: 0.05s; }
.waveform span:nth-child(3)  { height: 6px;  animation-delay: 0.10s; }
.waveform span:nth-child(4)  { height: 14px; animation-delay: 0.15s; }
.waveform span:nth-child(5)  { height: 8px;  animation-delay: 0.20s; }
.waveform span:nth-child(6)  { height: 16px; animation-delay: 0.05s; }
.waveform span:nth-child(7)  { height: 5px;  animation-delay: 0.10s; }
.waveform span:nth-child(8)  { height: 12px; animation-delay: 0.15s; }
.waveform span:nth-child(9)  { height: 18px; animation-delay: 0.20s; }
.waveform span:nth-child(10) { height: 7px;  animation-delay: 0.00s; }
.waveform span:nth-child(11) { height: 14px; animation-delay: 0.05s; }
.waveform span:nth-child(12) { height: 9px;  animation-delay: 0.10s; }
.waveform span:nth-child(13) { height: 18px; animation-delay: 0.15s; }
.waveform span:nth-child(14) { height: 6px;  animation-delay: 0.20s; }
.waveform span:nth-child(15) { height: 13px; animation-delay: 0.05s; }
.waveform span:nth-child(16) { height: 4px;  animation-delay: 0.10s; }
.waveform span:nth-child(17) { height: 16px; animation-delay: 0.15s; }
.waveform span:nth-child(18) { height: 8px;  animation-delay: 0.00s; }
.waveform span:nth-child(19) { height: 12px; animation-delay: 0.05s; }
.waveform span:nth-child(20) { height: 5px;  animation-delay: 0.10s; }
.waveform span:nth-child(21) { height: 15px; animation-delay: 0.15s; }
.waveform span:nth-child(22) { height: 9px;  animation-delay: 0.20s; }
.waveform span:nth-child(23) { height: 14px; animation-delay: 0.05s; }
.waveform span:nth-child(24) { height: 4px;  animation-delay: 0.10s; }
.waveform span:nth-child(25) { height: 11px; animation-delay: 0.15s; }
.waveform span:nth-child(26) { height: 7px;  animation-delay: 0.00s; }
.waveform span:nth-child(27) { height: 13px; animation-delay: 0.05s; }
.waveform span:nth-child(28) { height: 5px;  animation-delay: 0.10s; }
@keyframes wave {
  from { transform: scaleY(0.2); }
  to   { transform: scaleY(1); }
}
        .input {
  resize: none;
  min-height: 42px;
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.6;
  vertical-align: bottom;
}
.input-box { align-items: flex-end; padding: 4px 4px 4px 0; }

/* Code blocks */
:global(.code-block-wrap) { margin: 8px 0; border-radius: 10px; overflow: hidden; border: 1px solid var(--border); width: 100%; display: block; }
:global(.code-block-header) { display: flex; align-items: center; justify-content: space-between; background: #13152a; padding: 7px 14px; font-size: 11px; }
:global(.code-lang) { color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
:global(.copy-btn) { background: none; border: 1px solid var(--border); border-radius: 5px; color: var(--text-muted); padding: 2px 9px; font-size: 11px; cursor: pointer; transition: all .2s; }
:global(.copy-btn:hover) { background: var(--accent-light); color: var(--accent); border-color: var(--accent); }
:global(.code-block) { margin: 0; padding: 14px 16px; background: #0d1117; color: #e6edf3; font-size: 13px; line-height: 1.65; overflow-x: auto; white-space: pre; font-family: "JetBrains Mono", "Fira Code", monospace; }
:global(.inline-code) { background: var(--accent-light); color: var(--accent); padding: 2px 6px; border-radius: 5px; font-family: monospace; font-size: 12.5px; }

:global(.copy-btn.copied) {
  background: var(--accent-light);
  color: var(--accent);
  border-color: var(--accent);
}

/* Spinner for image loading */
.spinner-ring { width: 22px; height: 22px; border: 2.5px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.9s linear infinite; flex-shrink: 0; }

/* ── PASTE THIS INSIDE YOUR <style jsx> BLOCK, AT THE VERY BOTTOM ── */

/* ── Responsive / Mobile ───────────────────────────────────────────── */

/* Tablet (≤ 768px) */
@media (max-width: 768px) {
  /* Sidebar overlays instead of pushing */
  .sidebar {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    box-shadow: 4px 0 24px rgba(0,0,0,0.15);
  }
  .sidebar.closed {
    width: 0;
    min-width: 0;
    border: none;
  }
  .sidebar.open {
    width: 260px;
    min-width: 260px;
  }

  /* Dim overlay behind open sidebar */
  .sidebar-overlay {
    display: block;
  }

  .main {
    width: 100%;
  }

  .messages-wrap {
    padding: 14px 12px;
  }

  .messages {
    max-width: 100%;
  }

  .bottom-input-area {
    padding: 8px 12px 12px;
  }

  .input-form {
    max-width: 100%;
  }

  .center-layout {
    padding: 16px 14px;
    gap: 10px;
  }

  .center-title {
    font-size: 20px;
  }

  .topbar {
    padding: 10px 12px;
  }

  .topbar-title {
    font-size: 13px;
    max-width: 160px;
  }

  .suggestions {
    gap: 6px;
  }

  .suggestion {
    font-size: 12px;
    padding: 10px 13px;
  }
}

/* Phone (≤ 480px) */
@media (max-width: 480px) {
  .center-logo {
    width: 48px;
    height: 48px;
  }

  .center-title {
    font-size: 18px;
  }

  .center-sub {
    font-size: 12px;
  }

  .msg-content {
    font-size: 13px;
  }

  .msg-avatar {
    width: 26px;
    height: 26px;
    min-width: 26px;
  }

  .generated-image {
    max-width: 100%;
  }

  .theme-toggle {
    display: none; /* hide theme switcher on tiny screens */
  }

  .chat-id-badge {
    display: none;
  }

  .input {
    font-size: 16px; /* prevents iOS zoom on focus */
  }

  .topbar {
    padding: 8px 10px;
    min-height: 48px;
  }

  .brand-name {
    font-size: 15px;
  }

  .input-hint {
    display: none;
  }
}

@media (max-width: 768px) {
  .delete-btn { opacity: 1; }
}

@media (max-width: 768px) {
  #sidebar-toggle {
    display: flex !important;
  }
}
      `}</style>
    </div>
  );
}
