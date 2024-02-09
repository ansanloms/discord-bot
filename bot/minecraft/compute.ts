import compute from "@google-cloud/compute";

const project = Deno.env.get("GOOGLE_CLOUD_PROJECT_ID")!;
const zone = Deno.env.get("GOOGLE_CLOUD_ZONE")!;
const instance = Deno.env.get("GOOGLE_CLOUD_INSTANCE_NAME")!;

const keyFilename = Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS")!;

export const get = async () => {
  const instancesClient = new compute.InstancesClient({ keyFilename });

  const [response] = await instancesClient.get({
    project,
    zone,
    instance,
  });

  return response;
};

export const start = async () => {
  const instancesClient = new compute.InstancesClient({ keyFilename });

  const [response] = await instancesClient.start({
    project,
    zone,
    instance,
  });

  return response;
};

export const stop = async () => {
  const instancesClient = new compute.InstancesClient({ keyFilename });

  const [response] = await instancesClient.stop({
    project,
    zone,
    instance,
  });

  return response;
};
