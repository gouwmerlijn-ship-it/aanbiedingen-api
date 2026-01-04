# Stap-voor-stap Deployment Gids voor Vercel

Complete gids om je Aanbiedingen API te deployen op Vercel.

## 📋 Voorbereiding

Zorg dat je klaar bent met:
- ✅ GitHub account
- ✅ Vercel account (gratis is voldoende)
- ✅ Code staat lokaal in de `aanbiedingen-api` folder

---

## Stap 1: Code naar GitHub pushen

### 1.1. Open GitHub en maak een nieuwe repository

1. Ga naar [github.com](https://github.com) en log in
2. Klik rechtsboven op je profielfoto → **"Your repositories"**
3. Klik op de groene knop **"New"** (of ga naar [github.com/new](https://github.com/new))
4. Vul in:
   - **Repository name**: `aanbiedingen-api` (of een andere naam)
   - **Description**: "GraphQL API voor aanbiedingen zoeken - Google Assistant Fulfillment"
   - **Visibility**: Kies **Public** (gratis) of **Private**
   - **NIET** aanvinken: "Add a README file" (we hebben er al een)
   - **NIET** aanvinken: "Add .gitignore" (we hebben er al een)
5. Klik op **"Create repository"**

### 1.2. Push je code naar GitHub

Open PowerShell in de `aanbiedingen-api` folder en voer uit:

```powershell
# Navigeer naar je project folder (als je er nog niet bent)
cd C:\Users\merli\aanbiedingen-api

# Initialiseer git (als nog niet gedaan)
git init

# Voeg alle bestanden toe
git add .

# Maak eerste commit
git commit -m "Initial commit: Aanbiedingen API voor allefolders.nl"

# Voeg GitHub remote toe (vervang USERNAME en REPO-NAAM)
git remote add origin https://github.com/USERNAME/REPO-NAAM.git

# Push naar GitHub
git branch -M main
git push -u origin main
```

**Let op**: Vervang `USERNAME` met je GitHub gebruikersnaam en `REPO-NAAM` met de naam van je repository.

**Voorbeeld**:
```powershell
git remote add origin https://github.com/jan123/aanbiedingen-api.git
```

---

## Stap 2: Vercel Account aanmaken (als je die nog niet hebt)

1. Ga naar [vercel.com](https://vercel.com)
2. Klik op **"Sign Up"**
3. Kies **"Continue with GitHub"** (aanbevolen)
4. Autoriseer Vercel om toegang te krijgen tot je GitHub account
5. Volg de instructies om je account te voltooien

---

## Stap 3: Project importeren in Vercel

### 3.1. Nieuw project aanmaken

1. In je Vercel dashboard, klik op **"Add New..."** → **"Project"**
2. Je ziet een lijst met je GitHub repositories
3. Zoek en klik op je `aanbiedingen-api` repository
4. Klik op **"Import"**

### 3.2. Project configuratie

Vercel detecteert automatisch de instellingen uit `vercel.json`. Je ziet:

- **Framework Preset**: Automatisch gedetecteerd
- **Root Directory**: `./` (laat dit staan)
- **Build Command**: Leeg (dat is goed, we hebben geen build nodig)
- **Output Directory**: Leeg (dat is goed)

**Je hoeft hier niets te wijzigen!** Klik direct op **"Deploy"** (of ga eerst naar Environment Variables - zie Stap 4).

---

## Stap 4: Environment Variables instellen (OPTIONEEL)

**Belangrijk**: Voor allefolders.nl zijn environment variables **niet verplicht** omdat de API standaardwaarden heeft. Je kunt ze toevoegen als je wilt, of later aanpassen.

### Optie A: Voor de eerste deployment (aanbevolen)

1. **Voordat je op "Deploy" klikt**, scroll naar beneden naar **"Environment Variables"**
2. Klik op **"Add"** of **"Add New"**
3. Voeg eventueel toe (allemaal optioneel):

   **GRAPHQL_ENDPOINT** (optioneel - standaard is al `https://api.jafolders.com/graphql`):
   - Name: `GRAPHQL_ENDPOINT`
   - Value: `https://api.jafolders.com/graphql`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Klik op **"Save"**

   **JAFOLDERS_CONTEXT** (optioneel - standaard is al `allefolders;nl;web;1;1`):
   - Name: `JAFOLDERS_CONTEXT`
   - Value: `allefolders;nl;web;1;1`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Klik op **"Save"**

   **GRAPHQL_API_KEY** (alleen als je een API key hebt):
   - Name: `GRAPHQL_API_KEY`
   - Value: `jouw-api-key-hier`
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Klik op **"Save"**

4. Klik nu op **"Deploy"**

### Optie B: Na de eerste deployment

1. Klik eerst op **"Deploy"** (zonder environment variables)
2. Wacht tot de deployment klaar is
3. Ga naar je project dashboard
4. Klik op **"Settings"** (in de bovenste navigatie)
5. Klik op **"Environment Variables"** (in de linker sidebar)
6. Voeg de variabelen toe zoals hierboven beschreven
7. **Belangrijk**: Trigger een nieuwe deployment:
   - Ga naar **"Deployments"** tab
   - Klik op de drie puntjes (⋯) bij de laatste deployment
   - Klik op **"Redeploy"**

---

## Stap 5: Deployment volgen

1. Na het klikken op **"Deploy"** zie je een deployment scherm
2. Je ziet de voortgang in real-time:
   - "Building" → Vercel bereidt je project voor
   - "Deploying" → Code wordt gedeployed
   - "Ready" → ✅ Klaar!

3. Dit duurt meestal 1-2 minuten

---

## Stap 6: Je API URL vinden

1. Na een succesvolle deployment zie je: **"Congratulations! Your project has been deployed."**
2. Je ziet een URL zoals: `https://aanbiedingen-api-abc123.vercel.app`
3. **Kopieer deze URL** - dit is je API endpoint!

Je API is nu beschikbaar op:
```
https://jouw-project-naam.vercel.app/api/search-offers
```

---

## Stap 7: Test je API

### Test met browser (GET request)

Open in je browser:
```
https://jouw-project-naam.vercel.app/api/search-offers?searchTerm=koffie
```

Je zou een JSON response moeten zien met aanbiedingen.

### Test met Postman

1. Open Postman
2. Maak een nieuwe **GET** request
3. URL: `https://jouw-project-naam.vercel.app/api/search-offers?searchTerm=koffie`
4. Klik op **"Send"**

Of maak een **POST** request:
1. Method: **POST**
2. URL: `https://jouw-project-naam.vercel.app/api/search-offers`
3. Body → **raw** → **JSON**:
```json
{
  "searchTerm": "koffie"
}
```
4. Klik op **"Send"**

### Test met cURL (PowerShell)

```powershell
# GET request
curl "https://jouw-project-naam.vercel.app/api/search-offers?searchTerm=koffie"

# POST request
curl -X POST https://jouw-project-naam.vercel.app/api/search-offers `
  -H "Content-Type: application/json" `
  -d '{\"searchTerm\": \"koffie\"}'
```

---

## Stap 8: Automatische deployments instellen

### Standaard gedrag

Vercel is al geconfigureerd voor automatische deployments:

- ✅ **Push naar `main` branch** → Automatische production deployment
- ✅ **Pull Request** → Automatische preview deployment
- ✅ **Nieuwe commit** → Automatische redeploy

### Custom domain toevoegen (optioneel)

1. Ga naar je project → **Settings** → **Domains**
2. Voeg je eigen domein toe (bijv. `api.jouwdomein.nl`)
3. Volg de DNS instructies
4. Vercel configureert automatisch SSL certificaten

---

## 🎉 Klaar!

Je API is nu live en klaar voor gebruik met Google Assistant / Dialogflow!

### Je API endpoint:
```
https://jouw-project-naam.vercel.app/api/search-offers
```

### Voor Google Assistant / Dialogflow:

1. Ga naar je Dialogflow project
2. Open **Fulfillment**
3. Schakel **Webhook** in
4. Voer je Vercel URL in: `https://jouw-project-naam.vercel.app/api/search-offers`
5. In je Intent, voeg een parameter toe: `searchTerm`
6. Schakel **Enable webhook call for this intent** in

---

## 🆘 Troubleshooting

### Deployment faalt

**Probleem**: "Build failed" of "Deployment error"

**Oplossing**:
1. Check de deployment logs (klik op de failed deployment)
2. Kijk naar de error message
3. Meestal is het een syntax error in de code
4. Fix de error, commit en push opnieuw

### API retourneert 500 errors

**Probleem**: API werkt maar geeft errors terug

**Oplossing**:
1. Ga naar **Deployments** → Klik op deployment → **Functions** → Klik op functie → **Logs**
2. Check de error logs
3. Meestal is het een GraphQL endpoint probleem
4. Check of `GRAPHQL_ENDPOINT` correct is ingesteld

### API werkt niet met Google Assistant

**Probleem**: Dialogflow krijgt geen response

**Oplossing**:
1. Check of de URL correct is in Dialogflow
2. Test de API eerst met Postman
3. Check of de response format correct is (moet `fulfillmentText` bevatten)
4. Check Dialogflow logs voor meer details

### Environment variables werken niet

**Probleem**: Variables zijn toegevoegd maar werken niet

**Oplossing**:
1. **Belangrijk**: Na het toevoegen van variables moet je een nieuwe deployment triggeren!
2. Ga naar **Deployments** → ⋯ → **"Redeploy"**
3. Of push een nieuwe commit naar GitHub

---

## 📝 Handige links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub](https://github.com)
- [Postman](https://www.postman.com)

---

## 🔄 Updates maken

Wanneer je code aanpast:

1. Pas je code lokaal aan
2. Commit en push naar GitHub:
   ```powershell
   git add .
   git commit -m "Beschrijving van wijziging"
   git push
   ```
3. Vercel deployt automatisch binnen 1-2 minuten
4. Je nieuwe versie is live! 🚀

---

**Veel succes met je deployment!** 🎉

