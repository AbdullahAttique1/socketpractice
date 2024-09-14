"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";


export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);



  useEffect(() => {
    // Listen for 'chat message' events from the server
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      window.scrollTo(0, document.body.scrollHeight);
    });
    return () => {
      socket.off('chat message');
    };
  }, []);


  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);


  socket.on('chat message', (msg) => {
 
  
    console.log(msg,"what you get here ");
    
        window.scrollTo(0, document.body.scrollHeight);
      });
  socket.on("hello", (value) => {
  console.log(value);
  
  });


  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (input) {
      socket.emit('chat message', input);
      setInput(''); // Clear the input field
    }
  };



  return (
    <div className="max-w-md mx-auto p-4 bg-gray-100 rounded-lg shadow-lg">
    {/* Status and Transport Information */}
    <div className="mb-4 p-2 bg-white rounded-lg shadow-md">
      <p className={`font-semibold ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
        Status: {isConnected ? "connected" : "disconnected"}
      </p>
      <p className="text-gray-700">Transport: {transport}</p>
    </div>
  
    {/* Messages List */}
    <div className="mb-4 h-64 overflow-y-auto p-2 bg-white rounded-lg shadow-md">
      <ul id="messages" className="space-y-2">
        {messages.map((msg, index) => (
          <li
            key={index}
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            {msg}
          </li>
        ))}
      </ul>
    </div>
  
    {/* Input Form */}
    <form id="form" onSubmit={handleSubmit} className="flex space-x-2">
      <input
        id="input"
        placeholder="Type a message..."
        className="flex-grow bg-blue-500 text-white border-2 border-black rounded-lg px-4 py-2 focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoComplete="off"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 focus:outline-none"
      >
        Send
      </button>
    </form>
  </div>
  
  );
}