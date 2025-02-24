import { Anthropic } from '@anthropic-ai/sdk'
import { LLMProvider, Message, LLMConfig, LLMResponse } from '../types'

export class AnthropicProvider implements LLMProvider {
    private client: Anthropic
    private config: LLMConfig

    constructor(config: LLMConfig) {
        this.config = config
        this.client = new Anthropic({
            apiKey: config.apiKey,
        })
    }

    async generateResponse(messages: Message[], systemPrompt?: string): Promise<LLMResponse> {
        try {
            const response = await this.client.messages.create({
                model: this.config.model || "claude-3-5-sonnet-20241022",
                max_tokens: this.config.maxTokens || 4096,
                system: systemPrompt,
                messages: messages,
            })

            if (response.content[0].type === 'text') {
                return { text: response.content[0].text }
            }
            return { text: '', error: 'Unexpected response type' }
        } catch (error) {
            return { text: '', error: error.message }
        }
    }
}