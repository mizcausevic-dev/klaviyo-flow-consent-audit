import { describe, expect, test } from "vitest";

import { consentGaps, deliveryPosture, flowLane, summary, verification } from "./klaviyoFlowConsentAuditService.js";

describe("klaviyoFlowConsentAuditService", () => {
  test("summary exposes the expected operator counts", () => {
    expect(summary().programs).toBe(3);
    expect(summary().packets).toBe(5);
  });

  test("flow lane keeps four operator lanes", () => {
    expect(flowLane()).toHaveLength(4);
    expect(flowLane()[0]?.lane).toContain("Consent");
  });

  test("consent gaps include deliverability findings", () => {
    expect(consentGaps().some((finding) => finding.code === "missing-deliverability-readiness")).toBe(true);
  });

  test("delivery posture stays packet-shaped", () => {
    expect(deliveryPosture().every((packet) => typeof packet.completenessScore === "number")).toBe(true);
  });

  test("verification stays explicit about synthetic data", () => {
    expect(verification().join(" ")).toContain("synthetic");
  });
});
