# 🎸 SKAV

Fullstack-webbapplikation för bandet SKAV. Publik one-page-site, separat webshop och ett admin-CMS för bandet att sköta sitt eget innehåll. Live på [skav.nu](https://skav.nu).

---

## Tech Stack

**Frontend:** React 19 + TypeScript, Vite, Mantine UI v9, TanStack Query, Axios, React Router v7, Framer Motion  
**Backend:** ASP.NET Core 8, Dapper, SQLite, SixLabors.ImageSharp  
**Auth:** JWT (HS256) + BCrypt  
**Infra:** Docker Compose, Caddy, Cloudflare Tunnel, GitHub Actions (self-hosted runner på Raspberry Pi 5)  
**Email:** Resend + Cloudflare Email Routing

---

## Funktioner

### Publik sida
- One-page layout med scroll-navigation och hamburgermeny på mobil
- Bandpresentation med 3D-flipkort (namn, roll, citat, bio)
- Spelningar med Google Maps-integration
- Musiksektion med Spotify-embed och låtbilder
- Röstningssystem för låtförslag (IP-baserat dubblettskydd)
- Bokningsformulär
- Nyhetsbrev
- Webshop med produktvarianter, bildkarusell och signeringsfunktion

### Admin / CMS
- Fullständigt CRUD för: medlemmar, spelningar, låtar, album, produkter, användare
- Produkthantering med varianter (storlek/färg), lagersaldo och bilduppladdning
- Boknings- och köpförfrågningar med audit-trail
- Nyhetsbrev med förhandsgranskning
- Röstningsförslag
- Site-inställningar — pausa webshop eller bokningar med eget meddelande
- Rollbaserad access (Admin / Editor / Member)

---

## Arkitektur

### Backend — Clean Architecture
```
Api → Application ← Infrastructure
              ↑
           Domain (inga beroenden)
```

Tunna controllers → services med affärslogik → repositories via `BaseRepository<T>` med Dapper. Unit of Work med auto-rollback. Convention-based DI. Soft delete på alla entiteter.

### Frontend — Feature-baserad struktur
```
types → api → hooks → components → pages
```

Varje feature har egna typer, API-funktioner, React Query-hooks och admin-hooks som hanterar modal-state och notifieringar separat från datahämtning.

---

## Projektstruktur

```
SKAV/
├── backend/
│   ├── SKAV.Api/          # Controllers, middleware, Program.cs, wwwroot
│   ├── SKAV.Application/  # Services, DTOs, interfaces, validators
│   ├── SKAV.Domain/       # Entities, exceptions, konstanter
│   └── SKAV.Infrastructure/ # Repositories, UoW, databas, JWT, email
│
└── frontend/
    └── src/
        ├── api/           # Axios-klient per resurs
        ├── features/      # Domänlogik per feature (hooks + komponenter)
        ├── components/    # Delade UI-komponenter
        ├── pages/         # Route-level komponenter
        ├── types/         # TypeScript-interfaces
        ├── providers/     # AuthProvider (JWT + roller)
        └── utils/         # Hjälpfunktioner
```

---

## Deployment

```
git push → GitHub Actions → self-hosted runner på Pi → docker compose up --build → skav.nu
```

Cloudflare Tunnel hanterar HTTPS utan att exponera portar. Caddy agerar reverse proxy internt.

---

## Live

[skav.nu](https://skav.nu) — byggt som examensarbete inom kursen Systemutveckling .NET @ Campus, SUT24.
