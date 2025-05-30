import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import { useSendMessage } from "@/queries/messages/mutations";
import { useAuth } from "@/app/context/AuthContext";
import { Message, MessagesResponse } from "./types";
import { toast } from "react-hot-toast";

interface MessageListProps {
  selectedConversation: any | null;
}

const POLLING_INTERVAL = 2000; // 2 seconds

const MessageList = ({ selectedConversation }: MessageListProps) => {
  const { user } = useAuth();
  const { mutateAsync: sendMessage, isPending: isSending, error : sendMessageError } = useSendMessage();
  const [isLoading, setIsLoading] = React.useState(false);
  const [messagesData, setMessagesData] = React.useState<MessagesResponse | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesData]);

  const fetchMessages = async () => {
    if (!user?.user?.id || !selectedConversation?.id) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/get-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          senderId: user.user.id,
          receiverId: selectedConversation.id,
        }),
      });

      const data = await response.json();
      setMessagesData(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      timeoutRef.current = setTimeout(fetchMessages, POLLING_INTERVAL);
    }
  };

  useEffect(() => {
    if (!selectedConversation?.id || !user?.user?.id) return;

    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user?.user?.id, selectedConversation?.id]);

  const messages = messagesData?.result || [];

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user?.user?.id) return;

    try {
      const res = await sendMessage({
        senderId: user.user.id,
        receiverId: selectedConversation.id,
        content,
        images: [],
      });
      console.log("Message sent successfully:", res);
      await fetchMessages();
    } catch (error : any) {
      toast.error("You cannot send negative messages");
    }
  };

  return (
    <Card className="flex-1 flex flex-col rounded-none h-full py-0">
      <div className="p-4 border-b border-gray-200 flex items-center h-[80px]">
        {selectedConversation ? (
          <>
            <Avatar className="h-10 w-10 mr-3">
              <AvatarFallback>
                {selectedConversation.name?.split(" ")[0][0]}
                {selectedConversation.name?.split(" ")[1]?.[0]}
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

      <ScrollArea  className="flex-1 h-full p-4 overflow-auto">
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
                  message.senderId === user?.user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.senderId === user?.user?.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {message.senderId === user?.user?.id && (
                      <span className="text-xs text-muted-foreground">
                        {message.seen ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
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
        <div ref={scrollRef}></div>
      </ScrollArea>

      {selectedConversation && (
        <div className="sticky bottom-0">
          <MessageInput onSend={handleSendMessage} disabled={isSending} />
        </div>
      )}
    </Card>
  );
};

export default MessageList;
