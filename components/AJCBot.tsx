import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { Product, Shipment } from '../types';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AJCBotProps {
  products: Product[];
  shipments: Shipment[];
}

const AVAILABLE_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3.0 Pro' },
];

const AJCBot: React.FC<AJCBotProps> = ({ products, shipments }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am AJC-Bot. I have access to the live logistics database. How can I assist you with stock levels or shipment tracking today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0].id);
  const [showModelSelector, setShowModelSelector] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Serialize current data to provide context to the LLM
      const dataContext = `
      DATE: ${new Date().toLocaleDateString()}

      LIVE INVENTORY DATA:
      ${products.length > 0 
        ? products.map(p => `- Product: ${p.name} | Category: ${p.category} | Stock: ${p.stock_level} ${p.unit} | Location: ${p.location}`).join('\n')
        : 'No products found in database.'}

      LIVE SHIPMENT DATA:
      ${shipments.length > 0
        ? shipments.map(s => `- Tracking ID: ${s.tracking_number} | Status: ${s.status} | Product: ${s.product_name} | Route: ${s.origin} -> ${s.destination} | ETA: ${s.eta}`).join('\n')
        : 'No active shipments found.'}
      `;

      const systemInstruction = `
        You are AJC-Bot, a specialized AI assistant for AJC International. 
        AJC is a global leader in marketing frozen foods (poultry, pork, beef, seafood, vegetables, fries) and logistics.
        
        **CRITICAL: Use the provided "LIVE INVENTORY DATA" and "LIVE SHIPMENT DATA" above to answer specific questions.** 
        If a user asks about stock, look at the inventory data. If they ask about a shipment, look at the shipment data.
        If the data is not in the context provided, politely say you don't have that information.
        
        Key Business Context:
        - Connecting agricultural producers with global markets.
        - AJC Logistics provides transport solutions.
        
        Directives:
        1. **Formatting**: You MUST use Markdown for all responses. Use bolding (**text**) for key terms, bullet points for lists.
        2. **Language**: Detect the language of the user's message. If they speak Spanish, reply in Spanish. If English, reply in English.
        3. **Tone**: Professional, efficient, helpful.
        
        Data Context:
        ${dataContext}
      `;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: [
            ...messages.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const text = response.text || "I apologize, I could not generate a response.";
      
      setMessages(prev => [...prev, { role: 'model', text: text }]);

    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the AJC knowledge base right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-ajc-blue text-white p-4 rounded-full shadow-lg hover:bg-blue-800 transition-transform transform hover:scale-110 z-50 ${isOpen ? 'hidden' : 'block'}`}
      >
        <i className="fas fa-robot text-2xl"></i>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-ajc-blue text-white p-4 flex justify-between items-start">
            <div>
                <div className="flex items-center gap-2">
                    <i className="fas fa-robot"></i>
                    <h3 className="font-bold">AJC-Bot Assistant</h3>
                </div>
                
                {/* Status and Model Selector */}
                <div className="text-xs text-blue-200 mt-1 flex items-center gap-2 relative select-none">
                   <span className="flex items-center gap-1.5 bg-blue-900/30 px-2 py-0.5 rounded-full">
                      <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></span>
                      {isLoading ? 'Thinking...' : 'Online'}
                   </span>
                   <span className="text-blue-300">|</span>
                   <div className="relative">
                       <button
                         onClick={() => setShowModelSelector(!showModelSelector)}
                         className="hover:text-white flex items-center gap-1 transition-colors font-medium"
                       >
                          {AVAILABLE_MODELS.find(m => m.id === selectedModel)?.name}
                          <i className={`fas fa-chevron-down text-[10px] transition-transform duration-200 ${showModelSelector ? 'rotate-180' : ''}`}></i>
                       </button>

                       {/* Model Dropdown */}
                       {showModelSelector && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl text-gray-800 py-1 z-50 border border-gray-100 animate-in fade-in zoom-in-95 duration-100">
                              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider">Select Model</div>
                              {AVAILABLE_MODELS.map(m => (
                                  <button
                                     key={m.id}
                                     onClick={() => { setSelectedModel(m.id); setShowModelSelector(false); }}
                                     className={`w-full text-left px-4 py-2 text-xs hover:bg-blue-50 flex items-center justify-between group ${selectedModel === m.id ? 'font-bold text-ajc-blue bg-blue-50' : 'text-gray-600'}`}
                                  >
                                      {m.name}
                                      {selectedModel === m.id && <i className="fas fa-check text-ajc-blue"></i>}
                                  </button>
                              ))}
                          </div>
                       )}
                   </div>
                </div>
            </div>
            
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50" onClick={() => setShowModelSelector(false)}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.role === 'user' ? (
                    msg.text
                  ) : (
                    <ReactMarkdown 
                      className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ul:pl-4 prose-li:my-0 text-gray-800"
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-lg rounded-bl-none p-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about AJC Logistics..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white text-black"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-ajc-blue text-white rounded-lg px-4 py-2 hover:bg-blue-800 disabled:opacity-50 transition-colors"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AJCBot;