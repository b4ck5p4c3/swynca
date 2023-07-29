const TIMEZONE = process.env.SWYNCA_TZ || "Etc/ETC";
const LOCALE = process.env.NEXT_PUBLIC_SWYNCA_LOCALE || "en-US";
const CURRENCY = process.env.NEXT_PUBLIC_SWYNCA_CURRENCY || "USD";

const dateOnlyFormat = new Intl.DateTimeFormat(LOCALE);
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE);
const currencyFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
  currencyDisplay: "narrowSymbol",
});

export function formatCurrency(cents: number): string {
  return currencyFormat.format(cents / 100);
}
