import { describe, expect, it, vi } from "vitest";
import { sampleWebinar } from "../sampleData";
import {
  buildMailtoLink,
  buildPayload,
  clearLeads,
  getWebhookUrl,
  loadLeads,
  postWebhook,
  saveLead,
  setWebhookUrl,
} from "../storage";
import type { LeadInfo } from "../types";

const lead: LeadInfo = {
  name: "Alex Example",
  email: "alex@example.com",
  company: "Example Co",
};

describe("storage helpers", () => {
  it("saves, loads, and clears lead payloads locally", () => {
    const payload = buildPayload(lead, sampleWebinar);

    saveLead(payload);

    expect(loadLeads()).toEqual([payload]);

    clearLeads();
    expect(loadLeads()).toEqual([]);
  });

  it("persists and removes webhook URL settings", () => {
    setWebhookUrl("  https://n8n.example.com/webhook/webinar-rescue-kit-intake  ");

    expect(getWebhookUrl()).toBe("https://n8n.example.com/webhook/webinar-rescue-kit-intake");

    setWebhookUrl("   ");
    expect(getWebhookUrl()).toBe("");
  });

  it("builds a usable Bada mailto fallback", () => {
    const link = buildMailtoLink(lead, sampleWebinar);

    expect(link).toContain("mailto:alex@bada.digital");
    expect(decodeURIComponent(link)).toContain("Webinar Rescue Kit Inquiry");
    expect(decodeURIComponent(link)).toContain("alex@example.com");
  });
});

describe("postWebhook", () => {
  it("posts JSON to a configured webhook and reports success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);
    const payload = buildPayload(lead, sampleWebinar);

    const result = await postWebhook("https://n8n.example.com/webhook/webinar-rescue-kit-intake", payload);

    expect(result).toEqual({ ok: true, status: 200, message: "Sent successfully" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://n8n.example.com/webhook/webinar-rescue-kit-intake",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
  });

  it("returns a safe failure object on network errors", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await postWebhook("https://n8n.example.com/webhook/webinar-rescue-kit-intake", buildPayload(lead, sampleWebinar));

    expect(result).toEqual({ ok: false, message: "offline" });
  });
});
