import type {
  WebinarInput,
  GeneratedKit,
  EmailContent,
  AdAngle,
  Positioning,
  LandingPageCopy,
} from "./types";

// ── Executive Snapshot ──────────────────────────────────────────────

function buildSnapshot(i: WebinarInput): string {
  const fmt =
    i.format === "live"
      ? "live"
      : i.format === "hybrid"
        ? "hybrid"
        : "pre-recorded";
  return [
    `Campaign: "${i.title}"`,
    `Format: ${i.duration} ${fmt} session on ${i.platform}`,
    `Host: ${i.companyName}`,
    `Speaker: ${i.speakerName}${i.speakerCredentials ? ` — ${i.speakerCredentials}` : ""}`,
    `Audience: ${i.targetAudience}`,
    `Core promise: ${i.mainPromise}`,
    `Primary CTA: ${i.callToAction}`,
    i.dateTime ? `Date: ${i.dateTime}` : "Date: TBD — set a date to unlock time-based email sequences",
  ].join("\n");
}

// ── Positioning ─────────────────────────────────────────────────────

function buildPositioning(i: WebinarInput): Positioning {
  const hasAngle = i.uniqueAngle.trim().length > 0;
  return {
    angle: `This webinar positions ${i.companyName} as the go-to authority on ${i.topic} by directly addressing the core pain for ${i.targetAudience}: "${i.painPoint}." The ${i.duration} format keeps it tight enough to hold attention while delivering real substance.`,
    differentiation: hasAngle
      ? `Key differentiator: ${i.uniqueAngle}. Lead with this in every piece of copy — it is the reason someone picks this over the dozens of other webinar invites in their inbox.`
      : "[MISSING] No unique angle provided. Without a clear differentiator this webinar will blend into the noise. Consider: a contrarian take, exclusive data, a live demo, or a specific before/after case study.",
    valueProposition: `Attendees walk away with: ${i.mainPromise}. Every piece of promotional copy must reinforce this concrete outcome — it is the selfish reason to show up.`,
    audienceInsight: `${i.targetAudience} in ${i.industry || "this space"} are drowning in generic advice. They need specific, implementable steps with clear tradeoffs. Frame everything around their lived reality: "${i.painPoint}."`,
  };
}

// ── Landing Page Copy ───────────────────────────────────────────────

function buildLandingPage(i: WebinarInput): LandingPageCopy {
  const bullets = [
    `Why most ${i.industry || "industry"} teams get ${i.topic} wrong — and the hidden cost of the status quo`,
    `The exact framework behind "${i.mainPromise}"`,
    `${i.speakerName}'s top mistakes to avoid (learned the hard way)`,
    `A step-by-step action plan you can start using the same week`,
    i.uniqueAngle
      ? `Exclusive look: ${i.uniqueAngle}`
      : `Real-world examples from ${i.industry || "the field"} — no hypotheticals`,
    `Live Q&A — bring your toughest questions`,
  ];

  return {
    headline: `${i.mainPromise}`,
    subheadline: `Join ${i.speakerName} from ${i.companyName} for a ${i.duration} ${i.format} session that cuts through the noise on ${i.topic}.`,
    bullets,
    ctaButton: `Save My Spot →`,
    socialProofNote:
      "[INSERT REAL PROOF] Add a specific testimonial, client logo bar, or attendance count from a prior event here. Do not invent numbers.",
    urgencyElement: i.dateTime
      ? `${i.format === "live" ? "Live and interactive" : "Available"} — ${i.dateTime}. Spots are limited to keep Q&A useful.`
      : "Date announcement coming soon — register to lock in your spot.",
  };
}

// ── Email Sequence (5 emails) ───────────────────────────────────────

