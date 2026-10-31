#!/usr/bin/env python3
"""Check internal links and compare outbound hrefs to the gogolfsj.com inventory."""

from html.parser import HTMLParser
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]

ALLOWED_EXTERNAL = {
    "https://app.acuityscheduling.com/schedule.php?owner=14209514",
    "https://app.acuityscheduling.com/schedule/ca8f92f8/?categories[]=Lessons",
    "https://app.acuityscheduling.com/schedule/b61debab/appointment/75999154/calendar/11770564",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=category:Lessons",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=category:Simulator%20Rental",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=99723738",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=99723746",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=4053155",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=4053164",
    "https://squareup.com/gift/X5RPRSP5SG808/order",
    "https://square.link/u/N4MWJ485",
    "https://square.link/u/iyrech9W",
    "https://square.link/u/kSfhd5C1",
    "https://square.link/u/cD7oREnG",
    "https://clubchampion.com",
    "https://www.soteria-fitness.com",
    "https://www.soteria-fitness.com/",
    "https://www.instagram.com/GoGolf_SJ",
    "https://www.google.com/maps/search/?api=1&query=2091+Springdale+Rd+Suite+18%2C+Cherry+Hill%2C+NJ+08003",
    "mailto:Filindo@GoGolfSJ.com",
    "mailto:Filindo@gogolfsj.com",
    "mailto:Rich@gogolfsj.com",
    "mailto:lauren@gogolfsj.com",
    "tel:8567517194",
    "sms:8564810889",
}

REQUIRED = [
    "https://app.acuityscheduling.com/schedule.php?owner=14209514",
    "https://app.acuityscheduling.com/schedule/ca8f92f8/?categories[]=Lessons",
    "https://app.acuityscheduling.com/schedule/b61debab/appointment/75999154/calendar/11770564",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=category:Lessons",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=category:Simulator%20Rental",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=99723738",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=99723746",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=4053155",
    "https://app.acuityscheduling.com/schedule.php?owner=14209514&appointmentType=4053164",
    "https://squareup.com/gift/X5RPRSP5SG808/order",
    "https://square.link/u/N4MWJ485",
    "https://square.link/u/iyrech9W",
    "https://square.link/u/kSfhd5C1",
    "https://square.link/u/cD7oREnG",
    "https://clubchampion.com",
    "https://www.soteria-fitness.com",
    "https://www.soteria-fitness.com/",
    "https://www.instagram.com/GoGolf_SJ",
    "mailto:Filindo@GoGolfSJ.com",
    "mailto:Filindo@gogolfsj.com",
    "mailto:Rich@gogolfsj.com",
    "mailto:lauren@gogolfsj.com",
    "tel:8567517194",
    "sms:8564810889",
]

FORBIDDEN_SNIPPETS = [
    "stock-",
    "uncharge",
    "you're next",
    "founded in 2005",
    "UPCOMING EVENTS",
    "poynt.godaddy",
    "tel:8564810889",
    "Copyright © 2017",
    "Simuator",
]


class Collector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.hrefs = []
        self.srcs = []
        self.ids = set()
        self.posters = []

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if "href" in data:
            self.hrefs.append(data["href"])
        if "src" in data:
            self.srcs.append(data["src"])
        if "poster" in data:
            self.posters.append(data["poster"])
        if "id" in data:
            self.ids.add(data["id"])


def page_files():
    files = list(ROOT.glob("*.html"))
    files += list(ROOT.glob("*/index.html"))
    return sorted(files)


def resolve(path: Path, url: str):
    url = url.split("#", 1)[0].split("?", 1)[0]
    if url.startswith("/"):
        target = ROOT / url.lstrip("/")
    else:
        target = (path.parent / url).resolve()
    if target.is_dir():
        target = target / "index.html"
    if target.suffix == "" and not target.exists():
        index = target / "index.html"
        if index.exists():
            return index
        html = target.with_suffix(".html")
        if html.exists():
            return html
    return target


def main():
    errors = []
    seen = set()
    for path in page_files():
        text = path.read_text(encoding="utf-8")
        for snippet in FORBIDDEN_SNIPPETS:
            if snippet in text:
                errors.append(f"{path.relative_to(ROOT)} contains forbidden {snippet!r}")
        form_count = text.lower().count("<form")
        if form_count:
            web3 = (
                form_count == 1
                and 'action="https://api.web3forms.com/submit"' in text
                and 'method="POST"' in text
            )
            allowed_form = web3 and (
                path.as_posix().endswith("contact-us/index.html")
                or (
                    path.as_posix().endswith("simulator-rental/index.html")
                    and 'value="Simulator Membership Request"' in text
                )
            )
            if not allowed_form:
                errors.append(f"{path.relative_to(ROOT)} has a form that is not the Web3Forms inquiry")
        parser = Collector()
        parser.feed(text)
        for raw in parser.hrefs + parser.srcs + parser.posters:
            if raw.startswith(("http://", "https://", "mailto:", "tel:", "sms:")):
                seen.add(raw)
                if raw not in ALLOWED_EXTERNAL:
                    errors.append(f"{path.relative_to(ROOT)} outbound not in inventory list: {raw}")
                continue
            if raw.startswith("#"):
                anchor = raw[1:]
                if anchor and anchor not in parser.ids:
                    errors.append(f"{path.relative_to(ROOT)} missing id for {raw}")
                continue
            target = resolve(path, raw)
            try:
                target.relative_to(ROOT)
            except ValueError:
                errors.append(f"{path.relative_to(ROOT)} escapes the site: {raw}")
                continue
            if not target.exists():
                errors.append(f"{path.relative_to(ROOT)} broken internal link {raw} -> {target}")
            fragment = ""
            source = raw
            if "#" in source:
                fragment = source.split("#", 1)[1]
            if fragment:
                linked = target.read_text(encoding="utf-8")
                collector = Collector()
                collector.feed(linked)
                if fragment not in collector.ids:
                    errors.append(f"{path.relative_to(ROOT)} link {raw} has no matching id")

    missing = [url for url in REQUIRED if url not in seen]
    for url in missing:
        errors.append(f"required href never used: {url}")

    redirects = (ROOT / "_redirects").read_text(encoding="utf-8").splitlines()
    for line in redirects:
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) < 2:
            errors.append(f"bad redirect line: {line}")
            continue
        dest = parts[1]
        if dest.startswith("http"):
            continue
        target = resolve(ROOT / "index.html", dest if dest != "/" else "/index.html")
        if dest == "/":
            target = ROOT / "index.html"
        if not target.exists():
            errors.append(f"redirect target missing: {line}")

    if errors:
        print(f"{len(errors)} problem(s):")
        for error in errors:
            print(" -", error)
        return 1
    print(f"OK: {len(list(page_files()))} pages, {len(seen)} distinct outbound hrefs, redirects resolve.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
