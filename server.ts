import express from "express";
import path from "path";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const server = http.createServer(app);
const PORT = 3000;

// Initialize Gemini AI Client
const getGeminiAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Barmawar Travel Online Server" });
});

// REST API: Generate Travel Itinerary using Gemini 3.6 Flash + Search Grounding
app.post("/api/generate-itinerary", async (req, res) => {
  try {
    const { destination, days = 5, budget = "Moderate", travelStyle = "Balanced", group = "Couple" } = req.body;
    if (!destination) {
      return res.status(400).json({ error: "Destination is required" });
    }

    const ai = getGeminiAI();
    const prompt = `You are a master travel planner for Barmawar Travel Online. Generate a comprehensive, day-by-day travel itinerary for a ${days}-day trip to ${destination}.
Budget: ${budget}
Travel Style: ${travelStyle}
Group Type: ${group}

Respond in valid JSON format matching this structure:
{
  "destination": "${destination}",
  "durationDays": ${days},
  "totalEstimatedCost": "$1200 - $1800 per person",
  "bestTimeToVisit": "October to April",
  "tripOverview": "A brief 2-3 sentence overview of why this trip is special.",
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1 Title",
      "summary": "Short overview of the day",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity Name",
          "description": "Detailed activity description",
          "location": "Specific place name",
          "estimatedCost": "$25",
          "category": "sightseeing"
        }
      ]
    }
  ],
  "packingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "localCuisineToTry": ["Dish 1", "Dish 2", "Dish 3"]
}
Ensure activity category is one of: sightseeing, food, transport, leisure, stay.
Provide authentic, real place names and realistic prices.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "{}";
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    // Extract grounding chunks if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let groundingSources: { title: string; url: string }[] = [];
    if (chunks && Array.isArray(chunks)) {
      groundingSources = chunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({
          title: c.web.title || c.web.uri,
          url: c.web.uri,
        }));
    }

    res.json({ itinerary: data, groundingSources });
  } catch (err: any) {
    console.error("Error generating itinerary:", err);
    res.status(500).json({ error: err.message || "Failed to generate itinerary" });
  }
});

// REST API: Book Ticket / Voucher Generator
app.post("/api/book-ticket", (req, res) => {
  const { type, itemTitle, passengerName, passengerEmail, passengerPhone, travelDate, totalAmount, currency = "$" } = req.body;
  const pnr = "BTO-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const id = "BK-" + Date.now().toString().slice(-6);

  const booking = {
    id,
    type: type || "package",
    pnr,
    itemTitle: itemTitle || "Barmawar Customized Tour Package",
    subtitle: `Travel Date: ${travelDate || 'Flexible'}`,
    details: {
      "Agency": "Barmawar Travel Online",
      "Customer": passengerName || "Valued Traveler",
      "Email": passengerEmail || "guest@example.com",
      "Phone": passengerPhone || "+1 (800) BARMAWAR",
      "Status": "CONFIRMED & GUARANTEED",
    },
    passengerName: passengerName || "Valued Traveler",
    passengerEmail: passengerEmail || "guest@example.com",
    passengerPhone: passengerPhone || "+1 (800) BARMAWAR",
    totalAmount: totalAmount || 499,
    currency,
    bookingDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    travelDate: travelDate || "Upcoming",
    status: "Confirmed",
    paymentMethod: "Instant Payment / Verified",
    qrData: `PNR:${pnr}|ID:${id}|PASS:${passengerName}`,
  };

  res.json({ success: true, booking });
});

// Setup WebSocket Server for Gemini Multimodal Live API
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", async (clientWs: WebSocket) => {
  console.log("Client connected to /live-travel-agent WebSocket");
  let sessionPromise: Promise<any> | null = null;

  try {
    const ai = getGeminiAI();

    sessionPromise = ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        systemInstruction: `You are "Barmawar AI Voice Travel Concierge", the official AI voice assistant for Barmawar Travel Online.
You speak clearly, warmly, and helpfully with travelers inquiring about flights, hotels, holiday tour packages, cab rentals, and custom travel itineraries.
When users ask for flight suggestions, hotel recommendation, or tour packages, give clear, inviting recommendations and use function tools if applicable.`,
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        tools: [
          {
            functionDeclarations: [
              {
                name: "searchFlights",
                description: "Find available flights for origin and destination",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    from: { type: Type.STRING, description: "Origin city or code" },
                    to: { type: Type.STRING, description: "Destination city or code" },
                  },
                  required: ["from", "to"],
                },
              },
              {
                name: "searchHotels",
                description: "Search hotels at destination",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    destination: { type: Type.STRING, description: "City or country" },
                  },
                  required: ["destination"],
                },
              },
              {
                name: "suggestPackage",
                description: "Suggest a tour package",
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    destination: { type: Type.STRING, description: "Package destination e.g., Kashmir, Dubai, Maldives, Bali" },
                  },
                  required: ["destination"],
                },
              },
            ],
          },
        ],
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          // Send audio output chunk back to client
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio) {
            clientWs.send(JSON.stringify({ type: "audio", audio }));
          }

          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ type: "interrupted" }));
          }

          // Transcriptions
          const modelText = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (modelText) {
            clientWs.send(JSON.stringify({ type: "text", sender: "assistant", text: modelText }));
          }

          // Tool calls from Live API
          const toolCalls = message.toolCall?.functionCalls;
          if (toolCalls && toolCalls.length > 0) {
            for (const call of toolCalls) {
              clientWs.send(
                JSON.stringify({
                  type: "tool_call",
                  name: call.name,
                  args: call.args,
                  id: call.id,
                })
              );
            }
          }
        },
        onclose: () => {
          console.log("Gemini Live session closed.");
        },
        onerror: (err: any) => {
          console.error("Gemini Live session error:", err);
          clientWs.send(JSON.stringify({ type: "error", error: err.message || "Live API session error" }));
        },
      },
    });

    const session = await sessionPromise;

    clientWs.on("message", async (data: Buffer) => {
      try {
        const payload = JSON.parse(data.toString());
        if (payload.type === "audio" && payload.audio) {
          session.sendRealtimeInput({
            audio: {
              data: payload.audio,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        } else if (payload.type === "text" && payload.text) {
          session.sendRealtimeInput({
            text: payload.text,
          });
        } else if (payload.type === "tool_response") {
          session.sendToolResponse({
            functionResponses: [
              {
                id: payload.id,
                name: payload.name,
                response: payload.response || { result: "success" },
              },
            ],
          });
        }
      } catch (err) {
        console.error("Error processing client WS message:", err);
      }
    });

    clientWs.on("close", () => {
      if (session) {
        try {
          session.close();
        } catch {
          // ignore
        }
      }
    });
  } catch (err: any) {
    console.error("Failed to connect Gemini Live session:", err);
    clientWs.send(JSON.stringify({ type: "error", error: err.message || "Failed to initialize voice assistant" }));
  }
});

// Upgrade HTTP requests for WebSocket
server.on("upgrade", (request, socket, head) => {
  const pathname = request.url;
  if (pathname === "/live-travel-agent") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Start express server with Vite or Static
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Barmawar Travel Online server running on http://localhost:${PORT}`);
  });
}

startServer();
