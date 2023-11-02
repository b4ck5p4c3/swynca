import { AccountCreateDTO, AccountDTO, AccountPatchDTO, IntegrationAccountManagement } from "types/interfaces/account-management";

export default class LogtoAccountManagement implements IntegrationAccountManagement {
  bind(memberId: string, externalId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getExternalId(memberId: string): Promise<string | undefined> {
    throw new Error("Method not implemented.");
  }
  findAccountById(id: string): Promise<AccountDTO | undefined> {
    throw new Error("Method not implemented.");
  }
  createAccount(props: AccountCreateDTO): Promise<AccountDTO> {
    throw new Error("Method not implemented.");
  }
  updateAccount(id: string, patch: AccountPatchDTO): Promise<AccountDTO> {
    throw new Error("Method not implemented.");
  }
  disable(id: string): Promise<AccountDTO> {
    throw new Error("Method not implemented.");
  }
  enable(id: string): Promise<AccountDTO> {
    throw new Error("Method not implemented.");
  }
}