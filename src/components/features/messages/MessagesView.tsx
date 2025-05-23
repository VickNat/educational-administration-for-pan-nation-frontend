'use client'

import React, { useState } from 'react';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import { useAuth } from '@/app/context/AuthContext';
import { useGetDirectorRelatedUsers, useGetParentRelatedUsers, useGetTeacherRelatedUsers } from '@/queries/messages/queries';
import MySocket from './socket';
import SocketMessageList from './SocketMessageList';
// Dummy data for messages (right section) - will be replaced later
const messagesData = [
  {
    id: "cma9kuwk20001sb8wo1n02kd8",
    content: "Wow",
    senderId: "cm9vnhqey0000sb90ncjjxg4r",
    receiverId: "cm94avzr60006sbkkkag9owa6",
    createdAt: "2025-05-04T11:37:43.221Z",
    seen: false,
    images: [],
    sender: {
      id: "cm9vnhqey0000sb90ncjjxg4r",
      firstName: "abee",
      lastName: "dbe",
      role: "PARENT",
    },
    receiver: {
      id: "cm94avzr60006sbkkkag9owa6",
      firstName: "Tabcd12",
      lastName: "efg1",
      role: "TEACHER",
    },
  },
];

const MessagesView = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState('');
  
  // Get conversations based on user role
  const { data: directorData } = useGetDirectorRelatedUsers();
  const { data: parentData } = useGetParentRelatedUsers();
  const { data: teacherData } = useGetTeacherRelatedUsers();

  let conversations: any[] = [];
  if (user?.user.role === 'DIRECTOR' && directorData) {
    conversations = directorData.result.map((user: any) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    }));
  } else if (user?.user.role === 'PARENT' && parentData) {
    const directors = parentData.result.directors.map((item: any) => ({
      id: item.user.id,
      name: `${item.user.firstName} ${item.user.lastName}`,
      role: item.user.role,
    }));
    const teachers = parentData.result.teachers.map((item: any) => ({
      id: item.user.id,
      name: `${item.user.firstName} ${item.user.lastName}`,
      role: item.user.role,
    }));
    conversations = [...directors, ...teachers];
  } else if (user?.user.role === 'TEACHER' && teacherData) {
    const parents = teacherData.result.parents.map((item: any) => ({
      id: item.user.id,
      name: `${item.user.firstName} ${item.user.lastName}`,
      role: item.user.role,
    }));
    const directors = teacherData.result.director.map((item: any) => ({
      id: item.user.id,
      name: `${item.user.firstName} ${item.user.lastName}`,
      role: item.user.role,
    }));
    conversations = [...parents, ...directors];
  }

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedConversationId
  ) || null;

  return (
    <div className="flex h-[78vh] overflow-hidden ">
      <ConversationList
        selectedConversationId={selectedConversationId || ''}
        onSelectConversation={setSelectedConversationId}
      />
      <SocketMessageList
        selectedConversation={selectedConversation}
      />
    </div>
  );
};

export default MessagesView;