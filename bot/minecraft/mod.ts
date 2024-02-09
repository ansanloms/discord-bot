import {
  ApplicationCommandOptionTypes,
  CreateApplicationCommand,
  InteractionResponseTypes,
} from "discordeno/mod.ts";
import type { EventHandlers } from "discordeno/mod.ts";
import * as compute from "./compute.ts";

export const command: CreateApplicationCommand = {
  name: "minecraft",
  description: "Minecraft server operation.",
  options: [
    {
      name: "status",
      description: "Minecraft server status.",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
    {
      name: "start",
      description: "Start Minecraft server.",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
    {
      name: "stop",
      description: "Stop Minecraft server.",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
  ],
};

const interactionStatus: EventHandlers["interactionCreate"] = async (
  bot,
  interaction,
) => {
  try {
    const instance = await compute.get();

    const name = instance.name || undefined;
    const status = instance.status || undefined;
    const ipAddresses =
      ((instance.networkInterfaces || []).map((networkInterface) =>
        (networkInterface.accessConfigs || []).map((accessConfig) =>
          accessConfig.natIP || undefined
        )
      )).flat().filter((ip): ip is string => typeof ip === "string");

    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `
- name: \`${name || "???"}\`
- status: \`${status || "???"}\`
- ip address: ${ipAddresses.map((ipAddress) => `\`${ipAddress}\``) || `\`???\``}
`,
        },
      },
    );
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

const interactionStart: EventHandlers["interactionCreate"] = async (
  bot,
  interaction,
) => {
  try {
    await compute.start();

    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `
Instance started.
Please wait a few minutes.
`,
        },
      },
    );
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

const interactionStop: EventHandlers["interactionCreate"] = async (
  bot,
  interaction,
) => {
  try {
    await compute.stop();

    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `
Instance stopped.
Please wait a few minutes.
`,
        },
      },
    );
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

const interactionCommand: EventHandlers["interactionCreate"] = async (
  bot,
  interaction,
) => {
  const cmd =
    interaction.data?.options?.find((option) => option.name === "command")
      ?.options?.find((option) =>
        option.name === "command" && typeof option.value === "string"
      )?.value || undefined;

  if (typeof cmd !== "string") {
    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "Invalid command.",
        },
      },
    );
    return;
  }

  try {
    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: "Sending...",
        },
      },
    );

    const { code, stdout, stderr } = await compute.command(cmd);

    await bot.helpers.sendMessage(interaction.channelId!, {
      content: `
Request:
\`\`\`
${cmd}
\`\`\`
Response:
\`\`\`
${(code === 0 ? stdout : stderr) || "(empty)"}
\`\`\`
`,
    });
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

export const interactionCreate: EventHandlers["interactionCreate"] = async (
  bot,
  interaction,
) => {
  if (interaction.data?.name !== command.name) {
    return;
  }

  if (interaction.data?.options?.at(0)?.name === "status") {
    await interactionStatus(bot, interaction);
  }

  if (interaction.data?.options?.at(0)?.name === "start") {
    await interactionStart(bot, interaction);
  }

  if (interaction.data?.options?.at(0)?.name === "stop") {
    await interactionStop(bot, interaction);
  }
};
