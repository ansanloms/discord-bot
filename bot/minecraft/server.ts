export const sendCommand = async (commands: [string, ...string[]]) => {
  const c = new Deno.Command(
    "ssh",
    {
      args: [
        `${Deno.env.get("MINECRAFT_SERVER_USER")!}@${Deno.env.get(
          "MINECRAFT_SERVER_HOST",
        )!}`,
        [
          "docker",
          "compose",
          "--project-directory",
          Deno.env.get("MINECRAFT_SERVER_PROJECT_DIRECTORY")!,
          "run",
          "--rm",
          "rcon",
          ...commands.map((v) => `'${v}'`),
        ].join(" "),
      ],
    },
  );

  return await c.output();
};

export const execScript = async (scriptName: string) => {
  const c = new Deno.Command(
    "ssh",
    {
      args: [
        `${Deno.env.get("MINECRAFT_SERVER_USER")!}@${Deno.env.get(
          "MINECRAFT_SERVER_HOST",
        )!}`,
        [
          "docker",
          "compose",
          "--project-directory",
          Deno.env.get("MINECRAFT_SERVER_PROJECT_DIRECTORY")!,
          "exec",
          "minecraft",
          "bash",
          `./scripts/${scriptName}.sh`,
        ].join(" "),
      ],
    },
  );

  return await c.output();
};