function buildEmailSequence(i: WebinarInput): EmailContent[] {
  const emails: EmailContent[] = [
    {
      label: "Email 1 — Initial Invite",
      subject: `You're invited: ${i.title}`,
      preheader: `${i.speakerName} on ${i.topic} — ${i.duration}, free`,
      body: [
        `Hi {{first_name}},`,
        ``,
        `Quick question: ${i.painPoint}`,
        ``,
        `If that sounds familiar, this is for you.`,
        ``,
        `${i.speakerName} (${i.speakerCredentials || i.companyName}) is hosting a ${i.duration} ${i.format} session:`,
        ``,
        `"${i.title}"`,
        ``,
        `What you'll walk away with:`,
        `→ ${i.mainPromise}`,
        i.uniqueAngle ? `→ ${i.uniqueAngle}` : "",
        `→ Actionable steps you can implement this week`,
        ``,
        i.dateTime ? `When: ${i.dateTime}` : "Date: TBD",
        `Can't make it live? Register and we'll send the replay.`,
        ``,
        `[${i.callToAction || "Register Now"} →]`,
        ``,
        `— ${i.companyName}`,
      ]
        .filter(Boolean)
        .join("\n"),
      sendTiming: "14 days before event",
    },
    {
      label: "Email 2 — Value-Add Follow-Up",
      subject: `The #1 reason ${i.topic} fails (and what to do instead)`,
      preheader: `${i.speakerName} breaks it down in this upcoming session`,
      body: [
        `Hi {{first_name}},`,
        ``,
        `Most ${i.targetAudience} make the same mistake with ${i.topic}: they focus on the wrong metrics and wonder why nothing moves.`,
        ``,
        `In next ${i.dateTime ? "week's" : "our upcoming"} session, ${i.speakerName} is going to unpack:`,
        ``,
        `• Why the standard approach creates busywork, not results`,
        `• The specific framework behind "${i.mainPromise}"`,
        `• What to change first for the fastest impact`,
        ``,
        `This is a working session built for ${i.targetAudience} who need real answers and practical next steps.`,
        ``,
        `[Save Your Spot →]`,
        ``,
        `— ${i.companyName}`,
      ].join("\n"),
      sendTiming: "7 days before event",
    },
    {
      label: "Email 3 — Last Chance",
      subject: `Last chance: "${i.title}" is ${i.dateTime ? "this week" : "coming up"}`,
      preheader: `Don't miss ${i.speakerName}'s session on ${i.topic}`,
      body: [
        `Hi {{first_name}},`,
        ``,
        `Quick reminder — "${i.title}" is ${i.dateTime ? `happening on ${i.dateTime}` : "coming up soon"} and spots are filling up.`,
        ``,
        `If you're dealing with: "${i.painPoint}" — this ${i.duration} is worth your time.`,
        ``,
        `${i.speakerName} will cover:`,
        `→ ${i.mainPromise}`,
        `→ Specific steps you can act on immediately`,
        `→ Live Q&A to tackle your biggest questions`,
        ``,
        `[Register Before It's Full →]`,
        ``,
        `— ${i.companyName}`,
      ].join("\n"),
      sendTiming: "2 days before event",
    },
    {
      label: "Email 4 — Day-Of Reminder",
      subject: `TODAY: "${i.title}" starts ${i.dateTime ? "at " + i.dateTime.split(" ").slice(1).join(" ") : "soon"}`,
      preheader: `Your link is inside — join ${i.speakerName} live`,
      body: [
        `Hi {{first_name}},`,
        ``,
        `Today's the day.`,
        ``,
        `"${i.title}" with ${i.speakerName} goes live ${i.dateTime ? "at " + i.dateTime.split(" ").slice(1).join(" ") : "shortly"}.`,
        ``,
        `Here's your join link: [INSERT JOIN LINK]`,
        ``,
        `Come ready with questions — the live Q&A is the best part.`,
        ``,
        `See you there,`,
        `${i.companyName}`,
      ].join("\n"),
      sendTiming: "Morning of event",
    },
    {
      label: "Email 5 — Starting Now",
      subject: `We're live! Join "${i.title}" now`,
      preheader: `${i.speakerName} is starting — click to join`,
      body: [
        `Hi {{first_name}},`,
        ``,
        `"${i.title}" is starting right now.`,
        ``,
        `→ [Join the Live Session]`,
        ``,
        `${i.speakerName} is kicking off with the biggest mistake ${i.targetAudience} make with ${i.topic}. You won't want to miss the first 5 minutes.`,
        ``,
        `— ${i.companyName}`,
      ].join("\n"),
      sendTiming: "15 minutes before start (or at start time)",
    },
  ];
  return emails;
}

// ── Post-Webinar Follow-Up ──────────────────────────────────────────

