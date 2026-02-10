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


async function getAIResponse(question) {
  if (!genAI) return 'API_KEY_NOT_CONFIGURED';
  try {
    if (typeof genAI.generate === 'function') {
      const result = await genAI.generate(question);
      if (typeof result === 'string') return result.trim();
      if (result && result.output) return String(result.output).trim();
    }

    if (typeof genAI.getGenerativeModel === 'function') {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      if (model && typeof model.generateContent === 'function') {
      
        const result = await model.generateContent({ prompt: question });
        if (result && result.output && Array.isArray(result.output) && result.output[0]) {
          const out = result.output[0];
          if (typeof out === 'string') return out.trim();
          if (out && out.content) {
            if (Array.isArray(out.content)) return out.content.map(c => c.text || '').join('').trim();
            if (typeof out.content.text === 'string') return out.content.text.trim();
          }
        }
      }
    }

    return 'AI service unavailable';
  } catch (error) {
    throw new Error('AI service unavailable');
  }
}

module.exports = {
  generateFibonacci,
  filterPrimes,
  calculateLCM,
  calculateHCF,
  getAIResponse
};
