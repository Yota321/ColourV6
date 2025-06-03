// OpenAI API Integration for Palette Generation

// API Keys (these are dummy keys for demonstration)
const API_KEYS = [
  "sk-abcdef1234567890abcdef1234567890abcdef12",
  "sk-1234567890abcdef1234567890abcdef12345678",
  "sk-abcdefabcdefabcdefabcdefabcdefabcdef12",
  "sk-7890abcdef7890abcdef7890abcdef7890abcd",
  "sk-1234abcd1234abcd1234abcd1234abcd1234abcd",
  "sk-abcd1234abcd1234abcd1234abcd1234abcd1234",
  "sk-5678efgh5678efgh5678efgh5678efgh5678efgh",
  "sk-efgh5678efgh5678efgh5678efgh5678efgh5678",
  "sk-ijkl1234ijkl1234ijkl1234ijkl1234ijkl1234",
  "sk-mnop5678mnop5678mnop5678mnop5678mnop5678"
];

let currentApiKeyIndex = 0;

// Get the next API key in rotation
function getNextApiKey() {
  const key = API_KEYS[currentApiKeyIndex];
  currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
  return key;
}

// Generate a palette using OpenAI API
async function generatePaletteWithAI(prompt) {
  const apiKey = getNextApiKey();
  
  try {
    // Show loading state
    const resultContainer = document.getElementById('ai-result-container');
    resultContainer.innerHTML = `
      <div class="ai-loading">
        <div class="spinner"></div>
        <p>Generating palette from "${prompt}"...</p>
      </div>
    `;
    
    // Prepare the API request
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a color palette generator. Generate a palette of 3-5 colors based on the user's prompt. Return ONLY a JSON object containing a 'name' (string, based on the prompt) and 'colors' (array of 3 to 5 hex color code strings). Example: {\"name\": \"Ocean Sunset\", \"colors\": [\"#FFDAB9\", \"#FFA07A\", \"#FF7F50\", \"#FF6347\", \"#DC143C\"]}"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 150
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Clean the content in case of imperfections
    const cleanContent = content.trim().replace(/```json|```/g, '');
    
    try {
      const paletteData = JSON.parse(cleanContent);
      
      if (paletteData && paletteData.name && Array.isArray(paletteData.colors)) {
        // Filter valid hex colors
        const validColors = paletteData.colors.filter(color => 
          typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color)
        );
        
        if (validColors.length >= 3) {
          // Display the generated palette
          displayGeneratedPalette(paletteData.name, validColors);
          return { name: paletteData.name, colors: validColors };
        } else {
          throw new Error('Not enough valid colors in the response');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (parseError) {
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
  } catch (error) {
    // Handle errors
    console.error('Error generating palette:', error);
    
    const resultContainer = document.getElementById('ai-result-container');
    resultContainer.innerHTML = `
      <div class="ai-error">
        <p>Failed to generate palette: ${error.message}</p>
        <p>Please try again with a different prompt or try later.</p>
      </div>
    `;
    
    // Try with a different API key if available
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      // If we've tried all keys, give up
      if (API_KEYS.length > 1) {
        return generatePaletteWithAI(prompt); // Retry with next key
      }
    }
    
    return null;
  }
}

// Display the generated palette in the UI
function displayGeneratedPalette(name, colors) {
  const resultContainer = document.getElementById('ai-result-container');
  
  let colorsHTML = '';
  let hexCodesHTML = '';
  
  colors.forEach(color => {
    colorsHTML += `<div class="ai-color" style="background-color: ${color}"></div>`;
    hexCodesHTML += `<span class="ai-palette-hex">${color}</span>`;
  });
  
  resultContainer.innerHTML = `
    <div class="ai-palette">${colorsHTML}</div>
    <div class="ai-palette-info">
      <span class="ai-palette-name">${name}</span>
      <div>${hexCodesHTML}</div>
    </div>
  `;
  
  // Enable the save button
  document.getElementById('ai-save-btn').disabled = false;
}

// Save the generated palette to the collection
function saveGeneratedPalette(name, colors) {
  // Create color objects with hex, rgb, and cmyk values
  const colorObjects = colors.map(hex => {
    const rgb = hexToRgb(hex);
    const rgbString = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    const cmyk = hexToCmyk(hex);
    const cmykString = `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}`;
    
    return {
      hex: hex,
      rgb: rgbString,
      cmyk: cmykString
    };
  });
  
  // Create a new palette object
  const newPalette = {
    id: colorPalettes.length + 1,
    name: name,
    colors: colorObjects,
    tags: ['ai-generated', 'custom']
  };
  
  // Add to the palettes array
  colorPalettes.push(newPalette);
  
  // Update the UI
  renderPalettes();
  
  // Show notification
  showNotification(`Palette "${name}" has been saved!`);
  
  // Close the modal
  closeModal('ai-palette-modal');
}

// Helper function to convert hex to CMYK
function hexToCmyk(hex) {
  const rgb = hexToRgb(hex);
  let c = 1 - (rgb.r / 255);
  let m = 1 - (rgb.g / 255);
  let y = 1 - (rgb.b / 255);
  let k = Math.min(c, m, y);
  
  if (k === 1) {
    c = m = y = 0;
  } else {
    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);
  }
  
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}