function buildFollowUpSequence(i: WebinarInput): EmailContent[] {
  return [
    {
      label: "Follow-Up 1 — Replay + Thank You",
      subject: `Replay ready: "${i.title}"`,
      preheader: `Watch the recording + grab your action items`,
      body: [
        `Hi {{first_name}},`,
        ``,
        `Thanks for registering for "${i.title}." If you made it live, thanks for joining us.`,
        ``,
        `Here's the replay: [INSERT REPLAY LINK]`,
        ``,
        `Key takeaways:`,
        `1. ${i.painPoint} — why it persists and the root cause most teams miss`,
        `2. The framework: ${i.mainPromise}`,
        `3. First step to take this week: [INSERT SPECIFIC FIRST STEP FROM PRESENTATION]`,
        ``,
        `Want help implementing this? ${i.callToAction}`,
        ``,
        `[${i.callToAction} →]`,
        ``,
        `— ${i.speakerName}, ${i.companyName}`,
      ].join("\n"),
      sendTiming: "2 hours after event ends",
    },
    {
      label: "Follow-Up 2 — Key Takeaways + CTA",
      subject: `The one thing to change first (from ${i.speakerName}'s session)`,
      preheader: `If you only do one thing from the webinar, do this`,
      body: [
        `Hi {{first_name}},`,
        ``,
        `After "${i.title}", the #1 question people asked was: "Where do I start?"`,
        ``,
        `${i.speakerName}'s answer: focus on the bottleneck that's costing you the most right now. For most ${i.targetAudience}, that's "${i.painPoint}."`,
        ``,
        `Here's the priority checklist:`,
        `□ Audit your current approach to ${i.topic}`,
        `□ Identify the single biggest drop-off point`,
        `□ Apply the framework from the session to that one point`,
        `□ Measure the delta after 2 weeks`,
        ``,
        `Need a faster path? ${i.productService} was built for exactly this.`,
        ``,
        `[${i.callToAction} →]`,
        ``,
        `— ${i.companyName}`,
      ].join("\n"),
      sendTiming: "2 days after event",
    },
    {
      label: "Follow-Up 3 — Final Nudge",
      subject: `Still thinking about ${i.topic}? Let's talk.`,
      preheader: `No pressure — just a conversation about your ${i.industry || "team's"} goals`,
      body: [
        `Hi {{first_name}},`,
        ``,
        `It's been a few days since "${i.title}" and I wanted to check in.`,
        ``,
        `If you've started implementing what ${i.speakerName} covered — great. If you're stuck or want a second opinion on your approach, we're here.`,
        ``,
        `${i.companyName} works with ${i.targetAudience} to ${i.mainPromise.toLowerCase()}.`,
        ``,
        `No pitch, no pressure. Just a conversation about what would actually move the needle for your team.`,
        ``,
        `[${i.callToAction} →]`,
        ``,
        `— ${i.companyName}`,
      ].join("\n"),
      sendTiming: "5 days after event",
    },
  ];
}

// ── Paid Ad Angles ──────────────────────────────────────────────────

