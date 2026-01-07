import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Mic, Radio, Terminal, BrainCircuit, ChevronRight, Send } from 'lucide-react';
import { SystemMetric, LapData } from '../types';

interface RaceStrategyAIProps {
  metrics: SystemMetric[];
  laps: LapData[];
  gapAhead: string;
  gapBehind: string;
}

const RaceStrategyAI: React.FC<RaceStrategyAIProps> = ({ metrics, laps, gapAhead, gapBehind }) => {
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Radio check. Strategy systems online. Monitoring telemetry." }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isThinking) return;
    
    // Allow empty input to trigger a "general update"
    const userQuery = input.trim();
    if (userQuery) {
        setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    } else {
        // If empty, treat as a "Report status" command
        setMessages(prev => [...prev, { role: 'user', text: "Report Status" }]);
    }
    
    setInput('');
    setIsThinking(true);

    try {
      // Construct a prompt context from current app state
      const tireWear = metrics.find(m => m.name === 'Tire Wear')?.value || 0;
      const fuel = "1.2KG over target"; // Simulated
      const lastLap = laps[0];
      const bestLap = laps.reduce((prev, current) => (prev.lapTime < current.lapTime) ? prev : current);
      
      const context = `
        Role: F1 Race Engineer (calm, precise, brief).
        Car Data:
        - Tire Wear: ${tireWear}% (Soft C3)
        - Fuel: ${fuel}
        - Gap Ahead: +${gapAhead}s
        - Gap Behind: +${gapBehind}s
        - Last Lap: ${lastLap?.lapTime} (S1: ${lastLap?.s1}, S2: ${lastLap?.s2})
        - Personal Best: ${bestLap?.lapTime}
        
        User Question: "${userQuery || "General strategy update"}"
        
        Instructions: 
        1. Answer the specific user question if present.
        2. If no specific question, give a strategic recommendation.
        3. Keep it under 25 words. 
        4. Use F1 terminology (e.g., "Box to overtake", "Lift and coast", "Manage rears").
        5. Output ONLY the radio message text.
      `;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: context,
      });

      const text = response.text.trim();
      setMessages(prev => [...prev, { role: 'ai', text: text }]);
      
    } catch (error) {
      console.error("Strategy Gen Failed", error);
      setMessages(prev => [...prev, { role: 'ai', text: "Telemetry link unstable. Repeat." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black border border-scada-border overflow-hidden relative group">
       {/* Header */}
       <div className="flex justify-between items-center p-2 border-b border-scada-border shrink-0 bg-zinc-900/50">
        <h3 className="text-xs font-mono text-scada-text uppercase tracking-wide flex items-center gap-2">
           <BrainCircuit size={12} className="text-scada-blue" /> Race Engineer
        </h3>
        <div className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-scada-amber animate-ping' : 'bg-scada-green'}`}></span>
            <span className="text-[9px] text-zinc-500 font-mono">LIVE</span>
        </div>
      </div>

      {/* Chat Log */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-[10px] scrollbar-thin">
         {messages.map((msg, idx) => (
             <div key={idx} className={`flex gap-2 ${msg.role === 'ai' ? 'items-start' : 'items-center justify-end'}`}>
                 {msg.role === 'ai' && <Radio size={10} className="text-scada-blue mt-0.5 shrink-0" />}
                 <div className={`${msg.role === 'ai' ? 'text-scada-primary bg-white/5 border-scada-blue' : 'text-zinc-400 bg-zinc-900 border-zinc-700'} px-2 py-1.5 rounded-sm border-l-2 max-w-[90%]`}>
                     {msg.text}
                 </div>
             </div>
         ))}
         <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 border-t border-scada-border bg-black">
          <form onSubmit={handleSendMessage} className="flex gap-2">
             <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Race Control..."
                  disabled={isThinking}
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white text-[10px] font-mono py-2 pl-2 pr-8 focus:outline-none focus:border-scada-blue/50 placeholder:text-zinc-700"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                   {isThinking ? <Mic size={10} className="text-scada-amber animate-pulse" /> : <Terminal size={10} className="text-zinc-600" />}
                </div>
             </div>
             <button 
                type="submit"
                disabled={isThinking}
                className="bg-scada-blue/10 hover:bg-scada-blue/20 text-scada-blue border border-scada-blue/30 p-2 transition-colors"
             >
                <Send size={12} />
             </button>
          </form>
      </div>
    </div>
  );
};

export default RaceStrategyAI;