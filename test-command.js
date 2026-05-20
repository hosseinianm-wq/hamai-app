// test-command.js

const commandRegistry = {
  "/stats": "stats",
  "/voice": "voice",
};

function resolveCommand(text) {

  console.log(
    "\n[COMMAND_TEXT]",
    JSON.stringify(text)
  );

  const command =
    commandRegistry[text];

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

async function handleMessage(
  message
) {

  console.log(
    "\n========== HANDLE MESSAGE =========="
  );

  const type =
    message?.text?.startsWith("/")
      ? "command"
      : "text";

  console.log(
    "[TYPE]",
    type
  );

  const command =
    resolveCommand(
      message?.text || ""
    );

  const payload = {
    command,
    type,
    content:
      message?.text || "",
    mode: "text",
    result: {
      speech:
        "test speech",
    },
  };

  console.log(
    "\n[PAYLOAD]"
  );

  console.dir(
    payload,
    { depth: null }
  );

  return payload;
}

async function routeResponse(
  payload
) {

  console.log(
    "\n========== ROUTER =========="
  );

  console.log(
    "[COMMAND_NAME]",
    payload?.command?.name
  );

  if (
    payload?.command?.name ===
    "stats"
  ) {

    console.log(
      "\n[STATS_ROUTE_TRIGGERED]"
    );

    return {
      type: "text",
      reply:
        "📊 HamAI Stats OK",
    };
  }

  console.log(
    "\n[NORMAL_ROUTE]"
  );

  return {
    type: "text",
    reply:
      payload.result.speech,
  };
}

async function main() {

  const fakeMessage = {
    text: "/stats",
    chat: {
      id: 123,
    },
  };

  const payload =
    await handleMessage(
      fakeMessage
    );

  const response =
    await routeResponse(
      payload
    );

  console.log(
    "\n========== FINAL RESPONSE =========="
  );

  console.dir(
    response,
    { depth: null }
  );
}

main();