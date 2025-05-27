"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import React, { useEffect, useRef, useState } from "react"
import MessageInput from "./MessageInput"
import { useSendMessage } from "@/queries/messages/mutations"
import { useAuth } from "@/app/context/AuthContext"
import type { Message, MessagesResponse } from "./types"
import { toast } from "react-hot-toast"
import io from "socket.io-client"
import Image from "next/image"
import { CheckCheck, Loader2, X } from "lucide-react"
import { uploadImage } from "@/utils/helper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageIcon, Send } from "lucide-react"

interface MessageListProps {
  selectedConversation: any | null
}

interface SocketMessage {
  success: boolean
  senderId: string
  receiverId: string
  error: string | null
  data: Message | null
}

interface AllMessagesResponse {
  success: boolean
  data?: Message[]
  error?: string
}

interface DeleteMessageResponse {
  success: boolean
  data?: string
  senderId?: string
  recieverId?: string
  error?: string | null
}

// Create socket connection
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? "https://capstone-class-bridge.onrender.com", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  auth: {
    token: localStorage.getItem("token"),
  },
})

const SocketMessageList = ({ selectedConversation }: MessageListProps) => {
  const { user } = useAuth()
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage()
  const [isLoading, setIsLoading] = React.useState(false)
  const [messagesData, setMessagesData] = React.useState<MessagesResponse | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const socketInitialized = useRef(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current && messagesData?.result?.length) {
      const scrollToBottom = () => {
        const scrollElement = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight
        } else {
          // Fallback: try direct scroll on the ref element
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
          }
        }
      }

      // Use requestAnimationFrame for better timing
      requestAnimationFrame(() => {
        setTimeout(scrollToBottom, 50)
      })
    }
  }, [messagesData?.result?.length])

  // Additional scroll trigger for real-time messages
  useEffect(() => {
    if (messagesData?.result?.length) {
      const scrollToBottom = () => {
        const scrollElement = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement
        if (scrollElement) {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: "smooth",
          })
        }
      }

      const timeoutId = setTimeout(scrollToBottom, 100)
      return () => clearTimeout(timeoutId)
    }
  }, [messagesData?.result])

  // Socket connection and message handling
  useEffect(() => {
    if (!socketInitialized.current && user?.user?.id) {
      console.log("Initializing socket connection")

      // Handle incoming messages
      const handleReceiveMessage = (socketMessage: SocketMessage) => {
        console.log("Received socket message:", socketMessage)

        // Validate if message is for current conversation
        if (!selectedConversation?.id || !user?.user?.id) return

        const isRelevantMessage =
          (socketMessage.senderId === user.user.id && socketMessage.receiverId === selectedConversation.id) ||
          (socketMessage.senderId === selectedConversation.id && socketMessage.receiverId === user.user.id)

        if (!socketMessage.success) {
          toast.error(socketMessage.error ?? "Failed to send message")
          return
        }
        if (!isRelevantMessage) {
          console.log("Message not relevant for current conversation")
          return
        }

        if (!socketMessage.success) {
          toast.error("Failed to send message")
          return
        }
        const data = {
          recieverId: user.user.id,
          senderId: selectedConversation?.id,
        }
        console.log("EMitting", data)

        if (socketMessage.data) {
          setMessagesData((prev) => {
            if (!prev) {
              return {
                success: true,
                message: "Messages loaded",
                result: [socketMessage.data!],
              }
            }

            return {
              ...prev,
              result: [...prev.result, socketMessage.data!],
            }
          })
        }
      }

      // Handle initial messages fetch response
      const handleAllMessagesResponse = (response: AllMessagesResponse) => {
        console.log("Received all messages:", response)
        if (!response.success) {
          toast.error(response.error || "Failed to fetch messages")
          return
        }

        if (response.data) {
          setMessagesData({
            success: true,
            message: "Messages loaded",
            result: response.data,
          })
        }
        setIsLoading(false)
      }

      // Handle deleted message response
      const handleMessageDeleted = (response: DeleteMessageResponse) => {
        console.log("Message deleted response:", response)

        if (!response.success) {
          toast.error(response.error || "Failed to delete message")
          return
        }

        // Remove deleted message from state
        if (response.data) {
          setMessagesData((prev) => {
            if (!prev) return null
            return {
              ...prev,
              result: prev.result.filter((msg) => msg.id !== response.data),
            }
          })
          toast.success("Message deleted successfully")
        }
      }

      // Set up socket listeners
      socket.on("connect", () => {
        console.log("Socket connected")
      })

      socket.on("disconnect", () => {
        console.log("Socket disconnected")
      })

      socket.on("receive_message", handleReceiveMessage)
      socket.on("all_messages_response", handleAllMessagesResponse)

      socketInitialized.current = true

      // Cleanup
      return () => {
        console.log("Cleaning up socket listeners")
        socket.off("connect")
        socket.off("disconnect")
        socket.off("receive_message", handleReceiveMessage)
        socket.off("all_messages_response", handleAllMessagesResponse)
        socketInitialized.current = false
      }
    }
  }, [user?.user?.id, selectedConversation?.id])

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!selectedConversation?.id || !user?.user?.id) return

    setIsLoading(true)
    // Emit event to fetch all messages
    socket.emit("all_messages", {
      senderId: user.user.id,
      receiverId: selectedConversation.id,
    })
  }, [user?.user?.id, selectedConversation?.id])

  // Handle image file selection
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageRemove = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user?.user?.id) return
    let imageUrl = undefined
    if (imageFile) {
      const { url, error } = await uploadImage(imageFile)
      if (error) {
        toast.error("Failed to upload image")
        return
      }
      imageUrl = url
    }
    try {
      const messageData = {
        senderId: user.user.id,
        receiverId: selectedConversation.id,
        content,
        images: imageUrl ? [imageUrl] : [],
      }
      socket.emit("send_message", messageData)
      setImageFile(null)
      setImagePreview(null)
      setInputValue('')
    } catch (error: any) {
      toast.error(error.message || "Failed to send message")
    }
  }

  const messages = messagesData?.result || []

  return (
    <div className="flex flex-col w-full h-full max-h-full bg-gradient-to-b from-background to-muted/20">
      {/* Modern Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="px-6 py-4 flex items-center gap-4">
          {selectedConversation ? (
            <>
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20 transition-all duration-200 hover:ring-primary/40">
                  {selectedConversation.profile ? (
                    <Image
                      src={selectedConversation.profile || "/placeholder.svg"}
                      alt={selectedConversation.name}
                      width={48}
                      height={48}
                      unoptimized
                      loader={({ src }) => src}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-primary-foreground font-semibold text-lg">
                      {selectedConversation.name?.split(" ")[0][0]}
                      {selectedConversation.name?.split(" ")[1]?.[0]}
                    </AvatarFallback>
                  )}  
                </Avatar>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-foreground truncate">{selectedConversation.name}</h2>
                <p className="text-[12px] text-muted-foreground flex items-center gap-2">{selectedConversation.role}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
              <p className="text-muted-foreground">Select a conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto pb-20 w-full">
          <div className="px-4 py-6 space-y-4 min-h-full">
            {selectedConversation ? (
              isLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Loading messages...</p>
                </div>
              ) : messages.length > 0 ? (
                <>
                  {messages.map((message: Message, index: number) => {
                    const isCurrentUser = message.senderId === user?.user?.id
                    const isLastMessage = index === messages.length - 1
                    const showAvatar =
                      !isCurrentUser && (index === 0 || messages[index - 1]?.senderId !== message.senderId)

                    return (
                      <div
                        key={message.id}
                        className={`flex items-end gap-3 group ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        } ${isLastMessage ? "mb-4" : ""}`}
                      >
                        {!isCurrentUser && (
                          <div className="w-8 h-8 flex-shrink-0">
                            {showAvatar && (
                              <Avatar className="w-8 h-8">
                                {selectedConversation.profile ? (
                                  <Image
                                    src={selectedConversation.profile || "/placeholder.svg"}
                                    alt={selectedConversation.name}
                                    width={32}
                                    height={32}
                                    unoptimized
                                    loader={({ src }) => src}
                                    className="object-cover"
                                  />
                                ) : (
                                  <AvatarFallback className="bg-gradient-to-br from-secondary to-secondary/60 text-secondary-foreground text-xs">
                                    {selectedConversation.name?.split(" ")[0][0]}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                            )}
                          </div>
                        )}

                        <div className={`relative max-w-[70%] ${isCurrentUser ? "order-1" : ""}`}>
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                              isCurrentUser
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-card border border-border/50 text-card-foreground rounded-bl-md"
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
                              isCurrentUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {isCurrentUser && <CheckCheck className="w-3 h-3 text-primary/70" />}
                          </div>
                        </div>
                      </div>
                    )
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
              )
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-2xl">👋</span>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-foreground">Welcome to Chat</p>
                  <p className="text-xs text-muted-foreground">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Message Input */}
      {selectedConversation && (
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
                disabled={isSending}
              />
              {/* Image Upload Button */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  id="message-chat-image-upload"
                  style={{ display: 'none' }}
                  onChange={handleFileInputChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-2xl h-12 w-12 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm"
                  onClick={() => document.getElementById('message-chat-image-upload')?.click()}
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
                disabled={isSending || (!!imageFile && !imagePreview)}
              >
                <Send className="h-5 w-5 mr-2" />
                <span className="font-medium">Send</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SocketMessageList
