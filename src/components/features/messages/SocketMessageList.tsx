import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { useSendMessage } from "@/queries/messages/mutations";
import { useAuth } from "@/app/context/AuthContext";
import { Message, MessagesResponse } from "./types";
import { toast } from "react-hot-toast";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MessageListProps {
  selectedConversation: any | null;
}

interface SocketMessage {
  success: boolean;
  senderId: string;
  receiverId: string;
  error : string | null,
  data: Message | null;
}

interface AllMessagesResponse {
  success: boolean;
  data?: Message[];
  error?: string;
}

interface DeleteMessageResponse {
  success: boolean;
  data?: string;
  senderId?: string;
  recieverId?: string;
  error?: string | null;
}

// Create socket connection
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "https://capstone-class-bridge.onrender.com", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  auth: {
    token: localStorage.getItem('token')
  }
});


const SocketMessageList = ({ selectedConversation }: MessageListProps) => {
  const { user } = useAuth();
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage();
  const [isLoading, setIsLoading] = React.useState(false);
  const [messagesData, setMessagesData] = React.useState<MessagesResponse | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketInitialized = useRef(false);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesData]);

  // Socket connection and message handling
  useEffect(() => {
    if (!socketInitialized.current && user?.user?.id) {
      console.log('Initializing socket connection');

      // Handle incoming messages
      const handleReceiveMessage = (socketMessage: SocketMessage) => {
        console.log('Received socket message:', socketMessage);
        
        // Validate if message is for current conversation
        if (!selectedConversation?.id || !user?.user?.id) return;

        const isRelevantMessage = 
          (socketMessage.senderId === user.user.id && socketMessage.receiverId === selectedConversation.id) ||
          (socketMessage.senderId === selectedConversation.id && socketMessage.receiverId === user.user.id);
        
          if (!socketMessage.success) {
            toast.error(socketMessage.error ?? 'Failed to send message');
            return;
          }
        if (!isRelevantMessage) {
          console.log('Message not relevant for current conversation');
          return;
        }
        

        if (!socketMessage.success) {
          toast.error('Failed to send message');
          return;
        }
        const data = {
          recieverId : user.user.id,
          senderId : selectedConversation?.id
        }
        console.log("EMitting",data)
        socket.emit("seen-messages", data)


        if (socketMessage.data) {
          setMessagesData(prev => {
            if (!prev) {
              return {
                success: true,
                message: 'Messages loaded',
                result: [socketMessage.data!]
              };
            }
         

            return {
              ...prev,
              result: [...prev.result, socketMessage.data!]
            };
          });

        }
      };

      // Handle initial messages fetch response
      const handleAllMessagesResponse = (response: AllMessagesResponse) => {
        console.log('Received all messages:', response);
        if (!response.success) {
          toast.error(response.error || 'Failed to fetch messages');
          return;
        }
       

        if (response.data) {
          setMessagesData({
            success: true,
            message: 'Messages loaded',
            result: response.data
          });
        }
        setIsLoading(false);
      };

      // Handle deleted message response
      const handleMessageDeleted = (response: DeleteMessageResponse) => {
        console.log('Message deleted response:', response);
        
        if (!response.success) {
          toast.error(response.error || 'Failed to delete message');
          return;
        }

        // Remove deleted message from state
        if (response.data) {
          setMessagesData(prev => {
            if (!prev) return null;
            return {
              ...prev,
              result: prev.result.filter(msg => msg.id !== response.data)
            };
          });
          toast.success('Message deleted successfully');
        }
      };

      // Set up socket listeners
      socket.on('connect', () => {
        console.log('Socket connected');
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      socket.on('receive_message', handleReceiveMessage);
      socket.on('all_messages_response', handleAllMessagesResponse);
      socket.on('message_deleted', handleMessageDeleted);
      
      socketInitialized.current = true;

      // Cleanup
      return () => {
        console.log('Cleaning up socket listeners');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('receive_message', handleReceiveMessage);
        socket.off('all_messages_response', handleAllMessagesResponse);
        socketInitialized.current = false;
      };
    }
  }, [user?.user?.id, selectedConversation?.id]);

  

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!selectedConversation?.id || !user?.user?.id) return;

    setIsLoading(true);
    // Emit event to fetch all messages
    socket.emit('all_messages', {
      senderId: user.user.id,
      receiverId: selectedConversation.id
    });

  }, [user?.user?.id, selectedConversation?.id]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user?.user?.id) return;

    try {
      const messageData = {
        senderId: user.user.id,
        receiverId: selectedConversation.id,
        content,
        images: [],
      };

      // Only send through socket - the server will handle persistence
      socket.emit("send_message", messageData);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    }
  };

  const messages = messagesData?.result || [];

  return (
    <Card className="flex-1 flex flex-col rounded-none h-full py-0">
      <div className="p-4 border-b border-gray-200 flex items-center h-[80px]">
        {selectedConversation ? (
          <>
            <Avatar className="h-10 w-10 mr-3">
              {selectedConversation.profile ? (
                <Image 
                  src={selectedConversation.profile}
                  alt={selectedConversation.name}
                  width={40}
                  height={40}
                  unoptimized
                  loader={({ src }) => src}
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white uppercase">
                  {selectedConversation.name?.split(" ")[0][0]}
                  {selectedConversation.name?.split(" ")[1]?.[0]}
                </AvatarFallback>
              )}
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

      <div className="flex-1 h-full p-4 overflow-y-auto">
        {selectedConversation ? (
          isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message: Message) => {
              const isCurrentUser = message.senderId === user?.user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex mb-4 group ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`max-w-xs p-3 rounded-2xl ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-1">
                        <p className="text-xs opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {isCurrentUser && (
                          <span className="text-xs opacity-70">
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
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
        <div ref={scrollRef}></div>
      </div >

      {selectedConversation && (
        <div className="sticky bottom-0 bg-background border-t">
          <MessageInput onSend={handleSendMessage} disabled={isSending} />
        </div>
      )}
    </Card>
  );
};

export default SocketMessageList;
