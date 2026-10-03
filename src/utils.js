import { SPRITE_BASE_URL } from "./config.js";

export function getIdFromUrl(url) {
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getSpriteUrl(id) {
  return `${SPRITE_BASE_URL}/${id}.png`;
}

export const TYPE_COLORS = {
  normal:   "#A8A77A",
  fire:     "#EE8130",
  water:    "#6390F0",
  electric: "#F7D02C",
  grass:    "#7AC74C",
  ice:      "#96D9D6",
  fighting: "#C22E28",
  poison:   "#A33EA1",
  ground:   "#E2BF65",
  flying:   "#A98FF3",
  psychic:  "#F95587",
  bug:      "#A6B91A",
  rock:     "#B6A136",
  ghost:    "#735797",
  dragon:   "#6F35FC",
  dark:     "#705746",
  steel:    "#B7B7CE",
  fairy:    "#D685AD",
};

export function getTypeColor(type) {
  return TYPE_COLORS[type] ?? "#888";
}
