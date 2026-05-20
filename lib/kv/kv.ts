// lib/kv/kv.ts

type KV =
  | {
      get:
        (key: string)
        => Promise<any>;

      put:
        (
          key: string,
          value: string
        ) => Promise<void>;
    }
  | undefined;

const kv: KV =
  (globalThis as any)
    .HAMAI_KV;

export async function kvGet(
  key: string
) {

  if (!kv) {

    console.log(
      "[KV_DISABLED]"
    );

    return null;
  }

  return await kv.get(key);
}

export async function kvSet(
  key: string,
  value: string
) {

  if (!kv) {

    console.log(
      "[KV_DISABLED]"
    );

    return;
  }

  await kv.put(
    key,
    value
  );
}
