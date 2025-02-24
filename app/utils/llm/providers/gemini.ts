import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMProvider, Message, LLMConfig, LLMResponse } from '../types';

export class GeminiProvider implements LLMProvider {
    private client: GoogleGenerativeAI;
    private config: LLMConfig;

    constructor(config: LLMConfig) {
        this.config = config;
        this.client = new GoogleGenerativeAI(config.apiKey);
    }

    async generateResponse(messages: Message[], systemPrompt?: string): Promise<LLMResponse> {
        try {
            const model = this.client.getGenerativeModel({ 
                model: this.config.model || "gemini-pro"
            });

            // Combine system prompt with the first message if it exists
            const formattedMessages = messages.map((msg, index) => {
                if (index === 0 && systemPrompt) {
                    return {
                        role: msg.role,
                        content: `${systemPrompt}\n\n${msg.content}`
                    };
                }
                return msg;
            });

            // Convert messages to Gemini's chat format
            const chat = model.startChat({
                generationConfig: {
                    maxOutputTokens: this.config.maxTokens,
                    temperature: this.config.temperature,
                },
            });

            // Send all messages in sequence
            let response;
            for (const msg of formattedMessages) {
                response = await chat.sendMessage(msg.content);
            }

            if (!response) {
                throw new Error('No response generated');
            }

            const responseText = response.response.text();
            return { text: responseText };
        } catch (error) {
            return { text: '', error: error.message };
        }
    }
}