import { studio } from "@/data/studio";
import { socialIcons } from "@/components/ui/Icons";

/**
 * Social links, styled for the nav bar: no pill, an underline that wipes in
 * on hover, and icon-only below `sm` so the bar stays clean on a phone.
 */
export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-1 sm:gap-4 ${className}`}>
      {studio.socials.map((social) => {
        const Icon = socialIcons[social.icon];
        return (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 px-2 py-2 text-sm text-ink-soft transition-colors duration-200 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              <Icon className="size-4" />
              <span className="hidden font-medium tracking-tight sm:inline">
                {social.handle}
              </span>
              {/* The visible handle is hidden on phones, so the link keeps an
                  accessible name here either way. */}
              <span className="sr-only"> — {social.label}</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2 bottom-1 h-px origin-left scale-x-0 bg-ink transition-transform duration-300 group-hover:scale-x-100"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
