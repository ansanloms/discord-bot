import {
  ApplicationCommandOptionTypes,
  CreateApplicationCommand,
  InteractionResponseTypes,
} from "discordeno/mod.ts";
import type { EventHandlers } from "discordeno/mod.ts";
import * as server from "./server.ts";

const ignoreAnsiCodeRegex =
  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

export const command: CreateApplicationCommand = {
  name: "minecraft",
  description: "Minecraft server operation.",
  options: [
    {
      name: "command",
      description: "Send commands to the Minecraft server.",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          name: "command",
          description: "command.",
          required: true,
          type: ApplicationCommandOptionTypes.String,
        },
      ],
    },
    {
      name: "backup",
      description: "Creating a backup.",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
    {
      name: "bot",
      description: "Start/Stop bot.",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          name: "status",
          description: "(start|stop).",
          required: true,
          type: ApplicationCommandOptionTypes.String,
          choices: [
            {
              "name": "Start.",
              "value": "start",
            },
            {
              "name": "Stop.",
              "value": "stop",
            },
          ],
        },
      ],
    },
  ],
};

const interactionCommand: EventHandlers["interactionCreate"] = async (
  bot,
  interaction,
) => {
  const commands = [
    interaction.data?.options?.find((option) => option.name === "command")
      ?.options?.find((option) =>
        option.name === "command" && typeof option.value === "string"
      )?.value || undefined,
  ].filter((v): v is string => typeof v === "string");

  if (commands.length <= 0) {
    throw new TypeError("Invalid command.");
  }

  const { code, stdout, stderr } = await server.sendCommand(commands);

  await bot.helpers.sendInteractionResponse(
    interaction.id,
    interaction.token,
    {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: `\`\`\`${
          new TextDecoder().decode(code === 0 ? stdout : stderr).replace(
            ignoreAnsiCodeRegex,
            "",
          ) || "(empty)"
        }\`\`\``,
      },
    },
  );
};

const interactionBackup: EventHandlers["interactionCreate"] = async (
  bot,
  interaction,
) => {
  await Promise.all([
    bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "backup...",
        },
      },
    ),
    (async () => {
      await server.sendCommand(["say backup.", "save-all"]);
      await server.execScript("backup");
      await server.sendCommand(["say backup completed."]);
    })(),
  ]);
};

const interactionBot: EventHandlers["interactionCreate"] = async (
  bot,
  interaction,
) => {
  const status =
    interaction.data?.options?.find((option) => option.name === "bot")
      ?.options?.find((option) =>
        option.name === "status" && typeof option.value === "string"
      )?.value || undefined;

  if (status === "start") {
    await Promise.all([
      bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            content: "starting bot...",
          },
        },
      ),
      server.startBot(),
    ]);
  }

  if (status === "stop") {
    await Promise.all([
      bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
          type: InteractionResponseTypes.ChannelMessageWithSource,
          data: {
            content: "stopping bot...",
          },
        },
      ),
      server.stopBot(),
    ]);
  }
};

export const interactionCreate: EventHandlers["interactionCreate"] = async (
  bot,
  interaction,
) => {
  if (interaction.data?.name !== command.name) {
    return;
  }
  try {
    if (interaction.data?.options?.at(0)?.name === "command") {
      await interactionCommand(bot, interaction);
    }

    if (interaction.data?.options?.at(0)?.name === "backup") {
      await interactionBackup(bot, interaction);
    }

    if (interaction.data?.options?.at(0)?.name === "bot") {
      await interactionBot(bot, interaction);
    }
  } catch (err) {
    console.error(err);

    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `
\`\`\`
${err}
\`\`\`
`,
        },
      },
    );
  }
};
