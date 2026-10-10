# Chat skin sources

Only the files listed below are incorporated. No upstream host/plugin runtime is installed.

## Deep-sea Maid Atelier / ORCA LINK

Source: https://github.com/Small-tailqwq/dsh-deep-whale/tree/4b8c9c901ee249a9b2136c18a8249c30621d585d

| Local file | Original path |
| --- | --- |
| maid-day.webp | maid-atelier/assets/maid-atelier-palace-day-v4.webp |
| maid-night.webp | maid-atelier/assets/maid-atelier-palace-night-v4.webp |
| maid-lace.png | maid-atelier/assets/maid-composer-lace-tile-v2.png |
| maid-crest.webp | maid-atelier/assets/maid-bottom-crest-v1.webp |
| maid-frame.webp | maid-atelier/assets/maid-composer-frame-shell-v1.webp |
| maid-ribbon-left-cap.webp | maid-atelier/assets/maid-composer-ribbon-left-cap-v1.webp |
| maid-ribbon-left-fill.webp | maid-atelier/assets/maid-composer-ribbon-left-fill-v1.webp |
| maid-ribbon-right-cap.webp | maid-atelier/assets/maid-composer-ribbon-right-cap-v1.webp |
| maid-ribbon-right-fill.webp | maid-atelier/assets/maid-composer-ribbon-right-fill-v1.webp |
| maid-bow.webp | maid-atelier/assets/runtime/dcf64a43ad6b9e71c24c91fb9b1d7fe8af534497fd421213472bea96e6bc04b5.webp |
| maid-top-trim.webp | maid-atelier/assets/runtime/e49115f3942ea5c5034c81016c61944b5261c8ea410318cb0419b445c990b063.webp |
| orca-scene.webp | orca-link/assets/runtime/8e35ddb65f30bb23fcc7752cf5b92b2a1d958b93779eb607f878e0510e1affd9.webp |

Artwork bytes are unchanged. Artwork: **CC BY-NC-SA 4.0**, with the complete attribution chain retained in each NOTICE and LICENSE-ARTWORK. Maid attribution: 上善 → ZipZipPipe → Small-tailqwq. ORCA attribution: 上善 → Small-tailqwq. No separate character portraits, state atlases, or startup illustrations are included. The same ORCA scene serves both modes because this independent scene has no matching dark variant.

The CSS modules under each skin's `src/client/` inform the scoped chat adaptation: maid navy/periwinkle/porcelain/gold palette, framed surfaces, lace/crest; ORCA compact angular panels, seams and inset controls. Code is MIT; original LICENSE files are preserved. This is an adaptation for a resizable independent chat, not a whole-host DOM/CSS copy.

Maid sample revision: composer nine-slice shell and five-layer ribbon/bow composition adapt `maid-atelier.module.css` lines 3497–3534; local lace adapts lines 3614–3675. Small-window chrome uses half-size dimensions, fullscreen three-quarter dimensions. The image background remains centered cover as approved for this host. Frame corners include baked-in lace; the independent ornaments part owns the added ribbon, bow, lace strip and global trims. Porcelain surfaces are translucent; arbitrary custom colors/backgrounds require visual readability review rather than relying solely on the solid-base contrast calculation.

## Glass

https://github.com/noexcs/dsh-skin-glass/tree/085df7daf0ebc65f721e66896406bb9877489b59 — MIT, license preserved. Adapted frosted surfaces, mirror-edge highlights and round controls. Automatic wallpaper-derived colors and fallback wallpaper gradients are deliberately excluded by the approved specification. Content uses an opaque reading surface for deterministic contrast on arbitrary local wallpaper.

## Neumorphism

https://github.com/Lhy723/dsh-neu-theme/tree/218f4f7896637dc33ed691d15c5c8ccc568fca6a — MIT, license preserved. Reference: `src/client.tpl.js`. Adapted raised/inset surfaces, paired soft shadows, pressed feedback and recessed code containers. No runtime copied.

## Local additions

SVG action icons are simple original geometric line drawings. Module boundaries, layout, resize/fullscreen controls, settings and palette logic are local code. This file and all upstream licenses/notices ship with exported assets.
