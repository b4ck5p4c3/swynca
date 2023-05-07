const TIMEZONE = process.env.SWYNCA_TZ || "Etc/ETC";
const LOCALE = process.env.SWYNCA_LOCALE || "en-US";
const CURRENCY = process.env.SWYNCA_CURRENCY || 'USD';

const dateOnlyFormat = new Intl.DateTimeFormat(LOCALE);
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE);
const currencyFormat = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumSignificantDigits: 2,
  currencyDisplay: 'narrowSymbol'
});

export function formatCurrency(cents: number): string {
  return currencyFormat.format(cents / 100);
}
