import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Paperclip,
  ArrowUp,
  Brain,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Copy,
  Check,
  FileText,
  X,
  Anchor,
  Zap,
  Download,
  Database,
  ShieldCheck,
} from "lucide-react";
import { usePageHeader } from "@/contexts/usePageHeader";
import { copyTextToClipboard } from "@/lib/clipboard";
import "./chat-advisor.css";

interface AttachedFile {
  name: string;
  size: number;
  content?: string;
  fileType?: string;
}

interface ToolExecution {
  tool: string;
  summary: string;
  data?: unknown;
}

let msgIdSeq = 0;
function nextMessageId(prefix: string): string {
  msgIdSeq += 1;
  return `${prefix}-${Date.now()}-${msgIdSeq}`;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  reasoningTimeMs?: number;
  toolsExecuted?: ToolExecution[];
  files?: AttachedFile[];
  timestamp: string;
}

const INITIAL_PROMPTS = [
  {
    icon: "📈",
    text: "Forecast Newcastle to Paradip Supramax rates for next 30 days & laycan window",
  },
  {
    icon: "⚓",
    text: "Compare Dhamra vs Paradip for Capesize 180,000 DWT coal cargo discharge",
  },
  {
    icon: "🚢",
    text: "Simulate 3-voyage COA vs Spot charter procurement savings for Q4 intake",
  },
  {
    icon: "📑",
    text: "Analyze demurrage exposure & draft constraints across East Coast ports",
  },
];

