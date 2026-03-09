import { z } from "zod";
import { CombatArea } from "../enum/CombatArea";
import { itemSchema } from "./items";

/**
 * Zod schemas for enemies and enemy registries.
 * Mirrors src/interfaces/EnemyI.ts and src/domain/enemies/enemies.ts.
 */

export const combatAreaSchema = z.nativeEnum(CombatArea);

export const enemyLootSchema = z
  .object({
    items: z.array(itemSchema),
    weight: z.array(z.number().nonnegative()),
  })
  .refine(
    (value) => value.items.length === value.weight.length,
    { message: "enemy loot items/weight length mismatch" }
  );

export const enemySchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1),
  location: combatAreaSchema,
  picture: z.string().min(1).optional(),
  attack: z.number(),
  defense: z.number(),
  health: z.number(),
  loot: enemyLootSchema.optional(),
});

export const enemiesArraySchema = z.array(enemySchema);

export type EnemyFromSchema = z.infer<typeof enemySchema>;

export function parseEnemy(input: unknown): EnemyFromSchema {
  return enemySchema.parse(input);
}

export function parseEnemies(input: unknown): EnemyFromSchema[] {
  return enemiesArraySchema.parse(input);
}

