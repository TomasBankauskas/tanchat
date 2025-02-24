import { LLMProvider, LLMConfig } from '../types';
import { AnthropicProvider } from './anthropic';
import { OpenAIProvider } from './openai';
import { GeminiProvider } from './gemini';

export type ProviderType = 'anthropic' | 'openai' | 'gemini';

export function createLLMProvider(type: ProviderType, config: LLMConfig): LLMProvider {
    switch (type) {
        case 'anthropic':
            return new AnthropicProvider(config);
        case 'openai':
            return new OpenAIProvider(config);
        case 'gemini':
            return new GeminiProvider(config);
        default:
            throw new Error(`Unsupported provider type: ${type}`);
    }
}