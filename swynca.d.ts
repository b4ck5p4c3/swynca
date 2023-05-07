declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SWYNCA_TZ?: string;
      SWYNCA_LOCALE?: string;
      SWYNCA_CURRENCY?: string;
    }
  }
}

export {}
