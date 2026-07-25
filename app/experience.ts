export type FlowerKind = "higanbana" | "camellia" | "rose" | "sakura" | "wisteria";

export const experience = {
  recipientName: "Fran SC",
  introText: "Hice algo para ti.",
  audioPath: "",
  signature: "Hecho con código, café y buenas intenciones.",
  gardenMessage: "Ojalá sacarte una sonrisa con esto, jaja.",
  flowerMessages: [
    { kind: "higanbana", label: "HIGANBANA", name: "Lirio araña rojo" },
    { kind: "camellia", label: "CAMELIA", name: "Camelia roja oscura" },
    { kind: "rose", label: "ROSA CARMESÍ", name: "Rosa carmesí" },
    { kind: "sakura", label: "YOZAKURA", name: "Flor de cerezo nocturna" },
    { kind: "wisteria", label: "FUJI", name: "Glicinia púrpura" },
  ],
  finalMessages: [
    "Pensé en enviarte flores…",
    "Pero unas flores comunes no parecían suficientes.",
    "Y, por cierto, espero que tu resfriado termine pronto.",
  ],
  closingText: "Ahora tendrás que decirme cuál es tu favorita.",
} as const;
