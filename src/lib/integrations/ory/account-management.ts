import { getRequiredEnv } from "@/lib/utils/env";
import {
  Configuration,
  Identity,
  IdentityApi,
  JsonPatch,
} from "@ory/kratos-client";
import {
  AccountCreateDTO,
  AccountDTO,
  AccountPatchDTO,
  IntegrationAccountManagement,
} from "types/interfaces/account-management";

function getOryIdentityEmail(
  addresses: Identity["verifiable_addresses"]
): string {
  // @todo this rule is written on a plane with only SDK types.
  // Likely, "verified" is not enough, so it should be more strict.
  return addresses!.find((address) => address.verified)!.value;
}

function identityToAccount(identity: Identity): AccountDTO {
  return {
    id: identity.id,
    active: identity.state === "active",
    email: getOryIdentityEmail(identity.verifiable_addresses),
    name: identity.traits.name,
  };
}

export default class OryAccountManagement
  implements IntegrationAccountManagement
{
  private api: IdentityApi;
  constructor() {
    this.api = new IdentityApi(
      new Configuration({
        basePath: getRequiredEnv("ORY_ADMIN_URL"),
        apiKey: getRequiredEnv("ORY_ADMIN_APIKEY"),
      })
    );
  }

  async findAccountById(id: string): Promise<AccountDTO | undefined> {
    const identity = await this.api.getIdentity({ id });
    if (identity.status !== 200) {
      return undefined;
    }

    return identityToAccount(identity.data);
  }

  async createAccount(props: AccountCreateDTO): Promise<AccountDTO> {
    const result = await this.api.createIdentity({
      createIdentityBody: {
        schema_id: "default",
        verifiable_addresses: [
          {
            value: props.email,
            status: "verified", // @todo I DUNNO KNOW
            via: "ADMIN_FORCE", // @todo I DUNNO KNOW AS WELL
            verified: true,
          },
        ],
        traits: {
          name: props.name,
        },
      },
    });

    return identityToAccount(result.data);
  }

  async updateAccount(id: string, patch: AccountPatchDTO): Promise<AccountDTO> {
    const result = await this.api.patchIdentity({
      id,
      jsonPatch: {},
    });

    return identityToAccount(result.data);
  }
}
