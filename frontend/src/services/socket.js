let socket = null;

export const connectSocket = (roomId, onMessage) => {
  const url = `ws://localhost:8000/ws/chat/${roomId}/`;
  console.log("Connecting to WS:", url);

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("✅ WebSocket connected");
  };

  socket.onmessage = (event) => {
    console.log("📩 WS message received:", event.data);
    const data = JSON.parse(event.data);
    onMessage(data);
  };

  socket.onerror = (err) => {
    console.error("❌ WebSocket error:", err);
  };

  socket.onclose = (e) => {
    console.warn("⚠️ WebSocket closed:", e.code, e.reason);
  };
};

export const sendMessage = (senderId, content) => {
  if (!socket) {
    console.error("❌ WS not initialized");
    return;
  }

  if (socket.readyState !== WebSocket.OPEN) {
    console.error("❌ WS not open. State:", socket.readyState);
    return;
  }

  const payload = {
    sender_id: senderId,
    content: content,
  };

  console.log("📤 Sending WS message:", payload);
  socket.send(JSON.stringify(payload));
};
