# Petty landing assets

Reference: `/Users/hyunjoong/.codex/attachments/424ccf3a-4627-4dc4-a5a9-86fc3859f289/image-1.png`.

All new illustrations were generated using the built-in ImageGen tool, with the supplied design as the visual reference. The existing wordmark and cat hero background were retained. Separate character assets share warm sunset lighting, navy shadows and polished romantic Korean anime art direction.

## Saved assets and generation prompts

Original PNGs and optimized, page-consumed WebP files are in `/Users/hyunjoong/petty-im/public/assets/`.

| Files (PNG + WebP) | Final prompt / direction |
| --- | --- |
| `seoha` | Young adult woman with long black hair and black blouse, reserved mysterious expression, warm sunset city, detailed premium Korean anime romance illustration, portrait 3:4, no text or watermark. |
| `ian` | Young adult man with swept black hair, thin glasses and black suit, calm intelligent expression, sunset research office and city, same premium anime direction, portrait 3:4, no text or watermark. |
| `yuri` | Young adult woman with flowing honey blonde hair, cream cardigan and gentle smile, warm sunset city, polished detailed romantic anime illustration, portrait 3:4, no text or watermark. |
| `kyle` | Young adult man with short tousled black hair, navy futuristic hooded jacket and calm reserved expression, warm sunset city, matching romantic anime illustration, portrait 3:4, no text or watermark. |
| `elia` | Young adult witch with very long silver-lavender hair, wide ivory witch hat with gold trim, dark violet robe, warm sunset magical city, romantic twilight lighting, premium Korean anime fantasy illustration, portrait 3:4, no text or watermark. |
| `story-book-transparent` (original `story-book`) | Magical open lavender storybook with a pink quill and subtle sparkles, soft lavender page glow, premium Korean anime fantasy illustration, centered landscape composition, no letters or watermark. Final edit preserves book, quill and sparkles and removes background to genuine transparency. |
| `heart-bubble` | Single soft ivory speech bubble with a bright dimensional glossy pink heart, small tapered tail pointing down-left, isolated on genuinely transparent background, polished Korean anime fantasy UI illustration, no text or watermark. |
| `app-phones` | High fidelity marketing asset of four overlapping black smartphones showing Korean AI character chat app Petty. Center front phone largest with Petty logo, purple anime promo banner and Korean title “새로운 이야기를 시작해요”, character cards; three phones behind with navy chat bubbles, avatar message lists and profile. Realistic black frames, lavender rim light, dark navy background, phones extend beyond bottom edge. Wide 3:2. Promotional concept illustration, not a screenshot of a released product. |

`hero-background.webp` is an optimized version of the existing `hero-background.png`. `download-qr.png` is a real QR encoding `https://petty.im/#download`, generated deterministically with a QR library. It links to the mobile website, not to an unconfigured app-store listing.

## Conversion behavior

App Store and Google Play URLs remain unconfigured in `content/landing-content.ts`. Their badges open the existing launch-notification form. Replacing their `href` values with actual store URLs automatically renders outbound links. No email submission was performed during browser QA.

Character cards open accessible descriptions and link to the download section. Mobile navigation expands and closes on selection. Footer policy items currently open inquiries to the existing contact address; published policy documents have not been supplied.
