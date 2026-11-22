# mchs-game-chart
MCHS 2026 season charts

Live chart: https://vanbasterkodi.github.io/mchs-game-chart/

- Open the link in Safari on the iPad, then Share > Add to Home Screen. Always open it from the home screen icon.
- Games are saved on the iPad. Plays > GitHub > **Upload to GitHub** copies them here:
  - `data/games/` – one file per game
  - `data/latest.json` – full backup (used by **Load from GitHub**)
  - `data/reports/` – a PDF report for each game plus `MCHS-season-report.pdf` (made on every upload, and whenever you tap Live Report > **PDF report**)
- `index.html` is the app, `sw.js` keeps a copy on the iPad so it opens without Wi-Fi, and the two `jspdf` files build the PDFs.
