// features/commands/commandBus.ts

import { commandRegistry }
from "./commandRegistry";

export function resolveCommand(
  text: string
) {

  const command =
    commandRegistry[
      text as keyof
      typeof commandRegistry
    ];

  if (!command) {
    return null;
  }

  return {
    raw: text,
    name: command,
  };
}
