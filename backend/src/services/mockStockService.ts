// Mock Stock Data Service
const mockQuotes: Record<string, any> = {
  'AAPL': {
    symbol: 'AAPL',
    price: {
      shortName: 'Apple Inc.',
      regularMarketPrice: { raw: 182.52, fmt: '$182.52' },
      regularMarketChange: { raw: 2.15, fmt: '+2.15' },
      regularMarketChangePercent: { raw: 1.19, fmt: '+1.19%' }
    }
  },
  'GOOGL': {
    symbol: 'GOOGL',
    price: {
      shortName: 'Alphabet Inc.',
      regularMarketPrice: { raw: 140.78, fmt: '$140.78' },
      regularMarketChange: { raw: -1.22, fmt: '-1.22' },
      regularMarketChangePercent: { raw: -0.86, fmt: '-0.86%' }
    }
  },
  'MSFT': {
    symbol: 'MSFT',
    price: {
      shortName: 'Microsoft Corporation',
      regularMarketPrice: { raw: 378.91, fmt: '$378.91' },
      regularMarketChange: { raw: 3.45, fmt: '+3.45' },
      regularMarketChangePercent: { raw: 0.92, fmt: '+0.92%' }
    }
  },
  'AMZN': {
    symbol: 'AMZN',
    price: {
      shortName: 'Amazon.com Inc.',
      regularMarketPrice: { raw: 169.23, fmt: '$169.23' },
      regularMarketChange: { raw: -0.77, fmt: '-0.77' },
      regularMarketChangePercent: { raw: -0.45, fmt: '-0.45%' }
    }
  },
  'TSLA': {
    symbol: 'TSLA',
    price: {
      shortName: 'Tesla Inc.',
      regularMarketPrice: { raw: 242.84, fmt: '$242.84' },
      regularMarketChange: { raw: 5.32, fmt: '+5.32' },
      regularMarketChangePercent: { raw: 2.24, fmt: '+2.24%' }
    }
  }
};

const mockSearchResults = [
  { symbol: 'AAPL', shortname: 'Apple Inc.', name: 'Apple Inc.' },
  { symbol: 'GOOGL', shortname: 'Alphabet Inc.', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', shortname: 'Microsoft Corporation', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', shortname: 'Amazon.com Inc.', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', shortname: 'Tesla Inc.', name: 'Tesla Inc.' },
  { symbol: 'NFLX', shortname: 'Netflix Inc.', name: 'Netflix Inc.' }
];

export class MockStockService {
  search(q: string): Promise<{ quotes: any[] }> {
    const filtered = mockSearchResults.filter(item =>
      item.symbol.toUpperCase().includes(q.toUpperCase()) ||
      item.shortname.toUpperCase().includes(q.toUpperCase())
    );
    return Promise.resolve({ quotes: filtered });
  }

  quote(symbol: string): Promise<any> {
    const quote = mockQuotes[symbol.toUpperCase()] || {
      symbol,
      price: {
        shortName: symbol,
        regularMarketPrice: { raw: 0, fmt: '$0.00' },
        regularMarketChange: { raw: 0, fmt: '0' },
        regularMarketChangePercent: { raw: 0, fmt: '0%' }
      }
    };
    return Promise.resolve(quote);
  }

  historical(symbol: string): Promise<any> {
    const now = Math.floor(Date.now() / 1000);
    const timestamps = Array.from({ length: 30 }, (_, i) => now - 86400 * (29 - i));
    const closes = Array.from({ length: 30 }, (_, i) => 150 + i * 0.8);

    return Promise.resolve({
      chart: {
        result: [
          {
            timestamp: timestamps,
            indicators: {
              quote: [{ close: closes }]
            }
          }
        ]
      }
    });
  }
}

export const mockStockService = new MockStockService();
