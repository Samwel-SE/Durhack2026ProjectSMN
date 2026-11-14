  
 function StraightLine(x) {

  const conversion =[{name:'a', colorStroke:"#e70606"},{name:'b', colorStroke:"#f78b10"},{name:'c', colorStroke:"#d4e022"},{name:'d', colorStroke:"#10f7d8"},{name:'e', colorStroke:"#f710bd"},
    {name:'f', colorStroke:"#3a10f7"},{name:'g', colorStroke:"#3d0404"},{name:'h', colorStroke:"#0b6e1c49"},{name:'i', colorStroke:"#ae23ca44"},{name:'j', colorStroke:"#3e3a7293"},
    {name:'k', colorStroke:"#ce4a4ae3"},{name:'l', colorStroke:"#1b5964"},{name:'m', colorStroke:"#ca3c9b4b"},{name:'n', colorStroke:"#72470673"},{name:'o', colorStroke:"#ac4408"},
    {name:'p', colorStroke:"#f710bd"},{name:'q', colorStroke:"#7c2138"},{name:'r', colorStroke:"#041f05"},{name:'s', colorStroke:"#bbdf3c"},{name:'t', colorStroke:"#e9a33a52"},
    {name:'u', colorStroke:"#b354ae"}, {name:'v', colorStroke:"#dee48a"},{name:'w', colorStroke:"#32a797"},{name:'x', colorStroke:"#8a1c1c73"},{name:'y', colorStroke:"#80919b"},
      {name:'z', colorStroke:"#1b041a"}];

  return (

    <svg width="300" height="150">
      <line
        x1="20"
        y1="20"
        x2="20"
        y2="200"
        stroke=conversion[].colorStroke
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}



export default StraightLine