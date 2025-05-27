"use client"

import { useAuth } from "@/app/context/AuthContext"
import { useState, useEffect, useRef } from "react"
import { Formik, Form, Field } from "formik"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, ImageIcon, X, MessageSquare, Clock, CheckCheck } from "lucide-react"
import toast from "react-hot-toast"
import { format } from "date-fns"
import { ImageUpload } from "@/components/ui/image-upload"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import io from "socket.io-client"
import { uploadImage } from '@/utils/helper'

interface SectionChatTabProps {
  sectionId: string
}

interface SectionMessage {
  id: string
  content: string
  images?: string[]
  createdAt: string
  sectionId: string
  senderId: string
  sender: {
    id: string
    firstName: string
    lastName: string
    profile?: string | null
  }
}

interface SectionMessageResponse {
  success: boolean
  data: SectionMessage[] | null
  error: string | null
  sectionId: string
}

// Create socket connection
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  auth: {
    token: localStorage.getItem("token"),
  },
})

const SocketSectionChatTab = ({ sectionId }: SectionChatTabProps) => {
  const [messages, setMessages] = useState<SectionMessage[]>([])
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const socketInitialized = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
      console.log("working")

      console.log("Initializing socket connection for section chat")

      // Handle incoming messages
      const handleReceiveMessage = (response: any) => {
        console.log("Received section message:", response)

        if (!response.success) {
          toast.error(response.error || "Failed to send message")
          return
        }

        if (response.data) {
          setMessages((prev) => {
            // Check if message already exists to avoid duplicates
            const messageExists = prev.some((msg) => msg.id === response.data.id)
            if (messageExists) {
              return prev
            }
            return [...prev, response.data]
          })
        }
      }

      // Handle initial messages fetch response
      const handleAllMessagesResponse = (response: SectionMessageResponse) => {
        console.log("Received all section messages:", response)
        if (!response.success) {
          toast.error(response.error || "Failed to fetch messages")
          return
        }

        if (response.data) {
          setMessages(response.data)
        }
        setIsLoading(false)
      }

      // Set up socket listeners
      socket.on("connect", () => {
        console.log("Socket connected for section chat")
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected from section chat")
      })

      socket.on("section_receive_message", handleReceiveMessage)
      socket.on("section_all_messages_response", handleAllMessagesResponse)

      socketInitialized.current = true

      // Cleanup
      return () => {
        console.log("Cleaning up section chat socket listeners")
        socket.off("connect")
        socket.off("disconnect")
        socket.off("section_receive_message", handleReceiveMessage)
        socket.off("section_all_messages_response", handleAllMessagesResponse)
        socketInitialized.current = false
      }
    } else {
      console.log("Not working")
    }
  }, [user?.user?.id])

  // Fetch messages when component mounts or sectionId changes
  useEffect(() => {
    if (!sectionId || !user?.user?.id) return
    console.log("Emitted!!!....")

    setIsLoading(true)
    // Emit event to fetch all messages for this section
    socket.emit("section_all_messages", sectionId)
  }, [sectionId, user?.user?.id])

  const handleImageSelect = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage(reader.result as string)
      setIsImageDialogOpen(false)
    }
    reader.readAsDataURL(file)
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
  }

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

  const handleSubmit = async (values: { content: string }, { resetForm }: any) => {
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
        content: values.content,
        sectionId,
        senderId: user.user.id,
        images: [imageUrl],
      };
      console.log("Sending message:", messageData);
      socket.emit("section_send_message", messageData);
      resetForm();
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />

      {/* Chat Header */}
      <div className="relative z-10 px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/30" />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Section Chat</h3>
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            <span>Live</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1  overflow-auto relative z-10" ref={scrollRef}>
        <div className="px-6 py-6 space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-[50vh]">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 rounded-full animate-spin border-t-blue-500" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-ping border-t-blue-500/20" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Loading messages</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Connecting to chat...</p>
                </div>
              </div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message, index) => {
              const isCurrentUser = message.senderId === user?.user.id
              const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId
              const isLastInGroup = index === messages.length - 1 || messages[index + 1].senderId !== message.senderId

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 group ${isCurrentUser ? "justify-end" : "justify-start"} ${
                    showAvatar ? "mt-6" : "mt-1"
                  }`}
                >
                  <div className={`flex gap-3 max-w-[75%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    {!isCurrentUser && (
                      <div className={`flex-shrink-0 ${showAvatar ? "opacity-100" : "opacity-0"}`}>
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-0.5 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                              <span className="text-sm font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                {message.sender.firstName[0]}
                                {message.sender.lastName[0]}
                              </span>
                            </div>
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                        </div>
                      </div>
                    )}

                    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"} space-y-1`}>
                      {/* Sender name */}
                      {!isCurrentUser && showAvatar && (
                        <div className="flex items-center gap-2 px-1">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            {message.sender.firstName} {message.sender.lastName}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">
                            {format(new Date(message.createdAt), "h:mm a")}
                          </span>
                        </div>
                      )}

                      {/* Message bubble */}
                      <div
                        className={`relative group/message ${
                          isCurrentUser
                            ? "bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                        } rounded-2xl px-4 py-3 max-w-md transition-all duration-200 hover:shadow-md ${
                          isCurrentUser
                            ? "hover:shadow-blue-500/30"
                            : "hover:shadow-slate-200 dark:hover:shadow-slate-700"
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

                        {/* Message content */}
                        {message.content && (
                          <p
                            className={`text-sm leading-relaxed ${
                              isCurrentUser ? "text-white" : "text-slate-700 dark:text-slate-200"
                            }`}
                          >
                            {message.content}
                          </p>
                        )}

                        {/* Message status for current user */}
                        {isCurrentUser && (
                          <div className="flex items-center justify-end mt-2 gap-1">
                            <CheckCheck className="w-3 h-3 text-white/70" />
                            <span className="text-[10px] text-white/70">
                              {format(new Date(message.createdAt), "h:mm a")}
                            </span>
                          </div>
                        )}

                        {/* Timestamp for others */}
                        {!isCurrentUser && isLastInGroup && (
                          <div className="flex items-center justify-start mt-2">
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {format(new Date(message.createdAt), "h:mm a")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs text-white font-bold">+</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Start the conversation</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                  No messages yet. Be the first to share your thoughts with the section!
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input Area */}
      <div className="relative z-10 p-6 border-t border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <Formik initialValues={{ content: "" }} onSubmit={handleSubmit}>
          {({ values }) => (
            <Form className="space-y-4">
              {/* Selected Image Preview */}
              {imagePreview && (
                <div className="flex justify-center">
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

              {/* Input Row */}
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Field
                    as={Input}
                    name="content"
                    placeholder="Type your message..."
                    className="w-full rounded-2xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 transition-all duration-200 text-sm py-3 px-4 shadow-sm"
                  />
                </div>

                {/* Image Upload Button */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    id="section-chat-image-upload"
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-2xl h-12 w-12 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm"
                    onClick={() => document.getElementById('section-chat-image-upload')?.click()}
                    disabled={!!imagePreview}
                  >
                    <ImageIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </Button>
                </div>

                {/* Send Button */}
                <Button
                  type="submit"
                  disabled={(!values.content.trim() && !imagePreview) || !!(imageFile && !imagePreview)}
                  className="rounded-2xl h-12 px-6 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  <Send className="h-5 w-5 mr-2" />
                  <span className="font-medium">Send</span>
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default SocketSectionChatTab
