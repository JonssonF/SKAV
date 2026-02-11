# 🎸 SKAV – Byns bästa band  
Fullstack-projekt för bandet **SKAV**, byggt med React frontend och ASP.NET Core backend uppdelad enligt clean architecture.
Tanken är att jag ska hosta denna hemsida själv med en Raspberry PI5.
---

## 🛠 Tech Stack

### **Frontend**
- React 19 + TypeScript  
- Vite  
- Tailwind CSS  
- React Router  
- Axios

### **Backend**
- ASP.NET Core 8 (Web API)  
- Entity Framework Core (SQLite som standard)  
- Lagerstruktur:
- SKAV.API – Controllers, Program.cs, DI
- SKAV.Application – Interfaces, services, DTOs
- SKAV.Domain – Entities/Models
- SKAV.Infrastructure – DbContext, EF Core, Repository

---

## 🎤 Funktioner

| Område | Funktion |
|--------|----------|
| Publik sida | Startsida, giglistor, galleri, texter, kontakt |
| Backend-data | Venue (plats), Gig (spelning) |
| Admin (planeras) | JWT-login, CRUD för gig och innehåll |
| Platsinfo | Latitude/Longitude per Venue (för karta/väder) |
| Databas | SQLite lokalt, går enkelt att byta till SQL Server/PostgreSQL |

---

## 📂 Projektstruktur
```plaintext
SKAV/
├── SKAV.sln
│
├── backend/
│   ├── SKAV.API/                 # Controllers + DI + Swagger
│   │   ├── Controllers/
│   │   ├── Program.cs
│   │   ├── appsettings.json
│   │   └── SKAV.API.csproj
│   │
│   ├── SKAV.Application/         # Use cases / Services + Interfaces
│   │   ├── Interfaces/
│   │   ├── Services/
│   │   └── SKAV.Application.csproj
│   │
│   ├── SKAV.Domain/              # Entities / Models
│   │   ├── Models/
│   │   └── SKAV.Domain.csproj
│   │
│   ├── SKAV.Infrastructure/      # Dapper + SQLite + Repositories + DB init
│   │   ├── Database/             # ConnectionFactory, DbInitializer, Schema
│   │   ├── Repositories/
│   │   └── SKAV.Infrastructure.csproj
│
├── frontend/
│   └── ...

```
---

📌 Domain-modeller
Venue
```csharp
public class Venue
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string StreetAddress { get; set; }
    public required string ZipCode { get; set; }
    public required string City { get; set; }
    public string Country { get; set; } = "Sverige";

    public int? Capacity { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public ICollection<Gig> Gigs { get; set; } = new List<Gig>();
}
```
Gig
```csharp
public class Gig
{
    public int Id { get; set; }
    public required string Title { get; set; }

    public DateTime StartUtc { get; set; }
    public DateTime? DoorsOpenUtc { get; set; }

    public int VenueId { get; set; }
    public Venue? Venue { get; set; }

    public decimal? TicketPrice { get; set; }
    public string? ExternalTicketUrl { get; set; }

    public string? Notes { get; set; }
    public int? AgeLimit { get; set; }

    public DateTime CreatedUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedUtc { get; set; }
    public string? Slug { get; set; }
}
```
🚀 Planer framåt
✅ Venue & Gig modeller klara
⬜ API endpoints (/api/gigs, /api/venues)
⬜ Seed-data
⬜ Automatisk lat/long via geocoding API (t.ex. Geoapify/OpenStreetMap)
⬜ Admin med JWT
⬜ Bilduppladdning
⬜ Deployment (Docker / Raspberry Pi)

🛡️ Säkerhet (planeras)
JWT-baserad autentisering
Hashade lösenord (BCrypt)
CORS för frontend
Hemligheter i appsettings.Development.json eller environment variables

📜 Licens
Detta projekt är skapat för lärande och för bandet SKAV.
