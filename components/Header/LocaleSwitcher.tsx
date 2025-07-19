"use client";

import { Check, Globe } from "lucide-react";
import { useParams } from "next/navigation";
import { Locale, useLocale } from "next-intl";
import { startTransition } from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useIsMobile } from "@/hooks/useMobile";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";

type Props = {
  defaultValue: string;
};

export function LocaleSwitcherSelect({ defaultValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const params = useParams();

  function onLocaleSelect(locale: Locale) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale },
      );
    });
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        {isMobile ? (
          <Globe className="size-5 md:size-6" />
        ) : (
          <Button>{defaultValue}</Button>
        )}
      </DropdownTrigger>
      <DropdownMenu>
        {locales.map((locale) => (
          <DropdownItem
            key={locale.code}
            onClick={() => onLocaleSelect(locale.code)}
          >
            <div className="flex items-center justify-between">
              <span>{locale.name}</span>
              {defaultValue === locale.name && (
                <Check className="ml-2 size-4" />
              )}
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export function LocaleSwitcher() {
  const locale = useLocale();

  const name = locales.find((i) => i.code === locale)?.name ?? "Unknown";

  return <LocaleSwitcherSelect defaultValue={name} />;
}
