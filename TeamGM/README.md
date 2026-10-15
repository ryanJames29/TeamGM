# TeamGM

A sports companion app for fans: live NHL and MLB scores, box scores, AI game briefings for your favorite team, and a front-office style dashboard for managing a team.

> 🚧 **In development.** Core features work end to end; see [Status](#status) below.

<!-- Add 2–3 screenshots: Scores, Game detail, myGM -->
<p>
  <img src="docs/screenshots/scores.png" width="250" />
  <img src="docs/screenshots/game-detail.png" width="250" />
  <img src="docs/screenshots/mygm.png" width="250" />
</p>

## Features

- **Live scores**: NHL and MLB scoreboards with a league selector. Scores refresh quietly in the background; pull to refresh on demand.
- **Game detail**: box scores and head-to-head history for each matchup.
- **AI briefings**: a short, fan-friendly preview for your favorite team (why the next game matters, recent form, a concern level), generated only from real scores and standings.
- **myGM dashboard**: roster, salary cap, and player detail screens for a team.
- **Accounts**: sign up and sign in with Supabase Auth.

## Tech stack

- **React Native + Expo** (Expo Router, file-based routing), **TypeScript**
- **Redux Toolkit + RTK Query** for data fetching, caching, and polling
- **Supabase** for auth and typed data access
- **gluestack UI + NativeWind (Tailwind)** for UI, **Reanimated** for motion

## Architecture

The app never calls the sports data provider directly. It talks to the [TeamGM API](https://github.com/ryanJames29/TeamGM-LLM-API), a FastAPI backend that fetches scores on a schedule, caches them in Redis, and generates the AI briefings.

```
TeamGM app  →  TeamGM API (FastAPI)  →  Redis cache  ←  scheduled jobs  →  API-Sports
                       ↓
                 OpenAI (briefings) · Supabase (auth, user data)
```

## Running locally

Requires Node.js and the [TeamGM API](https://github.com/ryanJames29/TeamGM-LLM-API) running locally (see its README).

```bash
cd TeamGM
npm install
cp .env.example .env   # set EXPO_PUBLIC_API_URL and your Supabase keys
npx expo start -c
```

`EXPO_PUBLIC_API_URL` should point at the API (default `http://127.0.0.1:8000`). On a physical phone, use your computer's LAN IP; on the Android emulator, use `http://10.0.2.2:8000`.

## Status

**Done**
- NHL and MLB scoreboards with background polling
- Game detail with box scores and head-to-head history
- AI briefings for a favorite team
- myGM dashboard (roster, salary cap, player detail)
- Supabase auth

**Next**
<!-- Edit this list to match your plans -->
- More leagues
- Deploy the API and ship a TestFlight / internal test build
- Polish and tests across screens
