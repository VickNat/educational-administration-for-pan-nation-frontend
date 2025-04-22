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

// Sample data
const chats: Chat[] = [
  {
    id: 1,
    name: 'Kristin Watson',
    role: 'Chemistry Teacher',
    avatar: placeholderImages.avatar,
    lastMessage: 'Don&apos;t forget to submit your assignment',
    time: '2:30 PM',
    online: true,
    unread: 2
  },
  {
    id: 2,
    name: 'Marvin McKinney',
    role: 'French Teacher',
    avatar: placeholderImages.avatar,
    lastMessage: 'Great work on the test!',
    time: '1:45 PM',
    online: false
  },
  {
    id: 3,
    name: 'Jane Cooper',
    role: 'Maths Teacher',
    avatar: placeholderImages.avatar,
    lastMessage: 'Let&apos;s review the homework',
    time: '12:15 PM',
    online: true,
    unread: 1
  }
];

const messages: Message[] = [
  {
    id: 1,
    content: 'Hi, how are you?',
    time: '2:30 PM',
    isMe: true
  },
  {
    id: 2,
    content: 'I&apos;m good, thanks! How about you?',
    time: '2:31 PM',
    isMe: false
  },
  {
    id: 3,
    content: 'I&apos;m doing well too. How&apos;s the class going?',
    time: '2:32 PM',
    isMe: true
  }
];

export default function MessagePage() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(chats[0]);

  return (
    <div className="h-full flex">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={chat.avatar}
                    alt={chat.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                    unoptimized
                  />
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    {chat.unread && (
                      <span className="bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized
                />
                <div>
                  <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
                  <p className="text-sm text-gray-500">{selectedChat.role}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <RiMoreLine className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-xl p-3 ${
                      message.isMe
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p>{message.content}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.isMe ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <RiEmotionLine className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="text-blue-600 hover:text-blue-700">
                  <RiSendPlaneFill className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
} 