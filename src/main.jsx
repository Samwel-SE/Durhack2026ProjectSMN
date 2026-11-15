import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';


// =====================================
// REACT ROOT
// =====================================

const root = createRoot(document.getElementById('root'));

let requestId = 0;


// =====================================
// ENCRYPTION FORM
// =====================================

document
  .getElementById('encryptionForm')
  .addEventListener('submit', (e) => {

    e.preventDefault();

    const input = document.getElementById('input').value;

    const password = document.getElementById('password').value;

    requestId++;

    root.render(
      <App
        input={input}
        password={password}
        requestId={requestId}
      />
    );

  });


// =====================================
// HEXADECIMAL TO BYTES
// =====================================

function hexToBytes(hex) {

  if (
    typeof hex !== 'string' ||
    hex.length === 0 ||
    hex.length % 2 !== 0 ||
    !/^[0-9a-f]+$/i.test(hex)
  ) {

    throw new Error('Invalid hexadecimal data');

  }

  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < bytes.length; i++) {

    bytes[i] = parseInt(
      hex.substring(i * 2, i * 2 + 2),
      16
    );

  }

  return bytes;

}


// =====================================
// DECRYPT SVG FUNCTION
// =====================================

async function decryptSVG(file, password) {

  // 1. Read uploaded SVG

  const svgText = await file.text();


  // 2. Parse SVG

  const parser = new DOMParser();

  const svgDocument = parser.parseFromString(
    svgText,
    'image/svg+xml'
  );


  // 3. Validate SVG

  if (
    svgDocument.querySelector('parsererror') ||
    svgDocument.documentElement.localName !== 'svg' ||
    svgDocument.documentElement.namespaceURI !==
      'http://www.w3.org/2000/svg'
  ) {

    throw new Error('Invalid SVG file');

  }


  // 4. Extract metadata

  const metadata = svgDocument.getElementById('crypto-data');

  if (!metadata) {

    throw new Error('Encryption data not found');

  }


  // 5. Read metadata JSON

  const cryptoData = JSON.parse(metadata.textContent);


  // 6. Validate application and encryption settings

  if (
    cryptoData.application !== 'StraightLine' ||
    cryptoData.version !== 1 ||
    cryptoData.algorithm !== 'AES-GCM' ||
    cryptoData.kdf !== 'PBKDF2' ||
    cryptoData.hash !== 'SHA-256' ||
    cryptoData.keyLength !== 256 ||
    cryptoData.iterations !== 310000
  ) {

    throw new Error('Unsupported encryption format');

  }


  // 7. Convert hexadecimal data into bytes

  const salt = hexToBytes(cryptoData.salt);

  const iv = hexToBytes(cryptoData.iv);

  const ciphertext = hexToBytes(cryptoData.ciphertext);


  // 8. Validate cryptographic data

  if (
    salt.length !== 16 ||
    iv.length !== 12 ||
    ciphertext.length < 16 ||
    ciphertext.length > 10_000_000
  ) {

    throw new Error('Invalid encryption data');

  }


  // 9. Import password

  const passwordKey = await crypto.subtle.importKey(

    'raw',

    new TextEncoder().encode(password),

    'PBKDF2',

    false,

    ['deriveKey']

  );


  // 10. Recreate AES-256 key

  const key = await crypto.subtle.deriveKey(

    {
      name: 'PBKDF2',
      salt: salt,
      iterations: cryptoData.iterations,
      hash: 'SHA-256'
    },

    passwordKey,

    {
      name: 'AES-GCM',
      length: 256
    },

    false,

    ['decrypt']

  );


  // 11. Decrypt ciphertext

  const decrypted = await crypto.subtle.decrypt(

    {
      name: 'AES-GCM',
      iv: iv
    },

    key,

    ciphertext

  );


  // 12. Convert bytes into original text

  const originalMessage = new TextDecoder(
    'utf-8',
    { fatal: true }
  ).decode(decrypted);


  return originalMessage;

}


// =====================================
// DECRYPTION FORM
// =====================================

const decryptForm = document.getElementById('decryptForm');

const decryptResult = document.getElementById('decryptResult');

const fileInput = document.getElementById('svgFile');

const selectedFile = document.getElementById('selectedFile');


decryptForm.addEventListener('submit', async (e) => {

  e.preventDefault();

  const file = fileInput.files[0];

  const password = document.getElementById('decryptPassword').value;


  if (!file) {

    decryptResult.textContent = 'Please select an SVG file.';

    return;

  }


  if (
    !file.name.toLowerCase().endsWith('.svg') ||
    file.size > 10_000_000
  ) {

    decryptResult.textContent = 'Please select an SVG file under 10 MB.';

    return;

  }


  try {

    decryptResult.textContent = 'Decrypting...';


    const message = await decryptSVG(file, password);


    decryptResult.textContent =
      'Recovered message: ' + message;


  } catch (error) {

    console.error('Decryption failed:', error);

    decryptResult.textContent =
      'Decryption failed. Check your password or SVG file.';

  }

});


// =====================================
// FILE SELECTION
// =====================================

fileInput.addEventListener('change', () => {

  const file = fileInput.files[0];

  if (file) {

    selectedFile.textContent = 'Selected: ' + file.name;

  } else {

    selectedFile.textContent = '';

  }

});


// =====================================
// DRAG AND DROP
// =====================================

const dropZone = document.getElementById('dropZone');


dropZone.addEventListener('dragover', (e) => {

  e.preventDefault();

  dropZone.classList.add('dragging');

});


dropZone.addEventListener('dragleave', () => {

  dropZone.classList.remove('dragging');

});


dropZone.addEventListener('drop', (e) => {

  e.preventDefault();

  dropZone.classList.remove('dragging');

  const file = e.dataTransfer.files[0];


  if (
    file &&
    file.name.toLowerCase().endsWith('.svg') &&
    file.size <= 10_000_000
  ) {

    const transfer = new DataTransfer();

    transfer.items.add(file);

    fileInput.files = transfer.files;

    selectedFile.textContent =
      'Selected: ' + file.name;

    decryptResult.textContent = '';

  } else {

    selectedFile.textContent = '';

    decryptResult.textContent =
      'Please drop a valid SVG file under 10 MB.';

  }

});