// features/commands/commandBus.ts

import { commandRegistry }
from "./commandRegistry";

export function resolveCommand(
  text: string
) {

  console.log(
    "[COMMAND_TEXT]",
    JSON.stringify(text)
  );

  const command =
    commandRegistry[
      text as keyof
      typeof commandRegistry
    ];

  console.log(
    "[COMMAND_MATCH]",
    command
  );

  if (!command) {
    return null;
  }

  return {
    raw: text,
    name: command,
  };
}
