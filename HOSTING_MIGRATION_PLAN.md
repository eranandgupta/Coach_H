# Hosting Plan: Vercel se Hostinger tak

Last updated: 4 November 2026

Is file mein hosting ka poora faisla, ab tak ki findings aur baaki kaam ke steps hain.

---

## 1. Abhi ka status

| Cheez | Status |
|---|---|
| Vercel plan | **Pro le liya** (CLI se confirm kiya: team `anand's projects` = `pro`) |
| Live deployment | `e4bcbb4`, yani PR #1 `seo-round-23-admin-fixes` ka merge |
| Blog cache, canonical aur sitemap fix | **Ready hai, push nahi hua.** Branch `fix/blog-cache-sitemap-canonical`, commit `9a5b9a7` |
| SPF record | **Nahi hai.** Add karna baaki hai |
| Hostinger hosting plan ki renewal | lagbhag ₹15,000. **Expiry date abhi check nahi hui** |
| `talent-bridge` project (qualzv.com, .com.au, .co.nz, .co.uk) | Vercel pe **paused** hai, live nahi |

---

## 2. Final faisla

1. **Abhi:** Vercel Pro pe raho, taaki site pause na ho. Ye bridge plan hai.
2. **Agla step:** app ko apne existing Hostinger hosting plan pe ek test subdomain par chala kar dekho.
3. **Test pass hua:** app Hostinger plan pe shift karo aur Vercel Pro band kar do.
4. **Test fail hua:** Hostinger VPS KVM 2 lo, par pehle support se mail ka jawaab le lo (section 8).
5. **KVM 2 abhi mat kharido**, aur **naya Vercel Hobby account mat banao**. Wajah section 9 mein hai.

---

## 3. Turant karne wale kaam

### 3.1 Blog fix push karo
VS Code ke terminal mein chalao. Password maange to GitHub login do:

```
cd /Users/anand/coach_himanshu/Coach_H && git push origin fix/blog-cache-sitemap-canonical:main
```

- Agar `rejected` ya `non-fast-forward` aaye, to `main` aage badh gaya hai. Pehle rebase karo:
  `git fetch origin && git rebase origin/main fix/blog-cache-sitemap-canonical`. Phir dobara push karo.
- Deploy ke baad ye check karo:
  - Kisi blog post pe `curl -sI https://coachhimanshu.com/blog/<slug>` do baar chalao. Doosri baar `x-vercel-cache: HIT` aana chahiye, `no-store` nahi.
  - Page source mein sirf **ek** `<title>` aur **ek** canonical hona chahiye, jo usi post ka URL ho.
  - `https://coachhimanshu.com/robots.txt` mein 8 `Sitemap:` lines honi chahiye.

**Is commit mein kya hai:**
- `app/blog/[slug]/page.tsx`
  - **Empty `generateStaticParams`:** iske bina har blog view dynamic render ho raha tha (`private, no-cache, no-store`). Local test mein pehli request 2.29 sec ki thi aur doosri 0.003 sec ki (cache `HIT`).
  - **`stripEmbeddedDocumentTags`:** post ke HTML se doctype, `html`, `head`, `body`, `title`, `meta` aur canonical tags hataata hai. `Article` aur `MedicalWebPage` JSON-LD bhi hata deta hai, kyunki page `BlogPosting` already deta hai. `<style>` aur FAQPage schema wahi rehte hain.
- `public/robots.txt`: pehle sirf `/sitemap.xml` tha, jo **404** deta hai. Ab isme `/sitemap/0.xml` se `/sitemap/7.xml` tak ki 8 lines hain, jinme kul lagbhag 1,182 URLs hain.

**Side effects:**
- Blog post edit ya unpublish karne ka asar live pe dikhne mein 1 ghanta tak lag sakta hai.
- Jo URL exist nahi karta, uska 404 bhi 1 ghante tak cache ho sakta hai. Naya post publish karte hi 404 dikhe, to thoda ruko.

