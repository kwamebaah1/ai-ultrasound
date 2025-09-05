'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ChatBot from '@/components/Chatbot/ChatBot'

export default function ChatPage() {
  const [chatSessions, setChatSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        fetchChatSessions(user.id)
      } else {
        setLoading(false)
      }
    }
    getUser()
  }, [])

  const fetchChatSessions = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          chat_messages (
            id,
            content,
            role,
            created_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setChatSessions(data || [])
      
      if (data && data.length > 0 && !selectedSession) {
        setSelectedSession(data[0])
      }
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const createNewSession = async () => {
    try {
      if (!user) return
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([
          {
            user_id: user.id,
            title: 'New Chat'
          }
        ])
        .select(`
          *,
          chat_messages (
            id,
            content,
            role,
            created_at
          )
        `)
        .single()

      if (error) throw error
      
      setChatSessions(prev => [data, ...prev])
      setSelectedSession(data)
      return data
    } catch (error) {
      console.error('Error creating chat session:', error)
      return null
    }
  }

  const deleteSession = async (sessionId) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error
      
      setChatSessions(prev => prev.filter(session => session.id !== sessionId))
      if (selectedSession?.id === sessionId) {
        setSelectedSession(chatSessions.find(session => session.id !== sessionId) || null)
      }
    } catch (error) {
      console.error('Error deleting chat session:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="w-1/4 pr-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Chat History</h2>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm p-6 h-full">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/*<div className="w-1/4 pr-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
          <button
            onClick={createNewSession}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            New Chat
          </button>
        </div>
        <div className="space-y-2">
          {chatSessions.map(session => (
            <div 
              key={session.id} 
              className={`p-3 rounded-lg cursor-pointer group ${
                selectedSession?.id === session.id 
                  ? 'bg-blue-100' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedSession(session)}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm font-medium truncate flex-1">
                  {session.title || 'New Chat'}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 ml-2"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(session.created_at).toLocaleDateString()}
              </p>
              {session.chat_messages && session.chat_messages.length > 0 && (
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {session.chat_messages[0].content.substring(0, 50)}...
                </p>
              )}
            </div>
          ))}
          
          {chatSessions.length === 0 && (
            <div className="p-3 rounded-lg bg-gray-100">
              <p className="text-sm text-gray-500">No chat history yet.</p>
            </div>
          )}
        </div>
      </div>*/}
      
      <div className="flex-1">
        <ChatBot 
          session={selectedSession}
          onNewSession={() => fetchChatSessions(user?.id)}
          onSessionUpdate={() => fetchChatSessions(user?.id)}
          fullPage={true}
          user={user}
        />
      </div>
    </div>
  )
}