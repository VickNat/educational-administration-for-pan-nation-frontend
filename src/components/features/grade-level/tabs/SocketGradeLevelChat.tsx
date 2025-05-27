import { useAuth } from '@/app/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ImageUpload } from '@/components/ui/image-upload';
import io from 'socket.io-client';
import Image from 'next/image';
import { uploadImage } from '@/utils/helper';

interface GradeLevelChatTabProps {
  gradeLevelId: string;
}

interface GradeLevelMessage {
  id: string;
  content: string;
  images?: string[];
  createdAt: string;
  gradeLevelId: string;
  senderId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profile?: string | null;
  };
}

interface GradeLevelMessageResponse {
  success: boolean;
  data: GradeLevelMessage[] | null;
  error: string | null;
  gradeLevelId: string;
}

// Create socket connection
const socket = io("https://capstone-class-bridge.onrender.com", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  auth: {
    token: localStorage.getItem('token')
  }
});

const SocketGradeLevelChatTab = ({ gradeLevelId }: GradeLevelChatTabProps) => {
  const [messages, setMessages] = useState<GradeLevelMessage[]>([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const socketInitialized = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom when messages update (like SocketMessageList)
  useEffect(() => {
    if (scrollRef.current && messages.length) {
      const scrollToBottom = () => {
        const scrollElement = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        if (scrollElement) {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: 'smooth',
          });
        } else {
          scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
        }
      };
      requestAnimationFrame(() => {
        setTimeout(scrollToBottom, 50);
      });
    }
  }, [messages.length]);

  // Socket connection and message handling
  useEffect(() => {
    if (!socketInitialized.current && user?.user?.id) {
      console.log('Initializing socket connection for grade level chat');

      // Handle incoming messages
      const handleReceiveMessage = (response: any) => {
        console.log('Received grade level message:', response);

        if (!response.success) {
          toast.error(response.error || 'Failed to send message');
          return;
        }

        if (response.data) {
          setMessages(prev => {
            // Check if message already exists to avoid duplicates
            const messageExists = prev.some(msg => 
              msg.id === response.data.id
            );
            if (messageExists) {
              return prev;
            }
            return [...prev, response.data];
          });
        }
      };

      // Handle initial messages fetch response
      const handleAllMessagesResponse = (response: GradeLevelMessageResponse) => {
        console.log('Received all grade level messages:', response);
        if (!response.success) {
          toast.error(response.error || 'Failed to fetch messages');
          return;
        }

        if (response.data) {
          setMessages(response.data);
        }
        setIsLoading(false);
      };

      // Set up socket listeners
      socket.on('connect', () => {
        console.log('Socket connected for grade level chat');
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected from grade level chat');
      });

      socket.on('grade_level_receive_message', handleReceiveMessage);
      socket.on('grade_level_all_messages_response', handleAllMessagesResponse);

      socketInitialized.current = true;

      // Cleanup
      return () => {
        console.log('Cleaning up grade level chat socket listeners');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('grade_level_receive_message', handleReceiveMessage);
        socket.off('grade_level_all_messages_response', handleAllMessagesResponse);
        socketInitialized.current = false;
      };
    }
  }, [user?.user?.id]);

  // Fetch messages when component mounts or gradeLevelId changes
  useEffect(() => {
    if (!gradeLevelId || !user?.user?.id) return;

    setIsLoading(true);
    // Emit event to fetch all messages for this grade level
    socket.emit('grade_level_all_messages', gradeLevelId);

  }, [gradeLevelId, user?.user?.id]);

  // Handle image file selection
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSendMessage = async (content: string) => {
    if (!user?.user?.id) return;
    let imageUrl = undefined;
    if (imageFile) {
      const { url, error } = await uploadImage(imageFile);
      if (error) {
        toast.error('Failed to upload image');
        return;
      }
      imageUrl = url;
    }
    try {
      const messageData = {
        content,
        gradeLevelId,
        senderId: user.user.id,
        images: imageUrl ? [imageUrl] : [],
      };
      socket.emit("grade_level_send_message", messageData);
      setImageFile(null);
      setImagePreview(null);
      setInputValue('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  
  const messagesList = messages || [];

  return (
    <div className="flex flex-col w-full h-full max-h-full bg-gradient-to-b from-background to-muted/20">
      {/* Modern Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
              <AvatarFallback className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground font-semibold text-lg">
                GL
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">Grade Level Chat</h2>
            <p className="text-[12px] text-muted-foreground flex items-center gap-2">Group Chat</p>
          </div>
        </div>
      </div>
      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pb-20 w-full"
          style={{ height: '60vh', maxHeight: '60vh', minHeight: '400px' }}
        >
          <div className="px-4 py-6 space-y-4 min-h-full">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading messages...</p>
              </div>
            ) : messagesList.length > 0 ? (
              <>
                {messagesList.map((message, index) => {
                  const isCurrentUser = message.senderId === user?.user?.id;
                  const isLastMessage = index === messagesList.length - 1;
                  const showAvatar =
                    !isCurrentUser && (index === 0 || messagesList[index - 1]?.senderId !== message.senderId);
                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-3 group ${
                        isCurrentUser ? 'justify-end' : 'justify-start'
                      } ${isLastMessage ? 'mb-4' : ''}`}
                    >
                      {!isCurrentUser && (
                        <div className="w-8 h-8 flex-shrink-0">
                          {showAvatar && (
                            <Avatar className="w-8 h-8">
                              {message.sender.profile ? (
                                <Image
                                  src={message.sender.profile || '/placeholder.svg'}
                                  alt={`${message.sender.firstName} ${message.sender.lastName}`}
                                  width={32}
                                  height={32}
                                  unoptimized
                                  loader={({ src }) => src}
                                  className="object-cover"
                                />
                              ) : (
                                <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/60 text-secondary-foreground text-xs">
                                  {message.sender.firstName[0]}
                                  {message.sender.lastName[0]}
                                </AvatarFallback>
                              )}
                            </Avatar>
                          )}
                        </div>
                      )}
                      <div className={`relative max-w-[70%] ${isCurrentUser ? 'order-1' : ''}`}>
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground rounded-br-md'
                              : 'bg-card border border-border/50 text-card-foreground rounded-bl-md'
                          }`}
                        >
                          {/* Message image */}
                          {message.images && message.images.length > 0 && (
                            <div className="mb-3 -mx-1">
                              <div className="relative overflow-hidden rounded-xl">
                                <img
                                  src={message.images[0] || "/placeholder.svg"}
                                  alt="Message attachment"
                                  className="max-w-[280px] w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
                              </div>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <div
                          className={`flex items-center gap-1 mt-1 px-1 ${
                            isCurrentUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.createdAt), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-foreground">No messages yet</p>
                  <p className="text-xs text-muted-foreground">Start the conversation!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modern Message Input */}
      <div className="sticky bottom-0 w-full bg-background/95 backdrop-blur-sm border-t border-border/50 p-4">
        <div className="w-full max-w-none">
          {/* Image preview */}
          {imagePreview && (
            <div className="flex justify-center mb-2">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Selected"
                    className="max-h-[200px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  onClick={handleImageRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <div className="flex gap-3 items-end">
            <Input
              placeholder="Type your message..."
              className="flex-1"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter' && !e.shiftKey && (!imageFile || imagePreview)) {
                  e.preventDefault();
                  await handleSendMessage(inputValue);
                }
              }}
            />
            {/* Image Upload Button */}
            <div>
              <input
                type="file"
                accept="image/*"
                id="gradelevel-chat-image-upload"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="rounded-2xl h-12 w-12 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm"
                onClick={() => document.getElementById('gradelevel-chat-image-upload')?.click()}
                disabled={!!imagePreview}
              >
                <ImageIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>
            <Button
              onClick={async () => {
                if ((!imageFile || imagePreview)) {
                  await handleSendMessage(inputValue);
                }
              }}
              className="rounded-2xl h-12 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={(!inputValue.trim() && !imagePreview) || (!!imageFile && !imagePreview)}
            >
              <Send className="h-5 w-5 mr-2" />
              <span className="font-medium">Send</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocketGradeLevelChatTab;