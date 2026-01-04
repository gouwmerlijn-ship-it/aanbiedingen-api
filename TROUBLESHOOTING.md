# Troubleshooting - 404 NOT_FOUND Error

## Probleem: "The page could not be found" / 404 NOT_FOUND

### Oplossing 1: Check je URL structuur

Voor Vercel serverless functies in de `api/` folder moet je URL zijn:

```
https://jouw-project.vercel.app/api/search-offers
```

**NIET**:
- ❌ `https://jouw-project.vercel.app/search-offers` (mist `/api/`)
- ❌ `https://jouw-project.vercel.app/api/` (incomplete)
- ❌ `https://jouw-project.vercel.app/api/search-offers.js` (geen .js extensie)

**WEL**:
- ✅ `https://jouw-project.vercel.app/api/search-offers`
- ✅ `https://jouw-project.vercel.app/api/search-offers?searchTerm=koffie`

### Oplossing 2: Check deployment status

1. Ga naar Vercel dashboard
2. Klik op je project
3. Check de "Deployments" tab
4. Zorg dat de laatste deployment **succesvol** is (groen vinkje)
5. Als deployment failed, klik erop en bekijk de logs

### Oplossing 3: Check functie naam

De bestandsnaam in `api/` folder bepaalt de route:

- Bestand: `api/search-offers.js`
- Route: `/api/search-offers`

Als je bestand `api/offers.js` heet, dan is de route `/api/offers`

### Oplossing 4: Redeploy na wijzigingen

Na het aanpassen van `vercel.json` of code:

1. Commit en push naar GitHub:
```powershell
git add .
git commit -m "Fix Vercel configuration"
git push
```

2. Of trigger handmatig in Vercel:
   - Ga naar Deployments
   - Klik op ⋯ bij laatste deployment
   - Klik op "Redeploy"

### Oplossing 5: Check Vercel logs

1. Ga naar Vercel dashboard → Je project
2. Klik op "Deployments"
3. Klik op de laatste deployment
4. Klik op "Functions"
5. Klik op `api/search-offers`
6. Bekijk "Logs" voor errors

### Oplossing 6: Test met verschillende URLs

Probeer deze URLs in Postman:

1. **Basis endpoint**:
   ```
   GET https://jouw-project.vercel.app/api/search-offers?searchTerm=koffie
   ```

2. **Met trailing slash** (sommige configuraties):
   ```
   GET https://jouw-project.vercel.app/api/search-offers/?searchTerm=koffie
   ```

3. **Check base URL eerst**:
   ```
   GET https://jouw-project.vercel.app
   ```
   (Dit zou ook 404 geven, maar bevestigt dat de domain werkt)

### Oplossing 7: Verifieer bestandsstructuur

Zorg dat je projectstructuur zo is:

```
aanbiedingen-api/
├── api/
│   └── search-offers.js    ← Dit bestand moet bestaan
├── package.json
├── vercel.json            ← Kan leeg zijn {}
└── README.md
```

### Oplossing 8: Check Vercel project settings

1. Ga naar Vercel dashboard → Je project → Settings
2. Check "General" → "Root Directory"
3. Moet leeg zijn of `./` (niet een subfolder)
4. Check "Build & Development Settings"
5. Framework Preset moet "Other" zijn of automatisch gedetecteerd

### Oplossing 9: Test lokaal (optioneel)

Als je Vercel CLI hebt geïnstalleerd:

```powershell
npm install -g vercel
cd C:\Users\merli\aanbiedingen-api
vercel dev
```

Dan test je op `http://localhost:3000/api/search-offers?searchTerm=koffie`

### Oplossing 10: Maak een test endpoint

Maak tijdelijk een simpel test bestand:

`api/test.js`:
```javascript
export default function handler(req, res) {
  res.json({ message: 'API werkt!', timestamp: new Date().toISOString() });
}
```

Test dan: `https://jouw-project.vercel.app/api/test`

Als dit werkt, dan is het probleem specifiek met `search-offers.js`

---

## Veelvoorkomende fouten

### Fout: "Cannot GET /api/search-offers"
- **Oorzaak**: Bestand bestaat niet of export is verkeerd
- **Oplossing**: Check of `export default` correct is

### Fout: "404 NOT_FOUND" met fra1:: prefix
- **Oorzaak**: Vercel kan de functie niet vinden
- **Oplossing**: Check deployment logs en bestandsstructuur

### Fout: Deployment succesvol maar API werkt niet
- **Oorzaak**: Cache of oude deployment
- **Oplossing**: Wacht 1-2 minuten of trigger nieuwe deployment

---

## Debug Checklist

- [ ] URL bevat `/api/search-offers` (niet alleen `/api/`)
- [ ] Deployment is succesvol (groen vinkje)
- [ ] Bestand `api/search-offers.js` bestaat
- [ ] Bestand heeft `export default async function handler`
- [ ] `vercel.json` is aanwezig (kan leeg zijn `{}`)
- [ ] `package.json` heeft correcte Node.js versie (24.x)
- [ ] Geen errors in Vercel logs
- [ ] Test met verschillende zoektermen
- [ ] Check of je de juiste Vercel project URL gebruikt

---

## Nog steeds problemen?

1. **Check Vercel Community**: [vercel.com/community](https://vercel.com/community)
2. **Vercel Support**: [vercel.com/support](https://vercel.com/support)
3. **GitHub Issues**: Check of er bekende issues zijn

---

**Belangrijk**: De meest voorkomende oorzaak is een verkeerde URL. Zorg dat je `/api/search-offers` gebruikt (met `/api/` prefix)!

