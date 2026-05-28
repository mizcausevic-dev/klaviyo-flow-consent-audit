// SPDX-License-Identifier: AGPL-3.0-or-later

import type {
  AnalysisOptions,
  CoverageReport,
  Finding,
  FlowPacket,
  KlaviyoFlowConsentExport,
} from "./types.js";

function hoursBetween(startIso: string, endIso: string) {
  return Math.max(0, (Date.parse(endIso) - Date.parse(startIso)) / 36e5);
}

function hasOpenPacket(packets: FlowPacket[], kind: string) {
  return packets.some((packet) => packet.kind === kind && packet.status === "OPEN");
}

export function analyze(
  payload: KlaviyoFlowConsentExport,
  options: AnalysisOptions = {}
): CoverageReport {
  const now = options.now ?? new Date().toISOString();
  const staleAfterHours = options.staleDetectionAfterHours ?? 72;
  const findingsList: Finding[] = [];

  const onTrackPrograms = payload.programs.filter((program) => program.status === "ON_TRACK").length;
  const highSeverityPackets = payload.packets.filter(
    (packet) => packet.status === "OPEN" && packet.severity === "high"
  ).length;
  const workflowGaps = payload.programs.filter((program) => !program.workflowHealthy).length;

  if (onTrackPrograms === 0) {
    findingsList.push({
      code: "no-on-track-flows",
      severity: "high",
      subject: "workflow",
      subjectId: "flows",
      subjectName: "Klaviyo lifecycle flows",
      message:
        "No lifecycle flows are currently on track; consent, suppression, and deliverability are operating entirely in exception mode."
    });
  }

  for (const program of payload.programs) {
    const programPackets = payload.packets.filter((packet) => packet.programId === program.id && packet.status === "OPEN");

    if (program.status === "AT_RISK" || programPackets.length > 0) {
      findingsList.push({
        code: "consent-audit-gap",
        severity: program.status === "AT_RISK" ? "high" : "medium",
        subject: "program",
        subjectId: program.id,
        subjectName: `${program.flow} ${program.id}`,
        owner: program.owner,
        scope: program.platform,
        message: `${program.flow} still has open evidence debt against the ${program.packet} packet.`
      });
    }

    if (programPackets.length > 0 && !hasOpenPacket(programPackets, "ConsentEvidence")) {
      findingsList.push({
        code: "missing-consent-evidence",
        severity: "medium",
        subject: "program",
        subjectId: program.id,
        subjectName: `${program.flow} ${program.id}`,
        owner: program.owner,
        scope: program.platform,
        message:
          "The flow is still in exception mode but does not currently show a clean consent-evidence packet in the review queue."
      });
    }

    if (!program.workflowHealthy) {
      findingsList.push({
        code: "workflow-gap",
        severity: "medium",
        subject: "workflow",
        subjectId: program.id,
        subjectName: `${program.flow} ${program.id}`,
        owner: program.owner,
        scope: program.platform,
        message:
          "Owner-safe routing is degraded; consent, suppression, deliverability, and attribution review are still split across teams."
      });
    }
  }

  for (const packet of payload.packets) {
    if (packet.status !== "OPEN") continue;

    if (packet.domain === "CONSENT" || packet.kind === "ConsentEvidence") {
      findingsList.push({
        code: "missing-consent-evidence",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.flow} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.domain === "AUDIENCE" || packet.kind === "AudienceSuppression") {
      findingsList.push({
        code: "missing-audience-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.flow} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.domain === "DELIVERABILITY" || packet.kind === "Deliverability") {
      findingsList.push({
        code: "missing-deliverability-readiness",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.flow} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.domain === "ATTRIBUTION" || packet.kind === "Attribution") {
      findingsList.push({
        code: "missing-attribution-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.flow} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (!packet.owner && packet.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "high",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        scope: packet.scope,
        message: "A high-severity lifecycle-marketing packet is still unassigned."
      });
    }

    if (hoursBetween(packet.openedAt, now) >= staleAfterHours) {
      findingsList.push({
        code: "stale-open-packet",
        severity: packet.severity === "high" ? "high" : "medium",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: `${packet.kind} evidence has been open longer than the Growth Ops review SLA.`
      });
    }
  }

  return {
    ok: findingsList.every((finding) => finding.severity !== "high"),
    programs: payload.programs.length,
    onTrackPrograms,
    packets: payload.packets.length,
    highSeverityPackets,
    workflowGaps,
    stalePackets: findingsList.filter((finding) => finding.code === "stale-open-packet").length,
    findingsList
  };
}
