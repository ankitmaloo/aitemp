import { useEffect, useRef, useState } from 'react'

export interface WebSocketMessage {
  type: string
  status?: string
  message?: string
  chunk?: string
  is_final?: boolean
  persona_id?: string
  data?: any
}

// Global WebSocket instance to prevent multiple connections
let globalWs: WebSocket | null = null
let globalConnectionPromise: Promise<WebSocket> | null = null
let messageHandlers: Set<(message: WebSocketMessage) => void> = new Set()

const createConnection = (url: string): Promise<WebSocket> => {
  if (globalConnectionPromise) {
    return globalConnectionPromise
  }

  globalConnectionPromise = new Promise((resolve, reject) => {
    console.log('Creating single WebSocket connection to:', url)
    
    const ws = new WebSocket(url)
    
    ws.onopen = () => {
      console.log('WebSocket connected successfully')
      globalWs = ws
      resolve(ws)
    }

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        // Broadcast to all handlers
        messageHandlers.forEach(handler => handler(message))
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason)
      globalWs = null
      globalConnectionPromise = null
      
      // Try to reconnect after 3 seconds if it wasn't a clean close
      if (!event.wasClean && event.code !== 1000) {
        console.log('Attempting to reconnect in 3 seconds...')
        setTimeout(() => {
          createConnection(url)
        }, 3000)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      globalWs = null
      globalConnectionPromise = null
      reject(error)
    }
  })

  return globalConnectionPromise
}

export function useWebSocket(url: string) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const messageHandlerRef = useRef<((message: WebSocketMessage) => void) | null>(null)

  const setMessageHandler = (handler: (message: WebSocketMessage) => void) => {
    // Remove old handler if exists
    if (messageHandlerRef.current) {
      messageHandlers.delete(messageHandlerRef.current)
    }
    
    // Add new handler
    messageHandlerRef.current = handler
    messageHandlers.add(handler)
  }

  const sendMessage = (message: any) => {
    console.log('sendMessage called, ws state:', globalWs?.readyState, 'OPEN:', WebSocket.OPEN)
    if (globalWs?.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message)
      try {
        globalWs.send(JSON.stringify(message))
        return true
      } catch (error) {
        console.error('Error sending message:', error)
        return false
      }
    }
    console.log('Cannot send - WebSocket not open')
    return false
  }

  useEffect(() => {
    setIsConnecting(true)
    
    // Use existing connection or create new one
    if (globalWs?.readyState === WebSocket.OPEN) {
      setIsConnected(true)
      setIsConnecting(false)
    } else {
      createConnection(url)
        .then(() => {
          setIsConnected(true)
          setIsConnecting(false)
        })
        .catch(() => {
          setIsConnecting(false)
        })
    }

    // Cleanup on unmount
    return () => {
      if (messageHandlerRef.current) {
        messageHandlers.delete(messageHandlerRef.current)
      }
    }
  }, [url])

  return {
    isConnected,
    isConnecting,
    sendMessage,
    setMessageHandler
  }
}