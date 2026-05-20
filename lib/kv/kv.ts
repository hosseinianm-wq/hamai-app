// lib/kv/kv.ts

declare const HAMAI_KV: {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string
  ): Promise<void>;
};

export async function kvGet(
  key: string
) {

  return await HAMAI_KV.get(key);
}

export async function kvSet(
  key: string,
  value: string
) {

  await HAMAI_KV.put(
    key,
    value
  );
}
