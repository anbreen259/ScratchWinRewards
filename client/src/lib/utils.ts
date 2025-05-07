import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatDate(date: Date | string | undefined): string {
  if (!date) return 'Never';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Get today and yesterday dates
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if the date is today or yesterday
  if (d.toDateString() === today.toDateString()) {
    return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (d.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  }
  
  // Otherwise return full date
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function createConfetti() {
  const confettiColors = [
    'hsl(var(--premium-gold-500))',
    'hsl(var(--royal-blue-600))', 
    '#FFFFFF', 
    'hsl(var(--premium-gold-400))', 
    'hsl(var(--royal-blue-400))'
  ];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.width = `${Math.random() * 10 + 5}px`;
    confetti.style.height = `${Math.random() * 10 + 5}px`;
    confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
    document.body.appendChild(confetti);
    
    // Remove confetti after animation completes
    setTimeout(() => {
      if (confetti.parentNode) {
        confetti.parentNode.removeChild(confetti);
      }
    }, 5000);
  }
}

export function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function getGrowthClass(growth: number): string {
  return growth >= 0 ? 'text-green-500' : 'text-red-500';
}

export function getPrizeStockStatus(stock: number | null): { label: string; colorClass: string } {
  if (stock === null) {
    return { label: 'Unlimited', colorClass: 'bg-green-100 text-green-800' };
  } else if (stock <= 0) {
    return { label: 'Out of Stock', colorClass: 'bg-red-100 text-red-800' };
  } else if (stock < 10) {
    return { label: 'Low Stock', colorClass: 'bg-yellow-100 text-yellow-800' };
  } else {
    return { label: 'In Stock', colorClass: 'bg-green-100 text-green-800' };
  }
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
