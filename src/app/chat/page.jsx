'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import ChatBot from '@/components/ChatBot/ChatBot'

export default function ChatPage() {
  const [chatSessions, setChatSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChatSessions()
  }, [])

  const fetchChatSessions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setChatSessions(data || [])
    } catch (error) {
      console.error('Error fetching chat sessions:', error)
    } finally {
      setLoading(false)
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
      <div className="w-1/4 pr-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Chat History</h2>
        <div className="space-y-2">
          {chatSessions.map(session => (
            <div 
              key={session.id} 
              className={`p-3 rounded-lg cursor-pointer ${
                selectedSession?.id === session.id 
                  ? 'bg-blue-100' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedSession(session)}
            >
              <p className="text-sm font-medium truncate">
                {session.title || 'New Chat'}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(session.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
          
          {chatSessions.length === 0 && (
            <div className="p-3 rounded-lg bg-gray-100">
              <p className="text-sm text-gray-500">No chat history yet.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        <ChatBot 
          session={selectedSession}
          onNewSession={fetchChatSessions}
          fullPage={true}
        />
      </div>
    </div>
  )
}