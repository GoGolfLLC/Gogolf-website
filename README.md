# Go Golf

Static website for Go Golf, LLC, the indoor golf studio at 2091 Springdale Rd Suite 18, Cherry Hill, NJ 08003. It replaces the GoDaddy site at gogolfsj.com.

The pages are hand-written HTML. There is one stylesheet, `css/styles.css`. There is no JavaScript and no build step. Cloudflare Pages can publish this repository as-is.

## Preview on your computer

From this folder:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 . Page addresses look like http://localhost:8000/evaluations/ .

## Cloudflare Pages

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | Leave empty |
| Build output directory | Leave empty, so Pages serves the repository root |
| Root directory | Leave empty |

`_redirects` sits in the repository root. Pages reads it automatically. `404.html` is the missing-page screen.

## Pages

| Page | Address | Old address, if it changed |
|---|---|---|
| Home | `/` | |
| Evaluations | `/evaluations` | |
| Golf Lessons | `/golf-lessons` | |
| Simulator Rental | `/simulator-rental` | |
| Club Fitting | `/club-fitting` | `/club-fitting-1` |
| Leagues | `/leagues` | |
| Fitness | `/fitness` | |
| Junior Golf | `/junior-golf` | |
| 2029 PGA Championship | `/2029-pga-championship` | |
| Instructors | `/instructors` | `/instructors-1` |
| eGift Card | `/egift-card` | |
| Contact Us | `/contact-us` | |
| Cancellations | `/cancellations` | |
| Corporate Memberships | `/corporate-memberships` | |
| Holiday Hours | `/holiday-hours` | Footer link, same as before |
| Missing page | `404.html` | |

The online store (`/ols/...`) had no products. Those addresses redirect to the home page. See `_redirects`.

## How to edit the words

Open the HTML file for that page. Home is `index.html`. Every other page is `index.html` inside its folder (for example `evaluations/index.html`).

Change the sentence you see on the site. Leave the tags (`<p>`, `<h1>`, `<a>`, and so on) in place. If a tag is removed, the page can break.

The menu and the footer are copied at the top and bottom of every HTML file. A phone number, a link, or a menu label has to be updated in each file or the pages will disagree.

Hours appear in the footer of every page, and again on Home and Contact Us. Friday is 11:00 am – 08:00 pm. Change a day in every hours table or the pages will disagree. Open questions are listed in `CONTENT-TODO.md`.

The copyright line says 2026. Change the year in the footer of every page when the year changes.

## Photos

Photos live in `images/`. To replace one, add the new file and change the `src` and the `alt` text on the `<img>` tag. A width around 1600 pixels is enough. The `alt` text should say what the picture shows.

`pebble-beach.png` was re-saved as `pebble-beach.jpg` so the file is smaller. `soteria.png` is still a PNG because the graphic has a transparent background.

These GoDaddy stock photos were not copied onto the new site, because that license may not leave GoDaddy:

| Old file | Where it was | What to add if you want a picture |
|---|---|---|
| `stock-33461bfe8fa6.jpg` | Home, Corporate Memberships card | A photo of a corporate outing or the studio. The card is a navy block until then |
| `stock-g6b685.jpg` | Junior Golf | Replaced by `images/junior-golf.jpg`. See the credit below |
| `stock-051de6e9e3e1.jpg` | Cancellations, page background | Optional. The page is plain on purpose |
| `stock-34435.jpg` | Holiday Hours, fireworks | Optional. The page has a dashed "Photo needed" box |

`img_6427.jpg` is the photo of the Go Golf logo on the wall. It used to sit on the Home "Upcoming Events" card. That card linked nowhere and there is no events page, so the card was removed. The photo is now next to the contact details on Home.

`thumbnail_gogolf2.jpg` was a duplicate of `gogolf2.jpg`. The site uses `gogolf2.jpg`.

## Buttons that leave the site

These are the same addresses as the GoDaddy site. Do not retype them.

