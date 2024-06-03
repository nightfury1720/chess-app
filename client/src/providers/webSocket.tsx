"use client"
import React, { ReactNode, useContext, useEffect, useState } from "react";

export type WebSocketContextType = [
  (fn: (event: MessageEvent) => void, filter?: string) => void,
  (message: string) => void
];

export const WebSocketContext = React.createContext<WebSocketContextType>([
  () => {},
  () => {},
]);

interface WebSocketProviderProps {
  children: ReactNode;
  url: string;
  keepAliveInterval?: number;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  url,
  keepAliveInterval,
}) => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [listeners, setListeners] = useState<{
    [key: string]: ((event: MessageEvent) => void)[];
  }>({});

  const addListener = (fn: (event: MessageEvent) => void, filter = "any") => {
    setListeners((currentListeners) => ({
      ...currentListeners,
      [filter]: [...(currentListeners[filter] || []), fn],
    }));
  };

  const sendMessage = (message: string) => {
    if (webSocket) {
      webSocket.send(message);
    }
  };

  const onMessage = (event: MessageEvent) => {
    const { data } = event;
    if (listeners[data.filter]) {
      listeners[data.filter].forEach((listener) => listener(event));
    }
    if (listeners["any"]) {
      listeners["any"].forEach((listener) => listener(event));
    }
  };

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      setWebSocket(socket);
      console.log("Connected to websocket");
    };

    socket.onmessage = onMessage;

    if (keepAliveInterval) {
      const intervalId = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ method: "ping" }));
        }
      }, keepAliveInterval);

      return () => clearInterval(intervalId);
    }

    return () => {
      socket.close();
    };
  }, [url, keepAliveInterval]);

  return (
    <WebSocketContext.Provider value={[addListener, sendMessage]}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (
  listener?: (event: MessageEvent) => void,
  filter = "any"
) => {
  const [addListener, sendMessage] = useContext(WebSocketContext);

  useEffect(() => {
    if (listener) {
      addListener(listener, filter);
    }
  }, [listener, filter, addListener]);

  return { sendMessage };
};
