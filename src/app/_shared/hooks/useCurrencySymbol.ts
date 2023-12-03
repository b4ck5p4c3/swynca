import { useMemo } from "react";

export default function useCurrencySymbol(): string {
  return useMemo(
    () =>
      new Intl.NumberFormat(process.env.NEXT_PUBLIC_SWYNCA_LOCALE, {
        style: "currency",
        currency: process.env.NEXT_PUBLIC_SWYNCA_CURRENCY,
      }).formatToParts(0)[4].value,
    []
  );
}
