import { useState, useRef, useEffect } from 'react'
import { Send, Smile, Calendar, Cloud, User, MoreVertical, CheckCircle2, Circle } from 'lucide-react'
import './App.css'

// --- Reusable Components ---

const BreathingWidget = () => {
  const [phase, setPhase] = useState('Inhale')
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (!active) return

    const cycle = [
      { text: 'Inhale', time: 4000 },
      { text: 'Hold', time: 4000 },
      { text: 'Exhale', time: 4000 }
    ]
    let currentStep = 0

    const runCycle = () => {
      setPhase(cycle[currentStep].text)
      const timeout = setTimeout(() => {
        currentStep = (currentStep + 1) % cycle.length
        runCycle()
      }, cycle[currentStep].time)
      return timeout
    }

    const timer = runCycle()
    return () => clearTimeout(timer)
  }, [active])

  return (
    <div className="widget-card breathing-widget">
      <div className="widget-header">
        <Cloud size={18} className="icon" />
        <span>Breathing Exercise</span>
      </div>
      <div className="breathing-visual">
        <div className={`circle-ring ${phase.toLowerCase()}`}>
          <div className="circle-core"></div>
        </div>
        <div className="phase-text">{phase}</div>
      </div>
      <p className="instruction">Focus on your breath. Follow the rhythm.</p>
    </div>
  )
}

const ScheduleWidget = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Wait up & Stretch", checked: true },
    { id: 2, text: "Drink Water", checked: false },
    { id: 3, text: "Read a Book", checked: false },
    { id: 4, text: "Take a Walk", checked: false },
  ])

  const toggleItem = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ))
  }

  return (
    <div className="widget-card schedule-widget">
      <div className="widget-header">
        <Calendar size={18} className="icon" />
        <span>Your Routine</span>
      </div>
      <ul className="schedule-list">
        {items.map(item => (
          <li key={item.id} className={item.checked ? 'completed' : ''} onClick={() => toggleItem(item.id)}>
            {item.checked ? <CheckCircle2 size={18} className="check-icon" /> : <Circle size={18} className="check-icon" />}
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// --- Main Chat Logic ---

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your support friend. How are you feeling right now?",
      type: 'text',
      isUser: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])
  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages, isTyping])

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return

    const userMsg = {
      id: Date.now(),
      text,
      type: 'text',
      isUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInputText("")
    setIsTyping(true)

    // Simulate AI Response Logic
    setTimeout(() => {
      const response = generateResponse(text)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        ...response,
        isUser: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setIsTyping(false)
    }, 1200)
  }

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase()

    // Emotion Analysis
    if (lowerInput.includes('sad') || lowerInput.includes('upset') || lowerInput.includes('cry')) {
      return { text: "I'm sorry you're feeling down. Take a deep breath with me.", type: 'breathing' }
    }
    if (lowerInput.includes('happy') || lowerInput.includes('good') || lowerInput.includes('great')) {
      return { text: "I'm so glad to hear that! Keep smiling! 😊", type: 'text' }
    }
    if (lowerInput.includes('anxiety') || lowerInput.includes('panic') || lowerInput.includes('scared')) {
      return { text: "Let's pause. Follow this breathing exercise to calm down.", type: 'breathing' }
    }

    // Commands
    if (lowerInput.includes('schedule') || lowerInput.includes('routine') || lowerInput.includes('plan')) {
      return { text: "Here is your routine for today.", type: 'schedule' }
    }
    if (lowerInput.includes('breathe') || lowerInput.includes('calm')) {
      return { text: "Here is a calming exercise.", type: 'breathing' }
    }

    return { text: "I'm here for you. Tell me if you want to 'see my schedule' or try a 'breathing' exercise.", type: 'text' }
  }

  const renderMessageContent = (msg) => {
    switch (msg.type) {
      case 'breathing':
        return (
          <>
            <p className="msg-text">{msg.text}</p>
            <BreathingWidget />
          </>
        )
      case 'schedule':
        return (
          <>
            <p className="msg-text">{msg.text}</p>
            <ScheduleWidget />
          </>
        )
      default:
        return <p className="msg-text">{msg.text}</p>
    }
  }

  const quickActions = [
    { label: "Happy 😊", text: "I feel happy!" },
    { label: "Anxious 😰", text: "I feel anxious." },
    { label: "Schedule 📅", text: "Show my schedule." },
  ]

  return (
    <div className="mobile-view">
      {/* Header */}
      <header className="app-header">
        <div className="header-left">
          <div className="avatar">
            <User size={20} color="white" />
          </div>
          <div className="header-info">
            <h1>SafeSpace Bot</h1>
            <span className="status-dot">Online</span>
          </div>
        </div>
        <button className="menu-btn"><MoreVertical size={20} /></button>
      </header>

      {/* Chat Area */}
      <div className="chat-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.isUser ? 'user-row' : 'bot-row'}`}>
            {!msg.isUser && <div className="bot-avatar-small"><User size={14} /></div>}
            <div className={`message-bubble ${msg.isUser ? 'user-bubble' : 'bot-bubble'}`}>
              <div className="message-content">
                {renderMessageContent(msg)}
              </div>
              <div className="message-meta">{msg.time}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-row bot-row">
            <div className="bot-avatar-small"><User size={14} /></div>
            <div className="message-bubble bot-bubble typing">
              <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="quick-suggestions">
          {quickActions.map((action, idx) => (
            <button key={idx} onClick={() => handleSendMessage(action.text)} className="chip">
              {action.label}
            </button>
          ))}
        </div>
        <div className="input-bar">
          <button className="icon-btn"><Smile size={24} /></button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={() => handleSendMessage()}
            className={`send-btn ${inputText.trim() ? 'active' : ''}`}
            disabled={!inputText.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
