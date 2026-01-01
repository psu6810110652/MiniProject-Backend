import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Ensure Key is 32 bytes (256 bits)
const SECRET_KEY = Buffer.from('12345678901234567890123456789012'); // Replace with robust key or .env
const ALGORITHM = 'aes-256-ctr';

export const encrypt = (text: string): string => {
    // Generate distinct IV for each encryption
    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    // Return IV:Content
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = (hash: string): string => {
    try {
        const parts = hash.split(':');
        // Handle legacy plain text or invalid format
        if (parts.length !== 2) return hash;

        const iv = Buffer.from(parts[0], 'hex');
        const content = Buffer.from(parts[1], 'hex');
        const decipher = createDecipheriv(ALGORITHM, SECRET_KEY, iv);
        const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
        return decrypted.toString();
    } catch (e) {
        // Fallback if decryption fails (e.g. legacy bcrypt hash or plain text)
        return hash;
    }
};
