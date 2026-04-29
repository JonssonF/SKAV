# 🎸 SKAV – Byns bästa band

Fullstack-hemsida för bandet **SKAV**, byggd med React + Mantine frontend och ASP.NET Core 8 backend med Dapper + SQLite.
Publik sida för fans och ett admin-läge för bandet att hantera innehåll.

Målet är att självhosta allt på en **Raspberry Pi 5**.

---

## 🛠 Tech Stack

### Frontend
- React 19 + TypeScript
- Vite (dev-server & build)
- Mantine v9 (UI-komponenter)
- TanStack React Query (API-cache & state)
- React Router v7 (routing)
- Axios (HTTP-klient med JWT-interceptor)

### Backend
- ASP.NET Core 8 (Web API)
- Dapper (micro ORM)
- SQLite
- JWT-autentisering med BCrypt-hashade lösenord
- Clean Architecture (4 lager)

---

## 📂 Projektstruktur

```
SKAV/
├── backend/
│   ├── SKAV.Api/              # Controllers, middleware, Program.cs
│   ├── SKAV.Application/      # Services, DTOs, validators, interfaces
│   ├── SKAV.Domain/           # Entities, exceptions, konstanter
│   └── SKAV.Infrastructure/   # Repositories, UoW, databas, JWT
│
└── frontend/
    └── src/
        ├── api/               # Axios-setup + API-anrop per domän
        ├── components/        # Återanvändbara komponenter (layout, common)
        ├── features/          # Domänlogik per feature (hooks, komponenter)
        │   ├── albums/
        │   ├── gigs/
        │   ├── members/
        │   └── songs/
        ├── hooks/             # Generella React hooks
        ├── pages/             # Sidkomponenter (publika + admin)
        ├── providers/         # AuthProvider (JWT, roller)
        ├── routes/            # React Router + ProtectedRoute
        ├── types/             # TypeScript interfaces (speglar backend DTOs)
        └── utils/             # Hjälpfunktioner (felhantering m.m.)
```

---

## 🎤 Funktioner

### Publikt (alla besökare)
| Sida | Beskrivning |
|------|-------------|
| Hem | Startsida |
| Spelningar | Kommande och tidigare gigs med datum, plats, pris |
| Bandet | Bandmedlemmar med bild, citat, instrument |
| Musik | Album (expanderbara med spårlista) + singlar |

### Admin (kräver inloggning)
| Funktion | Beskrivning |
|----------|-------------|
| Inloggning | JWT-baserad auth via `/login` (dold från navigation) |
| Spelningar | Skapa, redigera, ta bort gigs med datumvalidering |
| Album | CRUD för album med releasedatum och Spotify-länk |
| Låtar | CRUD med album-koppling (eller singel), spårnummer, längd |
| Rollbaserad meny | Admin/Editor ser admin-alternativ, Member ser sin profil |
| Dark/Light mode | Växla tema via knapp i headern |

### Felhantering
- Backend-valideringsfel visas direkt under rätt formulärfält
- BusinessRule-fel mappas till relevanta fält via errorCode
- Toast-notifieringar för success/error vid CRUD-operationer
- Global 401-hantering — automatisk utloggning vid utgången token

---

## 🔐 Autentisering

- JWT-tokens med roller (Admin, Editor, Member)
- Token parsas i frontend för att visa rollbaserad navigation
- Axios-interceptor bifogar token automatiskt på varje request
- Skyddade routes via `ProtectedRoute`-komponent
- Login-sidan är fristående utan navbar — bandet bokmärker `/login`

---

## 🏗 Arkitektur

### Backend — Clean Architecture
```
Api → Application ← Infrastructure
              ↑
           Domain (inga beroenden)
```

- **Controllers** — tunna one-liners, returnerar DTOs direkt
- **Services** — affärslogik med UnitOfWork-transaktioner
- **Repositories** — generiskt BaseRepository med Dapper
- **Validators** — kastar typade exceptions
- **Soft delete** — alla entiteter med audit trail

### Frontend — Feature-baserad
```
Types → API → Hooks → Pages
  ↕       ↕      ↕       ↕
DTOs → Repos → Services → Controllers (backend-motsvarighet)
```

---

## 🚀 Roadmap

### ✅ Klart
- JWT-autentisering med rollhantering
- CRUD: Spelningar, Album, Låtar, Medlemmar
- Publik musiksida med album + singlar
- Rollbaserad navigation (Admin/Editor/Member)
- Felhantering med fältvalidering från backend
- Dark/Light mode
- React Query caching med automatisk invalidering

### 🔜 Nästa steg
- Subscribers — CRUD + nyhetsbrevsprenumeration
- Dashboard — StatsRing med prenumeranter, spelningar, besökare
- Besöksräknare — backend-endpoint för sidvisningar
- Members admin — profilredigering med avatar och rollhantering
- Lyrics — CRUD med slug-generering och publik visning
- Instruments — many-to-many koppling mellan medlem och instrument

### 🔮 Framtid
- Orval — autogenererad API-klient från Swagger/OpenAPI
- Bilduppladdning — medlemsbilder, albumomslag
- Nyhetsbrev — e-postutskick via Resend API
- Kontaktformulär — med e-postnotifiering
- Docker Compose — containerisering av frontend + backend
- Raspberry Pi 5 — självhostning med HTTPS via Let's Encrypt

---

## 💻 Kom igång

### Backend
```bash
cd backend/SKAV.Api
dotnet run
```
Lyssnar på `http://localhost:5249`. Swagger: `http://localhost:5249/swagger`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Öppnas på `http://localhost:5173`

---

## 📜 Licens

Detta projekt är skapat för lärande och för bandet SKAV.
