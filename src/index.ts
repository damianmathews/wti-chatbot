import { webSearchTool, Agent, Runner, withTrace } from "@openai/agents";
import { z } from "zod";

// Shared link index for all agents - FULL DETAILS
const LINK_INDEX = `
LINK INDEX - Use this to find the right link for any question:

MAIN PAGES:
https://waterfieldtech.com/ | Homepage introducing Waterfield Tech, solution categories, navigation. Sample queries: What does Waterfield Tech do? What solutions do you offer? Which industries do you serve? Where is Waterfield Tech headquartered?

https://waterfieldtech.com/contact/ | Contact form, headquarters address (110 S Hartford Ave, Ste 2502, Tulsa, OK 74120), embedded map. Sample queries: How do I contact Waterfield Tech? Where are you located? What is your headquarters address?

https://waterfieldtech.com/support/ | Support portal link, support email (support@waterfieldtech.com), support phone. Sample queries: How do I access the Signature Support Portal? What is the support email address? What number do I call for support?

https://waterfieldtech.com/about/ | Company overview, contact center expertise focus. Sample queries: Tell me about Waterfield Tech. What does Waterfield Tech specialize in?

https://waterfieldtech.com/about/team/ | Leadership team with Craig Waterfield (Founder + President) and Brian Waterfield (Founder + SVP, Business Development). Sample queries: Who are the founders? Who is on the leadership team?

https://waterfieldtech.com/about/careers/ | Perks, benefits, open positions with application links. Sample queries: What jobs are open? What benefits do you offer? How do I apply?

SOLUTIONS:
https://waterfieldtech.com/solutions/ | Solutions overview for Applied AI, CX Modernization, Innovative IT. Explains "Don't Get Tech-Tied" concept. Industries served: Education, Finance, Government, Healthcare, Retail. Sample queries: What solution categories do you offer? What is CX Modernization vs Applied AI?

https://waterfieldtech.com/solutions/applied-ai/ | Applied AI overview with faqGPT, routeGPT, taskGPT, voiceGPT, AI Strategy Workshop. AI Technology Lifecycle visual. Sample queries: What is Applied AI? Which AI solutions do you offer?

https://waterfieldtech.com/solutions/applied-ai/faq-gpt/ | faqGPT: Managed generative AI FAQ chatbot using website/knowledgebase/SME info. Go-live ~4 weeks. Includes monthly Q+A updates, 24/7 monitoring, ongoing advisory. Sample queries: What is faqGPT? How is it different from ChatGPT? How long to launch?

https://waterfieldtech.com/solutions/applied-ai/route-gpt/ | routeGPT: AI-driven call routing trained on real call recordings. Reduces misroutes, improves experience. Includes customer examples with metrics. Sample queries: What is routeGPT? How does it get trained? What results have you seen?

https://waterfieldtech.com/solutions/applied-ai/task-gpt/ | taskGPT: Generative AI chatbot for tasks (reschedule appointments, track refunds). Deploy in ~4 weeks. Sample queries: What is taskGPT? What tasks can it complete? How fast to deploy?

https://waterfieldtech.com/solutions/applied-ai/voice-gpt/ | voiceGPT: Generative AI voice self-service with full duplex audio, speech-to-text, LLaMA2/Mixtral models, AI voice synthesis. Sample queries: What is voiceGPT? What technical capabilities? Which language models?

https://waterfieldtech.com/solutions/applied-ai/ai-strategy-workshop/ | Free 90-minute AI Strategy Workshop: AI demystification, use-case identification, opportunity sizing, deployment path. Sample queries: What happens in the workshop? Is it free? How long?

https://waterfieldtech.com/solutions/consulting-services/ | Consulting services: Journey Mapping, Maturity Assessment & Audit, Digital Strategy & Enablement, Experience Design, Impact Analysis, Strategic Planning. Discovery Assessment: 2-hour virtual discussion. Sample queries: What consulting services? Do you do journey mapping? What is the Discovery Assessment?

https://waterfieldtech.com/solutions/cloud-migration/ | Ascend cloud migration subscription. Results: $175k avg upfront savings, 60% deployment reduction, 30% containment boost, 35% issue resolution savings. Sample queries: What is Ascend? How does cloud migration subscription work? What results?

https://waterfieldtech.com/solutions/workforce-optimization/ | Workforce optimization services. Sample queries: What does workforce optimization cover? How do you help optimize staffing?

https://waterfieldtech.com/solutions/contact-center/ | Contact center modernization services. Sample queries: How do you modernize contact centers? What contact center services do you offer?

https://waterfieldtech.com/solutions/managed-services/ | Managed services for ongoing support. Sample queries: What managed services do you offer? What does managed services include?

https://waterfieldtech.com/solutions/xcelerate/ | Xcelerate product. Sample queries: What is Xcelerate? What problems does it solve?

https://waterfieldtech.com/solutions/xcelerate/changelog/ | Xcelerate updates and releases. Sample queries: What's new in Xcelerate? Recent changes?

https://waterfieldtech.com/impact-analysis/ | Impact Analysis: 10 business-day consultative engagement with workshops. Example: 400 agents/4MM calls scenario showed $2.1MM gains, 48% reduction in call transfers. Sample queries: What is impact analysis? How long does it take? What outcomes?

INDUSTRIES:
https://waterfieldtech.com/financial-services/ | Financial services industry focus. Sample queries: How do you support financial services? Experience with banks?
https://waterfieldtech.com/healthcare/ | Healthcare industry focus. Sample queries: How do you support healthcare? Experience with patient communications?
https://waterfieldtech.com/government/ | Government industry focus. Sample queries: How do you support government? Experience with public sector?
https://waterfieldtech.com/higher-education/ | Higher education industry focus. Sample queries: How do you support universities? Solutions for seasonal call spikes?

PARTNERS:
https://waterfieldtech.com/partners/ | Partner directory with logos/links. Sample queries: Which vendors do you partner with? Do you work with Genesys, Avaya, Twilio?
https://waterfieldtech.com/partners/alvaria/ | Alvaria partnership
https://waterfieldtech.com/partners/avaya/ | Avaya partnership
https://waterfieldtech.com/partners/calabrio/ | Calabrio partnership
https://waterfieldtech.com/partners/cisco/ | Cisco partnership
https://waterfieldtech.com/partners/genesys/ | Genesys partnership
https://waterfieldtech.com/partners/twilio/ | Twilio partnership
https://waterfieldtech.com/partners/verint/ | Verint partnership

CONTENT:
https://waterfieldtech.com/insights/ | All articles, resources, case studies. Sample queries: Show me latest Insights. Do you have articles about AI?
https://waterfieldtech.com/the-last-mile/ | The Last Mile monthly CX newsletter signup. Sample queries: What is The Last Mile? How do I subscribe?

HEALTHCARE ARTICLES:
https://waterfieldtech.com/insights/unlocking-the-digital-front-door-ai-in-healthcare | "Unlocking the Digital Front Door: AI in Healthcare"
https://waterfieldtech.com/insights/your-healthcare-reputation-is-dependent-on-how-well-you-communicate | "Your Healthcare Reputation is Dependent on How Well You Communicate"
https://waterfieldtech.com/insights/are-communications-breakdowns-costing-you-patients | "Are Communications Breakdowns Costing You Patients?"

AI/BOT ARTICLES:
https://waterfieldtech.com/insights/8-steps-to-a-brilliant-bot-strategy | "8 Steps to a Brilliant Bot Strategy"
https://waterfieldtech.com/insights/is-agent-assist-dead | "Is Agent Assist Dead?"
https://waterfieldtech.com/insights/the-cost-of-generative-ai-vs-ivr-vs-human | "Comparing the Cost of Generative AI vs. IVR vs. Human Agents"
https://waterfieldtech.com/insights/generative-ai-gai-whats-stopping-you | "Generative AI - What's Stopping You?"
https://waterfieldtech.com/insights/four-steps-to-applied-ai | "Four Steps to Applied AI"
https://waterfieldtech.com/insights/3-real-world-examples-of-contact-center-ai | "3 Real-World Examples Of Contact Center AI"
https://waterfieldtech.com/insights/is-chatgpt-the-customer-service-bot-weve-been-looking-for | "Is ChatGPT the customer service bot we've been looking for?"
https://waterfieldtech.com/insights/conversational-ai-gets-clever | "Conversational AI Gets Clever"
https://waterfieldtech.com/insights/ai-cant-solve-your-customer-service-problem-heres-why | "AI can't solve your customer service problem. Here's why."
https://waterfieldtech.com/insights/personal-ai-is-going-to-swamp-your-contact-center | "Personal AI Will Swamp Your Contact Center"
https://waterfieldtech.com/insights/a-conversation-about-conversational-ai | "A Conversation About Conversational AI"
https://waterfieldtech.com/insights/three-must-haves-for-ai-in-the-contact-center | "Three Must-haves for AI in the Contact Center"
https://waterfieldtech.com/insights/transforming-contact-center-experience-ai | "Transforming the Contact Center Experience With AI"
https://waterfieldtech.com/insights/implementing-ai-to-address-a-global-pandemic | "Implementing AI to Address a Global Pandemic"

IVR ARTICLES:
https://waterfieldtech.com/insights/ivr-analytics-and-reporting | "IVR Analytics and Reporting"
https://waterfieldtech.com/insights/start-with-the-caller-why-ux-research-is-vital-to-great-ivr | "Start With the Caller: Why UX Research is Vital to Great IVR"
https://waterfieldtech.com/insights/want-your-ivr-to-perform-like-alexa-or-google-assistant-heres-how-you-do-it | "Want Your IVR to Perform Like Alexa or Google Assistant?"
https://waterfieldtech.com/insights/evaluate-your-ivr-by-asking-these-4-questions | "Evaluate your IVR by asking these 4 questions"
https://waterfieldtech.com/insights/3-ways-to-help-your-customers-avoid-contact-center-ivr-hell | "3 Ways to Help Your Customers Avoid Contact Center IVR Hell!"
https://waterfieldtech.com/insights/finding-the-right-voice-for-your-ivr | "How to Find the Right Voice for Your IVR"
https://waterfieldtech.com/insights/how-to-choose-voice-for-interactive-voice-response-solution | "How to Choose a Voice for Your IVR Solution"

CLOUD/MIGRATION ARTICLES:
https://waterfieldtech.com/insights/cloud-mythbusters-debunking-four-common-myths-surrounding-cx-cloud-adoption | "MythBusters: Debunking Four Common Myths Surrounding CX Cloud Adoption"
https://waterfieldtech.com/insights/calculating-the-business-value-of-migrating-to-the-cloud | "Calculating the Business Value of Migrating to the Cloud"
https://waterfieldtech.com/insights/3-tips-to-help-your-cloud-migration-take-flight | "3 Tips to Help Your Cloud Migration Take Flight"
https://waterfieldtech.com/insights/modernize-your-contact-center-move-to-the-cloud | "Modernize your contact center—move to the cloud"
https://waterfieldtech.com/insights/lets-never-do-like-for-like-again | "Let's Never DO 'Like for Like' Again"

WORKFORCE/AGENT ARTICLES:
https://waterfieldtech.com/insights/tips-to-attract-new-agents-and-keep-the-ones-you-have | "Tips to Attract New Agents (And Keep the Ones You Have)"
https://waterfieldtech.com/insights/3-tools-agents-need-to-make-working-from-home-successful | "3 Tools Your Agents Need to Make Working from Home Successful"
https://waterfieldtech.com/insights/optimizing-the-human-side-of-remote-workforce | "Why the Human Side of Remote Work Matters Most"
https://waterfieldtech.com/insights/fostering-belonging-in-remote-city | "Fostering Belonging in Remote City"
https://waterfieldtech.com/insights/choosing-the-right-workforce-optimization-platform-for-your-business | "Choosing the Right Workforce Optimization Platform"
https://waterfieldtech.com/insights/8-common-mistakes-to-avoid-when-implementing-wfo | "8 Common Mistakes to Avoid When Implementing WFO"

PARTNER/VENDOR ARTICLES:
https://waterfieldtech.com/insights/genesys-fedramp-authorization-what-it-is-and-why-you-should-care | "Genesys FedRamp Authorization - What it is and why you should care"
https://waterfieldtech.com/insights/everything-you-need-to-know-to-migrate-from-twilio-flex-1-to-flex-2 | "Everything You Need to Know to Migrate from Twilio Flex UI 1 to Flex UI 2"
https://waterfieldtech.com/insights/avaya-engage-meet-the-team | "Avaya Engage: Meet the Team!"

SECURITY/COMPLIANCE ARTICLES:
https://waterfieldtech.com/insights/e911-know-the-laws-and-why-you-need-to-be-compliant | "E911: Know the Laws and Why You Need to Be Compliant"
https://waterfieldtech.com/insights/top-5-questions-about-e911-compliance | "Top 5 Questions About E911 Compliance"
https://waterfieldtech.com/insights/how-voice-biometrics-keep-your-contact-center-secure | "How Voice Biometrics Keep Your Contact Center Secure"
https://waterfieldtech.com/insights/keep-your-contact-center-safe-with-pci-secure-payment | "Keep your contact center safe with PCI secure payment"
https://waterfieldtech.com/insights/protect-customer-information-reduce-risk-pci-compliance-contact-center | "PCI Compliance in your Contact Center"

CONTACT CENTER GENERAL ARTICLES:
https://waterfieldtech.com/insights/contact-center-self-service-and-the-customer-experience | "Contact Center Self Service and the Customer Experience"
https://waterfieldtech.com/insights/the-smart-and-modern-contact-center | "The Smart and Modern Contact Center"
https://waterfieldtech.com/insights/optimizing-your-contact-center-performance | "Optimizing Your Contact Center Performance"
https://waterfieldtech.com/insights/consider-digital-transformation-in-your-contact-center | "Consider Digital Transformation in Your Contact Center"
https://waterfieldtech.com/insights/modernizing-the-cx-in-your-contact-center | "Modernizing the CX in Your Contact Center"
https://waterfieldtech.com/insights/deliver-cohesive-business-results-in-your-contact-center | "Deliver Cohesive Business Results in your Contact Center"
https://waterfieldtech.com/insights/how-automation-is-preparing-contact-centers-for-whats-ahead | "How Automation is Preparing Contact Centers for What's Ahead"
https://waterfieldtech.com/insights/contact-center-dilemma | "Contact Center Dilemma - Self-Service or Agent?"

CHATBOT ARTICLES:
https://waterfieldtech.com/insights/6-features-of-chatbots-in-contact-centers | "6 Positive Features of Chatbots in Contact Centers"
https://waterfieldtech.com/insights/voice-and-ai-chatbots-using-intents-and-entities-in-questions | "Voice and AI Chatbots: Using Intents and Entities"
https://waterfieldtech.com/insights/common-voice-and-chat-script-problems-part-1 | "Common Voice and Chat Script Problems – Part 1"
https://waterfieldtech.com/insights/common-voice-and-chat-script-problems-part-2 | "Common Voice and Chat Script Problems – Part 2"
https://waterfieldtech.com/insights/conversational-ai-for-everyone-conversational-design-beyond-jargon | "Conversational AI for Everyone: Conversational Design Beyond Jargon"

CUSTOMER EXPERIENCE ARTICLES:
https://waterfieldtech.com/insights/how-to-achieve-the-ultimate-user-experience | "How to Achieve the Ultimate User Experience"
https://waterfieldtech.com/insights/pointers-to-enhance-the-customer-experience | "Some Pointers to Enhance the Customer Experience"
https://waterfieldtech.com/insights/good-customer-service-no-magic-wand-necessary | "Great Customer Experience - No Magic Wand Necessary"
https://waterfieldtech.com/insights/want-now-customer-experience-contact-center | "I Want It NOW! Customer Experience in the Contact Center"
https://waterfieldtech.com/insights/engaging-with-customers-seamlessly | "Engaging with Customers Seamlessly"
https://waterfieldtech.com/insights/proactive-change-good-for-the-user-experience | "Proactive Change - Good for the User Experience"

OTHER ARTICLES:
https://waterfieldtech.com/insights/callback-option-can-improve-contact-center-performance | "How The Callback Option Can Improve Your Contact Center Performance"
https://waterfieldtech.com/insights/dont-hold-get-a-call-back-caller-elected-callback-in-your-contact-center | "Don't Hold, Get a Call Back!"
https://waterfieldtech.com/insights/supply-relevant-personalized-information-with-outbound-notifications | "Supply Relevant, Personalized Information with Outbound Notifications"
https://waterfieldtech.com/insights/outbound-notification-in-your-contact-center | "Proactive Outbound Notifications in your Contact Center"
https://waterfieldtech.com/insights/google-dialogflow-capturing-numbers-with-voice | "Google Dialogflow – Capturing Numbers with Voice"
https://waterfieldtech.com/insights/xcelerate-labs-time-based-routing-to-adjust-routing-by-day-and-time | "Xcelerate Labs: Time-Based Routing"
https://waterfieldtech.com/insights/xcelerate-flextension-featured-at-twilio-signal-conference | "Xcelerate 'Flextension' Featured at Twilio SIGNAL"
https://waterfieldtech.com/insights/five-key-things-travel-industry-contact-center-leaders-need-to-consider-in-todays-economic-climate | "Five Key Things Travel Industry Contact Center Leaders Need to Consider"
https://waterfieldtech.com/insights/is-your-contact-center-ready-for-the-back-to-school-rush | "Is Your Contact Center Ready for the Back to School Rush?"
https://waterfieldtech.com/insights/pivot-your-business-now-to-survive-the-inflation-wall | "Pivot Your Business Now to Survive the Inflation Wall"
https://waterfieldtech.com/insights/5-reasons-to-work-with-a-solution-integrator-for-your-wem-needs | "5 Reasons You Should Rethink How to Shop for WEM"
https://waterfieldtech.com/insights/supporting-your-agents-and-customers-throughout-the-covid-19-crisis | "Supporting Your Agents and Customers Throughout the COVID-19 Crisis"
https://waterfieldtech.com/insights/platform-approach-to-conversational-ai-brings-simplicity-and-speed-to-digital-transformation | "Taking a Platform Approach to Conversational AI"
https://waterfieldtech.com/insights/call-center-metrics-is-your-ivr-contributing-to-a-better-customer-experience | "Call Center Metrics: Is Your IVR Contributing to a Better CX?"
https://waterfieldtech.com/insights/when-dreams-become-reality | "When Dreams Become Reality"
https://waterfieldtech.com/insights/digital-collaboration-and-content-sharing-in-your-contact-center | "Digital Collaboration and Content Sharing in Your Contact Center"
https://waterfieldtech.com/insights/breakthrough-ai-engine-automates-strategic-planning | "Breakthrough AI engine automates strategic planning!"
https://waterfieldtech.com/insights/consulting-is-dead | "Consulting is dead."
https://waterfieldtech.com/insights/transformation-of-your-contact-center | "Transformation is Upon Us"
https://waterfieldtech.com/insights/creating-dynamic-contact-center-experience-artificial-intelligence | "Creating a Dynamic Contact Center Experience With AI"
https://waterfieldtech.com/insights/increase-roi-contact-center-artificial-intelligence | "Increase ROI in Your Contact Center with AI"
https://waterfieldtech.com/insights/understanding-true-value-omni-channel-customer-engagement | "Understanding the True Value of Omni-Channel Customer Engagement"
https://waterfieldtech.com/insights/baseball-contact-center-technology | "Baseball and Contact Center Technology"
https://waterfieldtech.com/insights/trust-artificial-intelligence | "Trust and Artificial Intelligence"
`;

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
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link.

