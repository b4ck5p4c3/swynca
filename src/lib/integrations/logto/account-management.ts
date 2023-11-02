import { getRequiredEnv } from "@/lib/utils/env";
import { PrismaClient } from "@prisma/client";
import axios, { AxiosInstance } from "axios";
import { AccountCreateDTO, AccountDTO, AccountPatchDTO, IntegrationAccountManagement } from "types/interfaces/account-management";

/**
 * Identifier of Logto Management API
 */
const LOGTO_MANAGEMENT_API_ID = 'https://default.logto.app/api';

export default class LogtoAccountManagement implements IntegrationAccountManagement {
  /**
   * Pre-configured axios client
   */
  private client?: AxiosInstance;

  /**
   * Prisma client
   */
  private prisma: PrismaClient;

  /**
   * ID of M2M application in Logto
   */
  private appId: string;

  /**
   * Secret of M2M application in Logto
   */
  private appSecret: string;

  /**
   * Base URL of Logto's API
   */
  private baseUrl: string;

  /**
   * Authenticates as M2M API consumer and returns an access token
   * @returns Bearer access token
   */
  private async getAccessToken(): Promise<string> {
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('resource', LOGTO_MANAGEMENT_API_ID);
    body.append('scope', 'all');

    const response = await axios.post(
      `${this.baseUrl}/oidc/token`,
      body,
      {
        auth: {
          username: this.appId,
          password: this.appSecret
        }
      });

    const { access_token } = response.data;
    return access_token;
  };

  /**
   * Returns an axios client with the correct headers
   * @returns 
   */
  private async getClient(): Promise<AxiosInstance> {
    // We assume that once the client is initialized, we can ignore the token's expiry
    // because this AccountManagement instance will likely be destroyed much sooner.
    if (this.client) {
      return this.client;
    }

    const accessToken = await this.getAccessToken();
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    return this.client;
  };

  /**
   * Converts Logto's API response to AccountDTO
   * @param props Fragment of M2M API response with User properties
   * @returns AccountDTO
   */
  private convertApiToAccount(props: any): AccountDTO {
    return {
      id: props.id,
      name: props.name,
      email: props.primaryEmail,
      active: !props.isSuspended
    }
  };

  constructor() {
    this.appId = getRequiredEnv('LOGTO_M2M_APP_ID');
    this.appSecret = getRequiredEnv('LOGTO_M2M_APP_SECRET');
    this.baseUrl = getRequiredEnv('LOGTO_M2M_BASE_URL');
    this.prisma = new PrismaClient();
  }

  async bind(memberId: string, externalId: string): Promise<void> {
    await this.prisma.externalAuthenticationLogto.upsert({
      where: {
        logtoId: externalId
      },
      update: { memberId },
      create: {
        logtoId: externalId,
        memberId
      }
    });
  }

  async getExternalId(memberId: string): Promise<string | null> {
    const binding = await this.prisma.externalAuthenticationLogto.findUnique({
      where: {
        memberId
      }
    });

    if (!binding) {
      return null;
    }

    return binding.logtoId;
  }

  async findAccountById(id: string): Promise<AccountDTO | null> {
    const api = await this.getClient();
    const response = await api.get(`/users/${id}`, {
      validateStatus: s => s === 200 || s === 404
    });

    if (response.status === 404) {
      return null;
    }

    return this.convertApiToAccount(response.data);
  }

  async createAccount(props: AccountCreateDTO): Promise<AccountDTO> {
    const api = await this.getClient();
    const response = await api.post(
      '/users',
      {
        name: props.name,
        username: props.username,
        password: props.password,
        primaryEmail: props.email,
      },
    );

    const account: AccountDTO = {
      active: props.active ?? true,
      email: response.data.primaryEmail,
      id: response.data.id,
      name: response.data.name,
    };

    // Disabling the account if requested
    if (props.active === false) {
      await this.disable(account.id);
    }

    return account;
  }

  async updateAccount(id: string, patch: AccountPatchDTO): Promise<AccountDTO> {
    const api = await this.getClient();

    // If there's nothing to update, fetch and return the account
    if (Object.keys(patch).length === 0) {
      const account = await this.findAccountById(id);
      if (!account) {
        throw new Error(`Logto account with ID ${id} is not exists`);
      }
      return account;
    }

    let response: any;
    if (patch.password) {
      response = await api.patch(
        `/users/${id}/password`,
        {
          password: patch.password
        },
      );
    }

    if (patch.name || patch.email) {
      response = await api.patch(
        `/users/${id}`,
        {
          name: patch.name ?? null,
          primaryEmail: patch.email ?? null,
        },
      );
    }

    return this.convertApiToAccount(response.data);
  }

  async disable(id: string): Promise<AccountDTO> {
    const api = await this.getClient();
    const response = await api.patch(
      `/users/${id}/is-suspended`,
      { isSuspended: true },
    );

    return this.convertApiToAccount(response.data);
  }

  async enable(id: string): Promise<AccountDTO> {
    const api = await this.getClient();
    const response = await api.patch(
      `/users/${id}/is-suspended`,
      { isSuspended: false },
    );

    return this.convertApiToAccount(response.data);
  }
}