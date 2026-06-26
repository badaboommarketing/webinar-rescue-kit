import { describe, expect, it } from "vitest";
import { generateKit } from "../generator";
import { sampleWebinar } from "../sampleData";

const requiredSections = [
  "executiveSnapshot",
  "positioning",
  "landingPage",
  "emailSequence",
  "postWebinarFollowUp",
  "adAngles",
  "salesHandoff",
  "productionChecklist",
  "riskFlags",
] as const;

describe("generateKit", () => {
  it("creates every promised campaign section from sample input", () => {
    const kit = generateKit(sampleWebinar);

    for (const key of requiredSections) {
      expect(kit[key]).toBeTruthy();
    }

    expect(kit.emailSequence).toHaveLength(5);
    expect(kit.postWebinarFollowUp).toHaveLength(3);
    expect(kit.adAngles.length).toBeGreaterThanOrEqual(3);
    expect(kit.salesHandoff.length).toBeGreaterThanOrEqual(5);
    expect(kit.productionChecklist.length).toBeGreaterThanOrEqual(8);
  });

  it("keeps unsupported proof as an explicit placeholder instead of inventing stats", () => {
    const kit = generateKit(sampleWebinar);

    expect(kit.landingPage.socialProofNote).toContain("[INSERT REAL PROOF]");
    expect(kit.landingPage.socialProofNote).toContain("Do not invent numbers");
  });

  it("surfaces missing unique-angle risk when the input is weak", () => {
    const kit = generateKit({ ...sampleWebinar, uniqueAngle: "" });

    expect(kit.positioning.differentiation).toContain("[MISSING]");
    expect(kit.riskFlags.some((flag) => flag.includes("NO UNIQUE ANGLE"))).toBe(true);
  });
});
