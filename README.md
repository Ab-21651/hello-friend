# Cricket Connect

Build a polished, mobile-first POC for a Pakistani Cricket Board (PCB) digital stadium and fan experience app.

Core concept — "From Ticket to Seat": Not just ticket booking. A fan discovers a match, buys a ticket, picks a seat, sees a representative view from that section, downloads all match/stadium info before arriving, and navigates to their seat — all working offline, since Pakistani stadiums often have unreliable internet.

Build a real mobile app UI (phone-sized layout, bottom nav, large touch targets, cards/sheets, smooth transitions) — not a desktop site.

Branding

Dark green cricket-inspired palette, white surfaces, subtle gold accents. Premium, modern, trustworthy, energetic but not childish. Clean typography, rounded cards without over-the-top "SaaS" styling. PCB-inspired visual language (don't reproduce official assets unless provided). Should look presentable to a national cricket organization.

Navigation

Bottom nav: Home, Matches, Tickets, Stadium, Profile. On match day, that match becomes the primary experience.

Screens & Flows

Home: greeting, next Pakistan match with countdown/venue/date, "Get Tickets" CTA, upcoming matches, PCB announcements, quick links to My Tickets and Match Day Guide.

Demo match: Pakistan vs England, Rawalpindi Cricket Stadium, 15 Oct 2026, 4:30 PM.

Matches: list of series/matches (teams, date, time, venue, availability, View/Buy). Match detail page: teams, venue, date/time, series, match type, ticket categories, stadium info, Buy Ticket.

Ticket purchase (multi-step):

Select ticket category

Interactive seating map — blocks, available/unavailable/selected seats, gates per section

Seat detail — block, row, seat #, price, gate, "View from Seat" photo labeled "Representative view from this section" (never imply it's the exact seat's view)

Order summary — match, venue, date, seat, gate, price, service fee, total

Confirmation — "Ticket Confirmed" → "Download Match Pass"

Digital ticket: Pakistan vs England, Gate 3 / Block B / Row 12 / Seat 18, holder name, date, ticket ID, QR/barcode, status (VALID). "Available Offline" + "Download for Offline Use" button. Should visually read as a secure credential, not a static image.

Offline Match Pass: after download, "Ready for Match Day" with checklist — Digital Ticket, Stadium Map, Gate Info, Seat Info, Seat Route, Facilities, Stadium Rules, Emergency Info — all usable with no network (simulate with local/mock data).

Anti-fraud simulation: device-bound ticket, rotating QR (simulated), one-time entry, screenshot warning ("Do not share screenshots... protected against duplicated or reused credentials"). Ticket states: VALID → SCANNED → USED; rescanning shows "Ticket Already Used". UI simulation only, not real security.

Stadium companion: when user has a ticket, personalize with "Your Match Day" (gate/block/row/seat). Interactive-looking map showing gates, blocks, exits, washrooms, medical, prayer area, accessibility, help desk.

Offline wayfinding: Entrance → Gate 3 → Block B → Row 12 → Seat 18, using mock data — direction arrows, walking distance (e.g. "180 m"), nearby facilities. No Google Maps; custom indoor wayfinding.

Facilities finder: categories (Washrooms, Medical, Prayer Area, Accessibility, Help Desk, Exits, Information) — each shows distance/direction + "Navigate". Available offline.

Stadium rules ("Know Before You Go"): expandable FAQ cards — prohibited items, entry requirements, gate times, security info, ticket rules, emergency info, accessibility info.

Match Day dashboard: match header, countdown/status, ticket summary, quick actions (Open Ticket, Find My Gate, Find My Seat, Facilities, Stadium Rules, Help). Show "Offline Mode" clearly when active, with ticket/map/seat still available.

Remote fan engagement (non-stadium): predictions ("Predict the first wicket"), polls, quizzes, Fan Points (e.g. 1,250), "Predict & Win" contest for match tickets.

Notifications: contextual only, e.g. "Your match is tomorrow", "Ticket ready for offline use", "Download your Match Pass before leaving", "Gate 3 is your assigned entrance."

Profile: name, avatar, My Tickets, Match History, Fan Points, Notifications, FAQs, Help, Settings.

Ticket history: upcoming + past tickets with key details.

Admin dashboard (hidden "Admin" demo button): PCB Match Operations view — tickets sold/scanned, spectators inside, gate-wise entries (Gate 1–4: High/Medium/Low visualization), validation failures, reuse attempts, attendance by section, avg entry time, fan feedback, reported issues. Match overview e.g. Tickets Sold 28,450 / Scanned 21,230 / Attendance 20,814. Entry Analytics section. Sample data only.

Data & Offline Rules

All mock/local data — no real payment gateway or backend. Simulate: purchase, download, offline mode, barcode rotation, scanning, state changes, navigation, predictions, admin analytics. Architecture should be clean enough to later connect a real backend.

Must stay accessible in Offline Mode: ticket, QR/barcode, stadium map, gate, seat info, route to seat, facilities, rules, emergency info. Show a persistent connectivity indicator (Online / Offline Mode) and a Settings toggle: "Simulate Offline Mode."

Presentation Frame (Important)

Wrap the entire app inside a realistic iPhone mockup frame (notch/dynamic island, rounded bezel, side buttons) centered on the screen — this is a presentation POC, not a raw browser view.

Make transitions between key demo-flow screens genuinely dynamic and interesting, not just a single repeated effect. Vary the animation by context so it feels alive:

Major flow steps (Home → Match Detail, Buy Ticket → Seat Map, Confirmation → Ticket): whole-phone 180° flip (3D rotateY, perspective transform, ~0.6–0.8s, eased).

Seat selection → seat detail: phone tilts/zooms in slightly (subtle 3D rotateX + scale) as if leaning in to look closer, then settles.

Ticket → Offline Match Pass download: a downward swipe/slide-down with a soft bounce, plus a brief "materializing" checklist animation (items ticking in one by one).

Stadium map → wayfinding navigation: phone does a slight rotateY "turn to walk" pan, with the route line drawing itself progressively rather than appearing instantly.

Admin scan → "Ticket Already Used": a sharper shake/punch effect on the phone frame to signal rejection, paired with a red flash on the ticket state.

Successful scan (VALID → SCANNED → USED): a quick pulse + checkmark morph on the ticket QR area.

Keep regular in-screen interactions (tabs, bottom sheets, scrolling, toggles) on normal, snappy mobile transitions — reserve the bigger phone-level animations for the major step changes in the demo flow, so they read as deliberate "beats" rather than gimmicks. All animations should use smooth CSS/JS easing (no linear, no jank) and stay short enough (under ~1s each) not to slow down the live demo.

Design Quality

Realistic stadium/cricket imagery, realistic ticket layout, polished loading/empty/success/error states, confirmation dialogs, bottom sheets, subtle animation, proper mobile spacing. Avoid excessive gradients or over-carding every screen — prioritize usability and realism.

Demo Flow (must work end-to-end)

Home → Pakistan vs England → View Match → Buy Ticket → Select Block B → View Seat (representative photo) → Select Seat 18 → Confirm → Ticket Confirmed → Download Match Pass → Turn on Offline Mode → Open Match Pass → Open Stadium → Find Gate 3 → Navigate to Block B → Find Seat 18 → Open Facilities → Return to Ticket → Scan Ticket in Admin Demo → Ticket becomes USED → Second scan attempt → "Ticket Already Used"

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ac2cde5-6b04-4c4a-9265-6fdcb1ca825f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
