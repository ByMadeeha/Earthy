/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined. AI features will run in simulation mode.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // ----------------------------------------------------
  // API Routes
  // ----------------------------------------------------

  // 1. Healthcheck endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      aiConfigured: !!process.env.GEMINI_API_KEY
    });
  });

  // 2. Chat Advisory Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, deviceContext } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      const hasApiKey = !!process.env.GEMINI_API_KEY;
      if (!hasApiKey) {
        // Simulation mode
        setTimeout(() => {
          const lowerMsg = message.toLowerCase();
          let reply = "Hello! I am your Earthy energy co-pilot. I can help you optimize your home's electricity consumption. Since the Gemini API key is currently running in trial/mock mode, here is a helpful smart-home insight: ";
          
          if (lowerMsg.includes("refrigerator") || lowerMsg.includes("fridge")) {
            reply += "Your refrigerator runs 24/7. Cleaning its condenser coils and maintaining a 2cm gap from the wall can improve efficiency by up to 15%, reducing your monthly cost by about $3.50.";
          } else if (lowerMsg.includes("ac") || lowerMsg.includes("air conditioner") || lowerMsg.includes("cool")) {
            reply += "Increasing your thermostat by just 1°C can save roughly 6-10% on your cooling costs. Try scheduling your AC to pre-cool your home during off-peak morning hours.";
          } else if (lowerMsg.includes("carbon") || lowerMsg.includes("footprint")) {
            reply += "Your current home carbon footprint is equivalent to about 180kg CO2 per month. Toggling off standby power on inactive gaming consoles or chargers is the fastest way to save 5kg CO2 immediately.";
          } else {
            reply += "A typical smart home can reduce standby power leaks by up to 12% simply by using automated power schedules on plugs. Try setting rules for lights and water heaters to turn off when you go to sleep.";
          }
          return res.json({ reply, mode: "simulation" });
        }, 1000);
        return;
      }

      const ai = getGeminiClient();

      // Build system prompt incorporating current smart device stats
      const devicesSummary = deviceContext && Array.isArray(deviceContext)
        ? deviceContext.map((d: any) => `- ${d.name} in ${d.room}: ${d.status ? 'ON' : 'OFF'} (drawing ${d.powerUsage}W, daily usage ${d.dailyKwh} kWh, efficiency ${d.efficiencyScore}%)`).join("\n")
        : "None connected";

      const systemInstruction = `You are Earthy, a warm, highly intelligent, eco-friendly AI Smart Home Energy Specialist. 
Your goal is to help users understand, reduce, and optimize their home's electricity consumption and carbon footprint.
Be encouraging, helpful, peaceful, and professional. Speak with earth-conscious terminology (inspired by rivers, forests, winds, and oceans).

The user's current connected home profile is as follows:
${devicesSummary}

Respond conversationally, concisely, and with practical, actionable earth-saving advice. Keep answers clean, and formatted beautifully in markdown. Do not talk about database models or code files.`;

      // Structure contents with history
      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        history.forEach((h: any) => {
          contents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        });
      }
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ reply: response.text || "I was unable to analyze that. Let's try adjusting the energy settings together.", mode: "live" });

    } catch (error: any) {
      console.error("Gemini Chat Error:", error);
      res.status(500).json({ error: "Failed to connect with Earthy AI. Using ecological backup core.", details: error.message });
    }
  });

  // 3. AI Smart Home Audit / Diagnostics Endpoint (Returns Structured JSON)
  app.post("/api/audit", async (req, res) => {
    try {
      const { devices, regionalRate } = req.body;

      const hasApiKey = !!process.env.GEMINI_API_KEY;
      if (!hasApiKey) {
        // Simulation mode response
        setTimeout(() => {
          const simulatedAudit = {
            overallScore: 84,
            summary: "Your smart home energy flows are relatively healthy, resembling a clean woodland stream. However, standby power consumption in the Living Room acts as a minor dam to your sustainable flow.",
            hotspots: [
              "Living Room Standby Leak (TV, entertainment stack drawing 28W persistently)",
              "Kitchen Fridge coil health (cooling cycles are 12% longer than peak performance)"
            ],
            customRecommendations: [
              {
                appliance: "Living Room TV & Console",
                issue: "High standby power draw (vampire load) of 28W while not in active use.",
                environmentalImpact: "Consumes about 20.1 kWh per month, emitting 8.4kg of unnecessary CO2.",
                action: "Create a smart schedule in Earthy to kill plug power between 12:00 AM and 6:00 AM.",
                estimatedSavings: 3.02
              },
              {
                appliance: "Air Conditioner",
                issue: "Running 1.5°C lower than the recommended eco-thermostat point of 24°C.",
                environmentalImpact: "Increasing thermal work, leading to high daily spikes of 14.5 kWh.",
                action: "Turn on the Climate Guard preset to modulate the temperature automatically based on humidity.",
                estimatedSavings: 11.45
              }
            ],
            environmentalEquivalent: "Completing these actions is equivalent to planting 3 pine trees or preventing a 42-kilometer car ride."
          };
          return res.json(simulatedAudit);
        }, 1200);
        return;
      }

      const ai = getGeminiClient();

      const devicesList = Array.isArray(devices)
        ? devices.map((d: any) => `${d.name} (${d.room}): Status ${d.status ? 'ON' : 'OFF'}, Current power: ${d.powerUsage}W, Daily consumption: ${d.dailyKwh} kWh, Efficiency: ${d.efficiencyScore}%`).join("\n")
        : "No active devices";

      const prompt = `Conduct a deep smart home energy audit for the following household devices:
${devicesList}
The regional electricity rate is $${regionalRate || 0.15}/kWh.

Provide a highly personalized energy audit structured as JSON. Use the provided JSON schema to structure your analysis.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are Earthy, a detailed smart home energy diagnostic system. Your task is to output high-fidelity diagnostics inside structured JSON.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: {
                type: Type.INTEGER,
                description: "An overall environmental score from 0 to 100, where 100 is perfectly carbon-neutral."
              },
              summary: {
                type: Type.STRING,
                description: "A beautiful, organic overview of the home's current footprint and sustainable trends."
              },
              hotspots: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific devices or areas with elevated consumption or wasteful behaviors."
              },
              customRecommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    appliance: { type: Type.STRING },
                    issue: { type: Type.STRING },
                    environmentalImpact: { type: Type.STRING },
                    action: { type: Type.STRING },
                    estimatedSavings: { type: Type.NUMBER, description: "Monthly financial savings in currency" }
                  },
                  required: ["appliance", "issue", "environmentalImpact", "action", "estimatedSavings"]
                }
              },
              environmentalEquivalent: {
                type: Type.STRING,
                description: "A beautiful infographic sentence translating these savings into equivalent trees planted or driving avoided."
              }
            },
            required: ["overallScore", "summary", "hotspots", "customRecommendations", "environmentalEquivalent"]
          }
        }
      });

      const auditText = response.text;
      if (!auditText) {
        throw new Error("No response from Gemini API");
      }

      const parsedAudit = JSON.parse(auditText);
      res.json(parsedAudit);

    } catch (error: any) {
      console.error("Gemini Audit Error:", error);
      res.status(500).json({ error: "Failed to perform AI smart energy audit.", details: error.message });
    }
  });

  // ----------------------------------------------------
  // Vite Middleware & Static Serves
  // ----------------------------------------------------

  if (process.env.NODE_ENV !== "production") {
    console.log("Configuring Vite in middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving pre-built assets in production...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Earthy full-stack server launched on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server startup failure:", err);
});
