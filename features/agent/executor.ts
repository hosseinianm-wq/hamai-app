import { snapTool } from "../tools/snapTool";
import { ticketTool } from "../tools/ticketTool";
import { telegramTool } from "../tools/telegramTool";

export async function executeTool(tool: string, params: any) {
  switch (tool) {
    case "snap":
      return await snapTool(params);

    case "ticket":
      return await ticketTool(params);

    case "telegram":
      return await telegramTool(params);

    default:
      return { error: "Tool not found" };
  }
}