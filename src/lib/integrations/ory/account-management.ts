import { getRequiredEnv } from "@/lib/utils";
import {
  Configuration,
  Identity,
  IdentityApi,
  IdentityApiCreateIdentityRequest,
  IdentityApiUpdateIdentityRequest,
  IdentityState,
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
        apiKey: 'Bearer ' + getRequiredEnv("ORY_ADMIN_APIKEY"),
      })
    );
  }

  async disable(id: string): Promise<AccountDTO> {
    return this.changeAccountState(id, IdentityState.Inactive);
  }
  async enable(id: string): Promise<AccountDTO> {
    return this.changeAccountState(id, IdentityState.Active);
  }

  async changeAccountState(id: string, state: IdentityState): Promise<AccountDTO> {
    const request:IdentityApiUpdateIdentityRequest = {
      id: id,
      updateIdentityBody: {
        state: state,
        schema_id: 'person',
        traits: {}
      },
    }
    const result = await this.api.updateIdentity(request);
    return identityToAccount(result.data);
  }

  async findAccountById(id: string): Promise<AccountDTO | undefined> {
    const identity = await this.api.getIdentity({ id });
    if (identity.status !== 200) {
      return undefined;
    }

    return identityToAccount(identity.data);
  }

  async createAccount(props: AccountCreateDTO): Promise<AccountDTO> {
    const request:IdentityApiCreateIdentityRequest = {
      createIdentityBody: {
        schema_id: getRequiredEnv("ORY_MEMBER_SCHEMA_ID"),
        state: IdentityState.Active,
        verifiable_addresses: [
          {
            value: props.email,
            via: 'email',
            verified: true,
            status: 'verified',
          },
        ],
        traits: {
          name: props.name,
          email: props.email,
        }
      }
    };
    const result = await this.api.createIdentity(request);

    return identityToAccount(result.data);
  }

  async updateAccount(id: string, patch: AccountPatchDTO): Promise<AccountDTO> {
    const jsonPatch = ['name', 'email'].map(el => {
      // @ts-ignore
      return { from: `/${el}`, op: 'replace', path: `/${el}`, value: patch[el] };
    });
    const result = await this.api.patchIdentity({
      id,
      jsonPatch: jsonPatch,
    });

    return identityToAccount(result.data);
  }
}