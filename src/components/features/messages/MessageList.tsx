import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import React, { useEffect } from 'react';
import MessageInput from './MessageInput';
import { useGetMessagesBetweenUsers } from '@/queries/messages/queries';
import { useSendMessage } from '@/queries/messages/mutations';
import { useAuth } from '@/app/context/AuthContext';
import { Message, MessagesResponse } from './types';
import { toast } from 'react-hot-toast';

interface MessageListProps {
  selectedConversation: any | null;
}

const MessageList = ({ selectedConversation }: MessageListProps) => {
  const { user } = useAuth();
  const { data: messagesData, isLoading } = useGetMessagesBetweenUsers(
    user?.user?.id || '',
    selectedConversation?.id || ''
  );
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage();

  const messages = (messagesData as MessagesResponse)?.result || [];

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user?.user?.id) return;

    try {
      await sendMessage({
        senderId: user.user.id,
        receiverId: selectedConversation.id,
        content,
        images: []
      });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <Card className="flex-1 flex flex-col rounded-none h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center min-h-[72px]">
        {selectedConversation ? (
          <>
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback>
                {selectedConversation.name.split(' ')[0][0] +
                  selectedConversation.name.split(' ')[1][0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedConversation.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {selectedConversation.role}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Select a conversation</p>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        {selectedConversation ? (
          isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message: Message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  message.senderId === user?.user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.senderId === user?.user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              No messages yet. Start the conversation!
            </p>
          )
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Select a conversation to view messages.
          </p>
        )}
      </ScrollArea>

      {/* Message Input */}
      {selectedConversation && (
        <MessageInput onSend={handleSendMessage} disabled={isSending} />
      )}
    </Card>
  );
};

export default MessageList; 