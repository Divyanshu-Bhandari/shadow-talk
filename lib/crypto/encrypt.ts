export interface EncryptedMessage {
  ciphertext: string;
  iv: string;
}

export async function encryptMessage(
  message: string,
  sessionKey: CryptoKey
): Promise<EncryptedMessage> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const plaintext = encoder.encode(message);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    sessionKey,
    plaintext
  );

  const ciphertextArray = new Uint8Array(ciphertext);

  return {
    ciphertext: Array.from(ciphertextArray)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
    iv: Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
  };
}
