import React, { useEffect, useState, useRef } from 'react'; // Import necessary modules from React
import io from 'socket.io-client'; // Import the socket.io client library

// Simplified Message type definition
interface Message {
  message: string;
  timestamp: number;
}

// Establish socket connection with connection options
const socket = io('http://localhost:4000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  auth: {
    token: getAuthToken() // Send token in connection auth
  },
  extraHeaders: {
    Authorization: `Bearer ${getAuthToken()}` // Add token to headers
  }
});

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const listenerAdded = useRef(false);

  useEffect(() => {
    console.log('Initial socket connection status:', socket.connected);

    // Connection status handlers
    const onConnect = () => {
      console.log('Socket connected successfully');
      setIsConnected(true);
    };

    const onDisconnect = (reason: string) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    };

    const onConnectError = (error: Error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    };

    const onReceiveMessage = (data: Message) => {
      console.log('Received message:', data);
      // Only add message if it's not already in the messages array
      setMessages(prev => {
        const messageExists = prev.some(msg => 
          msg.message === data.message && 
          msg.timestamp === data.timestamp
        );
        if (messageExists) {
          console.log('Message already exists, not adding duplicate');
          return prev;
        }
        return [...prev, data];
      });
    };

    // Set up event listeners only if they haven't been added
    if (!listenerAdded.current) {
      console.log('Setting up socket listeners');
      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on('connect_error', onConnectError);
      socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('Reconnection attempt:', attemptNumber);
      });
      socket.on('receive_message', onReceiveMessage);
      socket.on('send_message', onReceiveMessage); // Listen for both send and receive
      listenerAdded.current = true;
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.off('reconnect_attempt');
      socket.off('receive_message', onReceiveMessage);
      socket.off('send_message', onReceiveMessage);
      listenerAdded.current = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const messageData: Message = {
      message: messageInput,
      timestamp: Date.now()
    };

    console.log('Sending message:', messageData);
    socket.emit("send_message", messageData);
    // Remove direct state update, let the server response handle it
    setMessageInput('');
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      {/* Connection Status with more detailed information */}
      <div className="mb-4">
        <span className={`inline-block px-2 py-1 rounded text-sm ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        <button 
          onClick={() => {
            console.log('Current socket state:', {
              connected: socket.connected,
              id: socket.id,
              disconnected: socket.disconnected,
              listenerAdded: listenerAdded.current,
              messageCount: messages.length
            });
          }}
          className="ml-2 text-xs text-blue-500 hover:text-blue-700"
        >
          Debug Connection
        </button>
      </div>

      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto mb-4 border rounded p-4 min-h-[300px] max-h-[400px]">
        {messages.map((msg, index) => (
          <div
            key={`${msg.timestamp}-${index}`}
            className="mb-2 p-2 rounded-lg bg-gray-100"
          >
            <div>{msg.message}</div>
            <div className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Form */}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          disabled={!isConnected || !messageInput.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </form>
    </div>
  );
}

function Receive() {
  const [receiveMessage, setReceiveMessage] = useState(""); // State to store received message
  
  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on("receive_message", (data) => {
      console.log(data); // Log the received message data to the console
      setReceiveMessage(data); // Set the received message data to state
    });

    // Cleanup the effect by removing the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div>
      <p>View Receive messages: {receiveMessage}</p> {/* Display the received message */}
    </div>
  );
}

function App() {
  // Function to send a message
  const sendMessage = async () => {

    // Emit a socket event with the message details
    socket.emit("send_message", {
      senderId: "123",     // ID of the sender
      receiverId: "456", // ID of the receiver
      message: "Hello"   // The actual message content
    });

  }

  return (
    <div>
       <button onClick={sendMessage}>send message</button> {/* Button to trigger sending a message */}
    </div>
  );
}

function getAuthToken(): any {
  return localStorage.getItem('token');
}
