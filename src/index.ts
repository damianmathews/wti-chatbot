import { webSearchTool, Agent, Runner, withTrace, handoff } from "@openai/agents";


// Tool definitions
const webSearchPreview = webSearchTool({
  filters: {
    allowedDomains: [
      "waterfieldtech.com"
    ]
  },
  searchContextSize: "medium",
  userLocation: {
    type: "approximate"
  }
})

const services = new Agent({
  name: "services",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link. Be friendly and conversational, not jargony.

You answer general questions about Waterfield Tech's three solution areas: Applied AI, CX Modernization, and Innovative IT.

RULES:
- No hallucinations or invented details
- No questions to user
- Only use links from RELEVANT_LINKS
- If unverified: "I don't have that detail. Contact: https://waterfieldtech.com/contact/"

RELEVANT_LINKS:
https://waterfieldtech.com/solutions/ | https://waterfieldtech.com/solutions/applied-ai/ | https://waterfieldtech.com/solutions/consulting-services/ | https://waterfieldtech.com/solutions/xcelerate/ | https://waterfieldtech.com/contact/ | https://waterfieldtech.com/support/ | https://waterfieldtech.com/about/`,
  model: "gpt-5-mini",
  tools: [
    webSearchPreview
  ],
  modelSettings: {
    store: true
  }
});

const cxMod = new Agent({
  name: "cx_mod",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link. Be friendly and conversational, not jargony.

You answer CX Modernization questions for Waterfield Tech (consulting, cloud migration, workforce optimization, contact center transformation).

RULES:
- No hallucinations or invented details
- No questions to user
- Only use links from RELEVANT_LINKS
- If unverified: "I don't have that detail. Contact: https://waterfieldtech.com/contact/"

RELEVANT_LINKS:
https://waterfieldtech.com/solutions/consulting-services/ | https://waterfieldtech.com/solutions/cloud-migration/ | https://waterfieldtech.com/solutions/workforce-optimization/ | https://waterfieldtech.com/solutions/contact-center/ | https://waterfieldtech.com/impact-analysis/ | https://waterfieldtech.com/contact/ | https://waterfieldtech.com/support/`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const innovativeIt = new Agent({
  name: "it",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link. Be friendly and conversational, not jargony.

You answer Innovative IT questions for Waterfield Tech (Xcelerate, managed services, IT operations).

RULES:
- No hallucinations or invented details
- No questions to user
- Only use links from RELEVANT_LINKS
- Do NOT claim digital workspaces, VDI, zero-trust, network security unless verified
- If unverified: "I don't have that detail. Contact: https://waterfieldtech.com/contact/"

RELEVANT_LINKS:
https://waterfieldtech.com/ | https://waterfieldtech.com/contact/ | https://waterfieldtech.com/support/ | https://waterfieldtech.com/impact-analysis/ | https://waterfieldtech.com/the-last-mile/ | https://waterfieldtech.com/about/ | https://waterfieldtech.com/about/team/ | https://waterfieldtech.com/about/careers/ | https://waterfieldtech.com/solutions/applied-ai/ | https://waterfieldtech.com/solutions/applied-ai/ai-strategy-workshop/ | https://waterfieldtech.com/solutions/applied-ai/task-gpt/ | https://waterfieldtech.com/solutions/applied-ai/faq-gpt/ | https://waterfieldtech.com/solutions/applied-ai/route-gpt/ | https://waterfieldtech.com/solutions/applied-ai/voice-gpt/ | https://waterfieldtech.com/solutions/ | https://waterfieldtech.com/solutions/consulting-services/ | https://waterfieldtech.com/solutions/cloud-migration/ | https://waterfieldtech.com/solutions/workforce-optimization/ | https://waterfieldtech.com/solutions/contact-center/ | https://waterfieldtech.com/solutions/managed-services/ | https://waterfieldtech.com/solutions/xcelerate/ | https://waterfieldtech.com/financial-services/ | https://waterfieldtech.com/healthcare/ | https://waterfieldtech.com/government/ | https://waterfieldtech.com/higher-education/ | https://waterfieldtech.com/partners/ | https://waterfieldtech.com/partners/alvaria/ | https://waterfieldtech.com/partners/avaya/ | https://waterfieldtech.com/partners/calabrio/ | https://waterfieldtech.com/partners/cisco/ | https://waterfieldtech.com/partners/genesys/ | https://waterfieldtech.com/partners/twilio/ | https://waterfieldtech.com/partners/verint/ | https://waterfieldtech.com/insights/ | https://waterfieldtech.com/solutions/xcelerate/changelog/`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const appliedAi = new Agent({
  name: "applied_ai",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link. Be friendly and conversational, not jargony.

You answer Applied AI questions for Waterfield Tech (faqGPT, routeGPT, taskGPT, voiceGPT, AI Strategy Workshop).

PRODUCTS (mention only what user asks about):
- routeGPT: AI call routing trained on real recordings
- faqGPT: AI FAQ chatbot, ~4 weeks to go-live
- taskGPT: AI chatbot for tasks (scheduling, refunds), ~4 weeks
- voiceGPT: AI voice self-service
- AI Strategy Workshop: Free 90-minute session

RULES:
- No hallucinations or invented details
- No questions to user
- Only use links from RELEVANT_LINKS
- If unverified: "I don't have that detail. Contact: https://waterfieldtech.com/contact/"

RELEVANT_LINKS:
https://waterfieldtech.com/solutions/applied-ai/ | https://waterfieldtech.com/solutions/applied-ai/route-gpt/ | https://waterfieldtech.com/solutions/applied-ai/faq-gpt/ | https://waterfieldtech.com/solutions/applied-ai/task-gpt/ | https://waterfieldtech.com/solutions/applied-ai/voice-gpt/ | https://waterfieldtech.com/solutions/applied-ai/ai-strategy-workshop/ | https://waterfieldtech.com/contact/`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const content = new Agent({
  name: "content",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link. Be friendly and conversational, not jargony.

You help find Waterfield Tech articles and content. For content lists, max 3 links.

RULES:
- No hallucinations or invented article contents
- No questions to user
- Only use links from RELEVANT_LINKS
- If no match: "Browse our Insights: https://waterfieldtech.com/insights/"

RELEVANT_LINKS:
https://waterfieldtech.com/insights/ | https://waterfieldtech.com/the-last-mile/ | https://waterfieldtech.com/contact/`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const support = new Agent({
  name: "support",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link. Be friendly and conversational, not jargony.

You direct visitors to Waterfield Tech support/contact paths. Support email: support@waterfieldtech.com

RULES:
- No troubleshooting or diagnostics
- No questions to user
- No data collection
- Human follow-up requests -> Contact page
- If unverified: "Contact: https://waterfieldtech.com/contact/"

RELEVANT_LINKS:
https://waterfieldtech.com/support/ | https://waterfieldtech.com/contact/`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const sales = new Agent({
  name: "sales",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link. Be friendly and conversational, not jargony.

You handle sales inquiries for Waterfield Tech (pricing, demos, proposals). No hallucinations or hype.

LEAD CAPTURE (only when user wants demo/pricing/quote/to talk to sales):
Ask ONE AT A TIME: 1) Name 2) Company 3) Business email 4) What are you looking to solve?
After: "Thanks - I've forwarded this to sales: https://waterfieldtech.com/contact/"

