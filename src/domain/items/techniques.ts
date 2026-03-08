/**
 * Qi and combat techniques. Used by shops, sect stores, and enemy loot.
 */
import type Item from "../../interfaces/ItemI";

/** Base path for technique images (qi and combat). Place under public/assets/techniques/ */
const TECHNIQUES_ASSETS = "/assets/techniques";

/** All 15 qi techniques. #0 in basic shop; #1–14 from sects and monster drops. qiGainBonus is exponential: with base 1 Qi/s, totals go 2, 5, 10, 20, 50, 100, … */
export const QI_TECHNIQUES: Item[] = [
  { id: 700, name: "Gentle Breath Circulation", description: "A foundational technique. +2 Qi/s when meditating.", price: 200, quantity: 1, picture: `${TECHNIQUES_ASSETS}/breath-circulation.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 1 },
  { id: 701, name: "Flowing Meridian Method", description: "Qi flows along meridians. +5 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/flowing-meridian-method.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 4 },
  { id: 702, name: "Earth-Root Breathing Art", description: "Grounds the cultivator. +10 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/earth-root-breathing-art.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 9 },
  { id: 703, name: "Clear Mind Qi Cycle", description: "Clears the mind for refinement. +20 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/clear-mind-qi-cycle.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 19 },
  { id: 704, name: "Eight Meridian Resonance", description: "Resonates with the eight meridians. +50 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/eight-meridian-resonance.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 49 },
  { id: 705, name: "Jade Pulse Refinement", description: "Refines qi like jade. +100 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/jade-pulse-refinement.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 99 },
  { id: 706, name: "Spirit River Circulation", description: "Qi flows like a river. +200 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/spirit-river-circulation.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 199 },
  { id: 707, name: "Inner Sea Condensation Art", description: "Condenses qi in the inner sea. +500 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/inner-sea-condensation-art.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 499 },
  { id: 708, name: "Golden Core Resonance Method", description: "Resonates with the golden core. +2,000 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/golden-core-resonance-method.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 999 },
  { id: 709, name: "Heavenly Breath Harmonization", description: "Harmonizes with heavenly breath. +1,000 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/heavenly-breath-harmonization.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 1999 },
  { id: 710, name: "Starflow Meridian Scripture", description: "Qi follows the starflow. +5,000 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/starflow-meridian-scripture.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 4999 },
  { id: 711, name: "Void Pulse Refinement", description: "Refines the void pulse. +10,000 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/void-pulse-refinement.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 9999 },
  { id: 712, name: "Heaven-Earth Unity Technique", description: "Unifies heaven and earth. +20,000 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/heaven-earth-unity-technique.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 19999 },
  { id: 713, name: "Immortal Breath Sutra", description: "The breath of immortals. +50,000 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/immortal-breath-sutra.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 49999 },
  { id: 714, name: "Eternal Dao Circulation", description: "Circulation of the eternal Dao. +100,000 Qi/s when meditating.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/eternal-dao-circulation.webp`, equipmentSlot: "qiTechnique", qiGainBonus: 99999 },
];

/** All 15 combat techniques. #0 in basic shop; #1–14 from sects and monster drops. Base attack interval 2 s; reduction is flat ms. */
export const COMBAT_TECHNIQUES: Item[] = [
  { id: 720, name: "Swift Wind Steps", description: "Basic footwork. Attack ×1.10, attack interval 1.95 s.", price: 250, quantity: 1, picture: `${TECHNIQUES_ASSETS}/swift-wind-steps.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 1.1, attackSpeedReduction: 50 },
  { id: 721, name: "Flowing Blade Rhythm", description: "Blade moves in rhythm. Attack ×1.30, attack interval 1.93 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/flowing-blade-rhythm.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 1.3, attackSpeedReduction: 70 },
  { id: 722, name: "Iron Body Assault Art", description: "Hardens the body for assault. Attack ×1.50, attack interval 1.91 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/iron-body-assault-art.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 1.5, attackSpeedReduction: 90 },
  { id: 723, name: "Flashing Shadow Technique", description: "Strike from shadow. Attack ×1.70, attack interval 1.89 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/flashing-shadow-technique.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 1.7, attackSpeedReduction: 110 },
  { id: 724, name: "Tiger Pounce Method", description: "Pounce like a tiger. Attack ×1.90, attack interval 1.87 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/tiger-pounce-method.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 1.9, attackSpeedReduction: 130 },
  { id: 725, name: "Gale Strike Footwork", description: "Footwork like the gale. Attack ×2.10, attack interval 1.85 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/gale-strike-footwork.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 2.1, attackSpeedReduction: 150 },
  { id: 726, name: "Thousand Fang Assault", description: "A thousand fangs. Attack ×2.30, attack interval 1.83 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/thousand-fang-assault.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 2.3, attackSpeedReduction: 170 },
  { id: 727, name: "Stormblade Tempo", description: "The tempo of the storm blade. Attack ×2.50, attack interval 1.81 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/stormblade-tempo.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 2.5, attackSpeedReduction: 190 },
  { id: 728, name: "Dragon Fang Momentum", description: "Momentum of the dragon fang. Attack ×2.70, attack interval 1.79 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/dragon-fang-momentum.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 2.7, attackSpeedReduction: 210 },
  { id: 729, name: "Thunder Pulse Combat Art", description: "Combat like thunder. Attack ×2.90, attack interval 1.77 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/thunder-pulse-combat-art.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 2.9, attackSpeedReduction: 230 },
  { id: 730, name: "Phantom Step Assault", description: "Assault with phantom steps. Attack ×3.10, attack interval 1.75 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/phantom-step-assault.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 3.1, attackSpeedReduction: 250 },
  { id: 731, name: "Void Flash Technique", description: "Strike from the void. Attack ×3.30, attack interval 1.73 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/void-flash-technique.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 3.3, attackSpeedReduction: 270 },
  { id: 732, name: "Heaven-Splitting Momentum", description: "Momentum that splits heaven. Attack ×3.50, attack interval 1.71 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/heaven-splitting-momentum.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 3.5, attackSpeedReduction: 290 },
  { id: 733, name: "Celestial War Rhythm", description: "The rhythm of celestial war. Attack ×3.70, attack interval 1.69 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/celestial-war-rhythm.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 3.7, attackSpeedReduction: 310 },
  { id: 734, name: "Immortal Slaughter Art", description: "The art of immortal slaughter. Attack ×3.90, attack interval 1.67 s.", price: 0, quantity: 1, picture: `${TECHNIQUES_ASSETS}/immortal-slaughter-art.webp`, equipmentSlot: "combatTechnique", attackMultiplier: 3.9, attackSpeedReduction: 330 },
];

/** Qi technique in basic shop (first of list). */
export const existingShopQiTechniques: Item[] = [QI_TECHNIQUES[0]];
/** Combat technique in basic shop (first of list). */
export const existingShopCombatTechniques: Item[] = [COMBAT_TECHNIQUES[0]];
