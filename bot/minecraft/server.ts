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
          Deno.env.get("MINECRAFT_SERVER_CONTAINER_NAME")!,
          "bash",
          `./scripts/${scriptName}.sh`,
        ].join(" "),
      ],
    },
  );

  return await c.output();
};

export const startBot = async () => {
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
          "--profile",
          "client",
          "up",
          "-d",
        ].join(" "),
      ],
    },
  );

  const { code } = await c.output();

  return code === 0;
};

export const stopBot = async () => {
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
          "--profile",
          "client",
          "stop",
        ].join(" "),
      ],
    },
  );

  const { code } = await c.output();

  return code === 0;
};
