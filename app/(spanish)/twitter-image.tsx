import {
  generateSocialImage,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
  socialImageAlt,
} from "@/lib/social-image";

export const alt = socialImageAlt("es");
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = SOCIAL_IMAGE_CONTENT_TYPE;

export default function TwitterImage() {
  return generateSocialImage("es");
}
