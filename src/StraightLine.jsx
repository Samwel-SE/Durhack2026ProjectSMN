import { useMemo } from "react";

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
    { name: 'p', colorStroke: "#f710bd" },
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

  const lines = useMemo(() => {

    const generatedLines = [];

    for (let i = 0; i < input.length; i++) {

      const letter = input[i].toLowerCase();

      const match = conversion.find(
        item => item.name === letter
      );

      if (!match) continue;

      // Original letter determines the angle
      const angle = i * 10;

      const radians = angle * Math.PI / 180;

      // Each letter gets a random number of copies
      const repetitions = Math.floor(Math.random() * 30) + 12;

      // Generate multiple lines for each letter
      for (let j = 0; j < repetitions; j++) {

        // Random starting position
        const x = Math.random() * 1000;
        const y = Math.random() * 700;

      // Random line length
      const length = 25 + Math.random() * 125;

      // Calculate angle
      const radians = angle * Math.PI / 180;

     // Calculate ending position (tilt left)
     const x2 = x - Math.sin(radians) * length;
    const y2 = y + Math.cos(radians) * length;

        // Slight variation in line thickness
        const thickness = 2 + Math.random() * 6 ;

        generatedLines.push(
          <line
            key={`${i}-${j}`}
            x1={x}
            y1={y}
            x2={x2}
            y2={y2}
            stroke={match.colorStroke}
            strokeWidth={thickness}
            strokeLinecap="round"
          />
        );

      }
    }

    return generatedLines;

  }, [input]);

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "fixed",
        inset: 0,
        background: "#111111",
        display: "block"
      }}
    >
      {lines}
    </svg>
  );
}

export default StraightLine;