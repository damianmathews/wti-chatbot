import { Agent, Runner, withTrace, AgentInputItem } from "@openai/agents";
import { z } from "zod";

type WorkflowInput = { input_as_text: string };

export const runWorkflow = async (workflow: WorkflowInput) => {
  return await withTrace("WEBSITE CHATBOT v3.0", async () => {
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "wf_6903a59036588190a3fcecfaab1c0e900c0fb5e0055eee54"
      }
    });

    // Call your workflow directly without defining agents
    const result = await runner.runWorkflow(
      "wf_6903a59036588190a3fcecfaab1c0e900c0fb5e0055eee54",
      conversationHistory
    );

    return result.finalOutput ?? "Sorry, I couldn't process that request.";
  });
};
