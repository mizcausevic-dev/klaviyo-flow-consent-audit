// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  consentGaps,
  deliveryPosture,
  flowLane,
  summary
} from "../src/services/klaviyoFlowConsentAuditService.js";

console.log("klaviyo-flow-consent-audit demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`flow lanes: ${flowLane().length}`);
console.log(`consent gap findings: ${consentGaps().length}`);
console.log(`delivery packets: ${deliveryPosture().length}`);