### 3.2 SPF record add karo (Hostinger DNS)
Domain pe abhi koi SPF record nahi hai. DKIM (`hostingermail-a/b/c`) aur DMARC (`p=none`) maujood hain.

| Type | Name | Value |
|---|---|---|
| TXT | `@` | `v=spf1 include:_spf.mail.hostinger.com ~all` |

- Domain pe sirf ek SPF record hona chahiye.
- Check karne ke liye: `dig +short TXT coachhimanshu.com`

### 3.3 Google Search Console
- `sitemap/0.xml` se `sitemap/7.xml` tak submit karo.
- `/sitemap.xml` submitted ho to use hata do, kyunki wo 404 hai.

### 3.4 Hostinger plan ki expiry date dekho
`hPanel → Websites → coachhimanshu.com → Hosting Plan → Renew`

- **Expiry 1 mahine ke andar hai:** renew kar do. Database isi plan pe hai (`server1326`, `srv1326.hstgr.io`). Plan expire hua to login, payments aur dashboards toot sakte hain, chahe site Vercel pe ho.
- **Expiry usse door hai:** test ke result tak ruko (section 5).

---

## 4. Vercel usage: kya bhar raha tha aur kyun

Hobby plan ka 30 din ka usage (screenshot, 1 Nov 2026):

| Meter | Usage | % |
|---|---|---|
| Fast Origin Transfer | 9.85 GB / 10 GB | **98%** |
| ISR Reads | 926K / 1M | 93% |
| Fluid Active CPU | 3h 2m / 4h | 76% |
| Deployment Storage | 6.06 GB / 10 GB | 61% |
| CDN Requests | 428K / 1M | 43% |
| Fast Data Transfer (CDN outgoing) | 8.26 GB / 100 GB | **8%, koi problem nahi** |

**Fast Origin Transfer kya hai:** jab page CDN cache mein nahi milta aur Vercel ko use function ya ISR storage se lana padta hai. Cache se serve hone (`HIT`) par ye meter nahi badhta. Ye pichhle 30 din ka rolling total hai, kisi date pe zero nahi hota.

**Pichhle 1 ghante ke request logs ke 669 requests se andaza:**
- Requests mein 82% browser jaise the aur 11% pehchane gaye bots. 70% traffic India se tha aur 22% US se.
- Calorie pages lagbhag 2.7 GB/month ka andaza deti hain. Ye cold `PRERENDER` hits hain, aur `/calories/[food]` ke lagbhag aadhe hits bots ke the.
- Blog posts lagbhag 1.2 GB/month ka andaza deti hain, kyunki cache nahi ho rahe the. Fix section 3.1 mein hai.
- Sitemaps 0.9 GB/month tak ho sakte hain.
- Dashboard ki API polling 0.1 GB se kam hai, kyunki responses chhote hain. Ye function calls aur CPU badhati hai, bytes nahi.
- Pichhle 30 din mein 11 alag dino par 26 production deploys hue. Har deploy ke baad cache dobara banta hai.
- Bytes Vercel compressed ginta hai ya raw, ye pakka nahi pata. Compressed ginta ho to ye numbers kam honge.

**Kya karna hai:**
- Ek din ka kaam ek hi deploy mein bhejo.
- Calorie pages ko block mat karo, kyunki SEO aur GEO ke liye zaroori hain.
- Bing, Perplexity aur doosre search ya AI bots ko block mat karo.

**Bina add-on ke data nahi milta:** path-wise 30 din ka data Vercel Observability Plus (paid add-on) ke bina nahi milta. Wo nahi kharida gaya.

---

## 5. Options aur saal ka kharcha

Maan ke chala hai: Pro = $20/month (lagbhag ₹1,900), hosting renewal = ₹15,000 for 1 saal. KVM 2 ke rates third-party sites se hain, kharidne se pehle confirm karna.

