export interface Message {
    role: 'user' | 'assistant'
    content: string
}

export interface LLMConfig {
    apiKey: string
    model?: string
    maxTokens?: number
    temperature?: number
}

export interface LLMResponse {
    text: string
    error?: string
}

export interface LLMProvider {
    generateResponse(messages: Message[], systemPrompt?: string): Promise<LLMResponse>
}