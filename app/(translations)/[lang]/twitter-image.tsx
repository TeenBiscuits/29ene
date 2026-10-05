import {
  generateSocialImage,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
  socialImageAlt,
} from "@/lib/social-image";
import { isLocale, type Locale } from "@/lib/locales";

export function generateImageMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const locale = isLocale(params.lang) ? params.lang : "es";

  return [
    {
      id: locale,
      alt: socialImageAlt(locale),
      size: SOCIAL_IMAGE_SIZE,
      contentType: SOCIAL_IMAGE_CONTENT_TYPE,
    },
  ];
}

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return generateSocialImage(lang as Locale);
}
