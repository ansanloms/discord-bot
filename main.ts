import "@std/dotenv/load";

import { createBot, Intents, startBot } from "discordeno/mod.ts";

import * as minecraft from "./bot/minecraft/mod.ts";

export const bot = createBot({
  token: Deno.env.get("DISCORD_TOKEN")!,
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
});

await bot.helpers.upsertGuildApplicationCommands(
  Deno.env.get("DISCORD_GUILD_ID")!,
  [
    minecraft.command,
  ],
);

bot.events.ready = (_b, payload) => {
  console.log(`${payload.user.username} is ready!`);
};

bot.events.interactionCreate = async (b, interaction) => {
  if (interaction.data?.name === minecraft.command.name) {
    await minecraft.interactionCreate(b, interaction);
  }
};

await startBot(bot);