- Book a simulator, a lesson, or the general scheduler: `https://app.acuityscheduling.com/schedule.php?owner=14209514`
- Evaluation with Rich, and Filindo's evaluation: `https://app.acuityscheduling.com/schedule/ca8f92f8/?categories[]=Lessons`
- Lessons page BOOK NOW: `https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=category:Lessons`
- Lauren's fitness assessment: `https://app.acuityscheduling.com/schedule/b61debab/appointment/75999154/calendar/11770564`
- Reserve a simulator: `https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=category:Simulator%20Rental`
- Monthly simulator subscription: `https://app.acuityscheduling.com/catalog.php?owner=14209514&category=Subscription`
- Gift cards: `https://squareup.com/gift/X5RPRSP5SG808/order`
- Club Champion: `https://clubchampion.com` (this is the Club Champion home page, which is where the old button went)
- Soteria Fitness: `https://www.soteria-fitness.com`
- Instagram: `https://www.instagram.com/GoGolf_SJ`

The 2027 Winter League sign-up is a Square checkout the owner supplied, titled "2027 Go Golf Cup": `https://square.link/u/N4MWJ485`. The old GoDaddy Payments league checkout is not used.

## Photo credits

Junior Golf (`images/junior-golf.jpg`):

- Source page: https://www.pexels.com/photo/a-boy-playing-gold-10463469/
- Photographer: Ali Danacı
- License: Pexels License, https://www.pexels.com/license/ — free to use, including commercially. Attribution is not required.

## Contact, and why there is no form

The GoDaddy contact forms were not copied. They only worked inside GoDaddy, and this site is not wired to another form service.

Home, Contact Us, and the footer show the ways to reach the studio:

- Call (856) 751-7194 (`tel:8567517194`). The note still says to allow 24 hours for a call back.
- Text (856) 481-0889. This is an `sms:` link. On Cancellations it is still described as a text-only number.
- Email Filindo@GoGolfSJ.com. The old Contact Us and Golf Lessons pages wrote it as Filindo@gogolfsj.com. Both spellings are kept where that page used them. They are the same inbox.
- The street address links to a Google Maps search. The old site did not have a map link.

Rich@gogolfsj.com and lauren@gogolfsj.com are linked on the pages that already showed them.

If you later want a form, that is a separate decision. It needs a form host and a privacy note. It is not hooked up now.

## Other decisions

- Typos fixed: "schedule your next club fitting" and "$100 upcharge" on Rich's lesson terms. The word Simulator was already spelled correctly on the site. The Acuity package name "Simuator" was not copied.
- The Fitness page no longer includes the leftover template line about Go Golf being founded in 2005 and selling equipment worldwide.
- The Home "Upcoming Events" card was removed. It pointed at `#` and there is no events page.
- The old "Book Your Evaluation!" popup was not rebuilt. The bar at the top of every page says "Click here to book your golf evaluation" and links to Evaluations. Home shows Filindo Colace's evaluation ($260) and Rich Stolz's evaluation ($225) side by side. Both cards use the description and the Acuity booking link from the Evaluations page. On a narrow screen Filindo's card is first. Both evaluations are also on Evaluations.
- A few prices were printed without a dollar sign on the old site (playing lessons 300, 500, and 100; simulator packages 240, 360, and 600; corporate tiers 500, 1000, 2000, and 3000). They are shown with a `$` here. The amounts are unchanged.
- Simulator prices are the pre-tax amounts from the old site. Memberships and packages still say tax is not included. Acuity shows tax-inclusive totals. Those Acuity totals were not copied onto the page.
- Google Analytics (`G-S8R1ERQHES`) and the Facebook pixel (`216850965850346`) were not added.
- Headings use Playfair Display. Body text uses Open Sans. The font files are in `fonts/`. Brand blues are `#1694E3`, `#067BC4`, and `#0475BD`. Navy is `#022C49`.

## Check the links

```bash
python3 scripts/check_links.py
```

That checks every internal link and compares every outbound address with the list from the old site, plus the map link and the `sms:` text link described above.
