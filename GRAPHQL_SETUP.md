# GraphQL Endpoint Setup Gids

## Waar vind ik mijn GraphQL endpoint en API key?

### 1. Als je al een GraphQL API hebt

#### GRAPHQL_ENDPOINT vinden:
- **Check je API documentatie** - meestal staat daar de base URL
- **Vraag je backend developer** - die weet waar de API draait
- **Check je hosting provider** - als je zelf een server hebt
- **Kijk in je applicatie code** - vaak staat de URL in configuratie bestanden

**Voorbeelden van hoe een endpoint eruit ziet:**
```
https://api.jouwbedrijf.nl/graphql
https://graphql.example.com/v1
https://api.example.com/api/graphql
https://your-project.hasura.app/v1/graphql
```

#### GRAPHQL_API_KEY vinden:
- **Developer Dashboard** - meestal onder "API Keys" of "Authentication"
- **Account Settings** - vaak in de security/API sectie
- **API Documentatie** - check de "Authentication" sectie
- **Vraag je beheerder** - als je toegang hebt tot het account

**Let op**: Niet alle GraphQL endpoints hebben een API key nodig. Alleen toevoegen als je API authenticatie vereist.

---

### 2. Als je een commerciële service gebruikt

Veel commerciële services hebben GraphQL endpoints. Check hun documentatie:

**Populaire services met GraphQL:**
- **Shopify** - heeft GraphQL Admin API
- **Contentful** - Content Delivery API met GraphQL
- **Strapi** - headless CMS met GraphQL
- **Hasura** - instant GraphQL over databases
- **AWS AppSync** - managed GraphQL service

**Waar te vinden:**
1. Log in op je account
2. Ga naar "Developer" of "API" sectie
3. Zoek naar "GraphQL endpoint" of "API endpoint"
4. Kopieer de URL en eventuele API keys

---

### 3. Als je nog geen GraphQL endpoint hebt

Je hebt een paar opties:

#### Optie A: Gebruik Hasura (snelste optie)

Hasura geeft je direct een GraphQL endpoint over je database:

1. Ga naar [hasura.io](https://hasura.io)
2. Maak een gratis account
3. Maak een nieuw project
4. Connect je database (of gebruik de gratis Postgres)
5. Je krijgt direct een GraphQL endpoint zoals:
   ```
   https://jouw-project.hasura.app/v1/graphql
   ```
6. Voor API keys: Ga naar "Settings" → "API Keys"

#### Optie B: Gebruik Supabase

Supabase heeft GraphQL support:

1. Ga naar [supabase.com](https://supabase.com)
2. Maak een gratis account
3. Maak een nieuw project
4. GraphQL endpoint staat in je project settings
5. API keys staan in "Settings" → "API"

#### Optie C: Maak je eigen met Apollo Server

Als je Node.js kent, kun je snel een GraphQL server maken:

```javascript
// server.js
const { ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
  type Store {
    id: ID!
    name: String!
    address: String
    city: String
  }

  type Offer {
    id: ID!
    productName: String!
    price: Float!
    originalPrice: Float
    discount: Float
    discountPercentage: Int
    store: Store
    imageUrl: String
    validUntil: String
    description: String
  }

  type Query {
    searchOffers(searchTerm: String!): [Offer]
  }
`;

const resolvers = {
  Query: {
    searchOffers: (_, { searchTerm }) => {
      // Je logica om aanbiedingen te zoeken
      return []; // Return je aanbiedingen
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`GraphQL server ready at ${url}`);
});
```

Deploy dit naar Vercel, Railway, of een andere hosting service.

---

### 4. Voor testen: Mock GraphQL Endpoint

Als je de API wilt testen zonder een echte endpoint, kun je:

#### Optie 1: Gebruik GraphQL Playground met mock data

1. Installeer GraphQL Playground lokaal (alleen voor testen)
2. Of gebruik een online mock service

#### Optie 2: Maak een simpele mock endpoint

Je kunt een simpele mock server maken met bijvoorbeeld:
- **JSON Server** + GraphQL wrapper
- **Mock Service Worker**
- **Online mock services**

#### Optie 3: Gebruik een publieke test endpoint

Sommige services bieden publieke test endpoints:
- `https://graphqlzero.almansi.me/api` (publieke test GraphQL)
- Check of je service een sandbox/test omgeving heeft

**Let op**: Mock endpoints zijn alleen voor ontwikkeling/testen. Voor productie heb je een echte GraphQL API nodig.

---

### 5. Veelgestelde vragen

**Q: Moet ik altijd een API key hebben?**
A: Nee, alleen als je GraphQL endpoint authenticatie vereist. Veel endpoints werken zonder key, of gebruiken andere authenticatie methoden.

**Q: Wat als mijn endpoint geen "searchOffers" query heeft?**
A: Pas de GraphQL query aan in `api/search-offers.js`. De query moet overeenkomen met je eigen GraphQL schema.

**Q: Kan ik de API testen zonder GraphQL endpoint?**
A: Nee, de API heeft een werkende GraphQL endpoint nodig. Maar je kunt wel een mock endpoint gebruiken voor testen.

**Q: Waar deploy ik mijn GraphQL endpoint?**
A: Populaire opties:
- **Vercel** (serverless)
- **Railway** (eenvoudig)
- **Heroku** (traditioneel)
- **AWS Lambda** (serverless)
- **DigitalOcean** (VPS)

---

### 6. Checklist voordat je de API gebruikt

- [ ] Ik heb een GraphQL endpoint URL
- [ ] Ik weet welke queries beschikbaar zijn
- [ ] Ik heb een API key (als vereist)
- [ ] De GraphQL query in `api/search-offers.js` matcht mijn schema
- [ ] Ik heb de environment variables toegevoegd in Vercel
- [ ] Ik heb een nieuwe deployment getriggerd na het toevoegen van variables

---

### 7. Hulp nodig?

Als je hulp nodig hebt met het opzetten van een GraphQL endpoint:
- Check de documentatie van je service provider
- Vraag je backend developer
- Gebruik Hasura of Supabase voor een snelle start
- Check GraphQL tutorials online

