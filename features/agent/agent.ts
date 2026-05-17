import { routeIntent } from "./router";
import { executeTool } from "./executor";

export async function agentRun(input: string) {
  // 1. تحلیل intent
  const plan = await routeIntent(input);

  // 2. اگر action لازم داشت
  if (plan.type === "action") {
    const result = await executeTool(plan.tool, plan.params);

    return {
      type: "action_result",
      result,
      message: `انجام شد: ${plan.tool}`,
    };
  }

  // 3. اگر فقط چت بود
  return {
    type: "chat",
    message: plan.response,
  };
}
