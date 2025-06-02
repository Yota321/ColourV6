// Main JavaScript for Color Palette Website

// DOM Elements
const body = document.body;
const sidebar = document.querySelector('.sidebar');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const closeSidebar = document.querySelector('.close-sidebar');
const mainNav = document.querySelectorAll('.nav-item');
const vizOptions = document.querySelectorAll('.viz-option');
const themeToggle = document.querySelector('.theme-toggle');
const searchInput = document.getElementById('search-input');
const filterToggle = document.getElementById('filter-toggle');
const filterMenu = document.getElementById('filter-menu');
const sortToggle = document.getElementById('sort-toggle');
const sortMenu = document.getElementById('sort-menu');
const sortOptions = document.querySelectorAll('.sort-option');
const generatePaletteBtn = document.getElementById('generate-palette-btn');
const paletteGrid = document.getElementById('palette-grid');
const singleColorGrid = document.getElementById('single-color-grid');
const patternsGrid = document.getElementById('patterns-grid');
const notification = document.getElementById('notification');

// Current state
let currentView = 'palettes';
let currentVisualization = 'default';
let currentSort = 'name';
let currentFilter = '';
let currentSearch = '';
let generatedPalette = null;

// Initialize the application
function initApp() {
  loadThemePreference();
  renderPalettes();
  renderColors();
  renderPatterns();
  setupEventListeners();
  populateFilterTags();
}

// Load theme preference from localStorage
function loadThemePreference() {
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    body.classList.add('dark-theme');
  }
}

// Toggle theme between light and dark
function toggleTheme() {
  body.classList.toggle('dark-theme');
  localStorage.setItem('darkMode', body.classList.contains('dark-theme'));
}

// Toggle mobile menu
function toggleMobileMenu() {
  sidebar.classList.toggle('show');
  mobileMenuToggle.classList.toggle('active');
}

// Switch between views (palettes, single colors, trending, favorites, patterns)
function switchView(view) {
  currentView = view;
  
  // Update active nav item
  mainNav.forEach(item => {
    item.classList.toggle('active', item.dataset.view === view);
  });
  
  // Hide all grids
  paletteGrid.classList.remove('visible');
  singleColorGrid.classList.remove('visible');
  patternsGrid.classList.remove('visible');
  
  // Show the selected grid
  switch (view) {
    case 'single-colors':
      singleColorGrid.classList.add('visible');
      break;
    case 'patterns':
      patternsGrid.classList.add('visible');
      break;
    default:
      paletteGrid.classList.add('visible');
      break;
  }
  
  // Close mobile menu if open
  if (sidebar.classList.contains('show')) {
    toggleMobileMenu();
  }
}

// Switch visualization mode
function switchVisualization(viz) {
  currentVisualization = viz;
  
  // Update active visualization option
  vizOptions.forEach(item => {
    item.classList.toggle('active', item.dataset.viz === viz);
  });
  
  // Re-render palettes with new visualization
  renderPalettes();
}

