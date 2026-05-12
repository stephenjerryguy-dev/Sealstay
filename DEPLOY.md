# Deploying SealStay → sealstay.xyz

This is a Vite SPA. Recommended host: **Vercel** (free, automatic on push). The
repo is already at `github.com/stephenjerryguy-dev/Sealstay`.

## 1. Push the local build to GitHub

```bash
cd /Users/sergerald/Claude/sealstay
git add -A
git commit -m "Cinematic redesign — landing, neighborhoods, capabilities"
git push origin main
```

## 2. Import on Vercel

1. https://vercel.com/new → Import `stephenjerryguy-dev/Sealstay`
2. Vercel will pick up `vercel.json` automatically. Framework: **Vite**.
3. Hit **Deploy**. First deploy takes ~1 min.

## 3. Attach sealstay.xyz

In the Vercel project → **Settings → Domains** → add `sealstay.xyz` and
`www.sealstay.xyz`.

Vercel will show DNS targets. At your registrar (where you bought
`sealstay.xyz`) set:

| Host | Type | Value |
|------|------|-------|
| `@` (apex) | `A` | `76.76.21.21` |
| `www` | `CNAME` | `cname.vercel-dns.com.` |

DNS propagation: 5 min – 24 hr (usually <1 hr).
SSL is issued automatically once DNS resolves.

## 4. (Alternate host) Netlify

If you'd rather use Netlify, the existing `vercel.json` rewrite is replicated
in `public/_redirects` (see file). Same DNS pattern, but the apex `A` record
points to `75.2.60.5` and `www` `CNAME` to `apex-loadbalancer.netlify.com.`.

## After deploy

- Update `index.html` `<meta>` description and Open Graph card.
- Drop a real `public/og-cover.png` (1200×630).
- Set `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` env vars when auth lands.
