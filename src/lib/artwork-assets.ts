import realArtAliBirraLeather from "@/assets/real_art_ali_birra_leather.jpg";
import realArtLeatherHachalu from "@/assets/real_art_leather_hachalu.jpg";
import realArtLeaderLeather from "@/assets/real_art_leader_leather.jpg";
import realArtSchoolMural from "@/assets/real_art_school_mural.jpg";
import realArtIrreechaMural from "@/assets/real_art_irreecha_mural.jpg";
import realArtEloraCoffee from "@/assets/real_art_elora_coffee.png";
import realArtDamLandscape from "@/assets/real_art_dam_landscape.jpg";
import realArtCafeMural from "@/assets/real_art_cafe_mural.jpg";
import realArtLiveCanvas from "@/assets/real_art_live_canvas.jpg";
import realArtOromoGirlMural from "@/assets/real_art_oromo_girl_mural.jpg";
import realArtElderFramed from "@/assets/real_art_elder_framed.jpg";
import realArtPortraitColor from "@/assets/real_art_portrait_color.jpg";
import realArtEvolutionSchoolMural from "@/assets/real_art_evolution_school_mural.jpg";
import realArtOliiSalonMural from "@/assets/real_art_olii_salon_mural.png";
import realArtWildlifeSafari from "@/assets/real_art_wildlife_safari.jpg";

/** Maps DB `image_key` values to bundled static assets. */
export const artworkAssetMap: Record<string, string> = {
  real_art_ali_birra_leather: realArtAliBirraLeather,
  real_art_leather_hachalu: realArtLeatherHachalu,
  real_art_leader_leather: realArtLeaderLeather,
  real_art_school_mural: realArtSchoolMural,
  real_art_irreecha_mural: realArtIrreechaMural,
  real_art_elora_coffee: realArtEloraCoffee,
  real_art_dam_landscape: realArtDamLandscape,
  real_art_cafe_mural: realArtCafeMural,
  real_art_live_canvas: realArtLiveCanvas,
  real_art_oromo_girl_mural: realArtOromoGirlMural,
  real_art_elder_framed: realArtElderFramed,
  real_art_portrait_color: realArtPortraitColor,
  real_art_evolution_school_mural: realArtEvolutionSchoolMural,
  real_art_olii_salon_mural: realArtOliiSalonMural,
  real_art_wildlife_safari: realArtWildlifeSafari,
};

export function resolveArtworkSrc(imageUrl?: string | null, imageKey?: string | null): string {
  if (imageUrl) return imageUrl;
  if (imageKey && artworkAssetMap[imageKey]) return artworkAssetMap[imageKey];
  return "";
}
