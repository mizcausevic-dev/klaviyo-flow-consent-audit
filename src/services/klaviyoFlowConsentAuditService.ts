// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { deliveryPackets, flowLanePackets, sampleKlaviyoFlowConsentPayload } from "../data/sampleKlaviyoFlowConsent.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-31T00:00:00Z";
const report = analyze(sampleKlaviyoFlowConsentPayload, {
  now: NOW,
  staleDetectionAfterHours: 72
});

function severityRank(finding: Finding): number {
  return finding.severity === "high" ? 0 : finding.severity === "medium" ? 1 : finding.severity === "low" ? 2 : 3;
}

export function summary() {
  return {
    programs: report.programs,
    onTrackPrograms: report.onTrackPrograms,
    packets: report.packets,
    highSeverityPackets: report.highSeverityPackets,
    workflowGaps: report.workflowGaps,
    stalePackets: report.stalePackets,
    recommendation:
      "Restore missing consent evidence, close suppression and deliverability packet gaps, repair stale send windows, and stabilize Growth Ops ownership before the next launch window."
  };
}

export function flowLane() {
  return flowLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "consent-lane") return finding.code === "consent-audit-gap" || finding.code === "missing-consent-evidence";
      if (lane.id === "audience-lane") return finding.code === "missing-audience-proof" || finding.code === "stale-open-packet";
      if (lane.id === "delivery-lane") return finding.code === "missing-deliverability-readiness" || finding.code === "workflow-gap";
      if (lane.id === "measurement-lane") return finding.code === "missing-attribution-proof" || finding.code === "high-severity-unassigned";
      return false;
    }).length
  }));
}

export function consentGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "missing-consent-evidence"
          ? "Lifecycle Marketing"
          : finding.code === "missing-audience-proof"
            ? "RevOps Governance"
            : finding.code === "missing-deliverability-readiness"
              ? "Growth Engineering"
              : finding.code === "missing-attribution-proof"
                ? "Analytics + Attribution"
                : "MarTech Operations")
    }));
}

export function deliveryPosture() {
  return deliveryPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline Klaviyo-flavored analyzer and CLI, not static copy alone.",
    "Flow, packet, and review snapshots are synthetic sample data only; no live customer, tenant, or identity records are published.",
    "The control plane keeps consent proof, suppression drift, deliverability readiness, and attribution posture visible for growth and audit stakeholders.",
    "This surface demonstrates Growth Ops consent and send-safe sequencing, not a generic MarTech keyword page.",
    "It complements workforce, security, and data surfaces with a reusable evidence-routing primitive."
  ];
}

export const validation = verification;

export function payload() {
  return {
    summary: summary(),
    flowLane: flowLane(),
    consentGaps: consentGaps(),
    deliveryPosture: deliveryPosture(),
    verification: verification(),
    sample: sampleKlaviyoFlowConsentPayload
  };
}
