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

In je Vercel project dashboard:

1. Ga naar **Settings** → **Environment Variables**
2. Voeg de volgende variabelen toe:

#### Verplicht:
- **`GRAPHQL_ENDPOINT`**: De URL van je GraphQL endpoint
  - Voorbeeld: `https://api.example.com/graphql`

#### Optioneel:
- **`GRAPHQL_API_KEY`**: API key voor authenticatie (indien vereist)
  - Voorbeeld: `Bearer abc123xyz...`

#### Environment Variables toevoegen:

1. Klik op "Add New"
2. Voer de **Name** in (bijv. `GRAPHQL_ENDPOINT`)
3. Voer de **Value** in (je GraphQL endpoint URL)
4. Selecteer de **Environments** waar dit van toepassing is:
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. Klik op "Save"

**Belangrijk**: Na het toevoegen van environment variables moet je een nieuwe deployment triggeren:
- Ga naar **Deployments** tab
- Klik op de drie puntjes (⋯) bij de laatste deployment
- Selecteer "Redeploy"

Of push een nieuwe commit naar GitHub om automatisch te deployen.

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