| Option | Pehla saal | Kaam aur risk |
|---|---|---|
| A. Vercel Pro + hosting plan | lagbhag ₹38,000 | Koi migration nahi, sabse safe |
| B. VPS + hosting plan | lagbhag ₹26,000–28,000 | App shift karni hogi aur server khud sambhalna hoga |
| C. Sirf VPS + alag email plan | lagbhag ₹11,000–13,000 + email ka kharcha | App, database aur mail teeno shift, sabse zyada kaam |
| **D. Sirf hosting plan, app bhi yahin** | **lagbhag ₹15,000** | App shift hogi, database aur mail wahin rahenge. **Test karna baaki hai** |

### Hosting plan vs VPS KVM 2 (specs)

| Detail | Hosting plan | VPS KVM 2 |
|---|---|---|
| Price | ₹15,000 renewal | ₹11,000/year offer. Renewal lagbhag ₹1,199/month + GST, yani lagbhag ₹17,000/year |
| RAM | 3 GB | 8 GB |
| CPU | 2 cores | 2 vCPU |
| Disk | 50 GB | 100 GB NVMe |
| Bandwidth | Unlimited | 8 TB |
| Process limit | 120 | Koi fixed limit nahi |
| Server maintenance | Hostinger | Aap khud |
| MySQL database | Abhi yahin hai | Khud install karke shift karna hoga |
| Mail IDs | Shayad isi plan se judi hain | Mail nahi milta, alag plan lena hoga |
| Next.js | Supported (Node 18–24) | Khud setup karna hoga |

---

## 6. Hostinger hosting plan pe test (Option D)

**Live site aur A record ko mat chhedna.** Sab kuch test subdomain pe hoga.

### 6.1 Code mein test se pehle ke kaam
- [ ] `sharp` ko `devDependencies` se `dependencies` mein shift karo, taaki self-hosted image optimization chale.
- [ ] Blog fix (section 3.1) `main` mein hona chahiye.

### 6.2 Setup
1. hPanel mein `test.coachhimanshu.com` subdomain banao.
2. **Add Website → Node.js** chuno, GitHub repo `eranandgupta/Coach_H` connect karo, branch `main` rakho.
3. Node version **20 ya 22** select karo.
4. Build command `npm run build` rakho (isme `prisma generate` shamil hai). Start command `npm start` rakho.
5. Env variables daalo (section 6.3). Production values Vercel se lo, local `.env` se nahi.

### 6.3 Env variables
Ye list code se nikali hai (4 Nov 2026). Shift se pehle ye command dobara chala ke check kar lena:
`grep -rhoE 'process\.env\.[A-Z0-9_]+' app lib components contexts hooks scripts worker | sort -u`

| Variable | Note |
|---|---|
| `DATABASE_URL` | Hostinger pe `connection_limit=1` ko badha ke 5–10 karo. Wo limit serverless ke liye thi |
| `JWT_SECRET` | **Bilkul wahi rakho**, warna sab users logout ho jayenge |
| `NEXT_PUBLIC_GA4_ID` | **Build se pehle set hona zaroori hai**, warna Google Analytics chupchap band ho jayega. Live ID `G-6F0YSQ9TFY` hai. Ye local `.env` files mein nahi hai |
| `CRON_SECRET` | Ye nahi hua to crons 500 denge |
| `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENV` | Production values. Local `.env.local` mein sandbox values ho sakti hain |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` | `smtp.hostinger.com:465` |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | **Wahi rakho**, warna push notifications toot jayengi |
| `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`, `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | Images ke liye |
| `ADMIN_ALERT_EMAIL`, `TRAINER_EMAIL`, `TRAINER_PASSWORD` | Vercel se lo |
| `GOOGLE_SITE_VERIFICATION` | Optional. Search Console DNS TXT record se verified hai |
| `PRISMA_ACCELERATE_URL` | Optional safety net |

