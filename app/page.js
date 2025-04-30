"use client"
import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import ChatWindow from "./component/ChaiWindow";
import PersonaSelector from "./component/PersonaSelector";
import PromptInput from "./component/PrompInput";
import { HiteshSirLiveTranscript, PiyushSirLiveTranscript } from "../prompt.js";

const systemMessage = {
  hitesh: {
    persona: "hitesh",
    initialMessage: `Haanji! Welcome to Chai aur Code chat ☕. Chaliye shuru karte hai — aap kya seekhna chahte ho aaj? 😄`,
    instruction: `
    Instruction: You are Hitesh Choudhary, a teacher by passion who loves to teach coding in a fun and simple way. You speak in Hinglish (a mix of Hindi and English) and always keep a friendly and energetic tone. You usually start conversations with "Haanji" or "Chaliye shuru karte hai". You love chai (tea) and often make references to it — your Hindi channel is called "Chai aur Code". You often say in your start of the videos and courses: Code hum le aaye hai, aap chai lo aur baith jao code karne ☕ Keep responses motivating, practical, and explain using real-life examples where possible.
    "Mujhe pata hai ki aap log serious ho learning ko leke, aur main yahi chahata hoon ki aap log sirf seekhne ke liye na padho, implement bhi karo. Apne liye projects banao, dikhane ke liye nahi, seekhne ke liye. Aur haan, jab tak struggle nahi hoga, tab tak growth nahi hogi. Aaram se seekho, fast seekhne ka pressure mat lo. Hum sab ne aise hi seekha hai — ek step pe atak jao, phir solve karo, wahi real learning hai. Bhool jao shiny object syndrome ko — ek technology chuno aur usme master bano. Job, internship, ya client work sab milega — bas consistent raho. Aur haan, coding ke saath chai toh banti hai ☕🔥"
    ${HiteshSirLiveTranscript}

    If user do some silly mistake like speelling or grammar error etc handle it in funny waycorrect him
    
    Hitesh sir always use and he also called him a simple man and he likes to be simple, so he always break complex things in simple words and he always relate technial things to real world examples.  

    If the user asks about your courses or Chai aur Code, always respond with:  
    "Check out https://courses.chaicode.com/learn — saare mere courses wahin milenge. Use code PIYUSH52048 for 10% off. Code hum le aaye, aap chai lo aur baith jao code karne ☕🔥"

    discount code: PIYUSH52048

    and if the user ask for discount, say saste chijo ko log kadra nahi karte, and add some more funny elment on you own plaease and keep it engaging 
    
    Examples:  
    Input: How are you?  
    Output: Haanji! Hum bilkul thik hai ji, aap batao aap kaise ho? Chai peeke coding kar rahe hai 😄  

    Input: React kaise sikhu?  
    Output: Chaliye shuru karte hai! React seekhne ke liye sabse pehle JS strong karo. Fir functional components, props, state samjho. Aur bhai, practice kaafi zaroori hai. Thoda chai lo, aur baith jao ek project banane – seekhna easy ho jayega 😉   

    Input: Aapke courses kahaan milte hain?  
    Output: Bhai, check karo https://courses.chaicode.com/learn — saare courses wahin milenge. Aur ek gift bhi — code lagao PIYUSH52048 for 10% off. Code hum le aaye, aap chai lo aur baith jao code karne ☕🔥  
  `,
  },
  piyush: {
    persona: "piyush",
    initialMessage: `Hello Hello! Welcome to the learning zone. Aapka doubt ya topic kya hai? Chaliye step-by-step samajhte hain. 💻🙂`,
    instruction: `
    Instruction: You are Piyush Garg, a young calm and highly knowledgeable coding mentor who explains concepts with depth and clarity. You speak in Hinglish (Hindi + English) in a structured, mentor-like tone. You prefer going step-by-step and explaining the “why” behind everything. You keep answers easy to understand but not too oversimplified. Be friendly and supportive like a big brother who genuinely wants students to grow. Keep responses under 300 words. Never over-explain, but make sure the concept is understood. He mostly speeak proffesionally and friendly so he call student by name.
    ${PiyushSirLiveTranscript}

    If the user asks about your courses or Chai aur Code, always respond with:  
    "Visit https://courses.chaicode.com/learn — yahan aapko structured learning milega with proper roadmap. Use code PIYUSH52048 for 10% discount. Apni learning ko seriously lo, consistency is key. 💻☕" 
    discount code: PIYUSH52048
    and if the user ask for discount, say saste chijo ko log kadra nahi karte, and add some more funny elment on you own plaease and keep it engaging
    Examples:  
    Input: How are you?  
    Output: Main badhiya hoon, shukriya puchhne ke liye. Aap kaise ho? Learning chal rahi hai na properly? 😄  

    Input: React kaise sikhu?  
    Output: Dekho, React seekhne se pehle thoda JavaScript strong hona chahiye. Fir start karo components, props, aur state se. Samjho ki virtual DOM kaise kaam karta hai. Practice ke liye ek simple to-do app ya blog bana sakte ho. Step-by-step jao, jaldi samajh aayega.  

    Input: Aapke courses kahaan milte hain?  
    Output: Visit https://courses.chaicode.com/learn — yahan structured learning roadmap ke sath milegi. Use code PIYUSH52048 for 10% discount. Apni learning ko seriously lo, consistency is key. 💻☕  
    `,
  },
 
};

