import { PERSIAN_STANDARD_60_ID } from "@/lib/layout/persian-standard-60";
import { TEMPLATE_60_ANSI_ID } from "@/lib/layout/template-60-ansi";

/** Maps legacy layout template ids to seeded {@link KeyboardTemplate} slugs. */
const LEGACY_TEMPLATE_SLUGS: Readonly<Record<string, string>> = {
  [PERSIAN_STANDARD_60_ID]: TEMPLATE_60_ANSI_ID,
};

/** Resolve a layout's templateId to a DB keyboard template slug. */
export function resolveKeyboardTemplateSlug(templateId: string): string {
  return LEGACY_TEMPLATE_SLUGS[templateId] ?? templateId;
}
