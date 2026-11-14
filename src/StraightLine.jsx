import { useMemo, useEffect } from "react";

function StraightLine({ input }) {

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
    { name: 'z', colorStroke: "#1b041a" }
  ];

  const cleanInput = input.replaceAll(' ', '');

  const svgContent = useMemo(() => {

    const generatedLines = [];

    for (let i = 0; i < cleanInput.length; i++) {

      const letter = cleanInput[i].toLowerCase();

      const match = conversion.find(
        item => item.name === letter
      );

      if (!match) continue;

      const angle = i * 10;
      const radians = angle * Math.PI / 180;

      const repetitions = Math.floor(Math.random() * 30) + 12;

      for (let j = 0; j < repetitions; j++) {

        const x = Math.random() * 1000;
        const y = Math.random() * 700;

        const length = 25 + Math.random() * 125;

        const x2 = x - Math.sin(radians) * length;
        const y2 = y + Math.cos(radians) * length;

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

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1000"
        height="700"
        viewBox="0 0 1000 700"
      >
        <rect width="1000" height="700" fill="#111111"/>
        ${generatedLines.join("")}
      </svg>
    `;

  }, [cleanInput]);

    useEffect(() => {

    if (!input) return;

    const blob = new Blob(
      [svgContent],
      { type: "image/svg+xml;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "encrypted-image.svg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);

  }, [svgContent, input]);

  return null;
}

export default StraightLine;