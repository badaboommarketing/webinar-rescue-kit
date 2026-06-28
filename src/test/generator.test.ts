import { describe, expect, it } from "vitest";
import { generateKit } from "../generator";
import { sampleWebinar } from "../sampleData";
import { sampleResearchBrief } from "../research";

const requiredSections = [
  "executiveSnapshot",
  "researchIntelligence",
  "webinarStrategy",
  "campaignBrief",
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

    expect(kit.rescueScore.score).toBeGreaterThan(0);
    expect(kit.rescueScore.recommendedOffer).toContain("Event Lead Growth");
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

  it("uses attached research to create director-grade strategy sections", () => {
    const kit = generateKit(sampleWebinar, sampleResearchBrief);

    expect(kit.researchIntelligence.status).toBe("attached");
    expect(kit.researchIntelligence.competitorEventCadence).toHaveLength(2);
    expect(kit.webinarStrategy.strategicThesis).toContain(sampleWebinar.companyName);
    expect(kit.campaignBrief.directorNotes.some((note) => note.includes("Research attached"))).toBe(true);
    expect(kit.riskFlags.some((flag) => flag.includes("NO RESEARCH LAYER"))).toBe(false);
  });
});
