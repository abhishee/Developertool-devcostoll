import React, { useEffect, useRef, useState } from "react";

const inputStyle = {
  width: "100%",
  background: "#0D0F16",
  border: "1px solid #232735",
  borderRadius: 8,
  padding: "10px 12px",
  color: "#E7E9F2",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12.5,
  outline: "none",
  boxSizing: "border-box",
};

const btnPrimary = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#7C5CFF",
  border: "none",
  color: "#0A0C10",
  fontWeight: 600,
  fontSize: 12.5,
  padding: "8px 14px",
  borderRadius: 7,
  cursor: "pointer",
};

const logBox = {
  background: "#0D0F16",
  border: "1px solid #232735",
  borderRadius: 8,
  padding: "12px 14px",
  minHeight: 180,
  color: "#34E4B8",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12.5,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  overflowY: "auto",
};

export default function WebsocketClient() {
  const [url, setUrl] = useState("wss://echo.websocket.org");
  const [protocols, setProtocols] = useState("");
  const [message, setMessage] = useState("Hello WebSocket");
  const [log, setLog] = useState("Disconnected\n");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const wsRef = useRef(null);
  const logRef = useRef(null);

  const appendLog = (entry) => {
    setLog((prev) => prev + entry + "\n");
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const connect = () => {
    setError("");
    if (wsRef.current) {
      wsRef.current.close();
    }
    try {
      const protocolsArray = protocols.split(",").map((p) => p.trim()).filter(Boolean);
      const socket = new WebSocket(url.trim(), protocolsArray.length ? protocolsArray : undefined);
      wsRef.current = socket;

      socket.onopen = () => {
        setConnected(true);
        appendLog("Connected");
      };
      socket.onmessage = (event) => {
        appendLog(`Received: ${event.data}`);
      };
      socket.onclose = () => {
        setConnected(false);
        appendLog("Disconnected");
      };
      socket.onerror = (event) => {
        setError("WebSocket error occurred");
        appendLog("Error: check console for details");
        console.error(event);
      };
    } catch (e) {
      setError(e.message);
      appendLog(`Failed to connect: ${e.message}`);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const sendMessage = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("WebSocket is not connected.");
      return;
    }
    wsRef.current.send(message);
    appendLog(`Sent: ${message}`);
  };

  return (
    <div>
      <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", display: "block", marginBottom: 6 }}>WebSocket URL</label>
      <input style={{ ...inputStyle, marginBottom: 10 }} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="wss://echo.websocket.org" />

      <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", display: "block", marginBottom: 6 }}>Protocols (comma-separated)</label>
      <input style={{ ...inputStyle, marginBottom: 10 }} value={protocols} onChange={(e) => setProtocols(e.target.value)} placeholder="graphql-ws,protocol2" />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <button onClick={connect} style={btnPrimary} disabled={connected}>Connect</button>
        <button onClick={disconnect} style={{ ...btnPrimary, background: "#FF6B6B" }} disabled={!connected}>Disconnect</button>
        <span style={{ fontSize: 12, color: connected ? "#34E4B8" : "#7A8099", alignSelf: "center" }}>
          {connected ? "Connected" : "Disconnected"}
        </span>
      </div>

      <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#7A8099", display: "block", marginBottom: 6 }}>Message</label>
      <textarea style={{ ...inputStyle, height: 90, marginBottom: 10 }} value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage} style={btnPrimary} disabled={!connected}>Send Message</button>

      {error && <div style={{ color: "#FF6B6B", fontSize: 12, marginTop: 10 }}>⚠ {error}</div>}

      <div ref={logRef} style={{ ...logBox, marginTop: 14 }}>{log}</div>
    </div>
  );
}
