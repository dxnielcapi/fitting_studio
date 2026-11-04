import { studio } from "@/data/studio";
import { socialIcons } from "@/components/ui/Icons";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {studio.socials.map((social) => {
        const Icon = socialIcons[social.icon];
        return (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-full border border-line/80 bg-paper/60 px-4 py-2 text-sm text-ink-soft transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-paper focus-visible:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <Icon className="size-4" />
              <span className="font-medium tracking-tight">{social.handle}</span>
              <span className="sr-only"> — {social.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
