import { describe, it, expect } from "vitest";
import { parseFishingAreas, parseMiningAreas, parseGatheringAreas } from "./areas";

describe("areas schema", () => {
  it("accepts valid fishing, mining, and gathering areas", () => {
    const fishing = parseFishingAreas([
      {
        id: 1,
        name: "Pond",
        picture: "/pond.webp",
        altText: "Pond",
        xp: 1,
        xpUnlock: 0,
        delay: 1000,
        fishingLootIds: [301],
      },
    ]);
    expect(fishing[0].name).toBe("Pond");

    const mining = parseMiningAreas([
      {
        id: 1,
        name: "Copper Vein",
        picture: "/copper.webp",
        altText: "Copper",
        xp: 1,
        xpUnlock: 0,
        delay: 2000,
        miningLootId: 501,
      },
    ]);
    expect(mining[0].miningLootId).toBe(501);

    const gathering = parseGatheringAreas([
      {
        id: 1,
        name: "Grove",
        picture: "/grove.webp",
        altText: "Grove",
        xp: 1,
        xpUnlock: 0,
        delay: 1500,
        gatheringLootIds: [601],
      },
    ]);
    expect(gathering[0].gatheringLootIds[0]).toBe(601);
  });

  it("rejects areas with invalid rare drop chance", () => {
    expect(() =>
      parseFishingAreas([
        {
          id: 2,
          name: "Bad Pond",
          picture: "/bad.webp",
          altText: "Bad",
          xp: 1,
          xpUnlock: 0,
          delay: 1000,
          fishingLootIds: [301],
          rareDropChancePercent: 200,
        },
      ]),
    ).toThrow();
  });
});

