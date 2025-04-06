'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RiSearchLine, RiMoreLine, RiSendPlaneFill, RiEmotionLine } from 'react-icons/ri';
import { placeholderImages } from '../components/placeholders';

interface Message {
  id: number;
  content: string;
  time: string;
  isMe: boolean;
  isVoice?: boolean;
}

interface Chat {
  id: number;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  time: string;
  online?: boolean;
  unread?: number;
}

const chats: Chat[] = [
  {
    id: 1,
    name: 'Mr. Alemu',
    role: 'Online',
    avatar: placeholderImages.avatar,
    lastMessage: 'Good question! How about just discussing it?',
    time: '11:55',
    online: true
  },
  {
    id: 2,
    name: 'Elen Hunt',
    role: 'Algebra',
    avatar: placeholderImages.avatar,
    lastMessage: 'Thank you very much! Im glad...',
    time: '3m ago'
  },
  {
    id: 3,
    name: 'Jakob Saris',
    role: 'Property manager',
    avatar: placeholderImages.avatar,
    lastMessage: 'You: Sure! let me help you about e...',
    time: '3m ago'
  },
  {
    id: 4,
    name: 'Jeremy Zucker',
    role: 'Teacher',
    avatar: placeholderImages.avatar,
    lastMessage: 'You: Sure! let me help you about...',
    time: '3m ago'
  },
  {
    id: 5,
    name: 'Nadia Lauren',
    role: 'Teacher',
    avatar: placeholderImages.avatar,
    lastMessage: 'Is there anything I can help? Just...',
    time: '3m ago',
    unread: 1
  }
];

const conversation: Message[] = [
  {
    id: 1,
    content: 'Good question! How about just discussing it?',
    time: '11:55',
    isMe: false
  },
  {
    id: 2,
    content: 'Of course. Thank you so much for taking your time.',
    time: '11:56',
    isMe: true
  },
  {
    id: 3,
    content: 'Morning! Elen Hunt, I have a question about my job!',
    time: '11:58',
    isMe: true
  },
  {
    id: 4,
    content: 'What are the points that are important to get the perfect result of my assignment?',
    time: '11:54',
    isMe: true
  }
];

export default function MessagePage() {
  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white rounded-xl overflow-hidden">
      {/* Left sidebar - Chat list */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-4">Messaging</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search in dashboard..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                selectedChat.id === chat.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={chat.avatar}
                    alt={chat.name}
                    width={40}
                    height={40}
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="truncate">
                    <div className="font-medium text-gray-900">{chat.name}</div>
                    <div className="text-xs text-gray-500">{chat.role}</div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{chat.time}</div>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
              </div>
              {chat.unread && (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right side - Chat conversation */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  width={40}
                  height={40}
                  className="object-cover"
                  unoptimized
                />
              </div>
              {selectedChat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">{selectedChat.name}</div>
              <div className="text-sm text-gray-500">{selectedChat.role}</div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <RiMoreLine className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  message.isMe
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.isMe ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <button className="text-gray-400 hover:text-gray-600">
              <RiEmotionLine className="w-6 h-6" />
            </button>
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="text-white bg-blue-600 rounded-xl p-2 hover:bg-blue-700">
              <RiSendPlaneFill className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 