// Render palettes based on current state
function renderPalettes() {
  // Filter palettes based on current filter, search, and view
  let filteredPalettes = colorPalettes;
  
  if (currentFilter) {
    filteredPalettes = filteredPalettes.filter(palette => 
      palette.tags && palette.tags.includes(currentFilter)
    );
  }
  
  if (currentSearch) {
    const searchLower = currentSearch.toLowerCase();
    filteredPalettes = filteredPalettes.filter(palette => 
      palette.name.toLowerCase().includes(searchLower) || 
      (palette.tags && palette.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  }
  
  if (currentView === 'trending') {
    // For demo purposes, just show some random palettes as "trending"
    filteredPalettes = [...filteredPalettes].sort(() => 0.5 - Math.random()).slice(0, 12);
  } else if (currentView === 'favorites') {
    // Get favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    filteredPalettes = filteredPalettes.filter(palette => favorites.includes(palette.id));
  }
  
  // Sort palettes
  filteredPalettes = sortPalettes(filteredPalettes, currentSort);
  
  // Clear the grid
  paletteGrid.innerHTML = '';
  
  // Add palettes to the grid
  filteredPalettes.forEach(palette => {
    const paletteCard = document.createElement('div');
    paletteCard.className = 'palette-card glass';
    paletteCard.dataset.id = palette.id;
    
    // Create palette visualization based on current mode
    let paletteVisualization;
    
    switch (currentVisualization) {
      case 'fluid-waves':
        paletteVisualization = createFluidWavesVisualization(palette.colors);
        break;
      case 'glass-morphism':
        paletteVisualization = createGlassMorphismVisualization(palette.colors);
        break;
      case 'gradient-blend':
        paletteVisualization = createGradientBlendVisualization(palette.colors);
        break;
      case 'neon-glow':
        paletteVisualization = createNeonGlowVisualization(palette.colors);
        break;
      default:
        paletteVisualization = createDefaultVisualization(palette.colors);
        break;
    }
    
    // Create palette info
    const paletteInfo = document.createElement('div');
    paletteInfo.className = 'palette-info';
    
    const paletteName = document.createElement('h3');
    paletteName.className = 'palette-name';
    paletteName.textContent = palette.name;
    
    const paletteTags = document.createElement('div');
    paletteTags.className = 'palette-tags';
    
    if (palette.tags) {
      palette.tags.slice(0, 3).forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'palette-tag';
        tagSpan.textContent = tag;
        paletteTags.appendChild(tagSpan);
      });
    }
    
    paletteInfo.appendChild(paletteName);
    paletteInfo.appendChild(paletteTags);
    
    paletteCard.appendChild(paletteVisualization);
    paletteCard.appendChild(paletteInfo);
    
    // Add click event to show palette detail
    paletteCard.addEventListener('click', () => {
      showPaletteDetail(palette);
    });
    
    paletteGrid.appendChild(paletteCard);
  });
}

// Create default visualization (simple color blocks)
function createDefaultVisualization(colors) {
  const paletteColors = document.createElement('div');
  paletteColors.className = 'palette-colors';
  
  colors.forEach(color => {
    const colorDiv = document.createElement('div');
    colorDiv.className = 'palette-color';
    colorDiv.style.backgroundColor = color.hex;
    paletteColors.appendChild(colorDiv);
  });
  
  return paletteColors;
}

// Create fluid waves visualization
function createFluidWavesVisualization(colors) {
  const container = document.createElement('div');
  container.className = 'fluid-waves';
  
  colors.forEach((color, index) => {
    const wave = document.createElement('div');
    wave.className = 'wave';
    wave.style.backgroundColor = color.hex;
    wave.style.opacity = 0.7 - (index * 0.1);
    wave.style.animationDelay = `${index * 0.5}s`;
    container.appendChild(wave);
  });
  
  return container;
}

// Create glass morphism visualization
function createGlassMorphismVisualization(colors) {
  const container = document.createElement('div');
  container.className = 'glass-morph';
  container.style.backgroundColor = colors[0].hex;
  
  colors.slice(1).forEach((color, index) => {
    const shape = document.createElement('div');
    shape.className = 'glass-shape';
    shape.style.backgroundColor = color.hex;
    shape.style.width = `${50 + index * 10}px`;
    shape.style.height = `${50 + index * 10}px`;
    shape.style.left = `${20 + index * 15}%`;
    shape.style.top = `${20 + index * 10}%`;
    shape.style.animationDelay = `${index * 0.7}s`;
    container.appendChild(shape);
  });
  
  return container;
}

// Create gradient blend visualization
function createGradientBlendVisualization(colors) {
  const container = document.createElement('div');
  container.className = 'gradient-blend';
  
  // Create gradient from all colors
  const colorStops = colors.map((color, index) => 
    `${color.hex} ${index * (100 / (colors.length - 1))}%`
  ).join(', ');
  
  container.style.background = `linear-gradient(45deg, ${colorStops})`;
  
  return container;
}

// Create neon glow visualization
function createNeonGlowVisualization(colors) {
  const container = document.createElement('div');
  container.className = 'neon-glow';
  
  colors.forEach((color, index) => {
    const line = document.createElement('div');
    line.className = 'neon-line';
    line.style.backgroundColor = color.hex;
    line.style.color = color.hex;
    line.style.width = '80%';
    line.style.left = '10%';
    line.style.top = `${20 + index * 20}%`;
    line.style.animationDelay = `${index * 0.3}s`;
    container.appendChild(line);
  });
  
  return container;
}

