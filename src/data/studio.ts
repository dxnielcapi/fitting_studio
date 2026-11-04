export type Social = {
  label: string;
  handle: string;
  href: string;
  icon: "instagram" | "globe";
};

export const studio = {
  name: "syle.studio",
  // CONFIRM: wording is a placeholder — swap for your own.
  tagline: "A creative studio for considered clothing",
  intro:
    "Every piece, seen from every side. Step into the fitting room and walk around the collection.",
  year: "2026",
  socials: [
    {
      label: "Instagram",
      handle: "@syle.studio",
      // CONFIRM: real Instagram URL
      href: "https://instagram.com/syle.studio",
      icon: "instagram",
    },
    {
      label: "Website",
      handle: "syle.studio",
      // CONFIRM: real domain
      href: "https://syle.studio",
      icon: "globe",
    },
  ] satisfies Social[],
};
