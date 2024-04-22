// "use server";

import { APIResponse } from "../types/APIResponse";
import { Streaming } from "../types/Streaming";

export async function joinStreaming({
  signed,
}: {
  signed: string;
}): Promise<APIResponse<Streaming>> {
  const res = await fetch(
    `https://pens-api-staging.superrexy-dev.my.id/api/streaming/${signed}`,
    {
      method: "GET",
    }
  );

  if (!res.ok) {
    const data = await res.text();
    const { message, statusCode } = JSON.parse(data);
    if (res.status >= 500) {
      throw new Error(
        JSON.stringify({ message: "Failed to join streaming", status: 500 })
      );
    } else {
      throw new Error(JSON.stringify({ message: message, status: statusCode }));
    }
  }

  return res.json();
}

export async function startRecordStreaming({
  slug,
}: {
  slug: string;
}): Promise<APIResponse<any>> {
  const res = await fetch(
    `https://pens-api-staging.superrexy-dev.my.id/api/streaming/record/start-record/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const data = await res.text();
    const { message, statusCode } = JSON.parse(data);
    if (res.status >= 500) {
      throw new Error(
        JSON.stringify({ message: "Failed to record streaming", status: 500 })
      );
    } else {
      throw new Error(JSON.stringify({ message: message, status: statusCode }));
    }
  }

  return res.json();
}

export async function stopRecordStreaming({
  slug,
}: {
  slug: string;
}): Promise<APIResponse<any>> {
  const res = await fetch(
    `https://pens-api-staging.superrexy-dev.my.id/api/streaming/record/stop-record/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const data = await res.text();
    const { message, statusCode } = JSON.parse(data);
    if (res.status >= 500) {
      throw new Error(
        JSON.stringify({ message: "Failed to record streaming", status: 500 })
      );
    } else {
      throw new Error(JSON.stringify({ message: message, status: statusCode }));
    }
  }

  return res.json();
}

export async function getIsRecording({
  slug,
}: {
  slug: string;
}): Promise<APIResponse<any>> {
  const res = await fetch(
    `https://pens-api-staging.superrexy-dev.my.id/api/streaming/record/${slug}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const data = await res.text();
    const { message, statusCode } = JSON.parse(data);
    if (res.status >= 500) {
      throw new Error(
        JSON.stringify({ message: "Failed to record streaming", status: 500 })
      );
    } else {
      throw new Error(JSON.stringify({ message: message, status: statusCode }));
    }
  }

  return res.json();
}
