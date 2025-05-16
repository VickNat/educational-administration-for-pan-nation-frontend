import { useCreateSectionMessage } from '@/queries/sections/mutations';
import { useGetSectionMessages } from '@/queries/sections/queries';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '@/app/context/AuthContext';
import { ImageUpload } from '@/components/ui/image-upload';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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

const SectionChatTab = ({ sectionId }: SectionChatTabProps) => {
  const [messages, setMessages] = useState<SectionMessage[]>([]);
  const { data: sectionMessages } = useGetSectionMessages(sectionId);
  const { mutateAsync: createSectionMessage, isPending } = useCreateSectionMessage();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  useEffect(() => {
    if (sectionMessages && sectionMessages.result) {
      setMessages(sectionMessages.result);
    }
  }, [sectionMessages]);

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
    try {
      await createSectionMessage({
        content: values.content,
        sectionId,
        senderId: user?.user.id || '',
        images: selectedImage ? [selectedImage] : [],
      });
      resetForm();
      setSelectedImage(null);
      toast.success('Message sent successfully');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };
  
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => {
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
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Formik
          initialValues={{ content: '' }}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
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
                <Button type="submit" disabled={isPending || (!values.content.trim() && !selectedImage)}>
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

export default SectionChatTab;