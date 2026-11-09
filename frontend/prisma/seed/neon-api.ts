// The few Neon API calls the seed needs. https://api-docs.neon.tech/reference/getting-started-with-neon-api

import type { NeonBranchInfo } from "./target";

const BASE_URL = "https://console.neon.tech/api/v2";

export class NeonApi {
  constructor(
    private readonly apiKey: string,
    private readonly projectId: string,
  ) {}

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    const response = await fetch(
      `${BASE_URL}/projects/${this.projectId}${path}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      },
    );
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(
        `Neon API ${method} ${path} failed: ${response.status} ${text}`.trim(),
      );
    }
    return (await response.json()) as T;
  }

  async getEndpointBranchId(endpointId: string): Promise<string> {
    const { endpoint } = await this.request<{
      endpoint: { branch_id: string };
    }>("GET", `/endpoints/${endpointId}`);
    return endpoint.branch_id;
  }

  async getBranch(branchId: string): Promise<NeonBranchInfo> {
    const { branch } = await this.request<{
      branch: {
        id: string;
        name: string;
        project_id: string;
        default: boolean;
        primary?: boolean;
        protected?: boolean;
      };
    }>("GET", `/branches/${branchId}`);
    return {
      id: branch.id,
      name: branch.name,
      projectId: branch.project_id,
      default: branch.default,
      primary: branch.primary,
      protected: branch.protected,
    };
  }

  /** Creates a Neon Auth user on the branch. Works with sign-up disabled. Returns the user ID. */
  async createAuthUser(
    branchId: string,
    email: string,
    name: string,
  ): Promise<string> {
    const { id } = await this.request<{ id: string }>(
      "POST",
      `/branches/${branchId}/auth/users`,
      {
        email,
        name,
      },
    );
    return id;
  }
}
