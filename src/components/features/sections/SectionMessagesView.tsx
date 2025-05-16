'use client'

import { useGetParentRelatedUsers } from '@/queries/messages/queries';
import React, { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Image as ImageIcon, X } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import { ImageUpload } from '@/components/ui/image-upload';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useCreateSectionMessage } from '@/queries/sections/mutations';
import { useGetSectionMessages } from '@/queries/sections/queries';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

interface RelatedUsers {
  directors: User[];
  teachers: User[];
}

interface Section {
  id: string;
  name: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  image?: string;
  sender: {
    firstName: string;
    lastName: string;
  };
}

const SectionMessagesView = () => {
  const { data: parentData } = useGetParentRelatedUsers();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const { data: sectionMessages } = useGetSectionMessages(selectedSection || '');
  const { mutateAsync: createSectionMessage, isPending } = useCreateSectionMessage();

  // Redirect if not a parent
  React.useEffect(() => {
    if (user?.user.role !== 'PARENT') {
      router.push('/dashboard');
    }
  }, [user, router]);

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
    if (!selectedSection) return;

    try {
      await createSectionMessage({
        content: values.content,
        sectionId: selectedSection,
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

  if (user?.user.role !== 'PARENT') {
    return null;
  }

  // Combine directors and teachers into a single array
  const allUsers = [
    ...(parentData?.result?.directors || []),
    ...(parentData?.result?.teachers || [])
  ];

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">Section Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Users List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>School Staff</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2">
                {allUsers.map((staff) => (
                  <Button
                    key={staff.id}
                    variant={selectedSection === staff.id ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedSection(staff.id)}
                  >
                    {staff.user.firstName} {staff.user.lastName} ({staff.user.role})
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedSection
                ? allUsers.find((s) => s.id === selectedSection)?.user.firstName + ' ' + 
                  allUsers.find((s) => s.id === selectedSection)?.user.lastName
                : 'Select a staff member to start chatting'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSection ? (
              <div className="h-[calc(100vh-300px)] flex flex-col">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {Array.isArray(sectionMessages?.result) && sectionMessages.result.map((message: Message) => {
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
            ) : (
              <div className="h-[calc(100vh-300px)] flex items-center justify-center text-muted-foreground">
                Select a staff member to view and send messages
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SectionMessagesView;