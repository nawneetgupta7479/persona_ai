import React, { useState, useRef, useEffect } from "react";

const PromptInput = ({ onSend, loading }) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onSend(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1 relative">
        <input
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-5 py-4 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none"
          placeholder="Ask your question in Hinglish..."
          rows={1}
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className={`px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-center min-w-[100px] font-medium ${
          loading || !prompt.trim()
            ? "bg-gray-700/50 text-white/50 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/20 hover:scale-105 transform"
        }`}
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          "Send"
        )}
      </button>
    </form>
  );
};

export default PromptInput;