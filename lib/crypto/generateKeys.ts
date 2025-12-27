export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export async function generateKeyPair(): Promise<KeyPair> {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    false,
    ['deriveKey', 'deriveBits']
  );

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey('spki', publicKey);
  const bytes = new Uint8Array(exported);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function importPublicKey(keyData: string): Promise<CryptoKey> {
  const bytes = new Uint8Array(
    keyData.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  return window.crypto.subtle.importKey(
    'spki',
    bytes.buffer,
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    false,
    []
  );
}
