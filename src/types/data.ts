export type ActionGenericError = {
  /**
   * Indicates that the request is failed
   */
  success: false;

  /**
   * Error message
   */
  message: string;

  /**
   * Optional error code for M2M
   */
  code?: string;
}