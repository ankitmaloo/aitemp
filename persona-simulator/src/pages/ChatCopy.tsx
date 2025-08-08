import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ArrowUp, Bot, ThumbsUp, ThumbsDown, Copy, RotateCcw, Wifi, WifiOff } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import { useWebSocket } from '@/hooks/useWebSocket'
import type { WebSocketMessage } from '@/hooks/useWebSocket'

interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
}

// Helper function to get user initials
const getUserInitials = (name: string = 'User') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function ChatCopy() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [streamingContent, setStreamingContent] = useState('')
    const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null)
    const streamingMessageRef = useRef<string>('')

    // WebSocket connection
    const { isConnected, isConnecting, sendMessage, setMessageHandler } = useWebSocket('ws://localhost:8000/ws')

    // Handle WebSocket messages
    useEffect(() => {
        setMessageHandler((message: WebSocketMessage) => {
            console.log('Received WebSocket message:', message)

            switch (message.type) {
                case 'status':
                    if (message.status === 'starting' || message.status === 'processing') {
                        setIsLoading(true)
                        setIsStreaming(false)
                    } else if (message.status === 'streaming') {
                        setIsLoading(false)
                        setIsStreaming(true)
                        streamingMessageRef.current = ''
                        setStreamingContent('')
                        // Create a new streaming message ID
                        setCurrentStreamingId(Date.now().toString())
                    }
                    break

                case 'chunk':
                    if (message.chunk && !message.is_final) {
                        streamingMessageRef.current += message.chunk
                        setStreamingContent(streamingMessageRef.current)
                    } else if (message.is_final) {
                        // Finalize the streaming message
                        const finalContent = streamingMessageRef.current
                        if (finalContent && currentStreamingId) {
                            const aiMessage: Message = {
                                id: currentStreamingId,
                                content: finalContent,
                                role: 'assistant',
                            }
                            setMessages(prev => [...prev, aiMessage])
                        }
                        setIsStreaming(false)
                        setStreamingContent('')
                        setCurrentStreamingId(null)
                        streamingMessageRef.current = ''
                    }
                    break

                case 'response':
                    if (message.status === 'completed') {
                        setIsLoading(false)
                        setIsStreaming(false)
                    }
                    break

                case 'error':
                    setIsLoading(false)
                    setIsStreaming(false)
                    setStreamingContent('')
                    toast.error(`Error: ${message.message}`)
                    break
            }
        })
    }, [currentStreamingId])

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content)
        toast.success('Message copied to clipboard!')
    }

    const handleRetry = (messageId: string) => {
        // Find the message and regenerate response
        const messageIndex = messages.findIndex(m => m.id === messageId)
        if (messageIndex > 0) {
            const userMessage = messages[messageIndex - 1]
            if (userMessage.role === 'user') {
                // Remove the AI message and regenerate
                setMessages(prev => prev.slice(0, messageIndex))

                // Send the same message again via WebSocket
                if (isConnected) {
                    const messageData = {
                        type: 'openai_chat',
                        data: {
                            input_text: userMessage.content,
                            model: 'gpt-4o-mini'
                        }
                    }
                    sendMessage(messageData)
                    toast.info('Regenerating response...')
                } else {
                    toast.error('WebSocket not connected')
                }
            }
        }
    }

    const handleSend = async () => {
        if (!input.trim() || !isConnected) {
            if (!isConnected) {
                toast.error('WebSocket not connected')
            }
            return
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input.trim(),
            role: 'user',
        }

        setMessages(prev => [...prev, userMessage])
        const messageText = input.trim()
        setInput('')

        // Send message via WebSocket
        const messageData = {
            type: 'openai_chat',
            data: {
                input_text: messageText,
                model: 'gpt-4o-mini'
            }
        }

        const success = sendMessage(messageData)
        if (!success) {
            toast.error('Failed to send message')
            // Remove the user message if sending failed
            setMessages(prev => prev.slice(0, -1))
            setInput(messageText) // Restore input
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <>
            {/* WebSocket Status Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="container mx-auto px-4 py-2 max-w-4xl">
                    <div className="flex items-center gap-2 text-sm">
                        {isConnecting ? (
                            <>
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                <span className="text-yellow-600 dark:text-yellow-400">Connecting to WebSocket...</span>
                            </>
                        ) : isConnected ? (
                            <>
                                <Wifi className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span className="text-green-600 dark:text-green-400">Connected</span>
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-4 h-4 text-red-600 dark:text-red-400" />
                                <span className="text-red-600 dark:text-red-400">Disconnected</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Messages - uses page scroll */}
            <div className="container mx-auto px-4 py-8 max-w-4xl pb-32 pt-20">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                        <Bot className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
                        <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
                        <p className="text-muted-foreground max-w-md">
                            Send a message to begin chatting with the AI via WebSocket. The connection status is shown above.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {messages.map((message) => (
                            <div key={message.id}>
                                {message.role === 'user' ? (
                                    /* User message with avatar and no timestamp */
                                    <div className="flex gap-3 justify-start max-w-full">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {getUserInitials()}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Card className="p-4 bg-gray-50 border-gray-200 dark:bg-blue-950/30 dark:border-none">
                                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                        {message.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                ) : (
                                    /* AI message without icon or border, full width for readability */
                                    <div className="w-full py-2">
                                        <div className="prose prose-base max-w-none dark:prose-invert">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {message.content}
                                            </ReactMarkdown>
                                        </div>

                                        {/* Action buttons and timestamp for AI messages only */}
                                        <div className="flex items-center justify-between mt-6 pt-2 border-t border-border/20">

                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-600 hover:text-green-600 dark:text-gray-400"
                                                    onClick={() => toast.success('Thanks for the positive feedback!')}
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 hover:text-red-600 dark:text-gray-400"
                                                    onClick={() => toast.info('Feedback noted. We\'ll improve!')}
                                                >
                                                    <ThumbsDown className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                                    onClick={() => handleCopy(message.content)}
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                                                    onClick={() => handleRetry(message.id)}
                                                >
                                                    <RotateCcw className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="w-full py-2">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">Thinking...</span>
                                </div>
                            </div>
                        )}

                        {isStreaming && (
                            <div className="w-full py-2">
                                <div className="prose prose-base max-w-none dark:prose-invert">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {streamingContent}
                                    </ReactMarkdown>
                                    {/* Blinking cursor */}
                                    <span className="inline-block w-2 h-5 bg-gray-600 dark:bg-gray-300 animate-pulse ml-1"></span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sticky Input Area */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border dark:border-none dark:bg-background/80">
                <div className="container mx-auto px-4 py-4 max-w-4xl">
                    <div className="relative">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message here..."
                            className="w-full min-h-[80px] max-h-[120px] resize-none pr-12 pb-12"
                            disabled={isLoading || isStreaming}
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading || isStreaming || !isConnected}
                            size="sm"
                            className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 disabled:opacity-50"
                        >
                            <ArrowUp className="w-4 h-4 text-white dark:text-gray-900" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Press Enter to send, Shift+Enter for new line
                        {!isConnected && <span className="text-red-500 ml-2">• WebSocket disconnected</span>}
                    </p>
                </div>
            </div>
        </>
    )
}