// Helper to format simple markdown elements (tables, bold, lists, headers) cleanly
function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableHeader: string[] = [];
  let tableRows: string[][] = [];

  const flushTable = (key: string) => {
    if (inTable && (tableHeader.length > 0 || tableRows.length > 0)) {
      elements.push(
        <div key={key} className="advisor-table-wrap">
          <table>
            {tableHeader.length > 0 && (
              <thead>
                <tr>
                  {tableHeader.map((th, i) => (
                    <th key={i}>{th.trim()}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci}>{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Table line
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      // Skip separator row like |:---|:---|
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        return;
      }
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable(`table-${idx}`);
    }

    if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={idx}>{trimmed.replace("### ", "")}</h3>);
    } else if (trimmed.startsWith("#### ")) {
      elements.push(<h4 key={idx}>{trimmed.replace("#### ", "")}</h4>);
    } else if (trimmed === "---") {
      elements.push(<hr key={idx} />);
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      const text = trimmed.slice(2);
      elements.push(
        <li key={idx}>
          {parseInlineFormatting(text)}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const text = trimmed.replace(/^\d+\.\s/, "");
      elements.push(
        <li key={idx} style={{ listStyleType: "decimal" }}>
          {parseInlineFormatting(text)}
        </li>
      );
    } else if (trimmed.length > 0) {
      elements.push(<p key={idx}>{parseInlineFormatting(trimmed)}</p>);
    }
  });

  if (inTable) {
    flushTable("table-end");
  }

  return <div className="advisor-markdown">{elements}</div>;
}

// Inline formatting: **bold**, *italic*, `code`
function parseInlineFormatting(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          style={{
            background: "#f1f5f9",
            padding: "2px 5px",
            borderRadius: 4,
            fontSize: "0.85em",
            fontFamily: "monospace",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function ChatAdvisorPage() {
  const { setAfterTitle, setEnd } = usePageHeader();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [enableCot, setEnableCot] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCots, setExpandedCots] = useState<Record<string, boolean>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setAfterTitle(null);
    setEnd(null);
    return () => {
      setAfterTitle(null);
      setEnd(null);
    };
  }, [setAfterTitle, setEnd]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const toggleCot = (msgId: string) => {
    setExpandedCots((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setAttachedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            content: typeof text === "string" ? text : "",
            fileType: file.type || file.name.split(".").pop(),
          },
        ]);
      };
      if (file.type.includes("text") || file.name.endsWith(".csv") || file.name.endsWith(".json") || file.name.endsWith(".txt")) {
        reader.readAsText(file);
      } else {
        // Sample metadata for binary / PDF docs
        setAttachedFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            content: `[Attached Document: ${file.name} - Size: ${file.size} bytes - Type: ${file.type || "Document"}]`,
            fileType: file.name.split(".").pop(),
          },
        ]);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (idx: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSend = async (overridePrompt?: string) => {
    const promptToSend = (overridePrompt ?? inputValue).trim();
    if (!promptToSend && attachedFiles.length === 0) return;
    if (isLoading) return;

    const userMessageId = nextMessageId("user");
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: promptToSend || `Analyzed attached files: ${attachedFiles.map((f) => f.name).join(", ")}`,
      files: [...attachedFiles],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setAttachedFiles([]);
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const payload = {
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        files: userMessage.files || [],
        enable_cot: enableCot,
      };

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = typeof window !== "undefined" ? window.__HERMES_SESSION_TOKEN__ : undefined;
      if (token) {
        headers["X-Hermes-Session-Token"] = token;
      }

      const response = await fetch("/api/advisor/chat", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Advisor API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessageId = nextMessageId("ai");
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: data.content || "Unable to generate forecast response.",
        reasoning: data.reasoning,
        reasoningTimeMs: data.reasoning_time_ms,
        toolsExecuted: data.tools_executed,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      // Default expand reasoning if present
      if (data.reasoning) {
        setExpandedCots((prev) => ({ ...prev, [assistantMessageId]: true }));
      }
    } catch (err: unknown) {
      console.error("Chat Advisor Error:", err);
      const errMsg = err instanceof Error ? err.message : String(err);
      const errorMessage: Message = {
        id: nextMessageId("ai-err"),
        role: "assistant",
        content: `⚠️ **Advisory Connection Alert**: Could not reach backend advisor endpoint (${errMsg}). Reverting to cached East Coast maritime models.\n\n* **Paradip Wait:** 3.2 days (Moderate Risk)\n* **Dhamra Capesize Draft:** 18.0 m (Optimal)\n* **Supramax Spot Baseline:** $14,250/day`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  const handleCopy = (text: string, id: string) => {
    void copyTextToClipboard(text).then((copied) => {
      if (copied) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    });
  };

  const clearChat = () => {
    setMessages([]);
    setExpandedCots({});
  };

  const exportChat = () => {
    const chatText = messages
      .map((m) => `[${m.timestamp}] ${m.role.toUpperCase()}:\n${m.content}\n${m.reasoning ? `Reasoning:\n${m.reasoning}\n` : ""}\n---`)
      .join("\n\n");
    const blob = new Blob([chatText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SAIL_Advisory_Report_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="advisor-container" role="region" aria-label="AI Chat Advisor & Forecaster">
      {/* ── Top Bar ────────────────────────────────────────────── */}
      <header className="advisor-header">
        <div className="advisor-header-left">
          <div className="advisor-logo-wrap">
            <Sparkles size={20} />
          </div>
          <div className="advisor-title-box">
            <h2>
              AI Chat Advisor &amp; Forecaster
              <span className="advisor-badge demo" title="Traffic queue and freight spot rate values are calibrated demonstration models">● Demo Mode</span>
            </h2>
            <p>SAIL Maritime Procurement Intelligence • Chain-of-Thought (CoT) Engine • Calibrated Port Telemetry</p>
          </div>
        </div>

        <div className="advisor-header-actions">
          <div className="advisor-header-badges">
            <span className="advisor-badge model" title="Active Reasoning LLM">
              <Brain size={12} /> Dots-3 MoE (CoT)
            </span>
            <span className="advisor-badge tool" title="Validated East Coast Port Parameters & Operational Directives">
              <ShieldCheck size={12} /> Port Specs Verified
            </span>
            <span className="advisor-badge demo" title="Queue and freight projections are based on calibrated demonstration data">
              <Database size={12} /> Demo Data
            </span>
          </div>

          <button className="advisor-btn-action" onClick={exportChat} title="Export Advisory Transcript" disabled={messages.length === 0}>
            <Download size={13} /> Export
          </button>
          <button className="advisor-btn-action" onClick={clearChat} title="Clear Chat History">
            <RotateCcw size={13} /> Clear
          </button>
        </div>
      </header>

      {/* ── Chat Messages Stream ─────────────────────────────────── */}
      <div className="advisor-chat-body">
        {messages.length === 0 ? (
          <div className="advisor-welcome-hero">
            <div className="advisor-welcome-icon">
              <Anchor size={28} />
            </div>
            <h1>How can INDRA AI advise your charter procurement today?</h1>
            <p>
              Ask any question on Newcastle or Gladstone coal fixtures, time-series freight predictions, draft limits,
              demurrage sensitivities, or attach a charter party document.
            </p>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              borderRadius: "6px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              color: "#92400e",
              fontSize: "0.74rem",
              marginTop: "12px",
              maxWidth: "680px",
              textAlign: "left"
            }}>
              <ShieldCheck size={16} style={{ flexShrink: 0, color: "#059669" }} />
              <span><strong>Data Notice [Demo Dataset]:</strong> Physical port constraints (draft, LOA, beam) are verified against official Major Port Handbooks. Daily traffic queues and spot fixtures are simulated demonstration values.</span>
            </div>

            <div className="advisor-prompts-grid">
              {INITIAL_PROMPTS.map((p, i) => (
                <div
                  key={i}
                  className="advisor-prompt-card"
                  onClick={() => handleSend(p.text)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="advisor-prompt-card-icon">{p.icon}</span>
                  <span className="advisor-prompt-card-text">{p.text}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`advisor-msg-row ${m.role}`}>
              {m.role === "assistant" && (
                <div className="advisor-msg-avatar ai">
                  <Anchor size={17} />
                </div>
              )}

              <div className="advisor-msg-content">
                {m.role === "user" ? (
                  <>
                    {m.files && m.files.length > 0 && (
                      <div className="advisor-user-files">
                        {m.files.map((f, fi) => (
                          <span key={fi} className="advisor-attached-file-chip">
                            <FileText size={12} /> {f.name} ({Math.round(f.size / 1024)} KB)
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="advisor-user-bubble">{m.content}</div>
                  </>
                ) : (
                  <div className="advisor-ai-card">
                    {/* Chain of Thought (CoT) Collapsible */}
                    {m.reasoning && (
                      <div className="advisor-cot-box">
                        <div className="advisor-cot-header" onClick={() => toggleCot(m.id)}>
                          <div className="advisor-cot-title">
                            <Brain size={14} color="#1a56db" />
                            <span>
                              Chain-of-Thought Reasoning
                              {m.reasoningTimeMs ? ` (${(m.reasoningTimeMs / 1000).toFixed(1)}s)` : ""}
                            </span>
                          </div>
                          {expandedCots[m.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                        {expandedCots[m.id] && (
                          <div className="advisor-cot-body">{m.reasoning}</div>
                        )}
                      </div>
                    )}

                    {/* Executed Tools */}
                    {m.toolsExecuted && m.toolsExecuted.length > 0 && (
                      <div className="advisor-tools-row">
                        {m.toolsExecuted.map((t, ti) => (
                          <span key={ti} className="advisor-tool-pill" title={t.summary}>
                            <Zap size={11} /> {t.tool}: {t.summary.slice(0, 60)}...
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Main Rendered Content */}
                    {renderMarkdown(m.content)}

                    {/* Copy Action */}
                    <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                      <button
                        className="advisor-btn-action"
                        onClick={() => handleCopy(m.content, m.id)}
                        style={{ padding: "4px 8px", fontSize: "0.74rem" }}
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check size={12} color="#16a34a" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="advisor-msg-avatar user">
                  <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>ME</span>
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="advisor-msg-row assistant">
            <div className="advisor-msg-avatar ai">
              <Anchor size={17} />
            </div>
            <div className="advisor-msg-content">
              <div className="advisor-ai-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: 14 }}>
                <div className="advisor-spinner" style={{ borderColor: "rgba(26,86,219,0.3)", borderTopColor: "#1a56db" }} />
                <span style={{ fontSize: "0.85rem", color: "#475569" }}>
                  Analyzing East Coast AIS telemetry, computing freight ARIMA models, and synthesizing CoT reasoning...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* ── Floating Input Dock (ChatGPT Style) ───────────────────── */}
      <div className="advisor-input-dock">
        <div className="advisor-input-card">
          {/* File attachments preview */}
          {attachedFiles.length > 0 && (
            <div className="advisor-attachments-preview">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="advisor-file-preview-chip">
                  <FileText size={12} />
                  <span>{file.name}</span>
                  <span style={{ opacity: 0.7 }}>({Math.round(file.size / 1024)} KB)</span>
                  <button className="advisor-file-remove-btn" onClick={() => removeFile(idx)}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Textarea + tools + send */}
          <div className="advisor-input-main-row">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              multiple
              accept=".pdf,.csv,.xlsx,.docx,.txt,.json,.doc"
              onChange={handleFileUpload}
            />

            {/* Attach button */}
            <button
              className="advisor-tool-btn"
              title="Attach Contract, Fixture, or Coal Spec Document"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={16} />
            </button>

            {/* CoT reasoning toggle */}
            <button
              className={`advisor-tool-btn ${enableCot ? "active" : ""}`}
              title={enableCot ? "Chain-of-Thought Reasoning Enabled" : "CoT Reasoning Disabled"}
              onClick={() => setEnableCot(!enableCot)}
            >
              <Brain size={16} />
            </button>

            {/* Expanding textarea */}
            <textarea
              ref={textareaRef}
              className="advisor-textarea"
              placeholder="Ask INDRA Advisor about freight rates, laycan optimization, port congestion, or attach files..."
              value={inputValue}
              onChange={handleTextareaInput}
              onKeyDown={handleKeyDown}
              rows={1}
            />

            {/* Send button */}
            <button
              className="advisor-send-btn"
              onClick={() => handleSend()}
              disabled={(!inputValue.trim() && attachedFiles.length === 0) || isLoading}
              title="Send message"
            >
              {isLoading ? <div className="advisor-spinner" /> : <ArrowUp size={18} />}
            </button>
          </div>
        </div>

        <div className="advisor-dock-footer">
          <span>🧠 CoT Model: <strong>Dots-3 MoE</strong> via OpenRouter</span>
          <span>•</span>
          <span>⚡ Validated Port Limits &amp; Calibrated RAG (Demo Dataset)</span>
        </div>
      </div>
    </div>
  );
}
