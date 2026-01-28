# 🖼️ Aplikacija za evaluaciju kolorizacije slika

Ova aplikacija služi za subjektivnu evaluaciju kvalitete koloriziranih slika i usporedbu ljudske percepcije s objektivnim metrikama kvalitete slike. Razvijena je kao desktop/web hibridna aplikacija temeljena na React + Electron arhitekturi, uz Node.js backend i SQLite bazu podataka.

## 👥 Korisnici aplikacije

Aplikacija razlikuje dvije vrste korisnika:

### 👤 Ispitanici 
- sudjeluju u testiranju
- ocjenjuju prikazane kolorizirane slike
- ocjene se spremaju u bazu

### 🛠️ Administrator 
- ima pristup administracijskom sučelju
- može pregledavati rezultate testiranja
- ima uvid u prikupljene subjektivne ocjene

# 🖥️ Sučelja aplikacije

Aplikacija se sastoji od sljedećih zaslona:

## 1️⃣ Welcome screen
- uvodni zaslon
- kratko objašnjenje svrhe testiranja
- gumb za početak evaluacije

## 2️⃣ Instruction screen
- upute kako ocjenjivati slike
- objašnjenje skale ocjenjivanja
- kontrolirani uvjeti evaluacije

## 3️⃣ Evaluation screen
- prikaz slika (original / kolorizirane metode)
- korisnik daje ocjenu kvalitete
- ocjene se spremaju u bazu

## 4️⃣ Pause screen
- pauza između evaluacija
- sprječava umor korisnika

## 5️⃣ Summary screen
- završni zaslon
- potvrda uspješnog sudjelovanja u testiranju

## 6️⃣ Admin dashboard
- pregled rezultata i ocjena
- agregirani prikaz (MOS)
- priprema i izvoz podataka za daljnju analizu

# 🧱 Tehnologije
- Frontend: React + Chakra UI
- Backend: Node.js (Express)
- Baza: SQLite
- Desktop: Electron
- Upravljanje paketima: Yarn

# 🚀 Pokretanje aplikacije
## 1️⃣ Instalacija paketa
U root direktoriju projekta:
```
yarn install
```
## 2️⃣ Pokretanje aplikacije (frontend + backend + electron)
```
yarn dev
```

Ova naredba pokreće:
- React frontend
- Node.js backend
- Electron desktop aplikaciju

🌐 Lokalni portovi
Backend
```
http://localhost:3001
```

Frontend
```
http://localhost:3000
```

# 📁 Struktura projekta (sažeto)
```
react-electron/
├── backend/
│   ├── db/
│   ├── images/
│   └── server.js
├── electron/
│   └── main.js
├── frontend/
│   ├── public/
│   └── src/
├── package.json
└── README.md
```

## 📌 Napomena

Aplikacija je razvijena u svrhu akademskog projekta za istraživanje odnosa između objektivnih metrika kvalitete slike i subjektivne ljudske percepcije kod problema kolorizacije crno-bijelih slika.