Ye abhi code mein use nahi hote, inhe chhod sakte ho: `BLOB_READ_WRITE_TOKEN`, `VERCEL_OIDC_TOKEN`, `RAZORPAY_*`.

### 6.4 Cron jobs (abhi `vercel.json` mein hain)
Har cron ko `Authorization: Bearer $CRON_SECRET` header chahiye. Schedules UTC mein hain.

| Path | Schedule (UTC) | IST | Kaam |
|---|---|---|---|
| `/api/cron/reconcile-subscriptions` | `35 18 * * *` | roz 00:05 | Subscriptions reconcile |
| `/api/cron/expiry-reminders` | `30 3 * * *` | roz 09:00 | Expiry reminder emails |
| `/api/cron/indexnow` | `0 3 * * 1` | Somvar 08:30 | IndexNow ping |

hPanel cron mein ye command chalegi:
`curl -s -H "Authorization: Bearer <CRON_SECRET>" https://coachhimanshu.com/api/cron/<name>`

### 6.5 Test checklist
- [ ] Build 15 minute ke andar khatam ho. Ye Hostinger ki limit hai, local build 10 minute ke andar hua tha.
- [ ] Homepage, blog, calorie, city aur country pages khulte hain.
- [ ] OG images (`opengraph-image`, edge runtime wali 7 files) bante hain.
- [ ] Login, logout aur 365 din wala session chalta hai.
- [ ] Client aur coach dashboards, chat aur notifications chalte hain.
- [ ] Website ke emails aate hain (SMTP) aur spam mein nahi jaate.
- [ ] Teeno crons manually chala ke dekho, 200 aana chahiye.
- [ ] Blog cache ke liye doosri request fast honi chahiye.
- [ ] `/llms.txt`, `/llms-full.txt`, `/robots.txt` aur sitemaps sahi aate hain.
- [ ] Load par 503 errors to nahi aa rahe. Process limit 120 hai, aur ek Next app lagbhag 10–11 threads leti hai.
- [ ] Traffic na hone ke baad app idle stop hoti hai. Uske baad pehli request kitni slow hai, ye dekho.
- [ ] India aur US se speed (TTFB) Vercel ke muqable kaisi hai.
- [ ] **Test domain pe live payments ya real customer emails mat chalana.**

Test fail ho, ya 503 aur slow speed ki problem aaye, to Option C (VPS) dekho.

---

## 7. Final switch (test pass hone ke baad)

1. Hostinger DNS mein A record ka TTL kam karo, jaise 300, aur ek din pehle kar do.
2. Hostinger pe SSL certificate **switch se pehle** ready rakho. Vercel HSTS (`max-age=63072000`) bhejta hai, isliye SSL toota to purane visitors site khol hi nahi payenge.
3. HSTS header aur `www → non-www` 301 redirect same rakho. Redirect `next.config.js` mein hai.
4. Sirf `@` ka A record `216.198.79.1` (Vercel) se `46.28.45.131` (Hostinger) pe badlo. `www` ek CNAME hai jo apne aap follow karega.
5. **MX, DKIM, DMARC aur SPF ko mat chhedna.**
6. Ek real chhota payment karke Cashfree checkout aur webhook (`/api/payment/webhook`) test karo.
7. Crons Hostinger pe chalu karo, aur Vercel pe crons ke duplicate run na hon, iska dhyan rakho.
8. Vercel ko **2–3 din** chalu rakho. Problem aaye to A record wapas `216.198.79.1` kar do.
9. Sab theek rahe to Vercel Pro band karo.
10. Search Console mein crawl errors aur Core Web Vitals 2 hafte tak dekho.

---

## 8. Hostinger support se 3 sawaal (VPS lene se pehle)

1. Hosting plan band karne ke baad meri mail IDs chalengi? Nahi, to alag email plan kitne ka hoga?
2. Hosting plan ka bacha hua amount VPS mein adjust ho sakta hai?
3. VPS ke ₹11,000 mein GST shamil hai? Agle saal renewal kitne ka hoga?