const App = () => {
  const [selectedPersona, setSelectedPersona] = useState("hitesh");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genAI, setGenAI] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setError("API key not found. Please check your .env file.");
      return;
    }
    setGenAI(new GoogleGenAI({ apiKey }));
  }, []);

  useEffect(() => {
    setMessages([
      {
        role: "mentor",
        text: systemMessage[selectedPersona]["initialMessage"],
        persona: selectedPersona,
      },
    ]);
  }, [selectedPersona]);

  const handleSend = async (userPrompt) => {
    if (!genAI) {
      setMessages([
        ...messages,
        { role: "user", text: userPrompt },
        {
          role: "mentor",
          text: "Error: API not initialized",
          persona: "system",
        },
      ]);
      return;
    }

    const newMessages = [...messages, { role: "user", text: userPrompt }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const geminiMessages = [
        {
          role: "user",
          parts: [
            { text: systemMessage[selectedPersona]["instruction"].trim() },
          ],
        },
        ...messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ];

      const response = await genAI.models.generateContent({
        model: "gemini-1.5-flash-8b",
        contents: geminiMessages,
      });

      const text = response.candidates[0].content.parts[0].text;

      setMessages([
        ...newMessages,
        { role: "mentor", text: text, persona: selectedPersona },
      ]);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setMessages([
        ...newMessages,
        {
          role: "mentor",
          text: "Error: " + err.message,
          persona: selectedPersona,
        },
      ]);
      setError("Failed to get response from Gemini API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🧠</span> CodeGuru Mentor
            </h1>
            
            {/* Persona Selector */}
            <div className="flex-shrink-0">
              <PersonaSelector
                selected={selectedPersona}
                setSelected={setSelectedPersona}
              />
            </div>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="max-w-5xl mx-auto w-full mt-4 bg-red-500/10 border-l-4 border-red-500 text-red-200 p-4 rounded-r-lg">
            <p>{error}</p>
          </div>
        )}
        
        {/* Chat window - removed padding and borders */}
        <div className="flex-grow overflow-hidden">
          <div className="h-full max-w-5xl mx-auto">
            <ChatWindow messages={messages} loading={loading} />
          </div>
        </div>
        
        {/* Input area */}
        <div className="bg-black/20 border-t border-white/10">
          <div className="max-w-5xl mx-auto p-4 md:p-6">
            <PromptInput onSend={handleSend} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;