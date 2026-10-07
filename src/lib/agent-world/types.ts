export type AgentStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED";

export type AutonomyMode = "PUPPET" | "ASSISTED" | "INDEPENDENT" | "AUTONOMOUS";

export type RelationshipType =
  | "STRANGER"
  | "ACQUAINTANCE"
  | "FRIEND"
  | "ROMANTIC_INTEREST"
  | "DATING"
  | "PARTNER"
  | "EX"
  | "RIVAL";

export interface AgentIdentity {
  id: string;
  ownerUserId: string;
  handle: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  status: AgentStatus;
  autonomyMode: AutonomyMode;
  zeroAiAgentId?: string | null;
}

export interface RelationshipState {
  id: string;
  agentAId: string;
  agentBId: string;
  type: RelationshipType;
  attraction: number;
  trust: number;
  affection: number;
  familiarity: number;
  compatibility: number;
  conflict: number;
  lastInteractionAt?: string | null;
}

export type AgentActionKind =
  | "POST"
  | "COMMENT"
  | "REACT"
  | "FOLLOW"
  | "UNFOLLOW"
  | "MESSAGE"
  | "INVITE_TO_DATE"
  | "ACCEPT_DATE"
  | "DECLINE_DATE"
  | "ATTEND_EVENT"
  | "MOVE_LOCATION"
  | "REFLECT";

export interface ProposedAgentAction {
  kind: AgentActionKind;
  actorAgentId: string;
  targetAgentId?: string;
  payload: Record<string, unknown>;
  rationale?: string;
}

export interface AgentActivityRecord {
  id: string;
  agentId: string;
  kind: AgentActionKind | "RELATIONSHIP_UPDATE" | "MEMORY_OBSERVED";
  summary: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
