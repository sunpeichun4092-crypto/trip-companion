export interface FxRateResult {
  settlement_currency: string;
  date: string;
  rates: Record<string, number>;
  source: 'frankfurter' | 'fallback';
}

const FALLBACK_RATES_TO_CNY: Record<string, number> = {
  CNY: 1,
  JPY: 0.047,
  USD: 7.2,
  EUR: 7.8,
  HKD: 0.92,
  KRW: 0.0052,
  THB: 0.2,
};

export async function getSettlementRates(
  currencies: string[],
  settlementCurrency: string,
  date = new Date(),
): Promise<FxRateResult> {
  const target = normalizeCurrency(settlementCurrency);
  const unique = Array.from(new Set(currencies.map(normalizeCurrency)));
  const rates: Record<string, number> = { [target]: 1 };
  const asOf = date.toISOString().slice(0, 10);
  let source: FxRateResult['source'] = 'frankfurter';

  for (const currency of unique) {
    if (currency === target) continue;
    try {
      rates[currency] = await fetchFrankfurterRate(currency, target);
    } catch {
      source = 'fallback';
      rates[currency] = fallbackRate(currency, target);
    }
  }

  return { settlement_currency: target, date: asOf, rates, source };
}

async function fetchFrankfurterRate(from: string, to: string): Promise<number> {
  const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  const res = await fetch(url, {
    headers: { accept: 'application/json' },
    next: { revalidate: 60 * 60 * 6 },
  });
  if (!res.ok) throw new Error(`FX provider returned ${res.status}`);
  const body = await res.json() as { rates?: Record<string, number> };
  const rate = body.rates?.[to];
  if (typeof rate !== 'number' || !Number.isFinite(rate) || rate <= 0) {
    throw new Error(`FX provider missing ${from}->${to}`);
  }
  return rate;
}

function fallbackRate(from: string, to: string): number {
  if (from === to) return 1;
  const fromCny = FALLBACK_RATES_TO_CNY[from];
  const toCny = FALLBACK_RATES_TO_CNY[to];
  if (typeof fromCny !== 'number' || typeof toCny !== 'number') {
    throw new Error(`missing fallback FX rate ${from}->${to}`);
  }
  return fromCny / toCny;
}

function normalizeCurrency(currency: string): string {
  return currency.trim().toUpperCase();
}
