import type { WebinarInput } from "./types";

export const sampleWebinar: WebinarInput = {
  title: "Pipeline Rescue: 5 Webinar Fixes That Actually Move Revenue",
  topic: "Webinar-led pipeline generation for B2B teams",
  targetAudience:
    "B2B marketing managers and demand-gen leads at companies with 50-500 employees who run webinars but struggle to convert attendees into pipeline",
  speakerName: "Jordan Chen",
  speakerCredentials:
    "VP of Marketing at Acme Growth Co, 12 years in B2B demand gen, formerly led webinar programs at two Series B SaaS companies",
  companyName: "Acme Growth Co",
  painPoint:
    "Webinars get registrations but produce almost zero qualified pipeline — attendees ghost after the replay email",
  mainPromise:
    "A 5-step framework to turn webinar attendees into sales-qualified conversations within 14 days of the event",
  dateTime: "2026-07-15 11:00 AM ET",
  duration: "45 minutes",
  format: "live",
  platform: "Zoom",
  callToAction: "Book a free pipeline audit with our team",
  productService:
    "Acme Pipeline Accelerator — a done-with-you webinar optimization engagement",
  industry: "B2B SaaS",
  uniqueAngle:
    "Live teardown of a real webinar funnel that went from 2% to 18% opportunity conversion — showing the actual emails, landing pages, and sales sequences used",
};

export function emptyInput(): WebinarInput {
  return {
    title: "",
    topic: "",
    targetAudience: "",
    speakerName: "",
    speakerCredentials: "",
    companyName: "",
    painPoint: "",
    mainPromise: "",
    dateTime: "",
    duration: "60 minutes",
    format: "live",
    platform: "Zoom",
    callToAction: "",
    productService: "",
    industry: "",
    uniqueAngle: "",
  };
}
