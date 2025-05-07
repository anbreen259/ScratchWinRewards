interface ScratchCardConfig {
  brushSize?: number;
  revealPercent?: number;
  finishPercent?: number;
}

export const createScratchCard = (
  canvas: HTMLCanvasElement,
  container: HTMLDivElement,
  onScratchProgress?: (percent: number) => void,
  config: ScratchCardConfig = {}
) => {
  // Default configuration
  const defaultConfig = {
    brushSize: 40,
    revealPercent: 0.5, // 50% scratch to reveal the prize
    finishPercent: 0.7, // 70% scratch to trigger complete
  };
  
  // Merge user config with defaults
  const { brushSize, revealPercent, finishPercent } = {
    ...defaultConfig,
    ...config
  };
  
  // Setup canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return {
      destroy: () => {},
      getPercentScratched: () => 0
    };
  }
  
  // Set canvas dimensions to match container
  const { width, height } = container.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
  
  // Create a custom scratch-off pattern
  const drawCustomPattern = () => {
    // Fill with a royal blue base color
    ctx.fillStyle = '#1a365d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw a custom gold pattern
    ctx.fillStyle = '#ffc107';
    
    // Draw some gold stars/sparkles
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 8 + 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Add some decorative lines
    ctx.strokeStyle = '#ffc107';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, 0);
      ctx.lineTo(Math.random() * canvas.width, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * canvas.height);
      ctx.lineTo(canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    
    // Add text
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);
  };
  
  // Draw the pattern
  drawCustomPattern();
  
  // Variables to track scratch state
  let isDrawing = false;
  let totalPixels = canvas.width * canvas.height;
  let scratchedPixels = 0;
  let percentScratched = 0;
  
  // Calculate the scratched percentage
  const calculateScratchPercentage = () => {
    // Get image data from canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Count transparent pixels (scratched area)
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) { // Check alpha value (less than 128 is mostly transparent)
        transparentPixels++;
      }
    }
    
    // Calculate percentage
    scratchedPixels = transparentPixels;
    percentScratched = (scratchedPixels / totalPixels) * 100;
    
    // Call progress callback if provided
    if (onScratchProgress) {
      onScratchProgress(percentScratched);
    }
    
    return percentScratched;
  };
  
  // Draw function for scratching
  const draw = (x: number, y: number) => {
    if (!isDrawing) return;
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Check the scratch percentage
    calculateScratchPercentage();
  };
  
  // Mouse and touch event handlers
  const startDrawing = (e: MouseEvent | TouchEvent) => {
    isDrawing = true;
    
    let x, y;
    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      const rect = canvas.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    draw(x, y);
  };
  
  const moveDrawing = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    
    let x, y;
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling on touch devices
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      const rect = canvas.getBoundingClientRect();
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    draw(x, y);
  };
  
  const stopDrawing = () => {
    isDrawing = false;
  };
  
  // Attach event listeners
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', moveDrawing);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
  
  // Touch events
  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', moveDrawing, { passive: false });
  canvas.addEventListener('touchend', stopDrawing);
  
  // Cleanup function to remove event listeners
  const destroy = () => {
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.removeEventListener('mousemove', moveDrawing);
    canvas.removeEventListener('mouseup', stopDrawing);
    canvas.removeEventListener('mouseleave', stopDrawing);
    
    canvas.removeEventListener('touchstart', startDrawing);
    canvas.removeEventListener('touchmove', moveDrawing);
    canvas.removeEventListener('touchend', stopDrawing);
  };
  
  return {
    destroy,
    getPercentScratched: () => percentScratched
  };
};

// Helper function to create confetti animation
export const createConfetti = () => {
  const confettiColors = ['#ffc107', '#1a365d', '#ffffff', '#f59e0b', '#3b82f6'];
  
  // Create and append confetti elements
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
    document.body.appendChild(confetti);
    
    // Remove confetti after animation completes
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
};
