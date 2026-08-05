import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, Send, RefreshCw, Compass, Plane, Hotel, CheckCircle2, Bot, User } from 'lucide-react';
import { pcmToBase64, base64ToAudioBuffer } from '../utils/audioUtils';
import { TranscriptMessage, LiveToolCall, FlightOption, HotelOption, PackageOption } from '../types';
import { MOCK_FLIGHTS, MOCK_HOTELS, MOCK_PACKAGES } from '../data/travelData';

interface LiveVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFlight: (flight: FlightOption) => void;
  onSelectHotel: (hotel: HotelOption) => void;
  onSelectPackage: (pkg: PackageOption) => void;
}

export const LiveVoiceAssistant: React.FC<LiveVoiceAssistantProps> = ({
  isOpen,
  onClose,
  onSelectFlight,
  onSelectHotel,
  onSelectPackage,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLiveListening, setIsLiveListening] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am Barmawar AI Voice Concierge. Ask me about flights, hotels, holiday packages, or custom travel itineraries!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [toolCalls, setToolCalls] = useState<LiveToolCall[]>([]);
  const [voiceVolume, setVoiceVolume] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll transcript
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts, toolCalls]);

  // Handle Voice Session Start/Stop
  const startLiveVoiceSession = async () => {
    try {
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Connect to server WebSocket endpoint
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live-travel-agent`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnected(true);
        setIsLiveListening(true);
        
        // Setup Audio Contexts
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        inputAudioCtxRef.current = inputCtx;
        outputAudioCtxRef.current = outputCtx;
        nextStartTimeRef.current = outputCtx.currentTime;

        // Capture Mic
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            
            // Measure simple volume for visualizer
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) {
              sum += Math.abs(inputData[i]);
            }
            setVoiceVolume(Math.min(100, Math.round((sum / inputData.length) * 500)));

            const base64PCM = pcmToBase64(inputData);
            ws.send(JSON.stringify({ type: 'audio', audio: base64PCM }));
          }
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'audio' && msg.audio) {
            // Play back 24kHz PCM chunk
            if (outputAudioCtxRef.current) {
              const ctx = outputAudioCtxRef.current;
              const buffer = base64ToAudioBuffer(msg.audio, ctx);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);

              const now = ctx.currentTime;
              const startTime = Math.max(now, nextStartTimeRef.current);
              source.start(startTime);
              nextStartTimeRef.current = startTime + buffer.duration;
            }
          } else if (msg.type === 'text') {
            setTranscripts((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                sender: msg.sender || 'assistant',
                text: msg.text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          } else if (msg.type === 'tool_call') {
            handleLiveToolCall(msg);
          } else if (msg.type === 'interrupted') {
            // Clear audio queue if user interrupted
            if (outputAudioCtxRef.current) {
              nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
            }
          }
        } catch (err) {
          console.error("Error parsing WS message:", err);
        }
      };

      ws.onclose = () => {
        stopLiveVoiceSession();
      };

      ws.onerror = (err) => {
        console.error("WS Live Assistant Error:", err);
        stopLiveVoiceSession();
      };
    } catch (err: any) {
      console.error("Failed to start voice stream:", err);
      alert("Microphone permission or audio connection failed: " + err.message);
      stopLiveVoiceSession();
    }
  };

  const stopLiveVoiceSession = () => {
    setIsLiveListening(false);
    setIsConnected(false);
    setVoiceVolume(0);

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // Process Tool Calls received from Live AI Voice Concierge
  const handleLiveToolCall = (toolMsg: any) => {
    const { name, args, id } = toolMsg;
    
    let resultData: any = {};
    if (name === 'searchFlights') {
      resultData = { flights: MOCK_FLIGHTS };
    } else if (name === 'searchHotels') {
      resultData = { hotels: MOCK_HOTELS };
    } else if (name === 'suggestPackage') {
      resultData = { packages: MOCK_PACKAGES };
    }

    setToolCalls((prev) => [
      ...prev,
      {
        name,
        args,
        result: resultData,
      },
    ]);

    // Send tool result back to session
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'tool_response',
          id,
          name,
          response: { status: 'success', data: resultData },
        })
      );
    }
  };

  const handleSendTextMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: TranscriptMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTranscripts((prev) => [...prev, userMsg]);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'text', text: inputText }));
    } else {
      // Offline fallback simulated response
      setTimeout(() => {
        setTranscripts((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: `I've received your query about "${inputText}". Connecting you with top options now!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 600);
    }

    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                Barmawar AI Voice Concierge
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  Gemini Live WebSocket
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isLiveListening ? '🎙️ Live Voice Session Active • Ask Anything' : 'Click microphone to start voice conversation'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopLiveVoiceSession();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Visualizer / Status Banner */}
        <div className="bg-slate-950/90 border-b border-slate-800 p-4 flex flex-col items-center justify-center gap-3">
          <div className="relative flex items-center justify-center">
            {/* Animated rings */}
            {isLiveListening && (
              <>
                <div
                  className="absolute w-24 h-24 rounded-full bg-cyan-500/20 animate-ping"
                  style={{ animationDuration: '2s' }}
                ></div>
                <div
                  className="absolute w-20 h-20 rounded-full bg-blue-500/20 animate-pulse"
                  style={{ transform: `scale(${1 + voiceVolume / 100})` }}
                ></div>
              </>
            )}

            <button
              onClick={isLiveListening ? stopLiveVoiceSession : startLiveVoiceSession}
              className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105 ${
                isLiveListening
                  ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-rose-500/40 ring-4 ring-rose-500/30 animate-pulse'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/30 hover:shadow-cyan-500/50'
              }`}
            >
              {isLiveListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>
          </div>

          <div className="text-center">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isLiveListening
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveListening ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
              {isLiveListening ? 'Microphone On • Speaking & Listening' : 'Tap Microphone to Start Voice AI'}
            </span>
          </div>

          {/* Prompt chips */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xl">
            {[
              'Plan a 5-day Kashmir tour under $500',
              'Find 5-star ocean villas in Maldives',
              'Show non-stop flights to Dubai',
              'Suggest romantic honeymoon packages',
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInputText(prompt);
                  if (!isLiveListening) {
                    startLiveVoiceSession();
                  }
                }}
                className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-200 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
              >
                💡 {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Transcript Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-900/50">
          {transcripts.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-tr from-indigo-500 to-purple-600'
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                }`}
              >
                <p className="font-medium text-[13px]">{msg.text}</p>
                <span className="text-[10px] opacity-60 mt-1 block text-right">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {/* Active Tool Result Cards from AI Voice */}
          {toolCalls.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Live Recommendations Found:
              </p>

              {/* Package Suggestions */}
              {toolCalls.some((t) => t.name === 'suggestPackage') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_PACKAGES.slice(0, 2).map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex gap-3 hover:border-cyan-500 transition-all cursor-pointer"
                      onClick={() => onSelectPackage(pkg)}
                    >
                      <img src={pkg.image} alt={pkg.title} className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{pkg.title}</h4>
                        <p className="text-[10px] text-slate-400">{pkg.destination}</p>
                        <p className="text-xs font-extrabold text-cyan-400 mt-2">${pkg.price} / person</p>
                        <button className="mt-1 text-[10px] bg-cyan-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                          View & Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Flight Suggestions */}
              {toolCalls.some((t) => t.name === 'searchFlights') && (
                <div className="space-y-2">
                  {MOCK_FLIGHTS.slice(0, 2).map((fl) => (
                    <div
                      key={fl.id}
                      className="bg-slate-800 border border-slate-700 rounded-2xl p-3 flex items-center justify-between hover:border-cyan-500 transition-all cursor-pointer"
                      onClick={() => onSelectFlight(fl)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700 rounded-xl">
                          <Plane className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{fl.airline} ({fl.flightNumber})</p>
                          <p className="text-[10px] text-slate-400">{fl.fromCode} → {fl.toCode} • {fl.duration}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-cyan-400">${fl.price}</p>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                          Select
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Text Input Footer */}
        <form onSubmit={handleSendTextMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your travel query or speak into microphone..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>
      </div>
    </div>
  );
};
