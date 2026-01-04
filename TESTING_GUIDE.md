# Test Gids - Aanbiedingen API

Complete gids om je API te testen na deployment op Vercel.

## 📍 Je API URL vinden

Na een succesvolle deployment op Vercel krijg je een URL zoals:
```
https://aanbiedingen-api-abc123.vercel.app
```

Je API endpoint is dan:
```
https://aanbiedingen-api-abc123.vercel.app/api/search-offers
```

**Waar vind je deze URL?**
1. Ga naar je Vercel dashboard
2. Klik op je project
3. Je ziet de URL bovenaan, of in de "Deployments" tab

---

## 🧪 Test Methoden

### Methode 1: Testen met Browser (Eenvoudigst)

**Stap 1**: Open je browser

**Stap 2**: Typ in de adresbalk:
```
https://jouw-project-naam.vercel.app/api/search-offers?searchTerm=koffie
```

**Vervang** `jouw-project-naam.vercel.app` met je echte Vercel URL.

**Voorbeelden van zoektermen**:
- `?searchTerm=koffie`
- `?searchTerm=cola`
- `?searchTerm=melk`
- `?searchTerm=brood`

**Verwacht resultaat**: Je ziet een JSON response met aanbiedingen.

---

### Methode 2: Testen met Postman (Aanbevolen)

#### GET Request

1. Open Postman
2. Maak een nieuwe request:
   - **Method**: Selecteer `GET`
   - **URL**: `https://jouw-project-naam.vercel.app/api/search-offers?searchTerm=koffie`
3. Klik op **"Send"**

#### POST Request

1. Open Postman
2. Maak een nieuwe request:
   - **Method**: Selecteer `POST`
   - **URL**: `https://jouw-project-naam.vercel.app/api/search-offers`
3. Klik op **"Body"** tab
4. Selecteer **"raw"**
5. Selecteer **"JSON"** in het dropdown menu
6. Plak dit in het tekstveld:
```json
{
  "searchTerm": "koffie"
}
```
7. Klik op **"Send"**

#### Google Assistant Format (POST)

Voor testen met Dialogflow format:
```json
{
  "queryResult": {
    "parameters": {
      "searchTerm": "koffie"
    }
  }
}
```

---

### Methode 3: Testen met cURL (PowerShell)

#### GET Request

Open PowerShell en voer uit:

```powershell
curl "https://jouw-project-naam.vercel.app/api/search-offers?searchTerm=koffie"
```

#### POST Request

```powershell
curl -X POST https://jouw-project-naam.vercel.app/api/search-offers `
  -H "Content-Type: application/json" `
  -d '{\"searchTerm\": \"koffie\"}'
```

**Let op**: Vervang `jouw-project-naam.vercel.app` met je echte Vercel URL.

---

### Methode 4: Testen met JavaScript (Browser Console)

Open de Developer Console (F12) op een willekeurige website en voer uit:

```javascript
// GET request
fetch('https://jouw-project-naam.vercel.app/api/search-offers?searchTerm=koffie')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// POST request
fetch('https://jouw-project-naam.vercel.app/api/search-offers', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    searchTerm: 'koffie'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

---

### Methode 5: Testen met VS Code REST Client

Als je VS Code gebruikt met de REST Client extensie:

1. Open `examples/test-requests.http`
2. Vervang `@baseUrl` met je echte URL
3. Klik op "Send Request" boven elke request

---

## ✅ Wat te verwachten bij een succesvolle response

### Succesvolle Response (met resultaten)

```json
{
  "fulfillmentText": "Ik heb 2 aanbiedingen gevonden voor \"koffie\":\n\n1. Douwe Egberts Koffie - €4.99 (was €6.99) - 29% korting bij Albert Heijn - ...",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["Ik heb 2 aanbiedingen gevonden voor \"koffie\":..."]
      }
    }
  ],
  "payload": {
    "offers": [
      {
        "id": "123",
        "productName": "Douwe Egberts Koffie",
        "price": 4.99,
        "originalPrice": 6.99,
        "discount": 2.00,
        "discountPercentage": 29,
        "store": {
          "id": "1",
          "name": "Albert Heijn",
          "slug": "albert-heijn",
          "logoUrl": "https://..."
        },
        "imageUrl": "https://...",
        "description": "...",
        "brochureId": "456",
        "pageIndex": 5
      }
    ],
    "searchTerm": "koffie",
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
  "error": "Missing search term",
  "fulfillmentText": "Geef alstublieft een zoekterm op. Bijvoorbeeld: \"cola\" of \"melk\".",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["Geef alstublieft een zoekterm op. Bijvoorbeeld: \"cola\" of \"melk\"."]
      }
    }
  ]
}
```

---

## 🔍 Test Cases

### Test 1: Basis GET Request
```
GET /api/search-offers?searchTerm=koffie
```
**Verwacht**: Succesvolle response met aanbiedingen

### Test 2: POST Request
```
POST /api/search-offers
Body: {"searchTerm": "cola"}
```
**Verwacht**: Succesvolle response met aanbiedingen

### Test 3: Geen zoekterm
```
GET /api/search-offers
```
**Verwacht**: Foutmelding "Missing search term"

### Test 4: Lege zoekterm
```
GET /api/search-offers?searchTerm=
```
**Verwacht**: Foutmelding "Missing search term"

### Test 5: Onbekende zoekterm
```
GET /api/search-offers?searchTerm=xyz123abc
```
**Verwacht**: "Geen aanbiedingen gevonden" response

### Test 6: Google Assistant Format
```
POST /api/search-offers
Body: {
  "queryResult": {
    "parameters": {
      "searchTerm": "melk"
    }
  }
}
```
**Verwacht**: Succesvolle response met fulfillmentText

### Test 7: CORS Test (van andere website)
Open browser console op een andere website en voer uit:
```javascript
fetch('https://jouw-project-naam.vercel.app/api/search-offers?searchTerm=koffie')
  .then(r => r.json())
  .then(console.log);
```
**Verwacht**: Succesvolle response (CORS werkt)

---

## 🐛 Troubleshooting

### Probleem: "404 Not Found"

**Oplossing**:
- Check of je de juiste URL gebruikt: `https://jouw-project.vercel.app/api/search-offers`
- Zorg dat je `/api/search-offers` toevoegt (niet alleen de base URL)
- Check of de deployment succesvol was in Vercel

### Probleem: "500 Internal Server Error"

**Oplossing**:
1. Ga naar Vercel dashboard → Je project → Deployments
2. Klik op de failed deployment
3. Klik op "Functions" → Klik op de functie → Bekijk "Logs"
4. Check de error message
5. Meestal is het een GraphQL endpoint probleem

### Probleem: "Network Error" of "CORS Error"

**Oplossing**:
- Check of je API URL correct is
- CORS is al geconfigureerd, maar check of je de juiste headers gebruikt
- Test eerst met Postman (geen CORS issues)

### Probleem: Lege response of geen aanbiedingen

**Oplossing**:
- Dit kan normaal zijn als er geen aanbiedingen zijn voor die zoekterm
- Probeer andere zoektermen zoals: "koffie", "cola", "melk", "brood"
- Check of de GraphQL endpoint correct werkt

### Probleem: Response heeft geen "fulfillmentText"

**Oplossing**:
- Check de Vercel logs voor errors
- Zorg dat de GraphQL query correct is
- Check of de data mapping correct werkt

---

## 📊 Response Validatie

Een goede response moet bevatten:

✅ `fulfillmentText` - Tekst voor Google Assistant  
✅ `fulfillmentMessages` - Array met text messages  
✅ `payload` - Gestructureerde data met:
  - `offers` - Array van aanbiedingen
  - `searchTerm` - De gebruikte zoekterm
  - `count` - Aantal gevonden aanbiedingen

Elke aanbieding moet bevatten:
✅ `id` - Unieke identifier  
✅ `productName` - Naam van het product  
✅ `price` - Huidige prijs  
✅ `store` - Winkelinformatie (of null)  
✅ `discountPercentage` - Korting percentage (of null)

---

## 🎯 Quick Test Checklist

- [ ] API URL werkt (geen 404)
- [ ] GET request met `?searchTerm=koffie` werkt
- [ ] POST request met JSON body werkt
- [ ] Response bevat `fulfillmentText`
- [ ] Response bevat `payload.offers` array
- [ ] Geen resultaten geeft duidelijke melding
- [ ] Foutafhandeling werkt (geen zoekterm = foutmelding)
- [ ] CORS werkt (test vanuit browser console)

---

## 🚀 Klaar voor Google Assistant

Als alle tests slagen, is je API klaar voor integratie met Google Assistant / Dialogflow!

Zie de README.md voor Dialogflow integratie instructies.

---

**Veel succes met testen!** 🎉

