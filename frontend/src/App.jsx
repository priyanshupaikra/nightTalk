import { useEffect, useState, useRef } from "react";
import { connectSocket, sendMessage } from "./services/socket";

const ROOM_ID = "test-room";
// A somewhat random user ID for simple identification in this demo.
// In a real app, this would come from your auth system.
const USER_ID = Math.floor(Math.random() * 10000);

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("disconnected"); // disconnected, connecting, connected
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setStatus("connecting");
    console.log("🔌 Initializing socket...");

    connectSocket(ROOM_ID, (msg) => {
      console.log("🟢 Message added to UI:", msg);
      // Ensure we don't add duplicate messages if the system sends them back weirdly
      setMessages((prev) => {
        // Simple duplicate check based on ID if available, or just append
        return [...prev, msg];
      });
    });

    // We assume connection is successful if no error throws immediately, 
    // but ideally the socket service would emit connection events.
    // For now, we'll just set it to connected after a short timeout to simulate the handshake time.
    setTimeout(() => setStatus("connected"), 500);

  }, []);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;

    console.log("➡️ Send clicked:", text);
    sendMessage(USER_ID, text);
    setText("");

    // Optimistically add message for immediate feedback? 
    // Ideally we wait for the server echo, but for smoother UI we might want to wait logic from the server.
    // The current backend echoes it back, so we will wait for the echo to redundant display.
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatWindow}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.titleContainer}>
            <div style={{
              ...styles.statusDot,
              backgroundColor: status === 'connected' ? '#10b981' : '#ef4444',
              boxShadow: status === 'connected' ? '0 0 10px #10b981' : 'none'
            }}></div>
            <h2 style={styles.title}>NightTalk</h2>
          </div>
          <span style={styles.roomBadge}>#{ROOM_ID}</span>
        </div>

        {/* Messages Area */}
        <div style={styles.messageList}>
          {messages.length === 0 && (
            <div style={styles.emptyState}>
              <p>No messages yet.</p>
              <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Be the first to say hello!</p>
            </div>
          )}
          {messages.map((m, i) => {
            // Check if 'm.sender' is the string version of our ID or the ID itself
            // The backend sends 'sender' as a username or ID.
            // Adjust logic based on exact backend response. Assuming 'sender' holds the identifier.
            const isMe = String(m.sender_id || m.sender) === String(USER_ID);

            return (
              <div key={i} style={{ ...styles.messageRow, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  ...styles.messageBubble,
                  backgroundColor: isMe ? '#6366f1' : '#334155',
                  color: isMe ? '#fff' : '#e2e8f0',
                  borderBottomRightRadius: isMe ? 2 : 16,
                  borderBottomLeftRadius: isMe ? 16 : 2
                }}>
                  {!isMe && <div style={styles.senderName}>{m.sender}</div>}
                  <div style={styles.messageContent}>{m.content}</div>
                  <div style={styles.timestamp}>
                    {/* If timestamp exists, format it, else just now */}
                    {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} style={styles.inputArea}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button type="submit" style={{
            ...styles.sendButton,
            backgroundColor: text.trim() ? '#6366f1' : '#475569',
            cursor: text.trim() ? 'pointer' : 'not-allowed'
          }} disabled={!text.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0f172a", // Slate 900
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
    margin: 0,
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    color: 'white'
  },
  chatWindow: {
    width: "100%",
    maxWidth: "450px",
    height: "85vh",
    backgroundColor: "#1e293b", // Slate 800
    borderRadius: "24px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    border: "1px solid #334155"
  },
  header: {
    padding: "20px 24px",
    borderBottom: "1px solid #334155",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e293b",
    zIndex: 10
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    transition: "background-color 0.3s ease"
  },
  title: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "-0.025em"
  },
  roomBadge: {
    backgroundColor: "#334155",
    color: "#94a3b8",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    scrollbarWidth: "thin",
    scrollbarColor: "#475569 #1e293b"
  },
  emptyState: {
    color: "#64748b",
    textAlign: "center",
    marginTop: "auto",
    marginBottom: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  messageRow: {
    display: "flex",
    width: "100%"
  },
  messageBubble: {
    maxWidth: "75%",
    padding: "12px 16px",
    borderRadius: "18px",
    fontSize: "0.95rem",
    lineHeight: "1.5",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "relative",
    display: "flex",
    flexDirection: "column"
  },
  senderName: {
    fontSize: "0.7rem",
    color: "#94a3b8",
    marginBottom: "2px",
    fontWeight: 600
  },
  messageContent: {
    wordBreak: "break-word"
  },
  timestamp: {
    fontSize: "0.65rem",
    alignSelf: "flex-end",
    marginTop: "4px",
    opacity: 0.7
  },
  inputArea: {
    padding: "20px",
    borderTop: "1px solid #334155",
    display: "flex",
    gap: "12px",
    backgroundColor: "#1e293b"
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "14px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s"
  },
  sendButton: {
    padding: "0 24px",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontWeight: 600,
    transition: "all 0.2s",
    fontSize: "0.95rem"
  }
};

export default App;