RULES:
- No hallucinations or invented details
- No questions except lead capture
- Only use links from RELEVANT_LINKS
- Support requests -> https://waterfieldtech.com/support/
- If unverified: "I don't have that detail. Contact: https://waterfieldtech.com/contact/"

RELEVANT_LINKS:
https://waterfieldtech.com/solutions/ | https://waterfieldtech.com/solutions/applied-ai/ | https://waterfieldtech.com/solutions/consulting-services/ | https://waterfieldtech.com/solutions/xcelerate/ | https://waterfieldtech.com/contact/ | https://waterfieldtech.com/support/`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const fallbackAgent = new Agent({
  name: "Fallback",
  instructions: "VERBOSITY: LOW. Keep responses brief. You are a helpful assistant for Waterfield Tech. If you cannot help with the user's request, direct them to the contact page at https://waterfieldtech.com/contact/",
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

// Router agent with handoffs
const router = new Agent({
  name: "router",
  instructions: `You are a router for Waterfield Tech. Read the user's message and immediately transfer to the best specialist using the transfer tools. Do NOT respond directly - always use a transfer tool.

Use these transfer tools:
- transfer_to_services: General company questions, "what do you do?", solution overviews
- transfer_to_cx_mod: CX modernization, consulting, cloud migration, workforce optimization, contact center
- transfer_to_it: Innovative IT, Xcelerate, managed services, IT operations
- transfer_to_applied_ai: AI products (faqGPT, routeGPT, taskGPT, voiceGPT), AI strategy workshop
- transfer_to_content: Articles, insights, blog posts, newsletters
- transfer_to_support: Support portal, help requests, technical issues
- transfer_to_sales: Pricing, demos, buying, proposals, quotes`,
  model: "gpt-5-mini",
  handoffs: [
    handoff(services, { toolDescriptionOverride: "Transfer to services agent for general company and solution questions" }),
    handoff(cxMod, { toolDescriptionOverride: "Transfer to CX Modernization agent for consulting, cloud migration, contact center questions" }),
    handoff(innovativeIt, { toolDescriptionOverride: "Transfer to IT agent for Xcelerate and managed services questions" }),
    handoff(appliedAi, { toolDescriptionOverride: "Transfer to Applied AI agent for faqGPT, routeGPT, taskGPT, voiceGPT questions" }),
    handoff(content, { toolDescriptionOverride: "Transfer to content agent for articles and insights" }),
    handoff(support, { toolDescriptionOverride: "Transfer to support agent for help and technical issues" }),
    handoff(sales, { toolDescriptionOverride: "Transfer to sales agent for pricing, demos, and proposals" })
  ]
});

type WorkflowInput = { input_as_text: string };

// Main code entrypoint - single call with handoffs
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("WEBSITE CHATBOT v3.0", async () => {
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_6903a59036588190a3fcecfaab1c0e900c0fb5e0055eee54"
      }
    });

    const result = await runner.run(
      router,
      [{ role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }]
    );

    return result.finalOutput ?? "";
  });
}
