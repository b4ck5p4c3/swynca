import LogtoProviderFactory from "@/lib/integrations/logto/auth-provider";
import LogtoAccountManagement from "@/lib/integrations/logto/account-management";

// @todo implement some sort of DI
export const authProviderFactory = LogtoProviderFactory;
export const AccountManagement = LogtoAccountManagement;
