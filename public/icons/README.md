# PWA Icons

Place your icon PNG files here with **exactly** these filenames:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## Recommended tool
Use https://realfavicongenerator.net — upload your 512×512 logo and it generates all sizes.

## After adding icons, commit and push:
```bash
git add public/icons/
git commit -m "feat: add PWA app icons"
git push
```

Until PNG icons are added, the app uses `/icon.svg` as a fallback (works on all browsers except iOS home screen).
