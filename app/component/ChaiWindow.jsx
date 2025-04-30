import React, { useEffect, useRef } from "react";
import Markdown from "react-markdown";

const ChatWindow = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
    <div className="h-full overflow-y-auto px-4 md:px-6 pt-4 pb-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-white/50">
          <div className="text-center p-6 max-w-md backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10 shadow-xl">
            <div className="text-5xl mb-4">🧠</div>
            <h3 className="text-xl font-medium mb-3 text-white">Welcome to CodeGuru Mentor</h3>
            <p className="text-sm text-white/70">
              Select a mentor and start asking questions in Hinglish. Our AI will respond in the style of your chosen coding mentor.
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`animate-fadeIn ${
              msg.role === "user"
                ? "pl-0 md:pl-10"
                : "pr-0 md:pr-10"
            }`}
          >
            <div className={`px-6 py-4 rounded-2xl ${
              msg.role === "user"
                ? "bg-indigo-600/20 border border-indigo-500/30 text-white ml-auto max-w-[90%]"
                : msg.persona === "hitesh"
                ? "bg-indigo-950/30 border border-indigo-500/20 text-white/90 max-w-[90%]"
                : msg.persona === "piyush"
                ? "bg-purple-950/30 border border-purple-500/20 text-white/90 max-w-[90%]"
                : "bg-gray-800/40 border border-gray-700 text-white/80 max-w-[90%]"
            }`}>
              <p className="font-medium mb-2 flex items-center text-sm opacity-80">
                {msg.role === "user"
                  ? "You"
                  : msg.persona === "hitesh"
                  ? "Hitesh Sir"
                  : msg.persona === "piyush"
                  ? "Piyush Sir"
                  : "System"}
              </p>
              <div className="text-sm md:text-base prose prose-invert max-w-none prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4">
                <Markdown>{msg.text}</Markdown>
              </div>
            </div>
          </div>
        ))
      )}
      {loading && (
        <div className="flex items-center space-x-2 px-5 py-3 rounded-full bg-gray-800/30 w-fit">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150"></div>
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300"></div>
          <span className="text-sm text-white/60 ml-2">Typing...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;