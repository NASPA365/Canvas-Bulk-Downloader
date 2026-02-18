# Einstaklingsverkefni: Canvas File Bulk Downloader (Browser Extension)

## Inngangur og hugmynd
Hugmyndin kemur frá eigin reynslu við náms efni á Canvas: Það er óþægilegt að þurfa að fara inn í hverja möppu og sækja PDF/skrár einstaklingslega. Ég vil búa til **browser extension** (t.d. Chrome/Firefox) sem leyfir að merkja skrár með checkmarks og sækja þær í bulk sjálfkrafa, notandi Canvas GraphQL API. Þetta mun spara tíma nemendum og tengist vefforritun (JS, API calls, DOM manipulation, browser APIs). [query]

## Valin skilyrði og efnistök
Ég útfæri **tvennt** af skilyrðalistann:
- **Vefþjónusta (GraphQL) útfærð**: Nota Canvas GraphQL API til að sækja lista yfir skrár/földur og metadata (t.d. submissions, files). Þetta krefst auth með Canvas token.
- **Flóknari framendi útfærður**: Browser extension með nýlegri CSS (Grid/Flexbox fyrir file list), kvikun (loading spinners, progress bars með CSS animations) og JS til að inject-a UI inn í Canvas síðu (DOM manipulation).

Efnistök: 
- MVP: Listi skrár á Canvas síðu með checkboxes, bulk download hnappur.
- Extra: Folder support, progress tracking, zip-pack downloads.
- Hýsing: Extension publish-að á Chrome Web Store (eða Firefox Add-ons) með CI/CD via GitHub Actions.

Þetta er **minna og sérstakt** verkefni (ekki allt saman eins og vefþjónusta + notandaumsjón), fókus á browser extension sem er ekki gert í öðrum verkefnum. [query]

## Verkplan (vikur 6–15, feb–apríl 2026)
Taka tillit til annarra námskeiða (lítið vinnu vikur 7, 10). Heild: ~40–50 klst.
- **Vika 6–7 (19. feb–1. mars)**: Rannsókn á Canvas GraphQL API (queries fyrir files/submissions), prototype UI í vanilla JS/HTML/CSS. (Flóknari hluti: API auth og CORS.)
- **Vika 8–9 (2.–15. mars)**: Útfæra extension manifest, content script til að inject-a checkboxes á Canvas síðu, basic download logic. 
- **Vika 10 (16.–22. mars)**: Prófanir á dev extension, fix bugs. (Lítill tími pga annarra námskeiða.)
- **Vika 11–12 (23. mars–5. apr)**: Bæta við kvikun (CSS animations, progress), zip support (JSZip lib), hýsing setup með GitHub Actions CI/CD.
- **Vika 13 (6.–12. apr)**: Kynning undirbúningur, prófanir á live Canvas.
- **Vika 14–15 (13.–26. apr)**: Lokaútfærsla, skýrsla, publish extension.

Hýsing sett upp vika 12. Skýrsla skrifuð vikur 14–15. [query]

## Matskvarði fyrir verkefnið
Byggt á MVP og extra:
- **30%** Canvas GraphQL API útfærð (query files, auth token, fetch metadata). [query]
- **30%** Flóknari framendi (checkbox UI injected á Canvas, CSS Grid + animations fyrir loading/progress). [query]
- **20%** Bulk download logic (single/multiple files, JSZip fyrir folders). [query]
- **10%** Extension setup og prófanir (manifest, content/popup scripts, dev tools). [query]
- **10%** Hýsing með CI/CD (GitHub Actions deploy að Chrome Web Store, live demo link). [query]

Heild: Keyrandi extension á Chrome/Firefox, hægt að demo-a live.