TONE: Write like you're texting a friend. Plain, simple words. NO JARGON.
BANNED WORDS: seamless, omnichannel, data-driven, leverage, engagement, friction, optimize, enablement, synergy, holistic, robust, scalable, ecosystem

You answer general questions about Waterfield Tech's three solution areas: Applied AI, CX Modernization, and Innovative IT.

RULES:
- NEVER ask for personal info (name, email, company, phone). Always link to contact page instead.
- No hallucinations or invented details
- No questions to user
- Only use links from the LINK INDEX below
- If unverified: "I don't have that detail. Contact: https://waterfieldtech.com/contact/"

${LINK_INDEX}`,
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
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link.

TONE: Write like you're texting a friend. Plain, simple words. NO JARGON.
BANNED WORDS: seamless, omnichannel, data-driven, leverage, engagement, friction, optimize, enablement, synergy, holistic, robust, scalable, ecosystem

GOOD: "It's about upgrading your call center tech and processes so customers get help faster."
BAD: "It delivers seamless, personalized omnichannel customer experiences using cloud, automation, and analytics."

You answer CX Modernization questions for Waterfield Tech (consulting, cloud migration, workforce optimization, contact center transformation).

RULES:
- NEVER ask for personal info (name, email, company, phone). Always link to contact page instead.
- No hallucinations or invented details
- No questions to user
- Only use links from the LINK INDEX below
- If unverified: "I don't have that detail. Contact: https://waterfieldtech.com/contact/"

${LINK_INDEX}`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const innovativeIt = new Agent({
  name: "it",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link.

TONE: Write like you're texting a friend. Plain, simple words. NO JARGON.
BANNED WORDS: seamless, omnichannel, data-driven, leverage, engagement, friction, optimize, enablement, synergy, holistic, robust, scalable, ecosystem

You answer Innovative IT questions for Waterfield Tech (Xcelerate, managed services, IT operations).

RULES:
- NEVER ask for personal info (name, email, company, phone). Always link to contact page instead.
- No hallucinations or invented details
- No questions to user
- Only use links from the LINK INDEX below
- Do NOT claim digital workspaces, VDI, zero-trust, network security unless verified
- If unverified: "I don't have that detail. Contact: https://waterfieldtech.com/contact/"

${LINK_INDEX}`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const appliedAi = new Agent({
  name: "applied_ai",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link.

TONE: Write like you're texting a friend. Plain, simple words. NO JARGON.
BANNED WORDS: seamless, omnichannel, data-driven, leverage, engagement, friction, optimize, enablement, synergy, holistic, robust, scalable, ecosystem

You answer Applied AI questions for Waterfield Tech (faqGPT, routeGPT, taskGPT, voiceGPT, AI Strategy Workshop).

PRODUCTS (mention only what user asks about):
- routeGPT: AI call routing trained on real recordings
- faqGPT: AI FAQ chatbot, ~4 weeks to go-live
- taskGPT: AI chatbot for tasks (scheduling, refunds), ~4 weeks
- voiceGPT: AI voice self-service
- AI Strategy Workshop: Free 90-minute session

RULES:
- NEVER ask for personal info (name, email, company, phone). Always link to contact page instead.
- No hallucinations or invented details
- No questions to user
- Only use links from the LINK INDEX below
- If unverified: "I don't have that detail. Contact: https://waterfieldtech.com/contact/"

${LINK_INDEX}`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const content = new Agent({
  name: "content",
  instructions: `You help find Waterfield Tech articles. When asked for articles/blogs on a topic, return the ACTUAL ARTICLE URLs from the LINK INDEX - NOT the general /insights/ page.

TONE: Write like you're texting a friend. Plain, simple words. NO JARGON.

EXAMPLE - User asks "blogs about healthcare":
GOOD: "Here are our healthcare articles: https://waterfieldtech.com/insights/unlocking-the-digital-front-door-ai-in-healthcare"
BAD: "Check our insights page: https://waterfieldtech.com/insights/"

RULES:
- Return actual article URLs from the LINK INDEX, not general category pages
- Max 3 article links per response
- NEVER ask for personal info
- No questions to user
- Only if truly no matching articles: "Browse our Insights: https://waterfieldtech.com/insights/"

${LINK_INDEX}`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const support = new Agent({
  name: "support",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link.

TONE: Write like you're texting a friend. Plain, simple words. NO JARGON.
BANNED WORDS: seamless, omnichannel, data-driven, leverage, engagement, friction, optimize, enablement, synergy, holistic, robust, scalable, ecosystem

You direct visitors to Waterfield Tech support/contact paths. Support email: support@waterfieldtech.com

RULES:
- NEVER ask for personal info (name, email, company, phone). Always link to contact page instead.
- No troubleshooting or diagnostics
- No questions to user
- Human follow-up requests -> Contact page
- If unverified: "Contact: https://waterfieldtech.com/contact/"

${LINK_INDEX}`,
  model: "gpt-5-mini",
  modelSettings: {
    store: true
  }
});

const sales = new Agent({
  name: "sales",
  instructions: `HARD LIMIT: MAX 2 SENTENCES + 1 LINK. Never exceed 40 words before the link.

TONE: Write like you're texting a friend. Plain, simple words. NO JARGON.
BANNED WORDS: seamless, omnichannel, data-driven, leverage, engagement, friction, optimize, enablement, synergy, holistic, robust, scalable, ecosystem

You handle sales inquiries for Waterfield Tech (pricing, demos, proposals).

RULES:
- NEVER ask for personal info (name, email, company, phone). Always link to contact page instead.
- No hallucinations or invented details
- No questions to user
- Only use links from the LINK INDEX below
- Pricing/demo/quote requests -> "Reach out here for pricing: https://waterfieldtech.com/contact/"
- Support requests -> https://waterfieldtech.com/support/

${LINK_INDEX}`,
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

// Router agent - returns which agent to use
const classify = new Agent({
  name: "classify",
  instructions: `Classify the user message and return the best agent:
- services: General "what do you do?", company overview, off-topic, greetings
- cx_mod: CX modernization, consulting, cloud migration, workforce optimization, contact center
- it: Innovative IT, Xcelerate, managed services
- applied_ai: AI products (faqGPT, routeGPT, taskGPT, voiceGPT), AI strategy workshop
- content: Articles, insights, blog posts, newsletters
- support: Support portal, help requests, technical issues
- sales: Pricing, demos, buying, proposals`,
  model: "gpt-5-mini",
  outputType: z.object({
    agent: z.enum(["services", "cx_mod", "it", "applied_ai", "content", "support", "sales"])
  })
});

const agentMap: Record<string, Agent> = {
  services,
  cx_mod: cxMod,
  it: innovativeIt,
  applied_ai: appliedAi,
  content,
  support,
  sales
};

type WorkflowInput = { input_as_text: string };

// Main code entrypoint - two calls: classify then respond
export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("WEBSITE CHATBOT v3.0", async () => {
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_6903a59036588190a3fcecfaab1c0e900c0fb5e0055eee54"
      }
    });

    const userMessage = [{ role: "user" as const, content: [{ type: "input_text" as const, text: workflow.input_as_text }] }];

    // Step 1: Classify
    const classifyResult = await runner.run(classify, userMessage);
    const classification = classifyResult.finalOutput as { agent: string };
    const selectedAgent = agentMap[classification.agent] ?? fallbackAgent;

    // Step 2: Run selected agent
    const result = await runner.run(selectedAgent, userMessage);
    return result.finalOutput ?? "";
  });
}
