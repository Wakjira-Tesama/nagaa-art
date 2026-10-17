import { describe, expect, it } from "vitest";
import { isLanguage, languages, filterWorks } from "@/lib/art-content";
describe("Portfolio languages", () => {
  it("supports exactly Oromo, English and Amharic", () => { expect(languages.map((item) => item.value)).toEqual(["om", "en", "am"]); });
  it("rejects unsupported saved languages", () => { expect(isLanguage("fr")).toBe(false); expect(isLanguage(null)).toBe(false); });
});
describe("Artwork filters", () => {
  const works = [{ id: 0, medium: "leather" }, { id: 1, medium: "canvas" }];
  it("filters by medium", () => { expect(filterWorks(works, "canvas", [])).toEqual([works[1]]); });
  it("only shows selected favorites", () => { expect(filterWorks(works, "favorites", [0])).toEqual([works[0]]); expect(filterWorks(works, "favorites", [])).toEqual([]); });
});
