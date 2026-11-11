# Our Cozy Corner

A small birthday website. It is plain HTML, CSS and JavaScript, so there is no build step: open `index.html` through any web server, or host it on GitHub Pages.

## Pages

| Page | File |
| --- | --- |
| Check-in (passcode) | `index.html` |
| Home | `home.html` |
| Letters (click to flip) | `letters.html` |
| Music player | `music.html` |
| Compliment gacha | `gacha.html` |
| Farm and sticker board | `garden.html` |
| Fanfics (AO3 "Temu edition") | `fanfics.html` |

## Editing content

- **Passcodes**: `assets/js/core.js` keeps SHA-256 hashes of the allowed codes (000000 for testing, 121105). To add a code, run `echo -n 123456 | sha256sum` and paste the hash into `ALLOWED`.
- **Compliments and voice notes**: `assets/js/gacha-data.js`. `THREE_STAR` and `FOUR_STAR` are lists of text. Each `VOICE_NOTES` entry is `{ title, src, transcript }`, and the audio goes in `assets/audio/voice/`. `TOMATO_TEXT` is shown when you lose the 50/50.
- **Gacha odds** are the Genshin ones (in `assets/js/gacha.js`): 5★ is 0.6%, rising by 6% per pull from pull 74, and guaranteed at 90. 4★ is 5.1%, 56.1% on pull 9, and guaranteed on pull 10. A 5★ is a voice note or a loss (50/50). A loss is a tomato or a rickroll, set in `FAILS` in `assets/js/gacha-data.js`, and after a loss the next 5★ is always a voice note. The very first 5★ is always the rickroll.
- **Fanfics**: `assets/js/fanfic-data.js`. Replace the placeholders. `summary` shows on the list, `about` is the longer description in the popup, and `url` adds a "Read it" button.
- **Songs**: `assets/js/music.js` (`SONGS`), with audio in `assets/audio/`.
- **Letters**: `assets/js/letters.js` (`LETTERS`), with images in `assets/letters/letterN-front.webp` / `letterN-back.webp`.
- **Stickers**: add an image to `assets/img/stickers/` and its file name to `STICKERS` in `assets/js/garden.js`.

Gacha pulls, the garden and the sticker board are saved in the browser, separately for each passcode. They live on that device only.

The passcode is a light lock, not real security. Anyone who reads the page source could get past it.

## Hosting on GitHub Pages

1. On GitHub, open the repository's **Settings → Pages**.
2. Under "Build and deployment", choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
3. After a minute the site is live at `https://sweeshtesting.github.io/website/`.

## Custom GoDaddy domain (once it's bought)

1. In GoDaddy, go to **My Products → your domain → DNS**.
2. Delete any existing `A` record for `@`, and the "Parked" one if there is one. Then add four `A` records with name `@`:
   `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Add (or edit) a `CNAME` record: name `www`, value `sweeshtesting.github.io`.
4. On GitHub, open **Settings → Pages → Custom domain**, type your domain (for example `yourdomain.com`), and press **Save**. This adds a `CNAME` file to the repo.
5. When the DNS check passes (it can take up to a day), tick **Enforce HTTPS**.