**KVM 2 ke offer pe ye bhi confirm karna:** 2 vCPU, 8 GB RAM, Mumbai data center, aur backups free hain ya alag charge.

---

## 9. Ye mat karna

- **Naya Vercel Hobby account mat banao.** Limit lagbhag ek mahine mein phir bhar jayegi. Hobby sirf non-commercial use ke liye hai, aur aapki site payments leti hai. Limit se bachne ke liye naya account banana abuse bhi lag sakta hai.
- **hPanel mein "Connect automatically" mat dabao.** Nameservers already Hostinger ke hain, aur A record Vercel pe hi rehna chahiye.
- **Cloudflare lagao to AI crawler blocking aur Bot Fight Mode check karo.** Ye GEO ko chupchap khatam kar sakte hain.
- **Nameservers mat badlo.** Badle to MX records chhoot sakte hain aur mail band ho sakti hai.
- **Bots ya calorie pages ko block mat karo.**

---

## 10. SEO, AEO aur GEO pe asar

| Area | Asar | Dhyan rakhne ki baat |
|---|---|---|
| Rankings | URL aur content same rahe to risk kam | Downtime aur 5xx errors se bachna. Crawling kuch din upar-neeche ho sakti hai |
| Search Console | Koi kaam nahi | DNS TXT verification same rahega |
| `llms.txt`, schema, robots | Code ke saath shift ho jayenge | Cloudflare ki AI bot settings check karna |
| Speed | India mein similar ho sakti hai | Abroad wale visitors ke liye single India server slow ho sakta hai. Sample mein 22% requests US se thin |
| Google Analytics | `NEXT_PUBLIC_GA4_ID` build pe hona chahiye | Iske bina tracking chupchap band ho jayegi |

---

## 11. Baaki kaam (hosting se alag)

- **28 posts ke content mein apna `<h1>` hai**, aur page bhi ek `<h1>` deta hai. Isse ek page pe do H1 aate hain. Ye abhi fix nahi hua.
- **Next.js 13.5.1 purana hai.** Self-hosting se pehle upgrade karna behtar rahega.
- **`talent-bridge` paused hai.** Agar wo sites chalni chahiye, to Vercel dashboard se resume karo.
- **Vercel CLI login is machine pe active hai.** Hatana ho to `npx vercel logout` chalao.

---

## 12. Reference

**Vercel CLI (read-only commands, team `anands-projects-29e381e1`):**
```
npx vercel teams ls
npx vercel project ls
npx vercel ls coach-h --environment production
npx vercel logs requests --scope anands-projects-29e381e1 --project coach-h --since 1h -n 1000
```

**Key IDs:**
- Vercel `coach-h` project: `prj_aR7hKQXHwYdpBTF7M1KUjZqI3kV6`
- Database host: `srv1326.hstgr.io` (Hostinger `server1326`)
- Website IP (Hostinger): `46.28.45.131`
- Vercel IP (abhi ka A record): `216.198.79.1`
- Nameservers: `ns1.dns-parking.com`, `ns2.dns-parking.com`
- MX: `mx1.hostinger.com`, `mx2.hostinger.com`

**Sources:**
- [Vercel plans (Hobby pause policy)](https://vercel.com/docs/plans)
- [Vercel limits](https://vercel.com/docs/limits)
- [Vercel pricing](https://vercel.com/docs/pricing)
- [Vercel regional pricing](https://vercel.com/docs/pricing/regional-pricing)
- [Hostinger Next.js docs](https://docs.hostinger.com/node.js/overview-1/next)
- [Hostinger Node.js limits](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/)
- [Hostinger build settings](https://docs.hostinger.com/node.js/build-settings)
- [Hostinger VPS price India](https://zoutons.com/news/hostinger-vps-hosting-price-india-2026)
- [Hostinger VPS renewal pricing](https://hostadvice.com/hosting-company/hostinger-reviews/vps-pricing/)
