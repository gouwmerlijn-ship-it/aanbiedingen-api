# Aanbiedingen API - Google Assistant Fulfillment

Een serverless GraphQL API voor het zoeken van aanbiedingen, volledig geoptimaliseerd voor Google Assistant / Dialogflow Fulfillment. De API draait volledig online via Vercel serverless functies.

## 🚀 Features

- ✅ GraphQL endpoint integratie voor aanbiedingen zoeken
- ✅ Google Assistant / Dialogflow Fulfillment compatibel
- ✅ Volledig serverless (geen lokale installatie nodig)
- ✅ Automatische deployment via GitHub → Vercel
- ✅ Robuuste foutafhandeling
- ✅ CORS ondersteuning voor cross-origin requests

## 📋 Vereisten

- GitHub account (voor versiebeheer)
- Vercel account (gratis tier is voldoende)
- GraphQL endpoint URL voor aanbiedingen
- Optioneel: API key voor GraphQL endpoint

## 🛠️ Setup & Deployment

📖 **📚 Uitgebreide stap-voor-stap gids**: Zie [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md) voor een complete, gedetailleerde deployment instructie met screenshots en troubleshooting.

### Quick Start

### Stap 1: Project naar GitHub pushen

1. Maak een nieuwe repository aan op GitHub
2. Clone de repository lokaal (optioneel, kan ook via GitHub web interface)
3. Push deze code naar je repository:

```bash
git init
git add .
git commit -m "Initial commit: Aanbiedingen API"
git branch -M main
git remote add origin https://github.com/jouw-username/jouw-repo-naam.git
git push -u origin main
```

### Stap 2: Vercel Project aanmaken

