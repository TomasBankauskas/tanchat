import OpenAI from 'openai'
import { LLMProvider, Message, LLMConfig, LLMResponse } from '../types'

export class OpenAIProvider implements LLMProvider {
    private client: OpenAI
    private config: LLMConfig

    constructor(config: LLMConfig) {
        this.config = config
        this.client = new OpenAI({
            apiKey: config.apiKey,
        })
    }

    async generateResponse(messages: Message[], systemPrompt?: string): Promise<LLMResponse> {
        try {
            const formattedMessages = [
                ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
                ...messages.map(msg => ({
                    role: msg.role === 'assistant' ? 'assistant' as const : 'user' as const,
                    content: msg.content
                }))
            ]

            const response = await this.client.chat.completions.create({
                model: this.config.model || 'gpt-4-turbo-preview',
                messages: formattedMessages,
                max_tokens: this.config.maxTokens,
                temperature: this.config.temperature,
            })

            return { text: response.choices[0].message.content || '' }
        } catch (error) {
            return { text: '', error: error.message }
        }
    }
}