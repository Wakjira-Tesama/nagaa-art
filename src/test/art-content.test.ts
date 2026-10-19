import { describe, expect, it } from "vitest";
import { isLanguage, languages, filterWorks, filterWorksByCategory, type Category } from "@/lib/art-content";

describe("Portfolio languages", () => {
  it("supports exactly Oromo, English and Amharic", () => {
    expect(languages.map((item) => item.value)).toEqual(["om", "en", "am"]);
  });
  it("rejects unsupported saved languages", () => {
    expect(isLanguage("fr")).toBe(false);
    expect(isLanguage(null)).toBe(false);
  });
});

describe("Artwork filters", () => {
  const works = [{ id: 0, medium: "leather" }, { id: 1, medium: "canvas" }];
  it("filters by medium", () => {
    expect(filterWorks(works, "canvas", [])).toEqual([works[1]]);
  });
  it("only shows selected favorites", () => {
    expect(filterWorks(works, "favorites", [0])).toEqual([works[0]]);
    expect(filterWorks(works, "favorites", [])).toEqual([]);
  });
});

describe("Artwork category filtering", () => {
  const works = [
    { id: 0, medium: "leather", category: "personal" as Category },
    { id: 1, medium: "canvas", category: "school" as Category },
    { id: 2, medium: "leather", category: "hospital" as Category },
    { id: 3, medium: "canvas", category: "hotel" as Category },
  ];

  it("filters by category correctly", () => {
    expect(filterWorksByCategory(works, "all", "school", [])).toEqual([works[1]]);
    expect(filterWorksByCategory(works, "all", "hospital", [])).toEqual([works[2]]);
  });

  it("combines medium and category filters", () => {
    expect(filterWorksByCategory(works, "leather", "hotel", [])).toEqual([]);
    expect(filterWorksByCategory(works, "canvas", "hotel", [])).toEqual([works[3]]);
  });
});
