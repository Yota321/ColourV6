// Color Combinations Logic

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Convert HSL to RGB
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

// Convert RGB to Hex
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Convert HSL to Hex
function hslToHex(h, s, l) {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// Generate complementary color
function getComplementaryColor(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const complementaryH = (hsl.h + 180) % 360;
  const complementaryRgb = hslToRgb(complementaryH, hsl.s, hsl.l);
  return rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b);
}

// Generate analogous colors
function getAnalogousColors(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const analogous1H = (hsl.h + 30) % 360;
  const analogous2H = (hsl.h - 30 + 360) % 360;
  
  const analogous1Rgb = hslToRgb(analogous1H, hsl.s, hsl.l);
  const analogous2Rgb = hslToRgb(analogous2H, hsl.s, hsl.l);
  
  return [
    rgbToHex(analogous1Rgb.r, analogous1Rgb.g, analogous1Rgb.b),
    rgbToHex(analogous2Rgb.r, analogous2Rgb.g, analogous2Rgb.b)
  ];
}

// Generate triadic colors
function getTriadicColors(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const triadic1H = (hsl.h + 120) % 360;
  const triadic2H = (hsl.h + 240) % 360;
  
  const triadic1Rgb = hslToRgb(triadic1H, hsl.s, hsl.l);
  const triadic2Rgb = hslToRgb(triadic2H, hsl.s, hsl.l);
  
  return [
    rgbToHex(triadic1Rgb.r, triadic1Rgb.g, triadic1Rgb.b),
    rgbToHex(triadic2Rgb.r, triadic2Rgb.g, triadic2Rgb.b)
  ];
}

// Generate monochromatic colors
function getMonochromaticColors(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const colors = [];
  
  // Generate 4 variations with different lightness
  for (let i = 1; i <= 4; i++) {
    const lightness = Math.min(Math.max(hsl.l + (i % 2 === 0 ? i * 10 : -i * 10), 10), 90);
    const monoRgb = hslToRgb(hsl.h, hsl.s, lightness);
    colors.push(rgbToHex(monoRgb.r, monoRgb.g, monoRgb.b));
  }
  
  return colors;
}

// Generate split complementary colors
function getSplitComplementaryColors(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const complementaryH = (hsl.h + 180) % 360;
  const split1H = (complementaryH + 30) % 360;
  const split2H = (complementaryH - 30 + 360) % 360;
  
  const split1Rgb = hslToRgb(split1H, hsl.s, hsl.l);
  const split2Rgb = hslToRgb(split2H, hsl.s, hsl.l);
  
  return [
    rgbToHex(split1Rgb.r, split1Rgb.g, split1Rgb.b),
    rgbToHex(split2Rgb.r, split2Rgb.g, split2Rgb.b)
  ];
}

// Generate tetradic colors
function getTetradicColors(hex) {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const tetradic1H = (hsl.h + 90) % 360;
  const tetradic2H = (hsl.h + 180) % 360;
  const tetradic3H = (hsl.h + 270) % 360;
  
  const tetradic1Rgb = hslToRgb(tetradic1H, hsl.s, hsl.l);
  const tetradic2Rgb = hslToRgb(tetradic2H, hsl.s, hsl.l);
  const tetradic3Rgb = hslToRgb(tetradic3H, hsl.s, hsl.l);
  
  return [
    rgbToHex(tetradic1Rgb.r, tetradic1Rgb.g, tetradic1Rgb.b),
    rgbToHex(tetradic2Rgb.r, tetradic2Rgb.g, tetradic2Rgb.b),
    rgbToHex(tetradic3Rgb.r, tetradic3Rgb.g, tetradic3Rgb.b)
  ];
}

// Generate all color combinations for a given hex color
function generateColorCombinations(hex) {
  return {
    complementary: getComplementaryColor(hex),
    analogous: getAnalogousColors(hex),
    triadic: getTriadicColors(hex),
    monochromatic: getMonochromaticColors(hex),
    splitComplementary: getSplitComplementaryColors(hex),
    tetradic: getTetradicColors(hex)
  };
}

// Check if a color is light or dark
function isLightColor(hex) {
  const rgb = hexToRgb(hex);
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128;
}

// Get contrasting text color (black or white) based on background color
function getContrastColor(hex) {
  return isLightColor(hex) ? '#000000' : '#FFFFFF';
}

// Calculate color distance (for finding similar colors)
function colorDistance(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  return Math.sqrt(
    Math.pow(rgb2.r - rgb1.r, 2) +
    Math.pow(rgb2.g - rgb1.g, 2) +
    Math.pow(rgb2.b - rgb1.b, 2)
  );
}

// Find similar colors from a list
function findSimilarColors(hex, colorList, count = 5) {
  return colorList
    .filter(color => color.hex !== hex)
    .map(color => ({
      ...color,
      distance: colorDistance(hex, color.hex)
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}
