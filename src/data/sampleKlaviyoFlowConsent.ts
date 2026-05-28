// SPDX-License-Identifier: AGPL-3.0-or-later

import type { KlaviyoFlowConsentExport } from "../types.js";

export const sampleKlaviyoFlowConsentPayload: KlaviyoFlowConsentExport = {
  programs: [
    {
      id: "FLOW-104",
      flow: "Winback reactivation",
      audience: "US lapsed subscribers > 120 days",
      platform: "Klaviyo + Snowflake",
      owner: "Lifecycle Marketing",
      status: "AT_RISK",
      workflowHealthy: false,
      hoursToSend: 14,
      packet: "winback-consent packet",
      excerpt: "Need one source of truth for consent, suppression, and attribution posture before the reactivation push.",
      nextAction: "Restore consent evidence and close the stale suppression packet."
    },
    {
      id: "FLOW-211",
      flow: "Post-purchase replenishment",
      audience: "US active subscribers by replenishment cohort",
      platform: "Klaviyo + Shopify",
      owner: "Retention Operations",
      status: "ON_TRACK",
      workflowHealthy: true,
      hoursToSend: 22,
      packet: "replenishment-delivery packet",
      excerpt: "Deliverability and suppression checkpoints are healthy, but the final attribution packet should still be archived.",
      nextAction: "Confirm the attribution archive and keep the replenishment window green."
    },
    {
      id: "FLOW-318",
      flow: "VIP promo launch",
      audience: "High-LTV subscribers in the priority cohort",
      platform: "Klaviyo + VWO",
      owner: "Growth Engineering",
      status: "AT_RISK",
      workflowHealthy: false,
      hoursToSend: 9,
      packet: "vip-launch packet",
      excerpt: "Suppression logic, approval posture, and deliverability guardrails are still split across marketing and RevOps teams.",
      nextAction: "Repair the delivery posture before the VIP promotion goes live."
    }
  ],
  packets: [
    {
      id: "PKT-701",
      programId: "FLOW-104",
      flow: "Winback reactivation",
      audience: "US lapsed subscribers > 120 days",
      platform: "Klaviyo + Snowflake",
      owner: "Lifecycle Marketing",
      domain: "CONSENT",
      kind: "ConsentEvidence",
      severity: "high",
      status: "OPEN",
      scope: "Reactivation consent ledger",
      principal: "winback-consent",
      message: "Consent evidence still does not reconcile historical opt-in posture with the reactivation audience export.",
      openedAt: "2026-05-24T14:00:00Z",
      dueAt: "2026-05-28T17:00:00Z"
    },
    {
      id: "PKT-702",
      programId: "FLOW-104",
      flow: "Winback reactivation",
      audience: "US lapsed subscribers > 120 days",
      platform: "Klaviyo + Snowflake",
      owner: "RevOps Governance",
      domain: "AUDIENCE",
      kind: "AudienceSuppression",
      severity: "medium",
      status: "OPEN",
      scope: "Suppression exclusion proof",
      principal: "winback-suppression",
      message: "The flow still lacks one consolidated suppression artifact for bounced, unsubscribed, and complaint-risk recipients.",
      openedAt: "2026-05-26T13:00:00Z",
      dueAt: "2026-05-29T18:00:00Z"
    },
    {
      id: "PKT-810",
      programId: "FLOW-211",
      flow: "Post-purchase replenishment",
      audience: "US active subscribers by replenishment cohort",
      platform: "Klaviyo + Shopify",
      owner: "Retention Operations",
      domain: "ATTRIBUTION",
      kind: "Attribution",
      severity: "low",
      status: "RESOLVED",
      scope: "Revenue event mapping review",
      principal: "replenishment-attribution",
      message: "Attribution packet approved and archived against the replenishment cohort.",
      openedAt: "2026-05-20T12:00:00Z",
      dueAt: "2026-05-22T12:00:00Z"
    },
    {
      id: "PKT-911",
      programId: "FLOW-318",
      flow: "VIP promo launch",
      audience: "High-LTV subscribers in the priority cohort",
      platform: "Klaviyo + VWO",
      owner: "Growth Engineering",
      domain: "DELIVERABILITY",
      kind: "Deliverability",
      severity: "high",
      status: "OPEN",
      scope: "Send-window readiness",
      principal: "vip-deliverability",
      message: "Deliverability safeguards are incomplete for the VIP launch; the send could ship before the latest domain warmup and throttling evidence are locked.",
      openedAt: "2026-05-23T10:30:00Z",
      dueAt: "2026-05-27T16:00:00Z"
    },
    {
      id: "PKT-912",
      programId: "FLOW-318",
      flow: "VIP promo launch",
      audience: "High-LTV subscribers in the priority cohort",
      platform: "Klaviyo + VWO",
      domain: "ATTRIBUTION",
      kind: "Attribution",
      severity: "high",
      status: "OPEN",
      scope: "Experiment holdout and attribution chain",
      principal: "vip-attribution",
      message: "The VIP campaign still lacks one owner-safe attribution chain for experiment holdout logic and downstream revenue proof.",
      openedAt: "2026-05-22T15:00:00Z",
      dueAt: "2026-05-27T15:00:00Z"
    }
  ]
};

