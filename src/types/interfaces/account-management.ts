/**
 * External integration Account properties
 */
export interface AccountDTO {
  id: string;
  email: string;
  name: string;
  active: boolean;
  password: string;
}

/**
 * DTO for new Account creation
 */
export interface AccountCreateDTO {
  email: string;
  name: string;
  active?: boolean;
}

/**
 * Options we can change
 */
export interface AccountPatchDTO {
  email?: string;
  name?: string;
  password?: string;
}

/**
 * Account Management interface for external integrations
 */
export interface IntegrationAccountManagement {
  /**
   * Finds an External Account ID by internal Member ID
   * @param memberId Member ID on our side
   */
  getExternalId(memberId: string): Promise<string | undefined>;

  /**
   * Binds an External Account ID to internal Member ID
   * @param memberId Member ID on our side
   * @param externalId External (SSO) Account ID
   */
  bind(memberId: string, externalId: string): Promise<void>;

  /**
   * Finds an Account by its ID
   * @param id Account ID in integration
   * @returns External account, or "undefined" if not found
   */
  findAccountById(id: string): Promise<AccountDTO | undefined>;

  /**
   * Creates a new account
   * @param props Properties of a new account
   * @returns Shiny new account
   */
  createAccount(props: AccountCreateDTO): Promise<AccountDTO>;

  /**
   * Updates account
   * @param id Account ID in integration
   * @param patch Properties with its new values
   */
  updateAccount(id: string, patch: AccountPatchDTO): Promise<AccountDTO>;

  /**
   * Disables account
   * @param id Account ID in integration
   */
  disable(id: string): Promise<AccountDTO>;

  /**
   * Enables account
   * @param id Account ID in integration
   */
  enable(id: string): Promise<AccountDTO>;
}
