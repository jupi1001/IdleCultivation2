import { describe, it, expect } from "vitest";
import { parseTalentTiers } from "./talents";

describe("talents schema", () => {
  it("accepts valid talent tiers and nodes", () => {
    const tiers = parseTalentTiers([
      {
        realmGate: { realmId: "Mortal", realmLevel: 0 },
        nodes: [
          {
            id: 1,
            name: "Qi Sense",
            description: "Test effect",
            costQi: 10,
            maxLevel: 1,
            effect: { type: "qiGain", value: 0.1 },
          },
        ],
      },
    ]);
    expect(tiers[0].nodes[0].name).toBe("Qi Sense");
  });

  it("rejects talents with invalid effect type", () => {
    expect(() =>
      parseTalentTiers([
        {
          nodes: [
            {
              id: 2,
              name: "Bad Talent",
              description: "Invalid effect",
              costQi: 5,
              maxLevel: 1,
              // @ts-expect-error runtime schema should reject this
              effect: { type: "unknownEffect", value: 1 },
            },
          ],
        },
      ]),
    ).toThrow();
  });

  it("rejects talents with invalid realm id", () => {
    expect(() =>
      parseTalentTiers([
        {
          // @ts-expect-error runtime schema should reject this
          realmGate: { realmId: "Unknown Realm", realmLevel: 1 },
          nodes: [
            {
              id: 3,
              name: "Bad Realm Talent",
              description: "Invalid realm",
              costQi: 5,
              maxLevel: 1,
              effect: { type: "attack", value: 1 },
            },
          ],
        },
      ]),
    ).toThrow();
  });
});