export const flowLanePackets = [
  {
    id: "consent-lane",
    lane: "Consent evidence lane",
    owner: "Lifecycle Marketing",
    focus: "Opt-in proof, consent lineage, and audience permission posture",
    status: "RED",
    note: "Missing consent evidence is the fastest way to turn a revenue push into a legal and deliverability problem.",
    nextAction: "Reconcile the consent ledger and close the missing evidence packet."
  },
  {
    id: "audience-lane",
    lane: "Audience suppression lane",
    owner: "RevOps Governance",
    focus: "Suppression integrity, exclusions, and segment hygiene",
    status: "YELLOW",
    note: "Suppression posture is partially healthy, but one packet is still open against a sensitive winback flow.",
    nextAction: "Collapse duplicate suppressions into one send-safe evidence packet."
  },
  {
    id: "delivery-lane",
    lane: "Delivery lane",
    owner: "Growth Engineering",
    focus: "Send-window readiness, throttling, and domain safety",
    status: "RED",
    note: "Delivery posture is degraded for the VIP launch because warmup and throttle proof are not fully locked.",
    nextAction: "Restore the send-window guardrail before release."
  },
  {
    id: "measurement-lane",
    lane: "Measurement lane",
    owner: "Analytics + Attribution",
    focus: "Experiment holdouts, attribution trust, and revenue proof",
    status: "YELLOW",
    note: "Attribution evidence exists, but some exception packets still depend on manual coordination.",
    nextAction: "Assign the remaining high-severity packet and validate the measurement path."
  }
];

export const deliveryPackets = [
  {
    packetId: "SEND-17",
    lane: "Winback reactivation",
    completenessScore: 54,
    owner: "Lifecycle Marketing",
    status: "RED",
    blocker: "Consent proof and suppression packet are still split across teams.",
    launchWindowHours: 14,
    decisionNote: "Do not send until the reactivation consent and suppression packets are reconciled."
  },
  {
    packetId: "SEND-24",
    lane: "Replenishment flow",
    completenessScore: 89,
    owner: "Retention Operations",
    status: "GREEN",
    blocker: "No active blocker. Final attribution archive still recommended.",
    launchWindowHours: 22,
    decisionNote: "Safe to schedule once the attribution archive is attached."
  },
  {
    packetId: "SEND-33",
    lane: "VIP promo launch",
    completenessScore: 61,
    owner: "Growth Engineering",
    status: "RED",
    blocker: "Deliverability safeguards and attribution chain are incomplete for the VIP promotion.",
    launchWindowHours: 9,
    decisionNote: "Hold until domain warmup, throttle posture, and holdout proof are validated."
  },
  {
    packetId: "SEND-41",
    lane: "Consent recovery branch",
    completenessScore: 78,
    owner: "MarTech Ops",
    status: "YELLOW",
    blocker: "Fallback suppression review is still manual for one branch audience.",
    launchWindowHours: 16,
    decisionNote: "Can clear if the fallback owner and suppression archive are locked in the next cycle."
  }
];
