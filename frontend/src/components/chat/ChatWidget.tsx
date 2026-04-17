import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../Context/AuthContext";
import api from "../../api/axios";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    // Connect socket
    const newSocket = io("http://localhost:3000", {
      withCredentials: true,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join", user.id);
    });

    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    fetchConversations();

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await api.get("/chats/conversations");
      setConversations(res.data.conversations);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const res = await api.get(`/chats/messages/${conversationId}`);
      setMessages(res.data.messages);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversation || !socket) return;

    const receiverId = activeConversation.participant1Id === user?.id 
      ? activeConversation.participant2Id 
      : activeConversation.participant1Id;

    const payload = {
      conversationId: activeConversation.id,
      senderId: user?.id,
      receiverId,
      content: inputText,
    };

    socket.emit("sendMessage", payload);
    setInputText("");
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition z-40 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden" style={{ height: '500px' }}>
          
          {/* Header */}
          <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">
              {activeConversation ? "Chat" : "Conversations"}
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!activeConversation ? (
            // Conversations List
            <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
              {conversations.length === 0 ? (
                <p className="text-center text-gray-500 mt-10 text-sm">No conversations yet.</p>
              ) : (
                conversations.map(conv => {
                  const otherUser = conv.participant1Id === user.id ? conv.participant2 : conv.participant1;
                  return (
                    <div 
                      key={conv.id} 
                      onClick={() => setActiveConversation(conv)}
                      className="p-3 bg-white rounded-lg shadow-sm mb-2 cursor-pointer hover:bg-gray-50 border border-gray-100 flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex justify-center items-center font-bold">
                        {otherUser?.name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">{otherUser?.name || "User"}</h4>
                        <p className="text-xs text-gray-500 truncate">
                          {conv.messages?.[0]?.content || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            // Active Conversation Map
            <>
              <div className="bg-gray-100 p-2 text-xs flex gap-2 items-center">
                <button onClick={() => setActiveConversation(null)} className="text-purple-600 hover:underline">
                  &larr; Back
                </button>
                <span className="text-gray-600 truncate">
                  Chatting with {
                    activeConversation.participant1Id === user.id ? activeConversation.participant2?.name : activeConversation.participant1?.name
                  }
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-white">
                {messages.map(msg => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] p-3 rounded-xl text-sm ${isMe ? "bg-purple-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-3 border-t flex gap-2 bg-gray-50">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </>
          )}

        </div>
      )}
    </>
  );
}
