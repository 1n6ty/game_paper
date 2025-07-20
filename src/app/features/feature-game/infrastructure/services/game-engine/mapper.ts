const snakeToCamel = (s: string): string => {
  return s.replace(/_([a-zA-Z0-9])/g, (_, p1) => p1.toUpperCase());
};

/**
 * Принимает объект с ключами в **snake_case** и переводит все его ключи в **camelCase**.
 * @template T - тип преобразуемого объекта.
 * @param input - объект с ключами в **snake_case**.
 * @returns этот же объект, но с ключами в **camelCase**.
 */
export const convertKeysFromSnakeToCamel = <T>(input: unknown): T => {
  if (Array.isArray(input)) {
    return input.map((item) =>
      convertKeysFromSnakeToCamel(item)
    ) as unknown as T;
  }

  if (input !== null && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const camelKey = snakeToCamel(key);

      result[camelKey] = convertKeysFromSnakeToCamel(value);
    }

    return result as T;
  }

  return input as T;
};
