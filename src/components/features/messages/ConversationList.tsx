import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import React from 'react';
import { useGetDirectorRelatedUsers, useGetParentRelatedUsers, useGetTeacherRelatedUsers } from '@/queries/messages/queries';
import { useAuth } from '@/app/context/AuthContext';
import { DirectorRelatedUsersResponse, ParentRelatedUsersResponse, TeacherRelatedUsersResponse } from './types';
import Image from "next/image"

interface ConversationProps {
  selectedConversationId: string;
  onSelectConversation: (id: string) => void;
}

const ConversationList = ({ selectedConversationId, onSelectConversation }: ConversationProps) => {
  const { user } = useAuth();
  const { data: directorData } = useGetDirectorRelatedUsers();
  const { data: parentData } = useGetParentRelatedUsers();
  const { data: teacherData } = useGetTeacherRelatedUsers();

  let conversations: any[] = [];

  if (user?.user.role === 'DIRECTOR' && directorData) {
    const directorResponse = directorData as DirectorRelatedUsersResponse;
    conversations = directorResponse.result.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      lastMessage: '',
      timestamp: '',
      profile : user.profile
    }));
  } else if (user?.user.role === 'PARENT' && parentData) {
    const parentResponse = parentData as ParentRelatedUsersResponse;
    const directors = parentResponse.result.directors.map((item) => ({
      id: item.user.id,
      name: `${item.user.firstName} ${item.user.lastName}`,
      role: item.user.role,
      lastMessage: '',
      timestamp: '',
      profile : item.user.profile

    }));
    const teachers = parentResponse.result.teachers.map((item) => ({
      id: item.user.id,
      name: `${item.user.firstName} ${item.user.lastName}`,
      role: item.user.role,
      lastMessage: '',
      timestamp: '',
      profile : item.user.profile

    }));
    conversations = [...directors, ...teachers];
  } else if (user?.user.role === 'TEACHER' && teacherData) {
    const teacherResponse = teacherData as TeacherRelatedUsersResponse;
    const parents = teacherResponse.result.parents.map((item) => ({
      id: item.user.id,
      name: `${item.user.firstName} ${item.user.lastName}`,
      role: item.user.role,
      lastMessage: '',
      timestamp: '',
      profile : item.user.profile

    }));
    const directors = teacherResponse.result.director.map((item) => ({
      id: item.user.id,
      name: `${item.user.firstName} ${item.user.lastName}`,
      role: item.user.role,
      lastMessage: '',
      timestamp: '',
      profile : item.user.profile

    }));
    conversations = [...parents, ...directors];
  }

  return (
    <Card className="w-80 border-r-0 rounded-none h-full  py-0 ">
      <div className="p-4 border-b border-gray-200 min-h-[80px] ">
        <h2 className="text-xl font-semibold text-gray-900">Messaging</h2>
      </div>
      <div className="h-full overflow-auto flex-1 pb-12">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
              selectedConversationId === conversation.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <Avatar className="h-10 w-10 mr-3">
              {conversation.profile ? (
                <Image 
                  src={conversation.profile}
                  alt={conversation.name}
                  width={40}
                  height={40}
                  loader={({ src }) => src}
                  unoptimized
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white uppercase">
                  {conversation.name.split(' ')[0][0] + conversation.name.split(' ')[1][0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">{conversation.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {conversation.timestamp}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {conversation.lastMessage}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ConversationList; 