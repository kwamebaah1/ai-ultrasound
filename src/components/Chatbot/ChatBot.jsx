'use client';
import { useState, useRef, useEffect } from 'react';
import { FiSend, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import MessageBubble from './MessageBubble';
import { supabase } from '@/lib/supabase';

const ChatBot = ({ initialAdvice, diagnosis, confidence, session, onNewSession, onSessionUpdate, fullPage = false, user }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState(session);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (session) {
      setCurrentSession(session);
      if (session.chat_messages && session.chat_messages.length > 0) {
        setMessages(session.chat_messages);
      } else if (initialAdvice) {
        setMessages([{ role: 'assistant', content: initialAdvice }]);
      }
    } else if (initialAdvice) {
      setMessages([{ role: 'assistant', content: initialAdvice }]);
    }
  }, [session, initialAdvice]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveMessage = async (sessionId, message) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: message.role,
          content: message.content
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const updateSessionTitle = async (sessionId, firstMessage) => {
    try {
      const title = firstMessage.content.substring(0, 50) + (firstMessage.content.length > 50 ? '...' : '');
      
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId);

      if (error) throw error;
      
      if (onSessionUpdate) onSessionUpdate();
    } catch (error) {
      console.error('Error updating session title:', error);
    }
  };

  const createNewSession = async () => {
    try {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([
          {
            user_id: user.id,
            title: 'New Chat'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      setCurrentSession(data);
      if (onNewSession) onNewSession();
      return data;
    } catch (error) {
      console.error('Error creating chat session:', error);
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    let currentSessionId = currentSession?.id;

    // If no session exists, create one
    if (!currentSessionId) {
      const newSession = await createNewSession();
      if (newSession) {
        currentSessionId = newSession.id;
      } else {
        console.error('Failed to create chat session');
        return;
      }
    }

    // Add user message to UI
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Save user message to database
    await saveMessage(currentSessionId, userMessage);

    // If this is the first message, update session title
    if (messages.length === 0 && newMessages.length === 1) {
      await updateSessionTitle(currentSessionId, userMessage);
    }

    try {
      const filteredMessages = newMessages
        .filter((msg, idx) => msg.role && msg.content?.trim())
        .slice(-6); // Keep last 6 messages for context

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: diagnosis && confidence
                ? `You are a helpful medical assistant. The user has received a breast ultrasound diagnosis of "${diagnosis}" with ${confidence.toFixed(1)}% confidence. Be empathetic, provide clear explanations, and guide users to consult healthcare professionals for definitive diagnosis. Keep responses concise but helpful.`
                : 'You are a helpful medical assistant specializing in breast ultrasound analysis. Provide clear, empathetic explanations and always recommend consulting with healthcare professionals for definitive diagnosis.',
            },
            ...filteredMessages
          ]
        }),
      });

      const result = await response.json();

      if (result.assistant) {
        const assistantMessage = { role: 'assistant', content: result.assistant };
        setMessages(prev => [...prev, assistantMessage]);
        await saveMessage(currentSessionId, assistantMessage);
      } else if (result.error) {
        console.error('Assistant returned error:', result.error, result.details);
        const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
        setMessages(prev => [...prev, errorMessage]);
        await saveMessage(currentSessionId, errorMessage);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
      if (currentSessionId) {
        await saveMessage(currentSessionId, errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (fullPage) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>Start a conversation with the medical assistant</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <MessageBubble 
                key={index}
                message={message}
                isFirst={index === 0}
              />
            ))
          )}
          {loading && (
            <MessageBubble 
              message={{ role: 'assistant', content: 'Thinking...' }}
              isLoading={true}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question about your diagnosis..."
              className="flex-1 px-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
            >
              <FiSend size={16} />
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-medium text-gray-800">AI Medical Assistant</h3>
        <button
          onClick={() => setShowFullPage(true)}
          className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-gray-100 transition-colors"
          title="Expand chat"
        >
          <FiMaximize2 size={16} />
        </button>
      </div>

      <div className="h-48 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <MessageBubble 
            key={index}
            message={message}
            isFirst={index === 0}
          />
        ))}
        {loading && (
          <MessageBubble 
            message={{ role: 'assistant', content: '...' }}
            isLoading={true}
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 text-sm text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <FiSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;