1. Ga naar [vercel.com](https://vercel.com) en log in met je GitHub account
2. Klik op "Add New Project"
3. Selecteer je GitHub repository
4. Vercel detecteert automatisch de configuratie uit `vercel.json`

### Stap 3: Environment Variables instellen

**⚠️ Belangrijk**: Environment variables kunnen **voor of na** de eerste deployment worden toegevoegd, maar na het toevoegen/wijzigen moet je altijd een nieuwe deployment triggeren!

#### Optie A: Voor de eerste deployment (aanbevolen)

1. Na het importeren van je repository, **voordat je op "Deploy" klikt**:
   - Klik op **"Environment Variables"** (rechtsboven of in de sidebar)
   - Voeg de variabelen toe (zie hieronder)
   - Klik daarna op **"Deploy"**

#### Optie B: Na de eerste deployment

1. Na de eerste deployment:
   - Ga naar je project dashboard
   - Klik op **Settings** → **Environment Variables**
   - Voeg de variabelen toe
   - **Trigger een nieuwe deployment** (zie hieronder)

#### Environment Variables toevoegen:

1. Klik op **"Add New"**
2. Voer de **Name** in (bijv. `GRAPHQL_ENDPOINT`)
3. Voer de **Value** in (je GraphQL endpoint URL of API key)
4. Selecteer de **Environments** waar dit van toepassing is:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Klik op **"Save"**

#### Verplichte variabele:
- **`GRAPHQL_ENDPOINT`**: De URL van je GraphQL endpoint
  - Voor allefolders.nl: `https://api.jafolders.com/graphql` (dit is de standaard)
  - Of je eigen endpoint: `https://api.example.com/graphql`

#### Optionele variabelen:
- **`GRAPHQL_API_KEY`**: API key voor authenticatie (indien vereist)
  - Voorbeeld: `abc123xyz...` (zonder "Bearer" prefix, dit wordt automatisch toegevoegd)
- **`JAFOLDERS_CONTEXT`**: Context header voor allefolders.nl API (optioneel)
  - Standaard: `allefolders;nl;web;1;1`
  - Pas dit aan als je een andere context nodig hebt

### Waar vind ik deze waarden?

**Deze waarden moet je zelf hebben of verkrijgen van je GraphQL service provider.** Hier zijn de meest voorkomende scenario's:

#### Scenario 1: Je hebt al een GraphQL API
- **GRAPHQL_ENDPOINT**: Dit is de URL waar je GraphQL API draait
  - Bijvoorbeeld: `https://api.jouwbedrijf.nl/graphql` of `https://graphql.example.com`
  - Vraag je backend developer of check je API documentatie
- **GRAPHQL_API_KEY**: Alleen nodig als je API authenticatie vereist
  - Check je API documentatie of vraag je beheerder
  - Vaak te vinden in je account dashboard van de service provider

#### Scenario 2: Je gebruikt een externe service (bijv. commercieel aanbod platform)
- Check de documentatie van de service
- Vaak te vinden in:
  - Developer dashboard / API settings
  - Account settings → API keys
  - Service documentatie → "Getting Started" of "API Integration"

#### Scenario 3: Je moet nog een GraphQL endpoint opzetten
Als je nog geen GraphQL endpoint hebt, heb je een paar opties:

**Optie A: Gebruik een bestaande GraphQL service**
- Zoek naar commerciële aanbiedingen APIs die GraphQL ondersteunen
- Of gebruik een service zoals Hasura, Apollo Server, etc.

**Optie B: Maak een mock/test endpoint (voor testen)**
- Je kunt tijdelijk een mock GraphQL endpoint gebruiken om de API te testen
- Zie hieronder voor een voorbeeld mock endpoint

**Optie C: Bouw je eigen GraphQL API**
- Gebruik bijvoorbeeld:
  - **Hasura** (snel GraphQL over je database)
  - **Apollo Server** (Node.js GraphQL server)
  - **Supabase** (heeft GraphQL support)
  - **AWS AppSync** (managed GraphQL service)

#### Voor testen: Mock GraphQL Endpoint

Als je de API wilt testen zonder een echte GraphQL endpoint, kun je tijdelijk een mock service gebruiken zoals:

- **GraphQL Playground** met mock data
- **Mock Service Worker** voor lokale ontwikkeling
- **Online mock services** zoals `https://graphqlzero.almansi.me/api`

**Let op**: Voor productie gebruik moet je een echte GraphQL endpoint hebben die aanbiedingen data levert.

📖 **Uitgebreide uitleg**: Zie `GRAPHQL_SETUP.md` voor een complete gids over het vinden of opzetten van een GraphQL endpoint.

#### Nieuwe deployment triggeren (na toevoegen/wijzigen):

**Methode 1: Via Vercel Dashboard**
- Ga naar **Deployments** tab
- Klik op de drie puntjes (⋯) bij de laatste deployment
- Selecteer **"Redeploy"**

**Methode 2: Via GitHub**
- Push een nieuwe commit naar GitHub (bijv. een kleine wijziging in README)
- Vercel deployt automatisch met de nieuwe environment variables

## 📡 API Endpoints

### Zoeken naar aanbiedingen

**Endpoint**: `https://jouw-project.vercel.app/api/search-offers`

**Method**: `GET` of `POST`

#### GET Request

```
GET /api/search-offers?searchTerm=cola
```

#### POST Request

```json
{
  "searchTerm": "cola"
}
```

#### Google Assistant / Dialogflow Format

```json
{
  "queryResult": {
    "parameters": {
      "searchTerm": "cola"
    }
  }
}
```

## 📤 Response Format

### Succesvolle Response

```json
{
  "fulfillmentText": "Ik heb 2 aanbiedingen gevonden voor \"cola\":\n\n1. Coca-Cola 1.5L - €2.99 (was €3.49) - 14% korting bij Albert Heijn - geldig tot 2024-12-31\n2. Pepsi Cola 2L - €1.99 (was €2.49) - 20% korting bij Jumbo - geldig tot 2024-12-25",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["Ik heb 2 aanbiedingen gevonden voor \"cola\":\n\n1. Coca-Cola 1.5L - €2.99 (was €3.49) - 14% korting bij Albert Heijn - geldig tot 2024-12-31\n2. Pepsi Cola 2L - €1.99 (was €2.49) - 20% korting bij Jumbo - geldig tot 2024-12-25"]
      }
    }
  ],
  "payload": {
    "offers": [
      {
        "id": "123",
        "productName": "Coca-Cola 1.5L",
        "price": 2.99,
        "originalPrice": 3.49,
        "discount": 0.50,
        "discountPercentage": 14,
        "store": {
          "name": "Albert Heijn",
          "address": "Hoofdstraat 1",
          "city": "Amsterdam"
        },
        "imageUrl": "https://example.com/images/coca-cola.jpg",
        "validUntil": "2024-12-31",
        "description": "Coca-Cola frisdrank 1.5 liter"
      },
      {
        "id": "124",
        "productName": "Pepsi Cola 2L",
        "price": 1.99,
        "originalPrice": 2.49,
        "discount": 0.50,
        "discountPercentage": 20,
        "store": {
          "name": "Jumbo",
          "address": "Kerkstraat 5",
          "city": "Utrecht"
        },
        "imageUrl": "https://example.com/images/pepsi.jpg",
        "validUntil": "2024-12-25",
        "description": "Pepsi Cola frisdrank 2 liter"
      }
    ],
    "searchTerm": "cola",
    "count": 2
  }
}
```

### Geen Resultaten

```json
{
  "fulfillmentText": "Geen aanbiedingen gevonden voor \"xyz\". Probeer een andere zoekterm.",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["Geen aanbiedingen gevonden voor \"xyz\". Probeer een andere zoekterm."]
      }
    }
  ],
  "payload": {
    "offers": [],
    "searchTerm": "xyz",
    "count": 0
  }
}
```

### Fout Response

```json
{
  "error": "Network error",
  "fulfillmentText": "Er is een netwerkfout opgetreden. Controleer uw internetverbinding en probeer het opnieuw.",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["Er is een netwerkfout opgetreden. Controleer uw internetverbinding en probeer het opnieuw."]
      }
    }
  ]
}
```

## 🧪 Testen

### Met cURL

```bash
# GET request
curl "https://jouw-project.vercel.app/api/search-offers?searchTerm=cola"

# POST request
curl -X POST https://jouw-project.vercel.app/api/search-offers \
  -H "Content-Type: application/json" \
  -d '{"searchTerm": "cola"}'
```

### Met Postman

1. Maak een nieuwe request
2. Method: `GET` of `POST`
3. URL: `https://jouw-project.vercel.app/api/search-offers`
4. Voor GET: Voeg `searchTerm` toe als query parameter
5. Voor POST: Voeg in Body (raw JSON):
   ```json
   {
     "searchTerm": "cola"
   }
   ```
6. Klik op "Send"

### Met Google Assistant / Dialogflow

1. Ga naar je Dialogflow project
2. Open **Fulfillment**
3. Schakel **Webhook** in
4. Voer je Vercel URL in: `https://jouw-project.vercel.app/api/search-offers`
5. In je Intent, voeg een parameter toe: `searchTerm`
6. Schakel **Enable webhook call for this intent** in

## 🔧 GraphQL Query Aanpassen

De GraphQL query kan worden aangepast in `api/search-offers.js`. Pas de `SEARCH_OFFERS_QUERY` constante aan naar je eigen GraphQL schema:

```javascript
const SEARCH_OFFERS_QUERY = `
  query SearchOffers($searchTerm: String!) {
    searchOffers(searchTerm: $searchTerm) {
      # Pas deze velden aan naar je eigen schema
      id
      productName
      price
      # ... meer velden
    }
  }
`;
```

## 🛡️ Foutafhandeling

De API handelt de volgende fouten netjes af:

- **Ontbrekende zoekterm**: Retourneert een duidelijke foutmelding
- **Netwerkfouten**: Detecteert netwerkproblemen en geeft passende feedback
- **GraphQL fouten**: Vangt GraphQL errors op en geeft gebruiksvriendelijke berichten
- **Ontbrekende configuratie**: Controleert environment variables en geeft duidelijke foutmeldingen

## 📝 Projectstructuur

```
.
├── api/
│   └── search-offers.js    # Hoofd API endpoint
├── package.json            # Dependencies
├── vercel.json             # Vercel configuratie
├── .gitignore             # Git ignore regels
└── README.md              # Deze documentatie
```

## 🔄 Automatische Deployment

Na de initiële setup:

1. **Push naar GitHub** → Automatische deployment op Vercel
2. **Pull Request** → Preview deployment
3. **Merge naar main** → Production deployment

Alle wijzigingen gaan automatisch live!

## 🆘 Troubleshooting

### API retourneert 500 errors

- Controleer of `GRAPHQL_ENDPOINT` correct is ingesteld in Vercel
- Controleer de Vercel logs: **Deployments** → Klik op deployment → **Functions** → Klik op functie → **Logs**

### GraphQL errors

- Controleer of je GraphQL endpoint bereikbaar is
- Verifieer of de query structuur overeenkomt met je GraphQL schema
- Controleer of API keys correct zijn ingesteld

### CORS errors

- De API heeft CORS headers ingesteld voor alle origins
- Als je specifieke origins wilt toestaan, pas de `Access-Control-Allow-Origin` header aan

## 📄 License

MIT

