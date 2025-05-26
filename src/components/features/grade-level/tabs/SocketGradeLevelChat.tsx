import { useAuth } from '@/app/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Image as ImageIcon, X, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ImageUpload } from '@/components/ui/image-upload';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import io from 'socket.io-client';

interface GradeLevelChatTabProps {
  gradeLevelId: string;
}

interface GradeLevelMessage {
  id: string;
  content: string;
  image?: string;
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
const socket = io('http://localhost:4000', {
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const socketInitialized = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleImageSelect = (file: File): void => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setIsImageDialogOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async (values: { content: string }, { resetForm }: any) => {
    if (!user?.user?.id) return;

    try {
      const messageData = {
        content: values.content,
        gradeLevelId,
        senderId: user.user.id,
        image: selectedImage || undefined,
      };

      // Send message through socket
      socket.emit("grade_level_send_message", messageData);
      resetForm();
      setSelectedImage(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-gradient-to-b from-background to-muted/30">
      <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
        <div className="space-y-6">
            
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">Loading messages...</p>
              </div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => {
              const isCurrentUser = message.senderId === user?.user.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isCurrentUser && (
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-sm">
                          <span className="text-sm font-semibold text-primary-foreground">
                            {message.sender.firstName[0]}
                            {message.sender.lastName[0]}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      <div className={`rounded-2xl px-4 py-3 shadow-sm relative
                        ${isCurrentUser 
                          ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground' 
                          : 'bg-gradient-to-br from-muted to-muted/90'}`}>
                        {message.image && (
                          <div className="mb-3">
                            <img
                              src={message.image}
                              alt="Message attachment"
                              className="rounded-xl max-w-[300px] shadow-md hover:scale-[1.02] transition-transform"
                            />
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <span className={`text-[10px] ${isCurrentUser ? 'text-primary-foreground/80' : 'text-muted-foreground/80'} absolute -bottom-4`}>
                          {format(new Date(message.createdAt), 'h:mm a')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t bg-background/80 backdrop-blur-sm">
        <Formik
          initialValues={{ content: '' }}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="space-y-4">
              {selectedImage && (
                <div className="flex justify-center">
                  <div className="relative group">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="rounded-xl max-h-[200px] object-cover shadow-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      onClick={handleImageRemove}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <div className="flex-1">
                  <Field
                    as={Input}
                    name="content"
                    placeholder="Type your message..."
                    className="w-full rounded-xl border-muted-foreground/20 focus:border-primary/50 transition-colors"
                  />
                </div>
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-xl hover:bg-muted/80 transition-colors"
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      onImageRemove={handleImageRemove}
                      selectedImage={selectedImage || undefined}
                    />
                  </DialogContent>
                </Dialog>
                <Button 
                  type="submit" 
                  disabled={!values.content.trim() && !selectedImage}
                  className="rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-opacity"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SocketGradeLevelChatTab;