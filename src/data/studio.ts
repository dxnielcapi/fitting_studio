export type Social = {
  label: string;
  handle: string;
  href: string;
  icon: "instagram" | "globe";
};

export const studio = {
  name: "syle.studio",
  city: "Ciudad de México",
  // CONFIRM: el texto es provisional — cámbialo por el tuyo.
  tagline: "Un estudio creativo de ropa pensada",
  intro:
    "Cada prenda, vista por los cuatro lados. Entra al probador y dale la vuelta a la colección.",
  madeIn: "Hecho en México",
  year: "2026",
  socials: [
    {
      label: "Instagram",
      handle: "@syle.studio",
      // CONFIRM: URL real de Instagram
      href: "https://instagram.com/syle.studio",
      icon: "instagram",
    },
    {
      label: "Sitio web",
      handle: "syle.studio",
      // CONFIRM: dominio real
      href: "https://syle.studio",
      icon: "globe",
    },
  ] satisfies Social[],
};