// Render single colors
function renderColors() {
  // Clear the grid
  singleColorGrid.innerHTML = '';
  
  // Filter colors based on search
  let filteredColors = allColors;
  
  if (currentSearch) {
    const searchLower = currentSearch.toLowerCase();
    filteredColors = filteredColors.filter(color => 
      color.name.toLowerCase().includes(searchLower) || 
      color.hex.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort colors
  filteredColors = sortColors(filteredColors, currentSort);
  
  // Add colors to the grid
  filteredColors.forEach(color => {
    const colorCard = document.createElement('div');
    colorCard.className = 'color-card glass';
    colorCard.dataset.hex = color.hex;
    
    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'color-swatch';
    colorSwatch.style.backgroundColor = color.hex;
    
    const colorInfo = document.createElement('div');
    colorInfo.className = 'color-info';
    
    const colorName = document.createElement('h3');
    colorName.className = 'color-name';
    colorName.textContent = color.name || 'Color';
    
    const colorHex = document.createElement('div');
    colorHex.className = 'color-hex';
    colorHex.textContent = color.hex;
    
    colorInfo.appendChild(colorName);
    colorInfo.appendChild(colorHex);
    
    colorCard.appendChild(colorSwatch);
    colorCard.appendChild(colorInfo);
    
    // Add click event to show color detail
    colorCard.addEventListener('click', () => {
      showColorDetail(color);
    });
    
    singleColorGrid.appendChild(colorCard);
  });
}

// Generate abstract patterns for palettes
function renderPatterns() {
  // Clear the grid
  patternsGrid.innerHTML = '';
  
  // Create patterns for each palette
  colorPalettes.slice(0, 30).forEach(palette => {
    const patternTypes = ['stripes', 'dots', 'waves', 'zigzag', 'triangles'];
    const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    
    const patternCard = document.createElement('div');
    patternCard.className = 'pattern-card glass';
    patternCard.dataset.id = palette.id;
    
    const patternPreview = document.createElement('div');
    patternPreview.className = 'pattern-preview';
    
    const pattern = document.createElement('div');
    pattern.className = `abstract-pattern pattern-${patternType}`;
    pattern.style.setProperty('--color1', palette.colors[0].hex);
    pattern.style.setProperty('--color2', palette.colors[1]?.hex || palette.colors[0].hex);
    pattern.style.setProperty('--color3', palette.colors[2]?.hex || palette.colors[0].hex);
    
    patternPreview.appendChild(pattern);
    
    const patternInfo = document.createElement('div');
    patternInfo.className = 'pattern-info';
    
    const patternName = document.createElement('h3');
    patternName.className = 'pattern-name';
    patternName.textContent = `${palette.name} Pattern`;
    
    patternInfo.appendChild(patternName);
    
    patternCard.appendChild(patternPreview);
    patternCard.appendChild(patternInfo);
    
    // Add click event to show pattern detail
    patternCard.addEventListener('click', () => {
      showPatternDetail(palette, patternType);
    });
    
    patternsGrid.appendChild(patternCard);
  });
}

// Show palette detail in modal
function showPaletteDetail(palette) {
  const paletteDetail = document.getElementById('palette-detail');
  
  // Check if palette is in favorites
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const isFavorite = favorites.includes(palette.id);
  
  // Create visualization container
  const visualizationContainer = document.createElement('div');
  visualizationContainer.className = 'visualization-container';
  
  // Add visualization based on current mode
  let visualization;
  switch (currentVisualization) {
    case 'fluid-waves':
      visualization = createFluidWavesVisualization(palette.colors);
      break;
    case 'glass-morphism':
      visualization = createGlassMorphismVisualization(palette.colors);
      break;
    case 'gradient-blend':
      visualization = createGradientBlendVisualization(palette.colors);
      break;
    case 'neon-glow':
      visualization = createNeonGlowVisualization(palette.colors);
      break;
    default:
      visualization = createDefaultVisualization(palette.colors);
      break;
  }
  
  visualizationContainer.appendChild(visualization);
  
  // Create palette header
  const paletteHeader = document.createElement('div');
  paletteHeader.className = 'palette-header';
  
  const paletteName = document.createElement('h2');
  paletteName.textContent = palette.name;
  
  const favoriteButton = document.createElement('button');
  favoriteButton.className = `favorite-button${isFavorite ? ' active' : ''}`;
  favoriteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  `;
  
  favoriteButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(palette.id);
    favoriteButton.classList.toggle('active');
    favoriteButton.querySelector('svg').setAttribute('fill', favoriteButton.classList.contains('active') ? 'currentColor' : 'none');
  });
  
  paletteHeader.appendChild(paletteName);
  paletteHeader.appendChild(favoriteButton);
  
  // Create tags container
  const tagsContainer = document.createElement('div');
  tagsContainer.className = 'tags-container';
  
  if (palette.tags) {
    palette.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'tag';
      tagSpan.textContent = tag;
      tagsContainer.appendChild(tagSpan);
    });
  }
  
  // Create colors container
  const colorsContainer = document.createElement('div');
  colorsContainer.className = 'colors-container';
  
  palette.colors.forEach(color => {
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';
    
    const colorSwatch = document.createElement('div');
    colorSwatch.className = 'color-item-swatch';
    colorSwatch.style.backgroundColor = color.hex;
    
    const colorInfo = document.createElement('div');
    colorInfo.className = 'color-item-info';
    
    const colorHex = document.createElement('div');
    colorHex.className = 'color-item-hex';
    colorHex.textContent = color.hex;
    
    colorInfo.appendChild(colorHex);
    
    colorItem.appendChild(colorSwatch);
    colorItem.appendChild(colorInfo);
    
    // Add click event to copy color
    colorItem.addEventListener('click', () => {
      copyToClipboard(color.hex);
      showNotification(`Copied ${color.hex} to clipboard!`);
    });
    
    colorsContainer.appendChild(colorItem);
  });
  
  // Create palette actions
  const paletteActions = document.createElement('div');
  paletteActions.className = 'palette-actions';
  
  const copyButton = document.createElement('button');
  copyButton.className = 'action-button';
  copyButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    Copy Palette
  `;
  
  copyButton.addEventListener('click', () => {
    const hexCodes = palette.colors.map(color => color.hex).join(', ');
    copyToClipboard(hexCodes);
    showNotification('Palette copied to clipboard!');
  });
  
  const downloadButton = document.createElement('button');
  downloadButton.className = 'action-button';
  downloadButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Download SVG
  `;
  
  downloadButton.addEventListener('click', () => {
    downloadPaletteSVG(palette);
  });
  
  paletteActions.appendChild(copyButton);
  paletteActions.appendChild(downloadButton);
  
  // Assemble the palette detail
  paletteDetail.innerHTML = '';
  paletteDetail.appendChild(visualizationContainer);
  paletteDetail.appendChild(paletteHeader);
  paletteDetail.appendChild(tagsContainer);
  paletteDetail.appendChild(colorsContainer);
  paletteDetail.appendChild(paletteActions);
  
  // Show the modal
  openModal('palette-modal');
}

// Show color detail in modal
function showColorDetail(color) {
  const colorDetail = document.getElementById('color-detail');
  
  // Create color preview
  const colorPreview = document.createElement('div');
  colorPreview.className = 'color-preview';
  
  const colorSwatchLarge = document.createElement('div');
  colorSwatchLarge.className = 'color-swatch-large';
  colorSwatchLarge.style.backgroundColor = color.hex;
  
  colorPreview.appendChild(colorSwatchLarge);
  
  // Create color header
  const colorHeader = document.createElement('div');
  colorHeader.className = 'color-header';
  
  const colorName = document.createElement('h2');
  colorName.textContent = color.name || 'Color';
  
  const colorHex = document.createElement('h3');
  colorHex.textContent = color.hex;
  
  colorHeader.appendChild(colorName);
  colorHeader.appendChild(colorHex);
  
  // Create color values container
  const colorValuesContainer = document.createElement('div');
  colorValuesContainer.className = 'color-values-container';
  
  // Add RGB value
  const rgbItem = document.createElement('div');
  rgbItem.className = 'color-value-item';
  
  const rgbLabel = document.createElement('span');
  rgbLabel.className = 'value-label';
  rgbLabel.textContent = 'RGB';
  
  const rgbValue = document.createElement('span');
  rgbValue.className = 'value-text';
  rgbValue.textContent = color.rgb;
  
  rgbItem.appendChild(rgbLabel);
  rgbItem.appendChild(rgbValue);
  
  // Add CMYK value
  const cmykItem = document.createElement('div');
  cmykItem.className = 'color-value-item';
  
  const cmykLabel = document.createElement('span');
  cmykLabel.className = 'value-label';
  cmykLabel.textContent = 'CMYK';
  
  const cmykValue = document.createElement('span');
  cmykValue.className = 'value-text';
  cmykValue.textContent = color.cmyk;
  
  cmykItem.appendChild(cmykLabel);
  cmykItem.appendChild(cmykValue);
  
  // Add HSL value
  const hslItem = document.createElement('div');
  hslItem.className = 'color-value-item';
  
  const hslLabel = document.createElement('span');
  hslLabel.className = 'value-label';
  hslLabel.textContent = 'HSL';
  
  const rgb = hexToRgb(color.hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  const hslValue = document.createElement('span');
  hslValue.className = 'value-text';
  hslValue.textContent = `${hsl.h}°, ${hsl.s}%, ${hsl.l}%`;
  
  hslItem.appendChild(hslLabel);
  hslItem.appendChild(hslValue);
  
  colorValuesContainer.appendChild(rgbItem);
  colorValuesContainer.appendChild(cmykItem);
  colorValuesContainer.appendChild(hslItem);
  
  // Create color harmony section
  const colorHarmony = document.createElement('div');
  colorHarmony.className = 'color-harmony';
  
  const harmonyTitle = document.createElement('h3');
  harmonyTitle.textContent = 'Color Harmonies';
  
  const harmonySwatches = document.createElement('div');
  harmonySwatches.className = 'harmony-swatches';
  
  // Generate color harmonies
  const harmonies = generateColorCombinations(color.hex);
  
  // Add complementary color
  const compSwatch = document.createElement('div');
  compSwatch.className = 'harmony-swatch';
  compSwatch.style.backgroundColor = harmonies.complementary;
  compSwatch.title = 'Complementary';
  harmonySwatches.appendChild(compSwatch);
  
  // Add analogous colors
  harmonies.analogous.forEach(analogous => {
    const analogousSwatch = document.createElement('div');
    analogousSwatch.className = 'harmony-swatch';
    analogousSwatch.style.backgroundColor = analogous;
    analogousSwatch.title = 'Analogous';
    harmonySwatches.appendChild(analogousSwatch);
  });
  
  // Add triadic colors
  harmonies.triadic.forEach(triadic => {
    const triadicSwatch = document.createElement('div');
    triadicSwatch.className = 'harmony-swatch';
    triadicSwatch.style.backgroundColor = triadic;
    triadicSwatch.title = 'Triadic';
    harmonySwatches.appendChild(triadicSwatch);
  });
  
  colorHarmony.appendChild(harmonyTitle);
  colorHarmony.appendChild(harmonySwatches);
  
  // Create color combinations section
  const colorCombinations = document.createElement('div');
  colorCombinations.className = 'color-combinations';
  
  const combinationsTitle = document.createElement('h3');
  combinationsTitle.textContent = 'Color Combinations';
  
  const combinationsContainer = document.createElement('div');
  combinationsContainer.className = 'combinations-container';
  
  // Find palettes containing this color
  const palettesWithColor = colorPalettes.filter(palette => 
    palette.colors.some(c => c.hex.toUpperCase() === color.hex.toUpperCase())
  ).slice(0, 4);
  
  palettesWithColor.forEach(palette => {
    const combinationItem = document.createElement('div');
    combinationItem.className = 'combination-item';
    
    const combinationColors = document.createElement('div');
    combinationColors.className = 'combination-colors';
    
    palette.colors.forEach(c => {
      const combinationColor = document.createElement('div');
      combinationColor.className = 'combination-color';
      combinationColor.style.backgroundColor = c.hex;
      combinationColors.appendChild(combinationColor);
    });
    
    const combinationInfo = document.createElement('div');
    combinationInfo.className = 'combination-info';
    combinationInfo.textContent = palette.name;
    
    combinationItem.appendChild(combinationColors);
    combinationItem.appendChild(combinationInfo);
    
    // Add click event to show palette detail
    combinationItem.addEventListener('click', () => {
      closeModal('color-modal');
      setTimeout(() => {
        showPaletteDetail(palette);
      }, 300);
    });
    
    combinationsContainer.appendChild(combinationItem);
  });
  
  colorCombinations.appendChild(combinationsTitle);
  colorCombinations.appendChild(combinationsContainer);
  
  // Create color actions
  const colorActions = document.createElement('div');
  colorActions.className = 'palette-actions';
  
  const copyButton = document.createElement('button');
  copyButton.className = 'action-button';
  copyButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    Copy Hex
  `;
  
  copyButton.addEventListener('click', () => {
    copyToClipboard(color.hex);
    showNotification(`Copied ${color.hex} to clipboard!`);
  });
  
  colorActions.appendChild(copyButton);
  
  // Assemble the color detail
  colorDetail.innerHTML = '';
  colorDetail.appendChild(colorPreview);
  colorDetail.appendChild(colorHeader);
  colorDetail.appendChild(colorValuesContainer);
  colorDetail.appendChild(colorHarmony);
  colorDetail.appendChild(colorCombinations);
  colorDetail.appendChild(colorActions);
  
  // Show the modal
  openModal('color-modal');
}

// Show pattern detail in modal
function showPatternDetail(palette, patternType) {
  const patternDetail = document.getElementById('pattern-detail');
  
  // Create pattern preview
  const patternPreview = document.createElement('div');
  patternPreview.className = 'pattern-detail-preview';
  
  const pattern = document.createElement('div');
  pattern.className = `abstract-pattern pattern-${patternType}`;
  pattern.style.setProperty('--color1', palette.colors[0].hex);
  pattern.style.setProperty('--color2', palette.colors[1]?.hex || palette.colors[0].hex);
  pattern.style.setProperty('--color3', palette.colors[2]?.hex || palette.colors[0].hex);
  
  patternPreview.appendChild(pattern);
  
  // Create pattern header
  const patternHeader = document.createElement('div');
  patternHeader.className = 'palette-header';
  
  const patternName = document.createElement('h2');
  patternName.textContent = `${palette.name} Pattern`;
  
  patternHeader.appendChild(patternName);
  
  // Create pattern colors
  const patternColors = document.createElement('div');
  patternColors.className = 'pattern-colors';
  
  palette.colors.slice(0, 3).forEach(color => {
    const patternColor = document.createElement('div');
    patternColor.className = 'pattern-color';
    patternColor.style.backgroundColor = color.hex;
    patternColors.appendChild(patternColor);
  });
  
  // Create pattern actions
  const patternActions = document.createElement('div');
  patternActions.className = 'pattern-actions';
  
  const viewPaletteButton = document.createElement('button');
  viewPaletteButton.className = 'action-button';
  viewPaletteButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    </svg>
    View Palette
  `;
  
  viewPaletteButton.addEventListener('click', () => {
    closeModal('pattern-modal');
    setTimeout(() => {
      showPaletteDetail(palette);
    }, 300);
  });
  
  const downloadButton = document.createElement('button');
  downloadButton.className = 'action-button';
  downloadButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    Download SVG
  `;
  
  downloadButton.addEventListener('click', () => {
    downloadPatternSVG(palette, patternType);
  });
  
  patternActions.appendChild(viewPaletteButton);
  patternActions.appendChild(downloadButton);
  
  // Assemble the pattern detail
  patternDetail.innerHTML = '';
  patternDetail.appendChild(patternPreview);
  patternDetail.appendChild(patternHeader);
  patternDetail.appendChild(patternColors);
  patternDetail.appendChild(patternActions);
  
  // Show the modal
  openModal('pattern-modal');
}

// Toggle favorite status of a palette
function toggleFavorite(paletteId) {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const index = favorites.indexOf(paletteId);
  
  if (index === -1) {
    favorites.push(paletteId);
    showNotification('Added to favorites!');
  } else {
    favorites.splice(index, 1);
    showNotification('Removed from favorites!');
    
    // Re-render if we're in favorites view
    if (currentView === 'favorites') {
      renderPalettes();
    }
  }
  
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Copy text to clipboard
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

// Download palette as SVG
function downloadPaletteSVG(palette) {
  const colors = palette.colors;
  const width = 800;
  const height = 400;
  const colorWidth = width / colors.length;
  
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Add color rectangles
  colors.forEach((color, index) => {
    const x = index * colorWidth;
    svgContent += `<rect x="${x}" y="0" width="${colorWidth}" height="${height}" fill="${color.hex}" />`;
    
    // Add color hex text
    const textY = height - 20;
    const textX = x + (colorWidth / 2);
    const textColor = isLightColor(color.hex) ? '#000000' : '#FFFFFF';
    svgContent += `<text x="${textX}" y="${textY}" font-family="Arial" font-size="16" fill="${textColor}" text-anchor="middle">${color.hex}</text>`;
  });
  
  // Add palette name
  svgContent += `<text x="${width / 2}" y="30" font-family="Arial" font-size="24" fill="#FFFFFF" text-anchor="middle" stroke="#000000" stroke-width="0.5">${palette.name}</text>`;
  
  svgContent += '</svg>';
  
  // Create download link
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${palette.name.replace(/\s+/g, '-').toLowerCase()}.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Download pattern as SVG
function downloadPatternSVG(palette, patternType) {
  const width = 800;
  const height = 800;
  
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  
  // Add pattern based on type
  const color1 = palette.colors[0].hex;
  const color2 = palette.colors[1]?.hex || palette.colors[0].hex;
  const color3 = palette.colors[2]?.hex || palette.colors[0].hex;
  
  switch (patternType) {
    case 'stripes':
      svgContent += `
        <defs>
          <pattern id="stripes" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
            <rect width="20" height="40" fill="${color1}" />
            <rect x="20" width="20" height="40" fill="${color2}" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#stripes)" />
      `;
      break;
    case 'dots':
      svgContent += `
        <defs>
          <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="${color1}" />
            <circle cx="10" cy="10" r="5" fill="${color2}" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#dots)" />
      `;
      break;
    case 'waves':
      svgContent += `
        <defs>
          <pattern id="waves" patternUnits="userSpaceOnUse" width="60" height="60">
            <path d="M0,0 L60,0 L60,60 L0,60 Z" fill="${color1}" />
            <path d="M0,15 Q15,0 30,15 T60,15 V30 Q45,45 30,30 T0,30 Z" fill="${color2}" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#waves)" />
      `;
      break;
    case 'zigzag':
      svgContent += `
        <defs>
          <pattern id="zigzag" patternUnits="userSpaceOnUse" width="40" height="40">
            <path d="M0,20 L10,10 L20,20 L30,10 L40,20 L40,40 L30,30 L20,40 L10,30 L0,40 Z" fill="${color1}" />
            <path d="M0,0 L10,10 L20,0 L30,10 L40,0 L40,20 L30,10 L20,20 L10,10 L0,20 Z" fill="${color2}" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#zigzag)" />
      `;
      break;
    case 'triangles':
      svgContent += `
        <defs>
          <pattern id="triangles" patternUnits="userSpaceOnUse" width="50" height="50">
            <polygon points="0,0 50,0 25,50" fill="${color1}" />
            <polygon points="0,50 25,0 50,50" fill="${color2}" />
            <polygon points="25,15 35,35 15,35" fill="${color3}" />
          </pattern>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#triangles)" />
      `;
      break;
  }
  
  // Add palette name
  svgContent += `<text x="${width / 2}" y="30" font-family="Arial" font-size="24" fill="#FFFFFF" text-anchor="middle" stroke="#000000" stroke-width="0.5">${palette.name} Pattern</text>`;
  
  svgContent += '</svg>';
  
  // Create download link
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${palette.name.replace(/\s+/g, '-').toLowerCase()}-pattern.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Sort palettes based on sort option
function sortPalettes(palettes, sortOption) {
  const sortedPalettes = [...palettes];
  
  switch (sortOption) {
    case 'name':
      sortedPalettes.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sortedPalettes.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
      sortedPalettes.sort((a, b) => b.id - a.id);
      break;
    case 'popular':
      // For demo purposes, just randomize
      sortedPalettes.sort(() => 0.5 - Math.random());
      break;
  }
  
  return sortedPalettes;
}

// Sort colors based on sort option
function sortColors(colors, sortOption) {
  const sortedColors = [...colors];
  
  switch (sortOption) {
    case 'name':
      sortedColors.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sortedColors.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      // No specific sorting for colors
      break;
  }
  
  return sortedColors;
}

// Populate filter tags
function populateFilterTags() {
  const filterTagsContainer = document.getElementById('filter-tags');
  filterTagsContainer.innerHTML = '';
  
  allTags.forEach(tag => {
    const tagButton = document.createElement('button');
    tagButton.className = `filter-tag${tag === currentFilter ? ' active' : ''}`;
    tagButton.textContent = tag;
    
    tagButton.addEventListener('click', () => {
      // Toggle filter
      if (currentFilter === tag) {
        currentFilter = '';
        tagButton.classList.remove('active');
      } else {
        // Remove active class from all tags
        document.querySelectorAll('.filter-tag').forEach(btn => {
          btn.classList.remove('active');
        });
        
        currentFilter = tag;
        tagButton.classList.add('active');
      }
      
      // Re-render palettes
      renderPalettes();
      
      // Close filter menu
      filterMenu.classList.remove('show');
      filterToggle.classList.remove('active');
    });
    
    filterTagsContainer.appendChild(tagButton);
  });
}

// Show notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Open modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('show');
}

// Close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('show');
}

// Setup event listeners
function setupEventListeners() {
  // Mobile menu toggle
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  closeSidebar.addEventListener('click', toggleMobileMenu);
  
  // Navigation
  mainNav.forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
    });
  });
  
  // Visualization options
  vizOptions.forEach(item => {
    item.addEventListener('click', () => {
      switchVisualization(item.dataset.viz);
    });
  });
  
  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);
  
  // Search input
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderPalettes();
    renderColors();
  });
  
  // Filter toggle
  filterToggle.addEventListener('click', () => {
    filterMenu.classList.toggle('show');
    filterToggle.classList.toggle('active');
    
    // Close sort menu if open
    sortMenu.classList.remove('show');
    sortToggle.classList.remove('active');
  });
  
  // Sort toggle
  sortToggle.addEventListener('click', () => {
    sortMenu.classList.toggle('show');
    sortToggle.classList.toggle('active');
    
    // Close filter menu if open
    filterMenu.classList.remove('show');
    filterToggle.classList.remove('active');
  });
  
  // Sort options
  sortOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove active class from all options
      sortOptions.forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Set current sort and add active class
      currentSort = option.dataset.sort;
      option.classList.add('active');
      
      // Re-render palettes
      renderPalettes();
      renderColors();
      
      // Close sort menu
      sortMenu.classList.remove('show');
      sortToggle.classList.remove('active');
    });
  });
  
  // Generate palette button
  generatePaletteBtn.addEventListener('click', () => {
    openModal('ai-palette-modal');
  });
  
  // Close palette modal
  document.getElementById('close-palette-modal').addEventListener('click', () => {
    closeModal('palette-modal');
  });
  
  // Close color modal
  document.getElementById('close-color-modal').addEventListener('click', () => {
    closeModal('color-modal');
  });
  
  // Close pattern modal
  document.getElementById('close-pattern-modal').addEventListener('click', () => {
    closeModal('pattern-modal');
  });
  
  // Close AI palette modal
  document.getElementById('close-ai-palette-modal').addEventListener('click', () => {
    closeModal('ai-palette-modal');
  });
  
  // AI generate button
  document.getElementById('ai-generate-btn').addEventListener('click', async () => {
    const prompt = document.getElementById('ai-prompt-input').value;
    
    if (prompt.trim() === '') {
      showNotification('Please enter a prompt!');
      return;
    }
    
    generatedPalette = await generatePaletteWithAI(prompt);
  });
  
  // AI save button
  document.getElementById('ai-save-btn').addEventListener('click', () => {
    if (generatedPalette) {
      saveGeneratedPalette(generatedPalette.name, generatedPalette.colors);
      generatedPalette = null;
    }
  });
  
  // Close modals when clicking on backdrop
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', () => {
      const modal = backdrop.parentElement;
      modal.classList.remove('show');
    });
  });
  
  // Prevent event propagation from modal content
  document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown') && !e.target.classList.contains('dropdown-toggle')) {
      filterMenu.classList.remove('show');
      filterToggle.classList.remove('active');
      sortMenu.classList.remove('show');
      sortToggle.classList.remove('active');
    }
  });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
