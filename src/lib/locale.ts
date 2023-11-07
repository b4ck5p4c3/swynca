import { Prisma } from "@prisma/client";

const TIMEZONE = process.env.NEXT_PUBLIC_SWYNCA_TZ || "Etc/ETC";
const LOCALE = process.env.NEXT_PUBLIC_SWYNCA_LOCALE || "en-US";
const CURRENCY = process.env.NEXT_PUBLIC_SWYNCA_CURRENCY || "USD";

const dateOnlyFormat = new Intl.DateTimeFormat(LOCALE);
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE);

const currencyFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  currencyDisplay: "narrowSymbol",
});

const shortCurrencyFormat = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  maximumFractionDigits: 0,
  currencyDisplay: "narrowSymbol",
});

export function formatCurrency(amount: Prisma.Decimal, short?: boolean): string {
  if (short) {
    return shortCurrencyFormat.format(amount.toNumber());
  }
  return currencyFormat.format(amount.toNumber());
}
