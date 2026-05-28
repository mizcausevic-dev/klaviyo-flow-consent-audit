// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdir, writeFile } from "node:fs/promises";

import {
  consentGaps,
  deliveryPosture,
  flowLane,
  payload,
  summary,
  verification
} from "../src/services/klaviyoFlowConsentAuditService.js";
import {
  renderConsentGaps,
  renderDeliveryPosture,
  renderDocs,
  renderFlowLane,
  renderOverview,
  renderValidation
} from "../src/services/render.js";

async function writePage(route: string, html: string) {
  const directory = route === "/" ? "site" : `site${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html, "utf8");
}

async function writeJson(name: string, value: unknown) {
  await mkdir("site/api", { recursive: true });
  await writeFile(`site/api/${name}.json`, JSON.stringify(value, null, 2), "utf8");
}

await writePage("/", renderOverview());
await writePage("/flow-lane", renderFlowLane());
await writePage("/consent-gaps", renderConsentGaps());
await writePage("/delivery-posture", renderDeliveryPosture());
await writePage("/verification", renderValidation());
await writePage("/docs", renderDocs());

await writeJson("summary", summary());
await writeJson("flow-lane", flowLane());
await writeJson("consent-gaps", consentGaps());
await writeJson("delivery-posture", deliveryPosture());
await writeJson("verification", verification());
await writeJson("sample", payload());
