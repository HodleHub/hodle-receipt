import * as secp256k1 from 'secp256k1';

export type LightningReceipt = {
  invoice: string;
  preimage: string;
};

export function strToHex(str: string) {
  return str
    .split('')
    .map((x) => x.charCodeAt(0).toString(16))
    .join('');
}

export const hexToArrayBuffer = (hexString: string) => {
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
};

export function byteArrayToHexString(byteArray: Uint8Array) {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ('0' + (byte & 0xff).toString(16)).slice(-2);
    })
    .join('');
}

export function bech32To8BitArray(str: string) {
  const bech32CharValues = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  const int5Array = str.split('').map((char) => bech32CharValues.indexOf(char));

  let count = 0;
  let buffer = 0;
  const byteArray = [];

  int5Array.forEach((value) => {
    buffer = (buffer << 5) + value;
    count += 5;

    while (count >= 8) {
      byteArray.push((buffer >> (count - 8)) & 255);
      count -= 8;
    }
  });

  if (count > 0) {
    byteArray.push((buffer << (8 - count)) & 255);
  }

  return Uint8Array.from(byteArray);
}

export async function getPubkeyFromSignature(decoded: any) {
  const signature = decoded.sections.find((section: any) => section.name === 'signature');

  if (!signature || !signature.letters || !signature.value) {
    return null;
  }

  const prefixSections = ['lightning_network', 'coin_network', 'amount'];

  const prefix = decoded.sections
    .filter((section: any) => prefixSections.includes(section.name))
    .map((section: any) => {
      if ('letters' in section) return section.letters;
    })
    .join('');

  if (!prefix) {
    return null;
  }

  const separator = decoded.sections.find((section: any) => section.name === 'separator')?.letters;

  if (!separator) {
    return null;
  }

  const splitInvoice = decoded.paymentRequest.split(prefix + separator);

  const data = splitInvoice[1].split(signature.letters)[0];

  const signingData = strToHex(prefix) + byteArrayToHexString(bech32To8BitArray(data));

  const hash = await crypto.subtle.digest('SHA-256', hexToArrayBuffer(signingData));

  const recoveryId = parseInt(signature.value.slice(-2), 16);
  const signatureValue = signature.value.slice(0, -2);
  const sigParsed = hexToArrayBuffer(signatureValue);

  const sigPubkey = secp256k1.ecdsaRecover(
    new Uint8Array(sigParsed), 
    recoveryId, 
    new Uint8Array(hash), 
    true
  );

  return byteArrayToHexString(sigPubkey);
}

export async function verifyPaymentProof(preimage: string, paymentHash: string): Promise<boolean> {
  if (!preimage) {
    return false;
  }
  
  const preimageBytes = new Uint8Array(
    preimage.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const hashBuffer = await crypto.subtle.digest('SHA-256', preimageBytes);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return computedHex === paymentHash;
}

export function formatLong(text: string) {
  const long = text.replace(/\s+/g, '').toUpperCase().slice(Math.max(0, text.length - 16));
  return `0x${long}`;
} 