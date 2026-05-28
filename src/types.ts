// SPDX-License-Identifier: AGPL-3.0-or-later

export type FlowStatus = "ON_TRACK" | "AT_RISK";
export type PacketStatus = "OPEN" | "RESOLVED";
export type Severity = "high" | "medium" | "low" | "info";
export type EvidenceKind =
  | "ConsentEvidence"
  | "AudienceSuppression"
  | "Deliverability"
  | "Attribution"
  | "Approval"
  | string;
export type FlowDomain = "CONSENT" | "AUDIENCE" | "DELIVERABILITY" | "ATTRIBUTION" | "WORKFLOW" | string;

export interface FlowProgram {
  id: string;
  flow: string;
  audience: string;
  platform: string;
  owner: string;
  status: FlowStatus;
  workflowHealthy: boolean;
  hoursToSend: number;
  packet: string;
  excerpt: string;
  nextAction: string;
}

export interface FlowPacket {
  id: string;
  programId: string;
  flow: string;
  audience: string;
  platform: string;
  owner?: string;
  domain: FlowDomain;
  kind: EvidenceKind;
  severity: Severity;
  status: PacketStatus;
  scope: string;
  principal?: string;
  message: string;
  openedAt: string;
  dueAt: string;
}

export interface KlaviyoFlowConsentExport {
  programs: FlowProgram[];
  packets: FlowPacket[];
}

export type FindingCode =
  | "no-on-track-flows"
  | "consent-audit-gap"
  | "missing-consent-evidence"
  | "missing-audience-proof"
  | "missing-deliverability-readiness"
  | "missing-attribution-proof"
  | "workflow-gap"
  | "stale-open-packet"
  | "high-severity-unassigned";

export interface Finding {
  code: FindingCode;
  severity: Severity;
  subject: "program" | "packet" | "workflow";
  subjectId: string;
  subjectName?: string;
  owner?: string;
  scope?: string;
  principal?: string;
  message: string;
}

export interface AnalysisOptions {
  now?: string;
  staleDetectionAfterHours?: number;
}

export interface CoverageReport {
  ok: boolean;
  programs: number;
  onTrackPrograms: number;
  packets: number;
  highSeverityPackets: number;
  workflowGaps: number;
  stalePackets: number;
  findingsList: Finding[];
}
