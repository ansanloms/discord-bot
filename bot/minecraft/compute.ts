import compute from "@google-cloud/compute";

const keyFilename = Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS")!;

export const get = async (
  { project, zone, instance }: {
    project: string;
    zone: string;
    instance: string;
  },
) => {
  const instancesClient = new compute.InstancesClient({ keyFilename });

  const [response] = await instancesClient.get({
    project,
    zone,
    instance,
  });

  return response;
};

export const start = async (
  { project, zone, instance }: {
    project: string;
    zone: string;
    instance: string;
  },
) => {
  const instancesClient = new compute.InstancesClient({ keyFilename });

  const [response] = await instancesClient.start({
    project,
    zone,
    instance,
  });

  return response;
};

export const stop = async (
  { project, zone, instance }: {
    project: string;
    zone: string;
    instance: string;
  },
) => {
  const instancesClient = new compute.InstancesClient({ keyFilename });

  const [response] = await instancesClient.stop({
    project,
    zone,
    instance,
  });

  return response;
};
