import * as Forge from 'node-forge';

import { environment } from '../environment/environment';
export const encryptInput = (data: string) => {
	try {
	  const rsaPublicKey = Forge.pki.publicKeyFromPem(environment.PUBLIC_KEY);
   
	  const encryptedData = rsaPublicKey.encrypt(data, 'RSA-OAEP', {
		md: Forge.md.sha256.create(),
		mgf1: {
		  md: Forge.md.sha256.create()
		}
	  });
   
	  const encryptedBase64 = Forge.util.encode64(encryptedData);
   
	  return encryptedBase64;
	} catch (error) {
	  console.error('Encryption error:', error);
	  throw error;
	}
  };