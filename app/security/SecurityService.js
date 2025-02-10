import { CONFIG } from '../config/config';

export class SecurityService {
    static async encrypt(data, key) {
        // Implementation of encryption
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(JSON.stringify(data));
        
        // Use Web Crypto API for encryption
        const cryptoKey = await this.generateKey(key);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        const encryptedData = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            cryptoKey,
            dataBuffer
        );

        return {
            data: Buffer.from(encryptedData).toString('base64'),
            iv: Buffer.from(iv).toString('base64')
        };
    }

    static async decrypt(encryptedData, key, iv) {
        const cryptoKey = await this.generateKey(key);
        const decryptedData = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: Buffer.from(iv, 'base64') },
            cryptoKey,
            Buffer.from(encryptedData, 'base64')
        );

        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(decryptedData));
    }

    private static async generateKey(key) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key);
        
        return await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
    }
} 