function buildAdAngles(i: WebinarInput): AdAngle[] {
  return [
    {
      platform: "LinkedIn Sponsored Content",
      headline: `${i.targetAudience.split(" ").slice(0, 4).join(" ")}? This ${i.duration} session is for you.`,
      body: `"${i.painPoint}" — sound familiar?\n\nJoin ${i.speakerName} from ${i.companyName} for a live breakdown of ${i.mainPromise.toLowerCase()}.\n\nNo fluff. No pitch deck. Just a working framework you can use this week.`,
      cta: "Register Free",
      targetingNotes: `Target: ${i.industry} professionals, marketing/demand-gen titles, company size 50-500. Exclude current customers. Layer interest targeting for ${i.topic}.`,
    },
    {
      platform: "Meta (Facebook/Instagram)",
      headline: `Stop wasting time on ${i.topic} that doesn't convert`,
      body: `${i.speakerName} is sharing the exact framework behind "${i.mainPromise}" in a free ${i.duration} ${i.format} session.\n\n${i.uniqueAngle || `Real examples from ${i.industry || "the field"} with concrete execution details.`}`,
      cta: "Save My Spot",
      targetingNotes: `Target: ${i.industry} interest audiences, lookalikes of existing leads/customers. Test both feed and stories placements. Keep creative raw/authentic — polished ads underperform for webinars on Meta.`,
    },
    {
      platform: "Google Search",
      headline: `Free ${i.format} session: ${i.topic}`,
      body: `${i.mainPromise}. ${i.duration} with ${i.speakerName} from ${i.companyName}. Register free — limited spots.`,
      cta: "Register Now",
      targetingNotes: `Keywords: "${i.topic}", "${i.topic} webinar", "${i.topic} training", "${i.topic} best practices", "${i.painPoint.split(" ").slice(0, 3).join(" ")}". Use exact and phrase match. Negative match: "free course", "certification".`,
    },
    {
      platform: "YouTube Pre-Roll (15s)",
      headline: `${i.duration} that could change your ${i.topic} results`,
      body: `Hook (first 5s): "${i.painPoint}?"\n\nBody: "${i.speakerName} from ${i.companyName} is hosting a free ${i.format} session breaking down ${i.mainPromise.toLowerCase()}. It's ${i.duration}, it's free, and you'll leave with a plan."\n\nCTA: "Link in the description — register now."`,
      cta: "Register Free",
      targetingNotes: `Target: In-market audiences for ${i.industry}, custom intent audiences around ${i.topic}. Affinity: business professionals, marketing professionals. Placement: skip YouTube Kids and gaming channels.`,
    },
  ];
}

// ── Sales Handoff Checklist ─────────────────────────────────────────

function buildSalesHandoff(i: WebinarInput): string[] {
  return [
    `Share the attendee list with sales within 2 hours of the event ending — split into "attended" and "registered but did not attend"`,
    `Tag attendees who asked questions during Q&A — these are highest intent. Prioritize outreach to this group`,
    `Provide sales with the replay link and a 3-bullet summary of what was covered — they need context before calling`,
    `Brief sales on the primary CTA: "${i.callToAction}" — every outreach should reference this as the natural next step`,
    `Share the key pain point ("${i.painPoint}") so reps can mirror the language from the webinar`,
    `Arm reps with 2-3 follow-up questions tied to the webinar content (e.g., "What's your current approach to ${i.topic}?" / "Which part of the session was most relevant to your team?")`,
    `Set a follow-up SLA: contacted within 48 hours for attendees, 72 hours for no-shows`,
    `Track pipeline sourced or influenced by this webinar — attribute by UTM, registration source, and deal stage progression`,
    `Schedule a sales-marketing debrief within 1 week: what worked, what objections came up, and whether the ICP was right`,
    `If ${i.productService} has a trial or demo, create a specific landing page for webinar attendees with the webinar framing`,
    `Flag any attendee from a target account for immediate, personalized outreach from the assigned AE`,
  ];
}

// ── Production / Run-of-Show Checklist ──────────────────────────────

function buildProductionChecklist(i: WebinarInput): string[] {
  const items = [
    `[T-14 days] Confirm ${i.speakerName}'s availability and send calendar hold for the session + 30-min tech check`,
    `[T-14 days] Set up registration page on ${i.platform} — test the full registration flow end to end`,
    `[T-14 days] Configure email sequences in marketing automation (5 invite/reminder emails + 3 follow-ups)`,
    `[T-10 days] Finalize slide deck and any screen-share materials — review with speaker`,
    `[T-7 days] Run a full tech rehearsal: audio, video, screen share, recording, Q&A/chat panel`,
    `[T-7 days] Prepare a backup plan: secondary presenter contact, dial-in number, pre-recorded fallback if ${i.format === "live" ? "the live session fails" : "playback has issues"}`,
    `[T-3 days] Test all links: registration page, calendar invite join link, replay page (even if empty)`,
    `[T-3 days] Confirm recording settings on ${i.platform} — cloud vs. local, auto-record on`,
    `[T-1 day] Send final day-of reminder emails`,
    `[T-1 day] Share the run-of-show document with all participants (speaker, moderator, tech support)`,
    `[Day of, -30 min] Open the ${i.platform} room, verify audio/video, confirm recording is working`,
    `[Day of, -15 min] Post welcome message in chat, share any pre-session resources`,
    `[Day of, 0 min] Start recording. ${i.speakerName} kicks off. Moderator monitors chat/Q&A`,
    `[Day of, -5 min to end] Moderator gives 5-minute warning, queues up key Q&A questions`,
    `[Day of, end] Close with clear CTA: "${i.callToAction}". Thank attendees. Stop recording`,
    `[+1 hour] Export attendee list and chat log from ${i.platform}`,
    `[+2 hours] Process recording: trim, add intro/outro if needed, upload to replay page`,
    `[+2 hours] Trigger post-webinar follow-up email sequence`,
    `[+24 hours] Send replay link to no-shows`,
    `[+48 hours] Hand off hot leads to sales with briefing notes`,
    `[+7 days] Run post-mortem: attendance rate, engagement, pipeline generated, lessons learned`,
  ];
  return items;
}

