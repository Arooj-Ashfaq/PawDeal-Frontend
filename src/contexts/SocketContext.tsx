import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (receiverId: string, message: string) => void;
  onNewMessage: (callback: (message: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socketInstance = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('pawdeal_token')
      },
      transports: ['websocket']
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  const sendMessage = (receiverId: string, message: string) => {
    if (socket && isConnected) {
      socket.emit('send_message', { receiverId, message });
    }
  };

  const onNewMessage = (callback: (message: any) => void) => {
    if (socket) {
      socket.on('new_message', callback);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendMessage, onNewMessage }}>
      {children}
    </SocketContext.Provider>
  );
};