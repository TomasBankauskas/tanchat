import { LLMProvider, LLMConfig } from '../types'
import { AnthropicProvider } from './anthropic'
import { OpenAIProvider } from './openai'

export type ProviderType = 'anthropic' | 'openai'

export function createLLMProvider(type: ProviderType, config: LLMConfig): LLMProvider {
    switch (type) {
        case 'anthropic':
            return new AnthropicProvider(config)
        case 'openai':
            return new OpenAIProvider(config)
        default:
            throw new Error(`Unsupported provider type: ${type}`)
    }
}