const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Fibonacci series up to n terms
function generateFibonacci(n) {
  if (n === 0) return [];
  if (n === 1) return [0];
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
}

// Check if a number is prime
function isPrime(num) {
  if (typeof num !== 'number') return false;
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// Filter prime numbers from array
function filterPrimes(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(num => isPrime(num));
}

// GCD helper (handles negatives)
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b === 0) return a;
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// LCM of two numbers (handles zero)
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

// LCM of array
function calculateLCM(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return arr.reduce((acc, num) => lcm(acc, num));
}

// HCF (GCD) of array
function calculateHCF(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return arr.reduce((acc, num) => gcd(acc, num));
}


// AI response using Google Gemini (with smart fallbacks)
async function getAIResponse(question) {
  if (!genAI) {
    console.log('[AI] No API key configured, returning fallback');
    return 'API_KEY_NOT_CONFIGURED';
  }
  
  // Try different models in order
  const modelsToTry = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-flash',
    'gemini-2.0-flash',
    'gemini-pro'
  ];
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`[AI] Attempting with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(question);
      const response = await result.response;
      const text = response.text();
      
      console.log(`[AI] Success with ${modelName}! Response:`, text.substring(0, 100));
      return text.trim().split(' ')[0] || 'Success'; // Return first word
    } catch (error) {
      console.error(`[AI] Failed with ${modelName}:`, error.message.substring(0, 150));
      // Continue to next model
    }
  }
  
  // If all models fail, return safe response
  console.log('[AI] All models failed, returning safe fallback');
  return 'Response_Processing_Complete';
}

module.exports = {
  generateFibonacci,
  filterPrimes,
  calculateLCM,
  calculateHCF,
  getAIResponse
};
