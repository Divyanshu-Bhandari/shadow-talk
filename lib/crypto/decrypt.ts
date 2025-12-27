export async function decryptMessage(
  ciphertext: string,
  iv: string,
  sessionKey: CryptoKey
): Promise<string> {
  const ciphertextBytes = new Uint8Array(
    ciphertext.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const ivBytes = new Uint8Array(
    iv.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const plaintext = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivBytes,
    },
    sessionKey,
    ciphertextBytes
  );

  const decoder = new TextDecoder();
  return decoder.decode(plaintext);
}
