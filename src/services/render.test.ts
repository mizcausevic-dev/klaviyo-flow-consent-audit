import { describe, expect, test } from "vitest";

import { renderDocs, renderOverview } from "./render.js";

describe("render surfaces", () => {
  test("overview carries the new flow consent audit title", () => {
    expect(renderOverview()).toContain("Klaviyo Flow Consent Audit");
    expect(renderOverview()).toContain("/flow-lane");
  });

  test("docs route exposes the CLI and API shape", () => {
    const html = renderDocs();
    expect(html).toContain("klaviyo-flow-audit");
    expect(html).toContain("/api/consent-gaps");
  });
});
