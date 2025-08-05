import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ArrowUp, Bot, ThumbsUp, ThumbsDown, Copy, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
}

// Helper function to get user initials
const getUserInitials = (name: string = 'User') => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')

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
        setIsLoading(true)
        toast.info('Regenerating response...')

        setTimeout(() => {
          const aiMessage: Message = {
            id: Date.now().toString(),
            content: `Here's a regenerated response to: "${userMessage.content}". This is an alternative simulated response from the AI persona.`,
            role: 'assistant',
          }
          setMessages(prev => [...prev, aiMessage])
          setIsLoading(false)
        }, 1000)
      }
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate loading phase
    setTimeout(() => {
      setIsLoading(false)
      setIsStreaming(true)
      setStreamingContent('')

      // Simulate streaming response
      const fullResponse = `I understand you said: **"${userMessage.content}"**. 

This is a simulated response from the AI persona with **markdown support**! Here are some examples:

- ✅ **Bold text** and *italic text*
- 🔗 [Links work too](https://example.com)
- \`inline code\` formatting
- Lists and bullet points

\`\`\`javascript
// Code blocks are supported
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> Blockquotes for emphasis

In a real implementation, this would connect to an actual AI service with full markdown rendering capabilities.`

      let currentIndex = 0
      const streamInterval = setInterval(() => {
        if (currentIndex < fullResponse.length) {
          setStreamingContent(fullResponse.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(streamInterval)
          setIsStreaming(false)
          setStreamingContent('')

          // Add final message
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: fullResponse,
            role: 'assistant',
          }
          setMessages(prev => [...prev, aiMessage])
        }
      }, 30) // Adjust speed as needed
    }, 1500) // Loading phase duration
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Messages - uses page scroll */}
      <div className="container mx-auto px-4 py-8 max-w-4xl pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Bot className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Start a conversation</h2>
            <p className="text-muted-foreground max-w-md">
              Send a message to begin chatting with the AI persona. Ask questions, have discussions, or explore different topics.
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
              disabled={!input.trim() || isLoading || isStreaming}
              size="sm"
              className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200"
            >
              <ArrowUp className="w-4 h-4 text-white dark:text-gray-900" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  )
}