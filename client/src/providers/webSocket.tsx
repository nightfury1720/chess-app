'use client'
import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react';

type WebSocketContextType = {
  isReady: boolean; // Corrected type annotation for isReady
  value: string | null; // Corrected type annotation for value
  send: (data: string) => void; // Corrected type annotation for send
};

export const WebSocketContext = createContext<WebSocketContextType>({
  isReady: false,
  value: null,
  send: (data: string) => {},
});

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [val, setVal] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => setIsReady(true);
    socket.onclose = () => setIsReady(false);
    socket.onmessage = (event) => setVal(event.data);

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  const send: WebSocketContextType['send'] = (data) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(data);
    } else {
      console.error('WebSocket is not open.');
    }
  };

  const contextValue: WebSocketContextType = { isReady, value: val, send };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};
