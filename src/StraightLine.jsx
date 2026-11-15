import { useEffect } from 'react';

function StraightLine({ input, password, requestId }) {

  const conversion = [

    { name: 'a', colorStroke: "#e70606" },
    { name: 'b', colorStroke: "#f78b10" },
    { name: 'c', colorStroke: "#d4e022" },
    { name: 'd', colorStroke: "#10f7d8" },
    { name: 'e', colorStroke: "#f710bd" },
    { name: 'f', colorStroke: "#3a10f7" },
    { name: 'g', colorStroke: "#3d0404" },
    { name: 'h', colorStroke: "#0b6e1c" },
    { name: 'i', colorStroke: "#ae23ca" },
    { name: 'j', colorStroke: "#3e3a72" },
    { name: 'k', colorStroke: "#ce4a4a" },
    { name: 'l', colorStroke: "#1b5964" },
    { name: 'm', colorStroke: "#ca3c9b" },
    { name: 'n', colorStroke: "#724706" },
    { name: 'o', colorStroke: "#ac4408" },
    { name: 'p', colorStroke: "#e710bc" },
    { name: 'q', colorStroke: "#7c2138" },
    { name: 'r', colorStroke: "#041f05" },
    { name: 's', colorStroke: "#bbdf3c" },
    { name: 't', colorStroke: "#e9a33a" },
    { name: 'u', colorStroke: "#b354ae" },
    { name: 'v', colorStroke: "#dee48a" },
    { name: 'w', colorStroke: "#32a797" },
    { name: 'x', colorStroke: "#8a1c1c" },
    { name: 'y', colorStroke: "#80919b" },
    { name: 'z', colorStroke: "#1b041a" },

    // Hexadecimal digits

    { name: '0', colorStroke: "#ff0000" },
    { name: '1', colorStroke: "#00ff00" },
    { name: '2', colorStroke: "#0000ff" },
    { name: '3', colorStroke: "#ffff00" },
    { name: '4', colorStroke: "#00ffff" },
    { name: '5', colorStroke: "#ff00ff" },
    { name: '6', colorStroke: "#ff8800" },
    { name: '7', colorStroke: "#8800ff" },
    { name: '8', colorStroke: "#008888" },
    { name: '9', colorStroke: "#888800" }

  ];


  useEffect(() => {

    if (!input || !password) return;


    async function generateSVG() {

      // Generate random salt

      const salt = crypto.getRandomValues(
        new Uint8Array(16)
      );


      // Generate random IV

      const iv = crypto.getRandomValues(
        new Uint8Array(12)
      );


      // Import password

      const passwordKey = await crypto.subtle.importKey(

        'raw',

        new TextEncoder().encode(password),

        'PBKDF2',

        false,

        ['deriveKey']

      );


      // Derive AES-256 key

      const key = await crypto.subtle.deriveKey(

        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 310000,
          hash: 'SHA-256'
        },

        passwordKey,

        {
          name: 'AES-GCM',
          length: 256
        },

        false,

        ['encrypt']

      );


      // Encrypt original message

      const encrypted = await crypto.subtle.encrypt(

        {
          name: 'AES-GCM',
          iv: iv
        },

        key,

        new TextEncoder().encode(input)

      );


      // Convert encrypted data to hexadecimal

      const encryptedHex = Array.from(
        new Uint8Array(encrypted)
      )

        .map(byte =>
          byte.toString(16).padStart(2, '0')
        )

        .join('');


      // Convert salt to hexadecimal

      const saltHex = Array.from(salt)

        .map(byte =>
          byte.toString(16).padStart(2, '0')
        )

        .join('');


      // Convert IV to hexadecimal

      const ivHex = Array.from(iv)

        .map(byte =>
          byte.toString(16).padStart(2, '0')
        )

        .join('');


      // Store encryption metadata

      const cryptoData = {

        application: 'StraightLine',

        version: 1,

        algorithm: 'AES-GCM',

        keyLength: 256,

        kdf: 'PBKDF2',

        hash: 'SHA-256',

        iterations: 310000,

        salt: saltHex,

        iv: ivHex,

        ciphertext: encryptedHex

      };


      // Generate visual lines

      const generatedLines = [];


      for (let i = 0; i < encryptedHex.length; i++) {

        const character = encryptedHex[i];


        const match = conversion.find(

          item => item.name === character

        );


        if (!match) {

          throw new Error('Unsupported hexadecimal character');

        }


        // Calculate angle

        const angle = i * (360 / encryptedHex.length);

        const radians = angle * Math.PI / 180;


        // Random repetition count

        const repetitions = Math.floor(

          Math.random() * 2

        ) + 12;


        for (let j = 0; j < repetitions; j++) {

          const x = Math.random() * 1000;

          const y = Math.random() * 700;

          const length = 25 + Math.random() * 125;


          const x2 = x + Math.cos(radians) * length;

          const y2 = y + Math.sin(radians) * length;


          const thickness = 2 + Math.random() * 6;


          generatedLines.push(`

            <line

              x1="${x}"

              y1="${y}"

              x2="${x2}"

              y2="${y2}"

              stroke="${match.colorStroke}"

              stroke-width="${thickness}"

              stroke-linecap="round"

            />

          `);

        }

      }


      // Create SVG

      const svgContent = `

        <svg

          xmlns="http://www.w3.org/2000/svg"

          width="1000"

          height="700"

          viewBox="0 0 1000 700"

        >

          <metadata id="crypto-data">${JSON.stringify(cryptoData)}</metadata>

          <rect

            width="1000"

            height="700"

            fill="#111111"

          />

          ${generatedLines.join("")}

        </svg>

      `;


      // Create downloadable SVG

      const blob = new Blob(

        [svgContent],

        { type: 'image/svg+xml;charset=utf-8' }

      );


      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;

      link.download = 'encrypted-image.svg';


      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);


      // Release temporary URL

      setTimeout(() => {

        URL.revokeObjectURL(url);

      }, 1000);

    }


    generateSVG().catch(error => {

      console.error('Encryption failed:', error);

      alert('Encryption failed. Check the console.');

    });


  }, [input, password, requestId]);


  return null;

}


export default StraightLine;