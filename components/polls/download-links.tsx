"use client";

import { HugeiconsIcon } from '@hugeicons/react';
import { Download04Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';

export function DownloadLinks({ links }: { links: { href: string; label: string }[] }) {
  return <div className="survey-download-links">
    {links.map(link => <Button key={link.href} variant="outline" nativeButton={false} render={<a href={link.href} download />}>
      <HugeiconsIcon icon={Download04Icon} data-icon="inline-start" aria-hidden="true" />{link.label}
    </Button>)}
  </div>;
}
