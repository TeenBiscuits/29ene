"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { Share01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareButton({
  labels,
}: {
  labels: {
    guide: string;
    motto: string;
    share: string;
    copied: string;
    error: string;
  };
}) {
  const [status, setStatus] = useState("");
  async function share() {
    const data = {
      title: `29N / ${labels.guide}`,
      text: labels.motto,
      url: window.location.href.split("#")[0],
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setStatus(labels.copied);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        setStatus(labels.error);
    }
  }
  return (
    <div className="share-control">
      <Button variant="outline" onClick={share} className="share-button">
        <HugeiconsIcon
          icon={Share01Icon}
          strokeWidth={1.5}
          data-icon="inline-start"
          aria-hidden="true"
        />
        {labels.share}
      </Button>
      <p role="status" className="share-status">
        {status}
      </p>
    </div>
  );
}
