import "std/dotenv/load.ts";

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

//Deno.cron("Stop Minecraft server", "0 4,10,16 * * *", async () => {
//  try {
//    const { status } = await minecraftCompute.get();
//
//    if (status === "RUNNING") {
//      await bot.helpers.sendMessage(
//        Deno.env.get("DISCORD_CHANNEL_ID_MINECRAFT")!,
//        {
//          content:
//            "Minecraft サーバが起動中です。1 分後にシャットダウンします。",
//        },
//      );
//
//      await setTimeout(async () => {
//        await minecraftCompute.stop();
//        const { status } = await minecraftCompute.get();
//
//        if (status === "RUNNING") {
//          await bot.helpers.sendMessage(
//            Deno.env.get("DISCORD_CHANNEL_ID_MINECRAFT")!,
//            {
//              content:
//                "Minecraft サーバのシャットダウンに失敗している可能性があります。確認してください。",
//            },
//          );
//        } else {
//          await bot.helpers.sendMessage(
//            Deno.env.get("DISCORD_CHANNEL_ID_MINECRAFT")!,
//            {
//              content: "Minecraft サーバをシャットダウンしました。",
//            },
//          );
//        }
//      }, 1000 * 60);
//    }
//  } catch (err) {
//    console.error(err);
//  }
//});
