import { useAuth } from '@/app/context/AuthContext';
import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ImageUpload } from '@/components/ui/image-upload';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import io from 'socket.io-client';

interface SectionChatTabProps {
  sectionId: string;
}

interface SectionMessage {
  id: string;
  content: string;
  image?: string;
  createdAt: string;
  sectionId: string;
  senderId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profile?: string | null;
  };
}

interface SectionMessageResponse {
  success: boolean;
  data: SectionMessage[] | null;
  error: string | null;
  sectionId: string;
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

const SocketSectionChatTab = ({ sectionId }: SectionChatTabProps) => {
  const [messages, setMessages] = useState<SectionMessage[]>([]);
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
      console.log("working")

      console.log('Initializing socket connection for section chat');

      // Handle incoming messages
      const handleReceiveMessage = (response: any) => {
        console.log('Received section message:', response);

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
      const handleAllMessagesResponse = (response: SectionMessageResponse) => {
        console.log('Received all section messages:', response);
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
        console.log('Socket connected for section chat');
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected from section chat');
      });

      socket.on('section_receive_message', handleReceiveMessage);
      socket.on('section_all_messages_response', handleAllMessagesResponse);

      socketInitialized.current = true;

      // Cleanup
      return () => {
        console.log('Cleaning up section chat socket listeners');
        socket.off('connect');
        socket.off('disconnect');
        socket.off('section_receive_message', handleReceiveMessage);
        socket.off('section_all_messages_response', handleAllMessagesResponse);
        socketInitialized.current = false;
      };
    } else {
        console.log("Not working")
    }
  }, [user?.user?.id]);

  // Fetch messages when component mounts or sectionId changes
  useEffect(() => {
    if (!sectionId || !user?.user?.id) return;
    console.log("Emitted!!!....")

    setIsLoading(true);
    // Emit event to fetch all messages for this section
    socket.emit('section_all_messages', sectionId);

  }, [sectionId, user?.user?.id]);

  const handleImageSelect = (file: File) => {
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
        sectionId,
        senderId: user.user.id,
        images: selectedImage ? [selectedImage] : [],
      };

      // Send message through socket
      socket.emit("section_send_message", messageData);
      resetForm();
      setSelectedImage(null);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
            
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message) => {
              const isCurrentUser = message.senderId === user?.user.id;
              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {message.sender.firstName[0]}
                          {message.sender.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.sender.firstName} {message.sender.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <Card className={`p-3 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {message.image && (
                          <div className="mb-2">
                            <img
                              src={message.image}
                              alt="Message attachment"
                              className="rounded-md max-w-[200px]"
                            />
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              No messages yet. Start the conversation!
            </p>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Formik
          initialValues={{ content: '' }}
          onSubmit={handleSubmit}
        >
          {({ values }) => (
            <Form className="space-y-4">
              {selectedImage && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected"
                      className="rounded-md max-h-[200px] object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleImageRemove}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <div className="flex-1">
                  <Field
                    as={Input}
                    name="content"
                    placeholder="Type your message..."
                    className="w-full"
                  />
                </div>
                <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                    >
                      <ImageIcon className="h-4 w-4" />
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
                <Button type="submit" disabled={!values.content.trim() && !selectedImage}>
                  <Send className="h-4 w-4 mr-2" />
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

export default SocketSectionChatTab;