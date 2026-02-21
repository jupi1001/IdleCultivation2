/** Base path for UI images (character, bag, etc.). Place under public/assets/ui/ */
export const UI_ASSETS = "/assets/ui";

/** Character portrait: female-default.webp, female-lotus.webp, male-default.webp, male-lotus.webp */
export function getCharacterImage(
  gender: "Male" | "Female",
  variant: "default" | "lotus"
): string {
  return `${UI_ASSETS}/${gender.toLowerCase()}-${variant}.webp`;
}
