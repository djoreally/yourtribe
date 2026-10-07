type ZeroAiScope = {
  workspaceId: string;
  userId: string;
  agentId: string;
  sessionId?: string;
};

type ZeroAiContextRequest = ZeroAiScope & {
  query: string;
  limit?: number;
};

type ZeroAiObservationRequest = ZeroAiScope & {
  content: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

const getBaseUrl = () => {
  const value = process.env.ZEROAI_BASE_URL?.trim();
  if (!value) throw new Error("ZEROAI_BASE_URL is not configured");
  return value.replace(/\/$/, "");
};

const getHeaders = () => {
  const apiKey = process.env.ZEROAI_API_KEY?.trim();
  return {
    "content-type": "application/json",
    ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
  };
};

export async function getAgentMemoryContext(input: ZeroAiContextRequest) {
  const response = await fetch(`${getBaseUrl()}/api/v1/brain/context`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`ZeroAI context request failed with ${response.status}`);
  }

  return response.json();
}

export async function observeAgentExperience(input: ZeroAiObservationRequest) {
  const response = await fetch(`${getBaseUrl()}/api/v1/brain/observe`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`ZeroAI observation request failed with ${response.status}`);
  }

  return response.json();
}
