import { Prisma } from "@prisma/client";

const TIMEZONE = process.env.NEXT_PUBLIC_SWYNCA_TZ || "Etc/ETC";
const LOCALE = process.env.NEXT_PUBLIC_SWYNCA_LOCALE || "en-US";
const CURRENCY = process.env.NEXT_PUBLIC_SWYNCA_CURRENCY || "USD";

const dateOnlyFormat = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

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

export function formatCurrency(amount: number, short?: boolean): string {
  if (short) {
    return shortCurrencyFormat.format(amount);
  }
  return currencyFormat.format(amount);
}

export function formatDateShort(date: string): string;
export function formatDateShort(date: Date): string;
export function formatDateShort(date: any): string {
  if (typeof date === "string") {
    return dateOnlyFormat.format(new Date(date));
  }
  return dateOnlyFormat.format(date);
}

export function formatDateTimeShort(date: string): string;
export function formatDateTimeShort(date: Date): string;
export function formatDateTimeShort(date: any): string {
  if (typeof date === "string") {
    return dateTimeFormat.format(new Date(date));
  }
  return dateTimeFormat.format(date);
}
