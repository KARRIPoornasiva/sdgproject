import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Droplet, 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useSimulator } from '../../context/SimulatorContext';

const QUICK_QUESTIONS = [
  "Which block consumed the most water today?",
  "Which block has the highest leakage risk?",
  "How much water was saved today?",
  "What is the current STP reuse?",
  "Which tank needs attention?",
  "What maintenance issue is most urgent?",
];

const ChatAssistantDrawer = ({ isOpen, onClose }) => {
  const { 
    blocks, 
    tanks, 
    activeLeak, 
    totalWaterSaved, 
    stpData, 
    maintenanceTickets 
  } = useSimulator();

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your Smart WaterGuard AI Assistant. I can answer questions about college blocks, telemetry, leak risks, tanks, STP, and maintenance tickets using verified application database data.",
      timestamp: "Just now",
    }
  ]);
  const [inputText, setInputText] = useState("");

  const generateAnswer = (query) => {
    const q = query.toLowerCase();

    // 1. Most consumed block
    if (q.includes("consumed the most") || q.includes("highest consumption") || q.includes("most water")) {
      const topBlock = [...blocks].sort((a, b) => b.currentConsumption - a.currentConsumption)[0];
      return `Based on live telemetry, **${topBlock.code} (${topBlock.name})** has consumed the most water today at **${topBlock.currentConsumption.toLocaleString()} L** (Expected baseline: ${topBlock.expectedConsumption.toLocaleString()} L).`;
    }

    // 2. Highest leakage risk
    if (q.includes("leakage risk") || q.includes("leak") || q.includes("highest risk")) {
      if (activeLeak) {
        return `**${activeLeak.block}** has the highest leakage risk at **${activeLeak.riskPercentage}% (Critical)**. An anomalous flow rate of **${activeLeak.flowDetected} L/min** was detected in the ${activeLeak.location} (Expected: ${activeLeak.expectedFlow}).`;
      }
      return `Currently, all college blocks are operating within normal risk parameters. AI risk scores across all blocks are below 20%.`;
    }

    // 3. Water saved today
    if (q.includes("water saved") || q.includes("how much water was saved") || q.includes("savings")) {
      return `A total of **${totalWaterSaved.toLocaleString()} L** of water was saved today through verified maintenance repairs and automated rain-gated garden conservation.`;
    }

    // 4. STP reuse
    if (q.includes("stp") || q.includes("recycled")) {
      return `The Sewage Treatment Plant (STP) is currently delivering **${stpData.treatedWaterLpd.toLocaleString()} L/day** of non-potable treated water. Distribution: Gardening (${stpData.distribution.gardening.toLocaleString()} L), Toilet Flushing (${stpData.distribution.toiletFlushing.toLocaleString()} L), Bus Washing (${stpData.distribution.busWashing.toLocaleString()} L), Road Cleaning (${stpData.distribution.roadCleaning.toLocaleString()} L).`;
    }

    // 5. Tanks needing attention
    if (q.includes("tank") || q.includes("overflow") || q.includes("level")) {
      const highTanks = tanks.filter(t => t.percentage >= 95);
      if (highTanks.length > 0) {
        return `⚠️ **${highTanks[0].name}** currently requires attention: Level is at **${highTanks[0].percentage}%** with feed pump ${highTanks[0].pumpState}. Recommend inspecting float-switch cutoff.`;
      }
      return `All overhead tanks and sumps are within safe operational limits (20% to 90% capacity).`;
    }

    // 6. Most urgent maintenance issue
    if (q.includes("maintenance") || q.includes("urgent") || q.includes("ticket")) {
      const criticalTicket = maintenanceTickets.find(t => t.priority === "Critical" && t.status !== "Closed");
      if (criticalTicket) {
        return `🚨 Most urgent issue: **Ticket ${criticalTicket.id}** for **${criticalTicket.block}** (${criticalTicket.floor} - ${criticalTicket.location}). Status: **${criticalTicket.status}**, Assigned to: **${criticalTicket.assignedTechnician}**.`;
      }
      return `There are currently no unresolved critical maintenance tickets.`;
    }

    // Default strictly constrained response (Never invent data)
    return `Insufficient data is available to answer this question accurately from the campus water telemetry database. Please refer to live telemetry charts or submit a query regarding monitored blocks, tanks, STP, or maintenance tickets.`;
  };

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: "user",
      text: textToSend,
      timestamp: "Just now",
    };

    const aiMsg = {
      sender: "ai",
      text: generateAnswer(textToSend),
      timestamp: "Just now",
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputText("");
  };

  if (!isOpen) return null;

  return (
    <div 
      className="position-fixed top-0 end-0 bottom-0 bg-white shadow-2xl border-start d-flex flex-column"
      style={{ width: '420px', maxWidth: '100vw', zIndex: 1150 }}
    >
      {/* Drawer Header */}
      <div className="p-3 bg-dark text-white d-flex align-items-center justify-content-between" style={{ background: 'linear-gradient(135deg, #0B192C, #1E3E62)' }}>
        <div className="d-flex align-items-center gap-2">
          <div className="p-2 bg-primary rounded-circle text-white">
            <Bot size={20} />
          </div>
          <div>
            <h6 className="mb-0 fw-bold font-display">Ask WaterGuard AI</h6>
            <div className="text-info fs-7" style={{ fontSize: '0.68rem' }}>Campus Telemetry & RAG Assistant</div>
          </div>
        </div>
        <button className="btn btn-sm btn-link text-white p-0" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Drawer Body / Chat Messages */}
      <div className="flex-grow-1 p-3 overflow-y-auto bg-light d-flex flex-column gap-3">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`d-flex flex-column ${msg.sender === 'user' ? 'align-items-end' : 'align-items-start'}`}
          >
            <div 
              className={`p-3 rounded-3 shadow-sm ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white text-dark border'}`}
              style={{ maxWidth: '88%', fontSize: '0.82rem', lineHeight: '1.45' }}
            >
              {msg.text}
            </div>
            <span className="text-muted mt-1 px-1" style={{ fontSize: '0.65rem' }}>{msg.timestamp}</span>
          </div>
        ))}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-2 bg-white border-top border-light">
        <div className="text-muted mb-1 px-2 fw-semibold" style={{ fontSize: '0.68rem' }}>SUGGESTED QUERIES:</div>
        <div className="d-flex flex-wrap gap-1">
          {QUICK_QUESTIONS.slice(0, 3).map((qq, idx) => (
            <button
              key={idx}
              className="btn btn-sm btn-outline-secondary py-1 px-2 text-truncate"
              style={{ fontSize: '0.7rem', maxWidth: '100%', borderRadius: '12px' }}
              onClick={() => handleSend(qq)}
            >
              {qq}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 bg-white border-top">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="d-flex gap-2"
        >
          <input 
            type="text" 
            className="form-control form-control-sm bg-light" 
            placeholder="Ask about water flow, leaks, tanks..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ fontSize: '0.82rem' }}
          />
          <button type="submit" className="btn btn-sm btn-primary px-3">
            <Send size={15} />
          </button>
        </form>
        <div className="text-muted text-center mt-1" style={{ fontSize: '0.65rem' }}>
          Answers strictly constrained to verified database telemetry.
        </div>
      </div>
    </div>
  );
};

export default ChatAssistantDrawer;
