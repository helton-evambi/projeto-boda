using BodaApi.Models;

namespace BodaApi.Data;

public static class SeedData
{
    public static void Initialize(BodaDbContext context)
    {
        if (context.Users.Any()) return;

        // ══════════════════════════════════════════════════
        // USERS (5 roles)
        // ══════════════════════════════════════════════════
        var admin = new User
        {
            Name = "Carlos Admin",
            Email = "admin@boda.ao",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            Verified = true,
            Bio = "Administrador da plataforma Boda.",
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
            Location = "Luanda",
            Phone = "+244 923 000 001",
            CreatedAt = DateTime.UtcNow.AddMonths(-12)
        };

        var organizer = new User
        {
            Name = "Maria Santos",
            Email = "maria@boda.ao",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Maria123!"),
            Role = UserRole.Organizer,
            Verified = true,
            Bio = "Organizadora de eventos premium em Angola. +500 eventos realizados.",
            CompanyName = "Santos Events",
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
            CoverUrl = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
            Location = "Luanda",
            Phone = "+244 923 000 002",
            Website = "https://santosevents.ao",
            CreatedAt = DateTime.UtcNow.AddMonths(-10)
        };

        var organizer2 = new User
        {
            Name = "Pedro Neto",
            Email = "pedro@boda.ao",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pedro123!"),
            Role = UserRole.Organizer,
            Verified = true,
            Bio = "Produtor de festivais e shows ao vivo. Referência no Huambo.",
            CompanyName = "Neto Productions",
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro",
            Location = "Huambo",
            Phone = "+244 923 000 007",
            CreatedAt = DateTime.UtcNow.AddMonths(-8)
        };

        var dj = new User
        {
            Name = "DJ Kiambote",
            Email = "dj@boda.ao",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Dj123456!"),
            Role = UserRole.DjArtist,
            Verified = true,
            ArtistName = "DJ Kiambote",
            Genre = "Kuduro / Afrohouse",
            Bio = "O rei do kuduro angolano. 1M+ plays no Spotify.",
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=kiambote",
            CoverUrl = "https://images.unsplash.com/photo-1571266028243-d220e6a767e3?w=1200",
            Location = "Luanda",
            Phone = "+244 923 000 003",
            Website = "https://djkiambote.ao",
            CreatedAt = DateTime.UtcNow.AddMonths(-9)
        };

        var user = new User
        {
            Name = "João Silva",
            Email = "joao@boda.ao",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Joao1234!"),
            Role = UserRole.User,
            Bio = "Amante de música e festas angolanas!",
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
            Location = "Luanda",
            Phone = "+244 923 000 004",
            CreatedAt = DateTime.UtcNow.AddMonths(-6)
        };

        var user2 = new User
        {
            Name = "Ana Fernandes",
            Email = "ana@boda.ao",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Ana12345!"),
            Role = UserRole.User,
            Bio = "Fotógrafa de eventos. Sempre presente nos melhores shows!",
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
            Location = "Benguela",
            Phone = "+244 923 000 008",
            CreatedAt = DateTime.UtcNow.AddMonths(-4)
        };

        var user3 = new User
        {
            Name = "Miguel Tomás",
            Email = "miguel@boda.ao",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Miguel12!"),
            Role = UserRole.User,
            Bio = "Estudante de engenharia e fã de festivais.",
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=miguel",
            Location = "Lubango",
            Phone = "+244 923 000 009",
            CreatedAt = DateTime.UtcNow.AddMonths(-3)
        };

        var developer = new User
        {
            Name = "Dev Tester",
            Email = "dev@boda.ao",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Dev12345!"),
            Role = UserRole.Developer,
            Bio = "Integrador da API Boda.",
            AvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=dev",
            Location = "Luanda",
            Phone = "+244 923 000 005",
            CreatedAt = DateTime.UtcNow.AddMonths(-2)
        };

        context.Users.AddRange(admin, organizer, organizer2, dj, user, user2, user3, developer);
        context.SaveChanges();

        // ══════════════════════════════════════════════════
        // VENUES (8 locations with coordinates)
        // ══════════════════════════════════════════════════
        var venues = new[]
        {
            new Venue { Name = "Arena de Luanda", Address = "Av. 21 de Janeiro", City = "Luanda", Lat = -8.8383, Lng = 13.2344, Capacity = 15000 },
            new Venue { Name = "Elinga Teatro", Address = "Rua Rainha Ginga 42", City = "Luanda", Lat = -8.8147, Lng = 13.2302, Capacity = 800 },
            new Venue { Name = "Club K", Address = "Via Expressa, Talatona", City = "Luanda", Lat = -8.9105, Lng = 13.1891, Capacity = 3000 },
            new Venue { Name = "Hotel Presidente", Address = "Largo 4 de Fevereiro", City = "Luanda", Lat = -8.8120, Lng = 13.2350, Capacity = 1200 },
            new Venue { Name = "Parque da Cidade", Address = "Av. Pedro de Castro Van-Dúnem", City = "Luanda", Lat = -8.8567, Lng = 13.2345, Capacity = 20000 },
            new Venue { Name = "Estádio 11 de Novembro", Address = "Rua do Estádio", City = "Luanda", Lat = -8.8900, Lng = 13.2100, Capacity = 50000 },
            new Venue { Name = "Centro Cultural do Huambo", Address = "Rua Norton de Matos", City = "Huambo", Lat = -12.7761, Lng = 15.7356, Capacity = 2000 },
            new Venue { Name = "Praia do Buraco", Address = "Praia do Buraco", City = "Benguela", Lat = -12.5763, Lng = 13.4055, Capacity = 5000 },
            new Venue { Name = "Hotel Serra da Chela", Address = "Serra da Chela", City = "Lubango", Lat = -14.9186, Lng = 13.4942, Capacity = 600 },
            new Venue { Name = "Marginal de Luanda", Address = "Marginal Av. 4 de Fevereiro", City = "Luanda", Lat = -8.8070, Lng = 13.2350, Capacity = 30000 },
        };
        context.Venues.AddRange(venues);
        context.SaveChanges();

        // ══════════════════════════════════════════════════
        // EVENTS (18 events, diverse categories)
        // ══════════════════════════════════════════════════
        var now = DateTime.UtcNow;
        var events = new Event[]
        {
            // — Featured Events —
            new()
            {
                OrganizerId = organizer.Id, Title = "Festival Kuduro 2026",
                Slug = "festival-kuduro-2026", Category = "Festival",
                Description = "O maior festival de kuduro de Angola está de volta! 3 dias de pura energia com os melhores artistas do país. Palcos múltiplos, zona gastronómica, marketplace de moda angolana e muito mais. Não fiques de fora!",
                StartDateTime = now.AddDays(30), EndDateTime = now.AddDays(32),
                Capacity = 15000, VenueId = venues[0].Id,
                ImageUrl = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
                IsFeatured = true, MinAge = 16, LikesCount = 1245, SharesCount = 387,
                RefundPolicy = "Reembolso total até 7 dias antes. 50% até 3 dias antes.",
                Status = EventStatus.Published, CreatedAt = now.AddDays(-15)
            },
            new()
            {
                OrganizerId = organizer.Id, Title = "Gala de Carnaval Luanda",
                Slug = "gala-carnaval-luanda", Category = "Gala",
                Description = "Uma noite de glamour com os melhores DJs e artistas. Jantar de gala, open bar premium, e show exclusivo. Dress code: Black Tie. Experiência VIP inesquecível.",
                StartDateTime = now.AddDays(14), EndDateTime = now.AddDays(14).AddHours(6),
                Capacity = 500, VenueId = venues[3].Id,
                ImageUrl = "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800",
                IsFeatured = true, MinAge = 21, LikesCount = 876, SharesCount = 234,
                RefundPolicy = "Sem reembolso. Bilhetes transferíveis.",
                Status = EventStatus.Published, CreatedAt = now.AddDays(-10)
            },
            new()
            {
                OrganizerId = organizer2.Id, Title = "Afro Nation Angola",
                Slug = "afro-nation-angola", Category = "Festival",
                Description = "O festival internacional Afro Nation chega a Angola pela primeira vez! Artistas de toda a diáspora africana reunidos num único palco. 2 dias de celebração da cultura afro.",
                StartDateTime = now.AddDays(45), EndDateTime = now.AddDays(46),
                Capacity = 20000, VenueId = venues[4].Id,
                ImageUrl = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
                IsFeatured = true, MinAge = 16, LikesCount = 2100, SharesCount = 890,
                IsHybrid = true,
                RefundPolicy = "Reembolso disponível até 14 dias antes do evento.",
                Status = EventStatus.Published, CreatedAt = now.AddDays(-20)
            },
            // — Regular Events —
            new()
            {
                OrganizerId = organizer.Id, Title = "Noite de Semba & Kizomba",
                Slug = "noite-semba-kizomba", Category = "Festa",
                Description = "Uma noite dedicada às raízes musicais angolanas. Semba ao vivo com banda completa, aulas de kizomba para iniciantes, e dança até amanhecer.",
                StartDateTime = now.AddDays(7), EndDateTime = now.AddDays(7).AddHours(5),
                Capacity = 800, VenueId = venues[1].Id,
                ImageUrl = "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800",
                MinAge = 18, LikesCount = 534, SharesCount = 120,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-7)
            },
            new()
            {
                OrganizerId = organizer.Id, Title = "Pool Party Talatona",
                Slug = "pool-party-talatona", Category = "Festa",
                Description = "A pool party mais épica de Luanda! DJs internacionais, piscina infinita, cocktails premium e sunset views. Traga o teu fato de banho e boa energia!",
                StartDateTime = now.AddDays(5), EndDateTime = now.AddDays(5).AddHours(8),
                Capacity = 3000, VenueId = venues[2].Id,
                ImageUrl = "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800",
                MinAge = 18, LikesCount = 789, SharesCount = 200,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-5)
            },
            new()
            {
                OrganizerId = organizer2.Id, Title = "Conferência Tech Angola",
                Slug = "conferencia-tech-angola", Category = "Conferência",
                Description = "A maior conferência de tecnologia de Angola. Palestrantes de Google, Microsoft e startups angolanas. Workshops práticos de IA, blockchain e desenvolvimento web.",
                StartDateTime = now.AddDays(21), EndDateTime = now.AddDays(22),
                Capacity = 2000, VenueId = venues[0].Id,
                ImageUrl = "https://images.unsplash.com/photo-1540575467063-178a50e2fd60?w=800",
                MinAge = 0, LikesCount = 456, SharesCount = 312,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-12)
            },
            new()
            {
                OrganizerId = organizer.Id, Title = "DJ Kiambote Live",
                Slug = "dj-kiambote-live", Category = "Show",
                Description = "Show exclusivo do DJ Kiambote com a tour 'Boda World'. 3 horas de set ao vivo com efeitos visuais e convidados surpresa.",
                StartDateTime = now.AddDays(10), EndDateTime = now.AddDays(10).AddHours(4),
                Capacity = 3000, VenueId = venues[2].Id,
                ImageUrl = "https://images.unsplash.com/photo-1571266028243-d220e6a767e3?w=800",
                MinAge = 16, LikesCount = 1567, SharesCount = 430, IsHybrid = true,
                RefundPolicy = "Reembolso até 48h antes do evento.",
                Status = EventStatus.Published, CreatedAt = now.AddDays(-8)
            },
            new()
            {
                OrganizerId = organizer2.Id, Title = "Festival de Jazz do Huambo",
                Slug = "festival-jazz-huambo", Category = "Festival",
                Description = "O Huambo recebe artistas de jazz de toda a África lusófona. 2 dias de música sofisticada, gastronomia local e artesanato.",
                StartDateTime = now.AddDays(35), EndDateTime = now.AddDays(36),
                Capacity = 2000, VenueId = venues[6].Id,
                ImageUrl = "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800",
                MinAge = 0, LikesCount = 345, SharesCount = 89,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-18)
            },
            new()
            {
                OrganizerId = organizer.Id, Title = "Sunset na Marginal",
                Slug = "sunset-na-marginal", Category = "Festa",
                Description = "Sunset party na Marginal de Luanda com vista para o mar. Food trucks, artistas locais e a melhor música afrobeat. Grátis para todos!",
                StartDateTime = now.AddDays(3), EndDateTime = now.AddDays(3).AddHours(5),
                Capacity = 5000, VenueId = venues[9].Id,
                ImageUrl = "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800",
                MinAge = 0, LikesCount = 2340, SharesCount = 567,
                IsFeatured = true,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-3)
            },
            new()
            {
                OrganizerId = organizer2.Id, Title = "Praia Party Benguela",
                Slug = "praia-party-benguela", Category = "Festa",
                Description = "Na areia da Praia do Buraco! DJ set, fogueira ao pôr-do-sol, churrasco e noite de estrelas. A festa de verão que não podes perder.",
                StartDateTime = now.AddDays(12), EndDateTime = now.AddDays(12).AddHours(7),
                Capacity = 5000, VenueId = venues[7].Id,
                ImageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
                MinAge = 16, LikesCount = 678, SharesCount = 156,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-6)
            },
            new()
            {
                OrganizerId = organizer.Id, Title = "Workshop Fotografia Angola",
                Slug = "workshop-fotografia-angola", Category = "Conferência",
                Description = "Workshop intensivo de fotografia com os melhores fotógrafos angolanos. Aprende técnicas de retrato, paisagem e fotojornalismo.",
                StartDateTime = now.AddDays(8), EndDateTime = now.AddDays(8).AddHours(6),
                Capacity = 60, VenueId = venues[1].Id,
                ImageUrl = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
                MinAge = 0, LikesCount = 123, SharesCount = 45,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-9)
            },
            new()
            {
                OrganizerId = organizer2.Id, Title = "Stand-up Comedy Night",
                Slug = "standup-comedy-night", Category = "Show",
                Description = "Os melhores comediantes de Angola num show inesquecível. 2 horas de risos garantidos com humor inteligente e observações do dia-a-dia angolano.",
                StartDateTime = now.AddDays(6), EndDateTime = now.AddDays(6).AddHours(3),
                Capacity = 600, VenueId = venues[8].Id,
                ImageUrl = "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800",
                MinAge = 16, LikesCount = 234, SharesCount = 67,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-4)
            },
            new()
            {
                OrganizerId = organizer.Id, Title = "Gala Beneficente UNICEF Angola",
                Slug = "gala-beneficente-unicef", Category = "Gala",
                Description = "Gala beneficente em prol das crianças angolanas. Jantar de 5 pratos, leilão silencioso e espetáculo musical. Todas as receitas revertidas para a UNICEF.",
                StartDateTime = now.AddDays(25), EndDateTime = now.AddDays(25).AddHours(5),
                Capacity = 300, VenueId = venues[3].Id,
                ImageUrl = "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
                MinAge = 18, LikesCount = 567, SharesCount = 234,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-14)
            },
            new()
            {
                OrganizerId = organizer2.Id, Title = "Maratona de Luanda 2026",
                Slug = "maratona-luanda-2026", Category = "Conferência",
                Description = "10km, 21km e maratona completa pela cidade de Luanda. Para corredores de todos os níveis. Inscreve-te e faz parte desta celebração de saúde e desporto!",
                StartDateTime = now.AddDays(40), EndDateTime = now.AddDays(40).AddHours(8),
                Capacity = 10000, VenueId = venues[9].Id,
                ImageUrl = "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
                MinAge = 14, LikesCount = 890, SharesCount = 340,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-25)
            },
            new()
            {
                OrganizerId = organizer.Id, Title = "Noite Eletrônica Club K",
                Slug = "noite-eletronica-club-k", Category = "Festa",
                Description = "A noite de eletrônica mais aguardada do ano. DJs internacionais, sistema de som Funktion-One, laser show e open bar até meia-noite.",
                StartDateTime = now.AddDays(4), EndDateTime = now.AddDays(4).AddHours(6),
                Capacity = 3000, VenueId = venues[2].Id,
                ImageUrl = "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800",
                MinAge = 18, LikesCount = 654, SharesCount = 178,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-2)
            },
            new()
            {
                OrganizerId = organizer2.Id, Title = "Festival Gastronômico Angola",
                Slug = "festival-gastronomico-angola", Category = "Festival",
                Description = "Os melhores chefs de Angola apresentam criações únicas. Degustação de comida tradicional, workshops de cozinha e competição culinária ao vivo.",
                StartDateTime = now.AddDays(18), EndDateTime = now.AddDays(19),
                Capacity = 3000, VenueId = venues[4].Id,
                ImageUrl = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
                MinAge = 0, LikesCount = 432, SharesCount = 156,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-11)
            },
            // Past event (for history)
            new()
            {
                OrganizerId = organizer.Id, Title = "Réveillon Boda 2025",
                Slug = "reveillon-boda-2025", Category = "Festa",
                Description = "O réveillon mais épico de Luanda 2025. Fogo de artifício, DJs e uma noite inesquecível.",
                StartDateTime = now.AddDays(-60), EndDateTime = now.AddDays(-59),
                Capacity = 20000, VenueId = venues[5].Id,
                ImageUrl = "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800",
                MinAge = 16, LikesCount = 4500, SharesCount = 1200,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-90)
            },
            new()
            {
                OrganizerId = organizer.Id, Title = "Show Acústico Elinga",
                Slug = "show-acustico-elinga", Category = "Show",
                Description = "Uma noite íntima de música acústica no icónico Elinga Teatro. Artistas emergentes angolanos ao vivo.",
                StartDateTime = now.AddDays(-14), EndDateTime = now.AddDays(-14).AddHours(3),
                Capacity = 200, VenueId = venues[1].Id,
                ImageUrl = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
                MinAge = 0, LikesCount = 312, SharesCount = 78,
                Status = EventStatus.Published, CreatedAt = now.AddDays(-30)
            },
        };

        context.Events.AddRange(events);
        context.SaveChanges();

        // ══════════════════════════════════════════════════
        // TICKETS (multiple tiers per event)
        // ══════════════════════════════════════════════════
        var tickets = new List<Ticket>();
        foreach (var ev in events)
        {
            // All events get at least Free + Normal
            tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.Free, Price = 0, QuantityTotal = (int)(ev.Capacity * 0.1), QuantitySold = (int)(ev.Capacity * 0.08) });
            if (ev.Category == "Conferência")
            {
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.EarlyBird, Price = 2000, QuantityTotal = (int)(ev.Capacity * 0.3), QuantitySold = (int)(ev.Capacity * 0.25) });
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.Normal, Price = 5000, QuantityTotal = (int)(ev.Capacity * 0.4), QuantitySold = (int)(ev.Capacity * 0.15) });
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.VIP, Price = 15000, QuantityTotal = (int)(ev.Capacity * 0.1), QuantitySold = (int)(ev.Capacity * 0.05) });
            }
            else if (ev.Category == "Gala")
            {
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.Normal, Price = 25000, QuantityTotal = (int)(ev.Capacity * 0.5), QuantitySold = (int)(ev.Capacity * 0.3) });
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.VIP, Price = 75000, QuantityTotal = (int)(ev.Capacity * 0.2), QuantitySold = (int)(ev.Capacity * 0.1) });
            }
            else if (ev.Category == "Festival")
            {
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.EarlyBird, Price = 3000, QuantityTotal = (int)(ev.Capacity * 0.2), QuantitySold = (int)(ev.Capacity * 0.18) });
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.Normal, Price = 5000, QuantityTotal = (int)(ev.Capacity * 0.4), QuantitySold = (int)(ev.Capacity * 0.2) });
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.VIP, Price = 10000, QuantityTotal = (int)(ev.Capacity * 0.1), QuantitySold = (int)(ev.Capacity * 0.04) });
            }
            else
            {
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.EarlyBird, Price = 2500, QuantityTotal = (int)(ev.Capacity * 0.15), QuantitySold = (int)(ev.Capacity * 0.12) });
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.Normal, Price = 5000, QuantityTotal = (int)(ev.Capacity * 0.4), QuantitySold = (int)(ev.Capacity * 0.2) });
                tickets.Add(new Ticket { EventId = ev.Id, Type = TicketType.VIP, Price = 10000, QuantityTotal = (int)(ev.Capacity * 0.1), QuantitySold = (int)(ev.Capacity * 0.03) });
            }
        }
        context.Tickets.AddRange(tickets);
        context.SaveChanges();

        // ══════════════════════════════════════════════════
        // ORDERS (completed purchases with issued tickets)
        // ══════════════════════════════════════════════════
        var rand = new Random(42);
        var orderUsers = new[] { user, user2, user3, dj };
        var orderId = 0;
        var allOrders = new List<Order>();

        // Create 12 orders across different events and users
        for (int i = 0; i < 12; i++)
        {
            var orderUser = orderUsers[i % orderUsers.Length];
            var eventIndex = i % Math.Min(events.Length, 15); // Only upcoming events
            var ev = events[eventIndex];
            var eventTickets = tickets.Where(t => t.EventId == ev.Id && t.Price > 0).ToList();
            if (!eventTickets.Any()) eventTickets = tickets.Where(t => t.EventId == ev.Id).ToList();
            var ticket = eventTickets[rand.Next(eventTickets.Count)];

            var qty = rand.Next(1, 4);
            var total = ticket.Price * qty;
            var commission = total * 0.07m;

            var order = new Order
            {
                UserId = orderUser.Id,
                TotalAmount = total,
                CommissionAmount = commission,
                PaymentStatus = i < 10 ? PaymentStatus.Paid : PaymentStatus.Pending,
                PaymentMethod = new[] { "BAI Pay", "Multicaixa", "Transferência", "Stripe" }[i % 4],
                CreatedAt = now.AddDays(-rand.Next(1, 30)),
                PaidAt = i < 10 ? now.AddDays(-rand.Next(1, 30)) : null,
            };
            allOrders.Add(order);
        }
        context.Orders.AddRange(allOrders);
        context.SaveChanges();

        // Order Items & Issued Tickets
        var allOrderItems = new List<OrderItem>();
        for (int i = 0; i < allOrders.Count; i++)
        {
            var order = allOrders[i];
            var eventIndex = i % Math.Min(events.Length, 15);
            var ev = events[eventIndex];
            var eventTickets = tickets.Where(t => t.EventId == ev.Id && t.Price > 0).ToList();
            if (!eventTickets.Any()) eventTickets = tickets.Where(t => t.EventId == ev.Id).ToList();
            var ticket = eventTickets[rand.Next(eventTickets.Count)];

            var qty = order.TotalAmount > 0 ? (int)(order.TotalAmount / ticket.Price) : 1;
            if (qty < 1) qty = 1;

            var item = new OrderItem
            {
                OrderId = order.Id,
                TicketId = ticket.Id,
                Quantity = qty,
                Price = ticket.Price
            };
            allOrderItems.Add(item);
        }
        context.OrderItems.AddRange(allOrderItems);
        context.SaveChanges();

        // Issued tickets with codes for paid orders
        var issuedTickets = new List<TicketIssued>();
        for (int i = 0; i < allOrderItems.Count; i++)
        {
            var item = allOrderItems[i];
            var order = allOrders[i];
            if (order.PaymentStatus == PaymentStatus.Paid)
            {
                for (int j = 0; j < item.Quantity; j++)
                {
                    issuedTickets.Add(new TicketIssued
                    {
                        OrderItemId = item.Id,
                        TicketCode = $"BODA-{now.Year}-{item.Id:D4}-{j + 1:D2}",
                        QrCode = $"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=BODA-{now.Year}-{item.Id:D4}-{j + 1:D2}",
                        Used = false,
                        IssuedAt = order.PaidAt ?? now
                    });
                }
            }
        }
        context.TicketsIssued.AddRange(issuedTickets);
        context.SaveChanges();

        // ══════════════════════════════════════════════════
        // PROMOTIONS
        // ══════════════════════════════════════════════════
        context.Promotions.AddRange(
            new Promotion { Code = "BODA20", DiscountType = "percentage", Value = 20, UsesLimit = 100, UsesCount = 23, ValidFrom = now.AddDays(-30), ValidTo = now.AddDays(90) },
            new Promotion { Code = "EARLYBIRD", DiscountType = "percentage", Value = 15, UsesLimit = 50, UsesCount = 12, ValidFrom = now.AddDays(-10), ValidTo = now.AddDays(60) },
            new Promotion { Code = "VIPFREE", DiscountType = "fixed", Value = 10000, UsesLimit = 10, UsesCount = 2, ValidFrom = now, ValidTo = now.AddDays(30) },
            new Promotion { Code = "WELCOME", DiscountType = "percentage", Value = 10, UsesLimit = 500, UsesCount = 67, ValidFrom = now.AddDays(-60), ValidTo = now.AddDays(120) },
            new Promotion { Code = "FESTIVAL50", DiscountType = "percentage", Value = 50, EventId = events[0].Id, UsesLimit = 20, UsesCount = 5, ValidFrom = now, ValidTo = now.AddDays(25) }
        );
        context.SaveChanges();

        // ══════════════════════════════════════════════════
        // COMMENTS (varied ratings, across events)
        // ══════════════════════════════════════════════════
        var commentTexts = new[]
        {
            (5, "Evento incrível! A produção foi de altíssimo nível. Recomendo a todos!"),
            (4, "Muito bom, adorei a música e o ambiente. Só faltou melhor organização na entrada."),
            (5, "Sem palavras! Melhor evento que já fui em Angola. A energia era contagiante!"),
            (3, "Foi razoável. O som poderia ter sido melhor, mas no geral valeu a pena."),
            (5, "Espetacular! Os artistas arrasaram. Já estou à espera do próximo!"),
            (4, "Gostei muito. O local é fantástico e a equipa muito profissional."),
            (5, "Perfeito do início ao fim. A decoração, comida e música — tudo top!"),
            (2, "Achei um pouco desorganizado. Filas enormes para entrar."),
            (4, "Boa festa! DJ incrível e pessoal muito animado."),
            (5, "Incrível experiência! Voltaria sem hesitar. 10/10!"),
            (3, "O evento em si foi bom, mas o estacionamento foi um caos."),
            (4, "Adorei a experiência VIP. O camarote estava perfeito."),
            (5, "Festival do ano! 3 dias de pura diversão. Obrigado Boda!"),
            (1, "Muito caro para o que ofereceram. Não recomendo."),
            (5, "Angola precisa de mais eventos assim. Parabéns à organização!"),
        };

        var commentUsers = new[] { user, user2, user3, dj, admin };
        var allComments = new List<Comment>();
        for (int i = 0; i < commentTexts.Length; i++)
        {
            var (rating, body) = commentTexts[i];
            allComments.Add(new Comment
            {
                EventId = events[i % events.Length].Id,
                UserId = commentUsers[i % commentUsers.Length].Id,
                Rating = rating,
                Body = body,
                Status = CommentStatus.Approved,
                CreatedAt = now.AddDays(-rand.Next(1, 20))
            });
        }
        // Add extra comments to the most popular events
        for (int i = 0; i < 10; i++)
        {
            allComments.Add(new Comment
            {
                EventId = events[i % 5].Id, // Top 5 events get extra comments
                UserId = commentUsers[(i + 2) % commentUsers.Length].Id,
                Rating = rand.Next(3, 6),
                Body = $"Nota {rand.Next(3, 6)}/5 — {'⭐'} Gostei muito! Experiência memorável em Luanda.",
                Status = CommentStatus.Approved,
                CreatedAt = now.AddDays(-rand.Next(1, 15))
            });
        }
        context.Comments.AddRange(allComments);
        context.SaveChanges();

        // ══════════════════════════════════════════════════
        // MESSAGES (conversations)
        // ══════════════════════════════════════════════════
        context.Messages.AddRange(
            new Message { FromUserId = user.Id, ToUserId = organizer.Id, Subject = "Evento Festival Kuduro", Body = "Olá Maria! Gostaria de saber se ainda há bilhetes VIP disponíveis para o Festival Kuduro. Somos um grupo de 5 pessoas.", CreatedAt = now.AddDays(-5) },
            new Message { FromUserId = organizer.Id, ToUserId = user.Id, Subject = "RE: Evento Festival Kuduro", Body = "Olá João! Sim, ainda temos bilhetes VIP. Posso reservar 5 para ti. Usa o código BODA20 para 20% de desconto!", Read = true, CreatedAt = now.AddDays(-4) },
            new Message { FromUserId = user.Id, ToUserId = organizer.Id, Subject = "RE: Evento Festival Kuduro", Body = "Perfeito! Vou comprar agora. Muito obrigado pela atenção!", CreatedAt = now.AddDays(-4) },
            new Message { FromUserId = user2.Id, ToUserId = organizer.Id, Subject = "Fotografia no evento", Body = "Olá! Sou fotógrafa profissional e gostaria de cobrir o Festival Kuduro. Posso ter um passe de imprensa?", CreatedAt = now.AddDays(-3) },
            new Message { FromUserId = organizer.Id, ToUserId = user2.Id, Subject = "RE: Fotografia no evento", Body = "Olá Ana! Claro, enviamos o passe de imprensa por email. Bem-vinda à equipa!", Read = true, CreatedAt = now.AddDays(-2) },
            new Message { FromUserId = user3.Id, ToUserId = dj.Id, Subject = "Fã do teu trabalho!", Body = "DJ Kiambote! Sou fã do teu som desde 2022. Vais tocar na conferência tech? Seria incrível!", CreatedAt = now.AddDays(-6) },
            new Message { FromUserId = dj.Id, ToUserId = user3.Id, Subject = "RE: Fã do teu trabalho!", Body = "Obrigado mano! Sim, vou tocar no DJ Kiambote Live dia 10. Aparece lá e traz os teus amigos! 🔥", Read = true, CreatedAt = now.AddDays(-5) },
            new Message { FromUserId = user.Id, ToUserId = organizer2.Id, Subject = "Benguela party", Body = "Pedro, a Praia Party vai ter estacionamento? Vamos de carro desde Luanda.", CreatedAt = now.AddDays(-2) },
            new Message { FromUserId = organizer2.Id, ToUserId = user.Id, Subject = "RE: Benguela party", Body = "Sim João! Temos parking gratuito para 200 carros. Chega cedo para garantir lugar. Boa viagem!", CreatedAt = now.AddDays(-1) },
            new Message { FromUserId = admin.Id, ToUserId = organizer.Id, Subject = "Parabéns pelo trabalho!", Body = "Maria, os números do último trimestre são impressionantes. A plataforma Boda está a crescer graças a organizadores como tu!", CreatedAt = now.AddDays(-1) }
        );
        context.SaveChanges();

        // ══════════════════════════════════════════════════
        // NOTIFICATIONS
        // ══════════════════════════════════════════════════
        context.Notifications.AddRange(
            // João notifications
            new Notification { UserId = user.Id, Type = "ticket_purchased", Title = "Bilhete comprado — Festival Kuduro 2026 (VIP x2)", CreatedAt = now.AddDays(-3) },
            new Notification { UserId = user.Id, Type = "event_reminder", Title = "Lembrete: Sunset na Marginal amanhã às 16:00!", CreatedAt = now.AddDays(-1) },
            new Notification { UserId = user.Id, Type = "new_message", Title = "Maria Santos respondeu à tua mensagem", Read = true, CreatedAt = now.AddDays(-4) },
            new Notification { UserId = user.Id, Type = "new_follower", Title = "Ana Fernandes começou a seguir-te", CreatedAt = now.AddHours(-5) },
            new Notification { UserId = user.Id, Type = "event_reminder", Title = "Noite Eletrônica Club K é em 4 dias!", CreatedAt = now.AddHours(-2) },
            // Maria (organizer) notifications
            new Notification { UserId = organizer.Id, Type = "ticket_purchased", Title = "3 novos bilhetes vendidos para Festival Kuduro!", CreatedAt = now.AddHours(-8) },
            new Notification { UserId = organizer.Id, Type = "new_follower", Title = "João Silva e mais 12 pessoas começaram a seguir-te", CreatedAt = now.AddDays(-2) },
            new Notification { UserId = organizer.Id, Type = "new_message", Title = "Nova mensagem de Ana Fernandes", CreatedAt = now.AddDays(-3) },
            new Notification { UserId = organizer.Id, Type = "ticket_purchased", Title = "Gala de Carnaval: 5 bilhetes VIP vendidos", Read = true, CreatedAt = now.AddDays(-5) },
            // Ana notifications
            new Notification { UserId = user2.Id, Type = "new_message", Title = "Maria Santos aceitou o teu pedido de passe de imprensa", CreatedAt = now.AddDays(-2) },
            new Notification { UserId = user2.Id, Type = "ticket_purchased", Title = "Bilhete comprado — Praia Party Benguela (Normal x1)", CreatedAt = now.AddDays(-4) },
            // Miguel
            new Notification { UserId = user3.Id, Type = "new_message", Title = "DJ Kiambote respondeu!", CreatedAt = now.AddDays(-5) },
            new Notification { UserId = user3.Id, Type = "event_reminder", Title = "Stand-up Comedy Night é em 6 dias", CreatedAt = now.AddDays(-1) }
        );
        context.SaveChanges();

        // ══════════════════════════════════════════════════
        // FOLLOWS
        // ══════════════════════════════════════════════════
        context.Follows.AddRange(
            new Follow { FollowerId = user.Id, FollowingId = organizer.Id, CreatedAt = now.AddDays(-30) },
            new Follow { FollowerId = user.Id, FollowingId = dj.Id, CreatedAt = now.AddDays(-25) },
            new Follow { FollowerId = user.Id, FollowingId = organizer2.Id, CreatedAt = now.AddDays(-20) },
            new Follow { FollowerId = user2.Id, FollowingId = organizer.Id, CreatedAt = now.AddDays(-15) },
            new Follow { FollowerId = user2.Id, FollowingId = user.Id, CreatedAt = now.AddDays(-10) },
            new Follow { FollowerId = user3.Id, FollowingId = dj.Id, CreatedAt = now.AddDays(-8) },
            new Follow { FollowerId = user3.Id, FollowingId = organizer.Id, CreatedAt = now.AddDays(-5) },
            new Follow { FollowerId = dj.Id, FollowingId = organizer.Id, CreatedAt = now.AddDays(-20) },
            new Follow { FollowerId = organizer.Id, FollowingId = dj.Id, CreatedAt = now.AddDays(-18) },
            new Follow { FollowerId = organizer2.Id, FollowingId = organizer.Id, CreatedAt = now.AddDays(-12) }
        );
        context.SaveChanges();

        // Update follower/following counts on users
        foreach (var u in new[] { admin, organizer, organizer2, dj, user, user2, user3, developer })
        {
            u.FollowersCount = context.Follows.Count(f => f.FollowingId == u.Id);
            u.FollowingCount = context.Follows.Count(f => f.FollowerId == u.Id);
            u.EventsCount = context.Events.Count(e => e.OrganizerId == u.Id);
        }
        context.SaveChanges();
    }
}
