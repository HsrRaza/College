import { GoogleGenerativeAI } from "@google/generative-ai"
import React, { useState } from 'react'
import Header from './components/Header'
import HomeScript from './components/HomeScript'
import Message from "./components/Message";
import OpenAI from "openai";


function App() {

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const [message, setMessage] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)


  const defaultMessages = [
    { role: "user", content: "Hi" },
    { role: "assistant", content: "Hey! I am your coding assistant. Let me know what you need." }
  ];

 const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = { role: "user", content: input };
  setMessage((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);

  try {
    const systemPrompt = `
      You are a professional AI coding assistant.
      - Reply with clean explanations
      - Use headings & paragraphs
      - Include syntax-highlighted code blocks
      - Give step-by-step reasoning
      - Focus on coding, debugging, errors, optimizations
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: input }
    ]);

    const response = result.response.text();

    setMessage((prev) => [
      ...prev,
      { role: "assistant", content: response }
    ]);

  } catch (error) {
    console.error("AI Error:", error);
    setMessage((prev) => [
      ...prev,
      { role: "assistant", content: "⚠️ Error: Something went wrong." }
    ]);
  }

  setLoading(false);
};




  return (
    <div className="bg-stone-950 text-stone-300 h-screen p-4">
      <div className='p-5 w-[70%] mx-auto '>

        <Header />

        <div className='h-[70vh] bg-black rounded-2xl shadow-xl overflow-y-auto'>

          {/* <HomeScript />
           */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {[...defaultMessages, ...message].map((msg, i) => (
              <div
                key={i}
              // className={`p-3 rounded-xl text-stone-100 text-xl max-w-xl ${msg.role === "user"
              //     ? "bg-purple-500 self-end ml-auto"
              //     : "bg-purple-600"
              //   }`}
              >
                <pre className="whitespace-pre-wrap"> <Message key={i} role={msg.role} content={msg.content} /></pre>
              </div>
            ))}

            {/* Bot typing indicator */}
            {loading && (
              <div className="p-3 rounded-xl bg-purple-600 max-w-xs">
                <div className="flex space-x-2">
                  <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>



        </div>
        <div className="mt-2 flex gap-2 shadow-2xl ">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask coding question..."
            className="flex-1 p-4 outline-none text-2xl bg-black rounded-2xl overflow-x-hidden  overflow-y-auto  "
            onKeyDown={(e) => {
              if(e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
           />
          <button
            onClick={sendMessage}
            className="bg-stone-600 px-6 py-3 rounded-xl hover:bg-stone-700 text-stone-200  focus:ring-2 "
          >
            Send
          </button>
        </div>

      </div>
    </div >

  )
}

export default App