// ── Risk Flags ──────────────────────────────────────────────────────

function buildRiskFlags(i: WebinarInput): string[] {
  const flags: string[] = [];

  if (!i.uniqueAngle.trim()) {
    flags.push(
      "NO UNIQUE ANGLE — Without a clear differentiator (contrarian take, exclusive data, live demo, case study), this webinar will struggle to stand out in crowded inboxes. Define what makes this one different before writing any copy.",
    );
  }

  if (!i.speakerCredentials.trim()) {
    flags.push(
      "MISSING SPEAKER CREDENTIALS — The audience needs a reason to trust the speaker. Add specific experience, results, or roles that establish authority on this topic.",
    );
  }

  if (!i.dateTime.trim()) {
    flags.push(
      "NO DATE SET — Time-based urgency is a major registration driver. Set a date to unlock day-of and countdown messaging.",
    );
  }

  if (!i.callToAction.trim()) {
    flags.push(
      "NO CLEAR CTA — Every webinar needs a next step. Without a CTA, you'll generate goodwill but not pipeline. Define what you want attendees to do after the session.",
    );
  }

  if (!i.productService.trim()) {
    flags.push(
      "NO PRODUCT/SERVICE DEFINED — The follow-up sequence and sales handoff reference a product/service. Without one, the post-webinar conversion path is unclear.",
    );
  }

  if (!i.painPoint.trim()) {
    flags.push(
      "NO PAIN POINT — Pain is the #1 driver of webinar registrations. Without a clear, specific pain point, all copy will be generic.",
    );
  }

  if (i.targetAudience.trim().split(" ").length < 5) {
    flags.push(
      "VAGUE AUDIENCE — A broad audience description leads to broad copy that converts nobody. Get specific: role, company size, industry, situation.",
    );
  }

  const durationNum = parseInt(i.duration, 10);
  if (durationNum && durationNum < 20) {
    flags.push(
      `SHORT DURATION (${i.duration}) — Under 20 minutes is tight for delivering value + Q&A. Consider extending to at least 30 minutes or cutting the scope to one sharp takeaway.`,
    );
  }
  if (durationNum && durationNum > 90) {
    flags.push(
      `LONG DURATION (${i.duration}) — Sessions over 90 minutes see steep drop-off. Consider splitting into a 2-part series or trimming to the essential content.`,
    );
  }

  if (i.mainPromise.trim().split(" ").length < 5) {
    flags.push(
      "VAGUE PROMISE — The main promise is too short to be compelling. A strong promise is specific and outcome-oriented (e.g., 'a 5-step framework to double webinar-to-pipeline conversion in 30 days').",
    );
  }

  // Always add proof flag
  flags.push(
    "SOCIAL PROOF NEEDED — Landing page and ads will perform significantly better with real testimonials, client logos, prior attendance numbers, or specific results. Do not fabricate these — collect them before launch.",
  );

  return flags;
}

// ── Main Generator ──────────────────────────────────────────────────

export function generateKit(input: WebinarInput): GeneratedKit {
  return {
    executiveSnapshot: buildSnapshot(input),
    positioning: buildPositioning(input),
    landingPage: buildLandingPage(input),
    emailSequence: buildEmailSequence(input),
    postWebinarFollowUp: buildFollowUpSequence(input),
    adAngles: buildAdAngles(input),
    salesHandoff: buildSalesHandoff(input),
    productionChecklist: buildProductionChecklist(input),
    riskFlags: buildRiskFlags(input),
  };
}
