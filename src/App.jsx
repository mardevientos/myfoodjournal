import { useState, useEffect, useRef } from "react";

/* ─── PALETTE ORIGINALE (pulita, moderna) ───────────────────────
   Bianco puro, arancio terra cotta, verde oliva per toggle,
   testo scuro nitido. Font DM Sans — leggibile e amichevole.
──────────────────────────────────────────────────────────────── */
const C = {
  bg:      "#F9F6F1",
  card:    "#FFFFFF",
  accent:  "#E8521A",
  olive:   "#2D6A4F",
  text:    "#1A1A1A",
  muted:   "#7A7A7A",
  border:  "#EBEBEB",
  tag:     "#FFF0E8",
  tagText: "#E8521A",
  overlay: "rgba(26,26,26,0.55)",
  gold:    "#F59E0B",
};

/* ─── FOTO AUTO ─────────────────────────────────────────────── */
const PHOTO_MAP = {
  carbonara:"photo-1612874742237-6526221588e3", pasta:"photo-1551183053-bf91798d047f",
  tiramisù:"photo-1571877227200-a0d98ea607e9",  tiramisu:"photo-1571877227200-a0d98ea607e9",
  pizza:"photo-1574071318508-1cdbab80d002",      focaccia:"photo-1509722747041-616f39b57569",
  pane:"photo-1509440159596-0249088772ff",        bread:"photo-1509440159596-0249088772ff",
  insalata:"photo-1512621776951-a57141f2eefd",   salad:"photo-1512621776951-a57141f2eefd",
  bowl:"photo-1512621776951-a57141f2eefd",        sushi:"photo-1579871494447-9811cf80d66c",
  ramen:"photo-1569050467447-ce54b3bbc37d",       tacos:"photo-1565299585323-38d6b0865b47",
  burger:"photo-1568901346375-23c9450c58cd",      curry:"photo-1585937421612-70a008356fbe",
  hummus:"photo-1540914124281-342587941389",       falafel:"photo-1593001872095-7d5b3868fb1d",
  couscous:"photo-1517686469429-8bdb88b9f907",    tagine:"photo-1611489145836-93e7a00f00fe",
  moussaka:"photo-1600891964599-f61ba0e24092",    cheesecake:"photo-1533134242443-d4fd215305ad",
  torta:"photo-1578985545062-69928b1d9587",        cake:"photo-1578985545062-69928b1d9587",
  risotto:"photo-1476124369491-e7addf5db371",     lasagne:"photo-1574894709920-11b28e7367e3",
  zuppa:"photo-1547592166-23ac45744acd",           soup:"photo-1547592166-23ac45744acd",
  pollo:"photo-1604908176997-125f25cc6f3d",        chicken:"photo-1604908176997-125f25cc6f3d",
  pesce:"photo-1534482421-64566f976cfa",           salmon:"photo-1467003909585-2f8a72700288",
  default:"photo-1490645935967-10de6ba17061",
};
function getPhoto(title="", ings=[]){
  const txt=(title+" "+ings.join(" ")).toLowerCase();
  for(const [kw,id] of Object.entries(PHOTO_MAP)) if(txt.includes(kw)) return `https://images.unsplash.com/${id}?w=600&q=80`;
  return `https://images.unsplash.com/${PHOTO_MAP.default}?w=600&q=80`;
}

/* ─── COSTANTI ──────────────────────────────────────────────── */
const CUISINE_FLAG={
  "Italiana":"🇮🇹","Francese":"🇫🇷","Greca":"🇬🇷","Spagnola":"🇪🇸","Marocchina":"🇲🇦",
  "Libanese":"🇱🇧","Turca":"🇹🇷","Araba":"🌙","Mediorientale":"🌙","Indiana":"🇮🇳",
  "Cinese":"🇨🇳","Giapponese":"🇯🇵","Tailandese":"🇹🇭","Messicana":"🇲🇽","Americana":"🇺🇸",
  "Mediterranea":"🌊","Internazionale":"🌍","Italian":"🇮🇹","Greek":"🇬🇷","French":"🇫🇷",
  "Spanish":"🇪🇸","Moroccan":"🇲🇦","Japanese":"🇯🇵","Mediterranean":"🌊","International":"🌍",
};
const PLATFORMS={web:"🌐",instagram:"📸",tiktok:"🎵",pinterest:"📌",facebook:"👥",altro:"📋"};
const CATEGORIES=["Tutte","Primi","Secondi","Dolci","Antipasti","Pane & Pizza","Vegano","Bevande"];
const CUISINES=["","Italiana","Greca","Mediterranea","Francese","Spagnola","Marocchina","Araba",
  "Mediorientale","Libanese","Turca","Indiana","Giapponese","Cinese","Tailandese","Messicana","Americana","Internazionale"];

/* ─── TRADUZIONI ────────────────────────────────────────────── */
const LANGUAGES=[
  {code:"it",label:"Italiano",flag:"🇮🇹"},{code:"en",label:"English",flag:"🇬🇧"},
  {code:"es",label:"Español",flag:"🇪🇸"},{code:"fr",label:"Français",flag:"🇫🇷"},
  {code:"de",label:"Deutsch",flag:"🇩🇪"},{code:"ar",label:"العربية",flag:"🇸🇦",rtl:true},
];
const T={
  it:{ greeting:"Ciao, buona cucina! 👋", myRecipes:"🔒 Le mie ricette", sharedBook:"👥 Ricettario condiviso",
    importPlaceholder:"Incolla link da Instagram, TikTok, siti…", save:"Salva",
    search:"Cerca per nome, cucina, tag…", all:"Tutte", recipes:"ricette", recipe:"ricetta",
    newRecipe:"+ Nuova", cookMode:"🍳 Modalità cottura guidata", share:"↗️ Condividi",
    publish:"👥 Pubblica nel condiviso", delete:"🗑️ Elimina", addToCart:"+ Spesa",
    shoppingList:"Lista della Spesa", itemsToBuy:"articoli da comprare",
    emptyCart:"Lista vuota", emptyCartHint:"Apri una ricetta e aggiungi gli ingredienti",
    aiChef:"✨ AI Chef", aiSubtitle:"Il tuo sous-chef personale",
    aiPlaceholder:"Chiedimi qualcosa di culinario…", aiWelcome:"Ciao! Sono il tuo AI Chef",
    aiHint:"Chiedimi ricette, varianti, abbinamenti vini, info nutrizionali o qualsiasi consiglio!",
    aiSuggestions:["💡 Idee per cena veloce","🍷 Abbinamento vino","🥗 Versione light","🌱 Variante vegana","🍋 Sostituire un ingrediente"],
    ingredients:"🥕 Ingredienti", preparation:"👨‍🍳 Preparazione", notes:"📝 Note personali",
    yourRating:"Voto personale", nutrition:"Valori Nutrizionali",
    calories:"Calorie",protein:"Proteine",carbs:"Carbo",fat:"Grassi",
    time:"Tempo",servings:"Persone",difficulty:"Difficoltà",
    savedBadge:"Salvata nel Journal — disponibile anche se il post originale viene eliminato",
    sharedCount:"ricette pubblicate", installApp:"Installa My Food Journal",
    installHint:"Apparirà nel menu Condividi di Instagram, TikTok e tutti i social",
    installDone:"Perfetto, capito!", installAfter:"Apri un post → Condividi → My Food Journal → importata automaticamente!",
    iosTitle:"🍎 iPhone / iPad (Safari)", androidTitle:"🤖 Android (Chrome)",
    installStepsIos:[["1","Apri in Safari","🌐"],["2","Tocca il tasto Condividi","⬆️"],["3","Scegli 'Aggiungi a schermata Home'","➕"],["4","Tocca 'Aggiungi'","✅"]],
    installStepsAndroid:[["1","Apri in Chrome","🌐"],["2","Tocca i tre puntini ⋮","⋮"],["3","Tocca 'Aggiungi a schermata Home'","➕"],["4","Conferma con 'Aggiungi'","✅"]],
    cancelBtn:"Annulla", saveBtn:"💾 Salva nel Journal",
    titleField:"Titolo *",authorField:"Autore / Creator",sourceField:"Fonte (sito, blog…)",
    sourceUrlField:"URL originale",imageUrlField:"URL immagine (opzionale)",
    imageUpload:"📷 Carica foto dalla galleria",photoHint:"Tocca per cambiare foto",
    prepTimeField:"Tempo di preparazione",categoryField:"Categoria",difficultyField:"Difficoltà",
    cuisineField:"Cucina",tagsField:"Tag (separati da virgola)",tagsPlaceholder:"vegano, veloce, tradizionale",
    ingredientsField:"Ingredienti (uno per riga)",stepsField:"Preparazione (uno step per riga)",
    notesField:"Note personali",notesPlaceholder:"Consigli, trucchi, varianti…",
    checkAll:"✓ Tutti",clearList:"🗑️ Svuota",stepOf:"di",stepLabel:"Step",
    backBtn:"←",nextBtn:"Avanti →",finishBtn:"✅ Buon appetito!",prevBtn:"← Indietro",
    cookModeLabel:"Modalità cottura",published:"✅ Pubblicata nel ricettario condiviso!",
    deleted:"Ricetta eliminata",saved:"🎉 Ricetta salvata!",imported:"salvata nel Journal!",
    importError:"❌ Impossibile importare. Riprova.",titleRequired:"Inserisci almeno il titolo!",
    tapShare:"↗️ Condividi con un tocco",publishShared:"👥 Pubblica nel ricettario condiviso",
    selectCuisine:"Seleziona cucina…",copyClipboard:"📋 Copiata negli appunti!",
    sharedBy:"Condivisa da",navRecipes:"Ricette",navCart:"Spesa",navAdd:"Aggiungi",navAI:"AI Chef",
    difficulties:["Facile","Media","Difficile"],
    shareText:(r)=>`🍽️ ${r.title}\n${r.cuisine?(CUISINE_FLAG[r.cuisine]||"🌍")+" Cucina "+r.cuisine:""}${r.author?" · by "+r.author:""}\n⏱️ ${r.time} · 👥 ${r.servings} pers.\n\n📝 Ingredienti:\n${r.ingredients.join("\n")}\n\n👨‍🍳 Preparazione:\n${r.steps.map((s,i)=>(i+1)+". "+s.text).join("\n")}\n\n— My Food Journal ✨`,
  },
  en:{ greeting:"Hello, happy cooking! 👋", myRecipes:"🔒 My Recipes", sharedBook:"👥 Shared Cookbook",
    importPlaceholder:"Paste link from Instagram, TikTok, websites…", save:"Save",
    search:"Search by name, cuisine, tag…", all:"All", recipes:"recipes", recipe:"recipe",
    newRecipe:"+ New", cookMode:"🍳 Guided Cooking Mode", share:"↗️ Share",
    publish:"👥 Publish to shared", delete:"🗑️ Delete", addToCart:"+ Cart",
    shoppingList:"Shopping List", itemsToBuy:"items to buy",
    emptyCart:"Empty list", emptyCartHint:"Open a recipe and add ingredients",
    aiChef:"✨ AI Chef", aiSubtitle:"Your personal sous-chef",
    aiPlaceholder:"Ask me anything culinary…", aiWelcome:"Hi! I'm your AI Chef",
    aiHint:"Ask me for recipes, variations, wine pairings, nutrition info or any cooking advice!",
    aiSuggestions:["💡 Quick dinner ideas","🍷 Wine pairing","🥗 Light version","🌱 Vegan variant","🍋 Substitute an ingredient"],
    ingredients:"🥕 Ingredients", preparation:"👨‍🍳 Instructions", notes:"📝 Personal notes",
    yourRating:"Your rating", nutrition:"Nutritional Values",
    calories:"Calories",protein:"Protein",carbs:"Carbs",fat:"Fat",
    time:"Time",servings:"Servings",difficulty:"Difficulty",
    savedBadge:"Saved in your Journal — available even if the original post is deleted",
    sharedCount:"published recipes", installApp:"Install My Food Journal",
    installHint:"It will appear in the Share menu of Instagram, TikTok and all social media",
    installDone:"Got it!", installAfter:"Open a post → Share → My Food Journal → imported automatically!",
    iosTitle:"🍎 iPhone / iPad (Safari)", androidTitle:"🤖 Android (Chrome)",
    installStepsIos:[["1","Open in Safari","🌐"],["2","Tap the Share button","⬆️"],["3","Choose 'Add to Home Screen'","➕"],["4","Tap 'Add'","✅"]],
    installStepsAndroid:[["1","Open in Chrome","🌐"],["2","Tap the three dots ⋮","⋮"],["3","Tap 'Add to Home Screen'","➕"],["4","Confirm with 'Add'","✅"]],
    cancelBtn:"Cancel", saveBtn:"💾 Save to Journal",
    titleField:"Title *",authorField:"Author / Creator",sourceField:"Source (website, blog…)",
    sourceUrlField:"Original URL",imageUrlField:"Image URL (optional)",
    imageUpload:"📷 Choose from gallery",photoHint:"Tap to change photo",
    prepTimeField:"Preparation time",categoryField:"Category",difficultyField:"Difficulty",
    cuisineField:"Cuisine",tagsField:"Tags (comma separated)",tagsPlaceholder:"vegan, quick, traditional",
    ingredientsField:"Ingredients (one per line)",stepsField:"Instructions (one step per line)",
    notesField:"Personal notes",notesPlaceholder:"Tips, tricks, variations…",
    checkAll:"✓ All",clearList:"🗑️ Clear",stepOf:"of",stepLabel:"Step",
    backBtn:"←",nextBtn:"Next →",finishBtn:"✅ Enjoy your meal!",prevBtn:"← Back",
    cookModeLabel:"Cooking mode",published:"✅ Published to shared cookbook!",
    deleted:"Recipe deleted",saved:"🎉 Recipe saved!",imported:"saved to Journal!",
    importError:"❌ Cannot import. Try again.",titleRequired:"Please enter at least a title!",
    tapShare:"↗️ Share with one tap",publishShared:"👥 Publish to shared cookbook",
    selectCuisine:"Select cuisine…",copyClipboard:"📋 Copied to clipboard!",
    sharedBy:"Shared by",navRecipes:"Recipes",navCart:"Cart",navAdd:"Add",navAI:"AI Chef",
    difficulties:["Easy","Medium","Hard"],
    shareText:(r)=>`🍽️ ${r.title}\n${r.cuisine?(CUISINE_FLAG[r.cuisine]||"🌍")+" "+r.cuisine+" cuisine":""}${r.author?" · by "+r.author:""}\n⏱️ ${r.time} · 👥 ${r.servings} servings\n\n📝 Ingredients:\n${r.ingredients.join("\n")}\n\n👨\u200d🍳 Instructions:\n${r.steps.map((s,i)=>(i+1)+". "+s.text).join("\n")}\n\n— My Food Journal ✨`,
  },
  es:{ greeting:"¡Hola, buen provecho! 👋", myRecipes:"🔒 Mis recetas", sharedBook:"👥 Recetario compartido",
    importPlaceholder:"Pega un enlace de Instagram, TikTok, webs…", save:"Guardar",
    search:"Buscar por nombre, cocina, etiqueta…", all:"Todas", recipes:"recetas", recipe:"receta",
    newRecipe:"+ Nueva", cookMode:"🍳 Modo cocina guiado", share:"↗️ Compartir",
    publish:"👥 Publicar en compartido", delete:"🗑️ Eliminar", addToCart:"+ Lista",
    shoppingList:"Lista de la Compra", itemsToBuy:"artículos por comprar",
    emptyCart:"Lista vacía", emptyCartHint:"Abre una receta y añade ingredientes",
    aiChef:"✨ AI Chef", aiSubtitle:"Tu sous-chef personal",
    aiPlaceholder:"Pregúntame algo culinario…", aiWelcome:"¡Hola! Soy tu AI Chef",
    aiHint:"¡Pídeme recetas, variantes, maridajes, info nutricional o cualquier consejo!",
    aiSuggestions:["💡 Ideas para cena rápida","🍷 Maridaje de vino","🥗 Versión ligera","🌱 Variante vegana","🍋 Sustituir ingrediente"],
    ingredients:"🥕 Ingredientes", preparation:"👨‍🍳 Preparación", notes:"📝 Notas personales",
    yourRating:"Tu valoración", nutrition:"Valores Nutricionales",
    calories:"Calorías",protein:"Proteínas",carbs:"Carbos",fat:"Grasas",
    time:"Tiempo",servings:"Personas",difficulty:"Dificultad",
    savedBadge:"Guardada en tu Journal — disponible aunque se elimine el post original",
    sharedCount:"recetas publicadas", installApp:"Instala My Food Journal",
    installHint:"Aparecerá en el menú Compartir de Instagram, TikTok y todas las redes sociales",
    installDone:"¡Perfecto, entendido!", installAfter:"¡Abre un post → Compartir → My Food Journal → importada automáticamente!",
    iosTitle:"🍎 iPhone / iPad (Safari)", androidTitle:"🤖 Android (Chrome)",
    installStepsIos:[["1","Abre en Safari","🌐"],["2","Toca el botón Compartir","⬆️"],["3","Elige 'Añadir a pantalla de inicio'","➕"],["4","Toca 'Añadir'","✅"]],
    installStepsAndroid:[["1","Abre en Chrome","🌐"],["2","Toca los tres puntos ⋮","⋮"],["3","Toca 'Añadir a pantalla de inicio'","➕"],["4","Confirma con 'Añadir'","✅"]],
    cancelBtn:"Cancelar", saveBtn:"💾 Guardar en Journal",
    titleField:"Título *",authorField:"Autor / Creator",sourceField:"Fuente (web, blog…)",
    sourceUrlField:"URL original",imageUrlField:"URL imagen (opcional)",
    imageUpload:"📷 Elegir de la galería",photoHint:"Toca para cambiar la foto",
    prepTimeField:"Tiempo de preparación",categoryField:"Categoría",difficultyField:"Dificultad",
    cuisineField:"Cocina",tagsField:"Etiquetas (separadas por coma)",tagsPlaceholder:"vegano, rápido, tradicional",
    ingredientsField:"Ingredientes (uno por línea)",stepsField:"Preparación (un paso por línea)",
    notesField:"Notas personales",notesPlaceholder:"Consejos, trucos, variantes…",
    checkAll:"✓ Todos",clearList:"🗑️ Vaciar",stepOf:"de",stepLabel:"Paso",
    backBtn:"←",nextBtn:"Siguiente →",finishBtn:"✅ ¡Buen provecho!",prevBtn:"← Atrás",
    cookModeLabel:"Modo cocina",published:"✅ ¡Publicada en el recetario compartido!",
    deleted:"Receta eliminada",saved:"🎉 ¡Receta guardada!",imported:"¡guardada en el Journal!",
    importError:"❌ No se puede importar. Inténtalo de nuevo.",titleRequired:"¡Introduce al menos un título!",
    tapShare:"↗️ Compartir con un toque",publishShared:"👥 Publicar en recetario compartido",
    selectCuisine:"Selecciona cocina…",copyClipboard:"📋 ¡Copiada al portapapeles!",
    sharedBy:"Compartida por",navRecipes:"Recetas",navCart:"Compra",navAdd:"Añadir",navAI:"AI Chef",
    difficulties:["Fácil","Media","Difícil"],
    shareText:(r)=>`🍽️ ${r.title}\n${r.cuisine?(CUISINE_FLAG[r.cuisine]||"🌍")+" Cocina "+r.cuisine:""}${r.author?" · de "+r.author:""}\n⏱️ ${r.time} · 👥 ${r.servings} personas\n\n📝 Ingredientes:\n${r.ingredients.join("\n")}\n\n👨\u200d🍳 Preparación:\n${r.steps.map((s,i)=>(i+1)+". "+s.text).join("\n")}\n\n— My Food Journal ✨`,
  },
  fr:{ greeting:"Bonjour, bonne cuisine ! 👋", myRecipes:"🔒 Mes recettes", sharedBook:"👥 Livre partagé",
    importPlaceholder:"Collez un lien Instagram, TikTok, site web…", save:"Enregistrer",
    search:"Chercher par nom, cuisine, tag…", all:"Toutes", recipes:"recettes", recipe:"recette",
    newRecipe:"+ Nouvelle", cookMode:"🍳 Mode cuisine guidé", share:"↗️ Partager",
    publish:"👥 Publier dans le partagé", delete:"🗑️ Supprimer", addToCart:"+ Liste",
    shoppingList:"Liste de Courses", itemsToBuy:"articles à acheter",
    emptyCart:"Liste vide", emptyCartHint:"Ouvrez une recette et ajoutez des ingrédients",
    aiChef:"✨ AI Chef", aiSubtitle:"Votre sous-chef personnel",
    aiPlaceholder:"Posez-moi une question culinaire…", aiWelcome:"Bonjour ! Je suis votre AI Chef",
    aiHint:"Demandez-moi des recettes, variantes, accords vins, infos nutritionnelles ou tout conseil !",
    aiSuggestions:["💡 Idées dîner rapide","🍷 Accord mets-vins","🥗 Version légère","🌱 Variante vegan","🍋 Remplacer un ingrédient"],
    ingredients:"🥕 Ingrédients", preparation:"👨‍🍳 Préparation", notes:"📝 Notes personnelles",
    yourRating:"Votre note", nutrition:"Valeurs Nutritionnelles",
    calories:"Calories",protein:"Protéines",carbs:"Glucides",fat:"Lipides",
    time:"Temps",servings:"Personnes",difficulty:"Difficulté",
    savedBadge:"Enregistrée dans votre Journal — disponible même si le post original est supprimé",
    sharedCount:"recettes publiées", installApp:"Installer My Food Journal",
    installHint:"Apparaîtra dans le menu Partager d'Instagram, TikTok et tous les réseaux",
    installDone:"Parfait, compris !", installAfter:"Ouvrez un post → Partager → My Food Journal → importée automatiquement !",
    iosTitle:"🍎 iPhone / iPad (Safari)", androidTitle:"🤖 Android (Chrome)",
    installStepsIos:[["1","Ouvrez dans Safari","🌐"],["2","Touchez le bouton Partager","⬆️"],["3","Choisissez 'Sur l'écran d'accueil'","➕"],["4","Touchez 'Ajouter'","✅"]],
    installStepsAndroid:[["1","Ouvrez dans Chrome","🌐"],["2","Touchez les trois points ⋮","⋮"],["3","Touchez 'Ajouter à l'écran d'accueil'","➕"],["4","Confirmez avec 'Ajouter'","✅"]],
    cancelBtn:"Annuler", saveBtn:"💾 Sauvegarder dans Journal",
    titleField:"Titre *",authorField:"Auteur / Créateur",sourceField:"Source (site, blog…)",
    sourceUrlField:"URL original",imageUrlField:"URL image (optionnel)",
    imageUpload:"📷 Choisir dans la galerie",photoHint:"Touchez pour changer la photo",
    prepTimeField:"Temps de préparation",categoryField:"Catégorie",difficultyField:"Difficulté",
    cuisineField:"Cuisine",tagsField:"Tags (séparés par virgule)",tagsPlaceholder:"vegan, rapide, traditionnel",
    ingredientsField:"Ingrédients (un par ligne)",stepsField:"Préparation (une étape par ligne)",
    notesField:"Notes personnelles",notesPlaceholder:"Conseils, astuces, variantes…",
    checkAll:"✓ Tous",clearList:"🗑️ Vider",stepOf:"sur",stepLabel:"Étape",
    backBtn:"←",nextBtn:"Suivant →",finishBtn:"✅ Bon appétit !",prevBtn:"← Retour",
    cookModeLabel:"Mode cuisine",published:"✅ Publiée dans le livre partagé !",
    deleted:"Recette supprimée",saved:"🎉 Recette sauvegardée !",imported:"sauvegardée dans le Journal !",
    importError:"❌ Impossible d'importer. Réessayez.",titleRequired:"Entrez au moins un titre !",
    tapShare:"↗️ Partager en un toucher",publishShared:"👥 Publier dans le livre partagé",
    selectCuisine:"Sélectionnez une cuisine…",copyClipboard:"📋 Copié dans le presse-papiers !",
    sharedBy:"Partagée par",navRecipes:"Recettes",navCart:"Courses",navAdd:"Ajouter",navAI:"AI Chef",
    difficulties:["Facile","Moyen","Difficile"],
    shareText:(r)=>`🍽️ ${r.title}\n${r.cuisine?(CUISINE_FLAG[r.cuisine]||"🌍")+" Cuisine "+r.cuisine:""}${r.author?" · par "+r.author:""}\n⏱️ ${r.time} · 👥 ${r.servings} pers.\n\n📝 Ingrédients :\n${r.ingredients.join("\n")}\n\n👨\u200d🍳 Préparation :\n${r.steps.map((s,i)=>(i+1)+". "+s.text).join("\n")}\n\n— My Food Journal ✨`,
  },
  de:{ greeting:"Hallo, gutes Kochen! 👋", myRecipes:"🔒 Meine Rezepte", sharedBook:"👥 Gemeinsames Kochbuch",
    importPlaceholder:"Link von Instagram, TikTok, Websites einfügen…", save:"Speichern",
    search:"Nach Name, Küche, Tag suchen…", all:"Alle", recipes:"Rezepte", recipe:"Rezept",
    newRecipe:"+ Neu", cookMode:"🍳 Geführter Kochmodus", share:"↗️ Teilen",
    publish:"👥 Im Gemeinsamen veröffentlichen", delete:"🗑️ Löschen", addToCart:"+ Einkauf",
    shoppingList:"Einkaufsliste", itemsToBuy:"Artikel zu kaufen",
    emptyCart:"Leere Liste", emptyCartHint:"Öffne ein Rezept und füge Zutaten hinzu",
    aiChef:"✨ AI Koch", aiSubtitle:"Dein persönlicher Sous-Chef",
    aiPlaceholder:"Frag mich etwas Kulinarisches…", aiWelcome:"Hallo! Ich bin dein AI Koch",
    aiHint:"Frag mich nach Rezepten, Varianten, Weinempfehlungen, Nährwerten oder Kochtipps!",
    aiSuggestions:["💡 Schnelle Abendessen-Ideen","🍷 Weinempfehlung","🥗 Light-Version","🌱 Vegane Variante","🍋 Zutat ersetzen"],
    ingredients:"🥕 Zutaten", preparation:"👨‍🍳 Zubereitung", notes:"📝 Persönliche Notizen",
    yourRating:"Deine Bewertung", nutrition:"Nährwerte",
    calories:"Kalorien",protein:"Eiweiß",carbs:"Kohlenhydrate",fat:"Fett",
    time:"Zeit",servings:"Personen",difficulty:"Schwierigkeit",
    savedBadge:"Im Journal gespeichert — verfügbar auch wenn der Original-Post gelöscht wird",
    sharedCount:"veröffentlichte Rezepte", installApp:"My Food Journal installieren",
    installHint:"Erscheint im Teilen-Menü von Instagram, TikTok und allen sozialen Netzwerken",
    installDone:"Perfekt, verstanden!", installAfter:"Beitrag öffnen → Teilen → My Food Journal → automatisch importiert!",
    iosTitle:"🍎 iPhone / iPad (Safari)", androidTitle:"🤖 Android (Chrome)",
    installStepsIos:[["1","In Safari öffnen","🌐"],["2","Teilen-Schaltfläche tippen","⬆️"],["3","'Zum Home-Bildschirm' wählen","➕"],["4","'Hinzufügen' tippen","✅"]],
    installStepsAndroid:[["1","In Chrome öffnen","🌐"],["2","Drei Punkte ⋮ tippen","⋮"],["3","'Zum Startbildschirm hinzufügen' tippen","➕"],["4","Mit 'Hinzufügen' bestätigen","✅"]],
    cancelBtn:"Abbrechen", saveBtn:"💾 Im Journal speichern",
    titleField:"Titel *",authorField:"Autor / Creator",sourceField:"Quelle (Website, Blog…)",
    sourceUrlField:"Original-URL",imageUrlField:"Bild-URL (optional)",
    imageUpload:"📷 Aus Galerie auswählen",photoHint:"Tippe um das Foto zu ändern",
    prepTimeField:"Zubereitungszeit",categoryField:"Kategorie",difficultyField:"Schwierigkeit",
    cuisineField:"Küche",tagsField:"Tags (durch Komma getrennt)",tagsPlaceholder:"vegan, schnell, traditionell",
    ingredientsField:"Zutaten (eine pro Zeile)",stepsField:"Zubereitung (ein Schritt pro Zeile)",
    notesField:"Persönliche Notizen",notesPlaceholder:"Tipps, Tricks, Varianten…",
    checkAll:"✓ Alle",clearList:"🗑️ Leeren",stepOf:"von",stepLabel:"Schritt",
    backBtn:"←",nextBtn:"Weiter →",finishBtn:"✅ Guten Appetit!",prevBtn:"← Zurück",
    cookModeLabel:"Kochmodus",published:"✅ Im gemeinsamen Kochbuch veröffentlicht!",
    deleted:"Rezept gelöscht",saved:"🎉 Rezept gespeichert!",imported:"im Journal gespeichert!",
    importError:"❌ Import nicht möglich. Erneut versuchen.",titleRequired:"Bitte mindestens einen Titel eingeben!",
    tapShare:"↗️ Mit einem Tippen teilen",publishShared:"👥 Im gemeinsamen Kochbuch veröffentlichen",
    selectCuisine:"Küche auswählen…",copyClipboard:"📋 In die Zwischenablage kopiert!",
    sharedBy:"Geteilt von",navRecipes:"Rezepte",navCart:"Einkauf",navAdd:"Hinzufügen",navAI:"AI Koch",
    difficulties:["Einfach","Mittel","Schwer"],
    shareText:(r)=>`🍽️ ${r.title}\n${r.cuisine?(CUISINE_FLAG[r.cuisine]||"🌍")+" Küche: "+r.cuisine:""}${r.author?" · von "+r.author:""}\n⏱️ ${r.time} · 👥 ${r.servings} Pers.\n\n📝 Zutaten:\n${r.ingredients.join("\n")}\n\n👨\u200d🍳 Zubereitung:\n${r.steps.map((s,i)=>(i+1)+". "+s.text).join("\n")}\n\n— My Food Journal ✨`,
  },
  ar:{ greeting:"مرحباً، طبخاً ممتازاً! 👋", myRecipes:"🔒 وصفاتي", sharedBook:"👥 كتاب الوصفات المشترك",
    importPlaceholder:"الصق رابطاً من إنستغرام أو تيك توك أو المواقع…", save:"حفظ",
    search:"ابحث بالاسم أو المطبخ أو الوسم…", all:"الكل", recipes:"وصفات", recipe:"وصفة",
    newRecipe:"+ جديدة", cookMode:"🍳 وضع الطهي التفاعلي", share:"↗️ مشاركة",
    publish:"👥 نشر في المشترك", delete:"🗑️ حذف", addToCart:"+ قائمة",
    shoppingList:"قائمة التسوق", itemsToBuy:"عناصر للشراء",
    emptyCart:"القائمة فارغة", emptyCartHint:"افتح وصفة وأضف المكونات",
    aiChef:"✨ طاهي AI", aiSubtitle:"مساعدك الطاهي الشخصي",
    aiPlaceholder:"اسألني أي شيء يتعلق بالطهي…", aiWelcome:"مرحباً! أنا طاهي الذكاء الاصطناعي",
    aiHint:"اسألني عن الوصفات والتنويعات وتوافق النبيذ والقيم الغذائية وأي نصيحة طهي!",
    aiSuggestions:["💡 أفكار عشاء سريع","🍷 توافق النبيذ","🥗 نسخة خفيفة","🌱 نسخة نباتية","🍋 استبدال مكون"],
    ingredients:"🥕 المكونات", preparation:"👨‍🍳 طريقة التحضير", notes:"📝 ملاحظات شخصية",
    yourRating:"تقييمك", nutrition:"القيم الغذائية",
    calories:"سعرات",protein:"بروتين",carbs:"كربوهيدرات",fat:"دهون",
    time:"الوقت",servings:"أشخاص",difficulty:"الصعوبة",
    savedBadge:"محفوظة في مجلتك — متاحة حتى لو حُذف المنشور الأصلي",
    sharedCount:"وصفات منشورة", installApp:"تثبيت My Food Journal",
    installHint:"ستظهر في قائمة المشاركة في إنستغرام وتيك توك وجميع وسائل التواصل",
    installDone:"ممتاز، فهمت!", installAfter:"افتح منشوراً → مشاركة → My Food Journal → تُستورد تلقائياً!",
    iosTitle:"🍎 iPhone / iPad (Safari)", androidTitle:"🤖 Android (Chrome)",
    installStepsIos:[["1","افتح في سافاري","🌐"],["2","اضغط زر المشاركة","⬆️"],["3","اختر 'إضافة إلى الشاشة الرئيسية'","➕"],["4","اضغط 'إضافة'","✅"]],
    installStepsAndroid:[["1","افتح في كروم","🌐"],["2","اضغط النقاط الثلاث ⋮","⋮"],["3","اضغط 'إضافة إلى الشاشة الرئيسية'","➕"],["4","أكد بالضغط على 'إضافة'","✅"]],
    cancelBtn:"إلغاء", saveBtn:"💾 حفظ في المجلة",
    titleField:"العنوان *",authorField:"المؤلف / المنشئ",sourceField:"المصدر (موقع، مدونة…)",
    sourceUrlField:"الرابط الأصلي",imageUrlField:"رابط الصورة (اختياري)",
    imageUpload:"📷 اختر من المعرض",photoHint:"اضغط لتغيير الصورة",
    prepTimeField:"وقت التحضير",categoryField:"الفئة",difficultyField:"الصعوبة",
    cuisineField:"المطبخ",tagsField:"الوسوم (مفصولة بفاصلة)",tagsPlaceholder:"نباتي، سريع، تقليدي",
    ingredientsField:"المكونات (واحد في كل سطر)",stepsField:"التحضير (خطوة في كل سطر)",
    notesField:"ملاحظات شخصية",notesPlaceholder:"نصائح وحيل وتنويعات…",
    checkAll:"✓ الكل",clearList:"🗑️ مسح",stepOf:"من",stepLabel:"خطوة",
    backBtn:"→",nextBtn:"← التالي",finishBtn:"✅ بالهناء والشفاء!",prevBtn:"→ السابق",
    cookModeLabel:"وضع الطهي",published:"✅ منشورة في كتاب الوصفات المشترك!",
    deleted:"تم حذف الوصفة",saved:"🎉 تم حفظ الوصفة!",imported:"محفوظة في المجلة!",
    importError:"❌ تعذّر الاستيراد. حاول مرة أخرى.",titleRequired:"أدخل على الأقل عنواناً!",
    tapShare:"↗️ مشاركة بنقرة واحدة",publishShared:"👥 نشر في كتاب الوصفات المشترك",
    selectCuisine:"اختر المطبخ…",copyClipboard:"📋 تم النسخ إلى الحافظة!",
    sharedBy:"شاركها",navRecipes:"الوصفات",navCart:"التسوق",navAdd:"إضافة",navAI:"طاهي AI",
    difficulties:["سهل","متوسط","صعب"],
    shareText:(r)=>`🍽️ ${r.title}\n${r.cuisine?(CUISINE_FLAG[r.cuisine]||"🌍")+" مطبخ "+r.cuisine:""}${r.author?" · بقلم "+r.author:""}\n⏱️ ${r.time} · 👥 ${r.servings} أشخاص\n\n📝 المكونات:\n${r.ingredients.join("\n")}\n\n👨\u200d🍳 التحضير:\n${r.steps.map((s,i)=>(i+1)+". "+s.text).join("\n")}\n\n— My Food Journal ✨`,
  },
};

/* ─── DEMO DATA ─────────────────────────────────────────────── */
const DEMO=[
  {id:1,title:"Pasta alla Carbonara",category:"Primi",source:"GialloZafferano",sourceUrl:"https://giallozafferano.it",platform:"web",author:"GialloZafferano",cuisine:"Italiana",image:"https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600&q=80",tags:["tradizionale","veloce","facile"],servings:2,time:"20 min",difficulty:"Facile",ingredients:["200 g spaghetti","100 g guanciale","2 tuorli + 1 uovo","60 g pecorino","Pepe nero"],steps:[{title:"Pasta",text:"Cuoci gli spaghetti in acqua salata al dente."},{title:"Guanciale",text:"Rosola il guanciale a listarelle fino a renderlo croccante."},{title:"Crema",text:"Sbatti uova e pecorino con pepe nero abbondante."},{title:"Manteca",text:"Unisci pasta e guanciale fuori dal fuoco, manteca con la crema."}],nutrition:{kcal:520,proteine:22,carbo:58,grassi:21},rating:5,saved:true,notes:"Acqua di cottura amidacea è fondamentale.",date:"2025-03-01",shared:false},
  {id:2,title:"Insalata Greca",category:"Antipasti",source:"TikTok",sourceUrl:"https://tiktok.com",platform:"tiktok",author:"@MalenaG",cuisine:"Greca",image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",tags:["vegano","facile","light"],servings:2,time:"10 min",difficulty:"Facile",ingredients:["2 pomodori","1 cetriolo","½ cipolla rossa","100 g feta","Olive Kalamata","Origano","Olio EVO"],steps:[{title:"Taglia",text:"Taglia pomodori, cetriolo e cipolla."},{title:"Assembla",text:"Disponi tutto con olive e feta intera."},{title:"Condisci",text:"Olio EVO, origano e sale."}],nutrition:{kcal:210,proteine:8,carbo:12,grassi:15},rating:5,saved:true,notes:"La feta va messa a pezzo intero sopra!",date:"2025-03-10",shared:false},
  {id:3,title:"Tiramisù Classico",category:"Dolci",source:"Instagram",sourceUrl:"https://instagram.com",platform:"instagram",author:"@cucina_italiana",cuisine:"Italiana",image:"https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",tags:["dolce","tradizionale"],servings:6,time:"40 min (+4h)",difficulty:"Media",ingredients:["300 g mascarpone","3 uova","80 g zucchero","200 g savoiardi","300 ml caffè","Cacao"],steps:[{title:"Zabaione",text:"Monta tuorli e zucchero."},{title:"Mascarpone",text:"Incorpora il mascarpone."},{title:"Albumi",text:"Aggiungi albumi montati a neve."},{title:"Strati",text:"Alterna savoiardi inzuppati e crema."},{title:"Riposo",text:"Lascia 4 ore in frigo, poi cospargilo di cacao."}],nutrition:{kcal:380,proteine:9,carbo:38,grassi:21},rating:5,saved:true,notes:"Il giorno dopo è ancora più buono!",date:"2025-02-20",shared:false},
  {id:4,title:"Focaccia Genovese",category:"Pane & Pizza",source:"Pinterest",sourceUrl:"https://pinterest.com",platform:"pinterest",author:"@dolcevita_kitchen",cuisine:"Italiana",image:"https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&q=80",tags:["tradizionale","forno","vegano"],servings:8,time:"3h",difficulty:"Media",ingredients:["500 g farina 0","350 ml acqua tiepida","7 g lievito secco","10 g sale","80 ml olio EVO","Salamoia"],steps:[{title:"Impasto",text:"Sciogli lievito nell'acqua, aggiungi farina e sale. Impasta 10 min."},{title:"Lievitazione",text:"Copri e lascia lievitare 2 ore."},{title:"Stesura",text:"Stendi in teglia oliata, fai i buchi con le dita."},{title:"Salamoia",text:"Versa la salamoia e lascia riposare 30 min."},{title:"Cottura",text:"Cuoci a 220°C per 20-25 minuti."}],nutrition:{kcal:280,proteine:7,carbo:44,grassi:9},rating:5,saved:true,notes:"Acqua a 30°C, non bollente!",date:"2025-01-15",shared:false},
];

/* ─── COMPONENTI UI ─────────────────────────────────────────── */
function Stars({n,onSet}){
  return [1,2,3,4,5].map(i=>(
    <span key={i} onClick={()=>onSet&&onSet(i)}
      style={{fontSize:16,cursor:onSet?"pointer":"default",color:i<=n?C.gold:"#D0D0D0",marginRight:1}}>★</span>
  ));
}
function NutriBadge({label,val,unit,color}){
  return(
    <div style={{background:C.bg,borderRadius:12,padding:"10px 12px",textAlign:"center",flex:1}}>
      <div style={{fontSize:17,fontWeight:700,color:color||C.accent}}>{val}</div>
      <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:0.6}}>{unit}</div>
      <div style={{fontSize:11,color:C.text,marginTop:2}}>{label}</div>
    </div>
  );
}
function Spinner({white}){
  return <span style={{width:14,height:14,border:`2px solid ${white?"rgba(255,255,255,.35)":"#E0D9D0"}`,borderTopColor:white?"#fff":C.accent,borderRadius:"50%",display:"inline-block",animation:"spin .7s linear infinite"}}/>;
}
function Btn({onClick,bg,color,children,style={},disabled}){
  return(
    <button onClick={onClick} disabled={disabled}
      style={{background:bg||C.accent,color:color||"#fff",border:"none",borderRadius:14,padding:"13px 16px",
        fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
        display:"flex",alignItems:"center",justifyContent:"center",gap:8,...style}}>
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   APP
════════════════════════════════════════════════════════════ */
export default function MyFoodJournal(){
  const [lang,          setLang]          = useState(()=>{ try{ const s=localStorage.getItem("mfj:lang"); return s&&T[s]?s:"it"; }catch{ return "it"; }});
  const t = T[lang]||T.it;
  const isRTL = LANGUAGES.find(l=>l.code===lang)?.rtl||false;

  const [recipes,       setRecipes]       = useState([]);
  const [storageReady,  setStorageReady]  = useState(false);
  const [tab,           setTab]           = useState("home");
  const [selected,      setSelected]      = useState(null);
  const [cookStep,      setCookStep]      = useState(0);
  const [category,      setCategory]      = useState("Tutte");
  const [search,        setSearch]        = useState("");
  const [shopping,      setShopping]      = useState([]);
  const [toast,         setToast]         = useState(null);
  const [aiChat,        setAiChat]        = useState([]);
  const [aiInput,       setAiInput]       = useState("");
  const [aiLoading,     setAiLoading]     = useState(false);
  const [importUrl,     setImportUrl]     = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [nr,            setNr]            = useState(blank());
  const [shareModal,    setShareModal]    = useState(null);
  const [showInstall,   setShowInstall]   = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled,   setIsInstalled]   = useState(false);
  const [sharedMode,    setSharedMode]    = useState(false);
  const [sharedRecipes, setSharedRecipes] = useState([]);
  const [sharedLoading, setSharedLoading] = useState(false);
  const [showLangMenu,  setShowLangMenu]  = useState(false);
  const chatEndRef  = useRef(null);
  const photoNewRef = useRef(null);
  const photoEditRef= useRef(null);

  function blank(){ return {title:"",category:"Primi",cuisine:"",author:"",source:"",sourceUrl:"",platform:"web",image:"",tags:"",servings:2,time:"",difficulty:"Facile",ingredientsRaw:"",stepsRaw:"",notes:""}; }

  /* ── Storage con localStorage (funziona ovunque) ── */
  const storage = {
    get: (key) => { try{ const v=localStorage.getItem(key); return v?{value:v}:null; }catch{ return null; } },
    set: (key, val) => { try{ localStorage.setItem(key, val); }catch{} },
  };

  useEffect(()=>{
    try{
      const r=storage.get("mfj:recipes");
      const s=storage.get("mfj:shopping");
      const sh=storage.get("mfj:shared");
      setRecipes(r ? JSON.parse(r.value) : DEMO);
      setShopping(s ? JSON.parse(s.value) : []);
      setSharedRecipes(sh ? JSON.parse(sh.value) : []);
    }catch{ setRecipes(DEMO); }
    setStorageReady(true);
    const p=new URLSearchParams(window.location.search);
    const sh=p.get("shared")||p.get("url")||p.get("text")||"";
    if(sh){ const m=sh.match(/https?:\/\/[^\s]+/); if(m) setImportUrl(m[0]); }
  },[]);
  useEffect(()=>{ if(storageReady) storage.set("mfj:recipes",JSON.stringify(recipes)); },[recipes,storageReady]);
  useEffect(()=>{ if(storageReady) storage.set("mfj:shopping",JSON.stringify(shopping)); },[shopping,storageReady]);
  useEffect(()=>{ if(storageReady) storage.set("mfj:shared",JSON.stringify(sharedRecipes)); },[sharedRecipes,storageReady]);

  /* ── PWA ── */
  useEffect(()=>{
    if(window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone) setIsInstalled(true);
    const h=e=>{e.preventDefault();setInstallPrompt(e);};
    window.addEventListener("beforeinstallprompt",h);
    return ()=>window.removeEventListener("beforeinstallprompt",h);
  },[]);

  function changeLang(code){ setLang(code); try{ localStorage.setItem("mfj:lang",code); }catch{} setShowLangMenu(false); }
  const showToast=(msg,err=false)=>{ setToast({msg,err}); setTimeout(()=>setToast(null),3200); };
  const activeList=sharedMode?sharedRecipes:recipes;
  const filtered=activeList.filter(r=>{
    const cat=category==="Tutte"||r.category===category;
    const q=search.trim().toLowerCase();
    return cat&&(!q||r.title.toLowerCase().includes(q)||r.tags.some(x=>x.includes(q))||(r.cuisine||"").toLowerCase().includes(q)||(r.author||"").toLowerCase().includes(q));
  });

  /* ── AI ── */
  async function askAI(msg){
    const chat=[...aiChat,{role:"user",content:msg}];
    setAiChat(chat); setAiInput(""); setAiLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`You are an expert chef and nutritionist. Always reply in ${LANGUAGES.find(l=>l.code===lang)?.label||"Italian"}. Be friendly, concise and practical. Use food emojis.`,
          messages:chat.map(m=>({role:m.role,content:m.content}))})});
      const d=await res.json();
      setAiChat([...chat,{role:"assistant",content:d.content?.[0]?.text||"..."}]);
    }catch{ setAiChat([...chat,{role:"assistant",content:"⚠️ Errore. Riprova."}]); }
    setAiLoading(false);
    setTimeout(()=>chatEndRef.current?.scrollIntoView({behavior:"smooth"}),100);
  }

  /* ── Import URL ── */
  async function importFromUrl(){
    if(!importUrl.trim()) return;
    setImportLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1200,
          system:`Extract a recipe from the URL. Reply ONLY with valid JSON (no markdown):
{"title":"...","category":"Primi","cuisine":"...","author":"...","tags":[],"servings":2,"time":"...","difficulty":"Easy","ingredients":[],"steps":[{"title":"...","text":"..."}],"nutrition":{"kcal":0,"proteine":0,"carbo":0,"grassi":0},"notes":""}
- cuisine: identify world cuisine (Italian, Greek, Moroccan, Japanese, etc.)
- author: extract username from URL if possible`,
          messages:[{role:"user",content:`Extract recipe from: ${importUrl}`}]})});
      const d=await res.json();
      const parsed=JSON.parse((d.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim());
      const platform=importUrl.includes("instagram")?"instagram":importUrl.includes("tiktok")?"tiktok":importUrl.includes("pinterest")?"pinterest":"web";
      let host="web"; try{ host=new URL(importUrl.startsWith("http")?importUrl:"https://"+importUrl).hostname.replace("www.",""); }catch{}
      const r={...parsed,id:Date.now(),source:host,sourceUrl:importUrl,platform,
        author:parsed.author||"",cuisine:parsed.cuisine||"International",
        image:getPhoto(parsed.title,parsed.ingredients||[]),
        rating:0,saved:true,date:new Date().toISOString().split("T")[0],shared:false};
      setRecipes(p=>[r,...p]); setImportUrl("");
      showToast(`✅ "${r.title}" ${t.imported}`);
    }catch{ showToast(t.importError,true); }
    setImportLoading(false);
  }

  /* ── Foto personale ── */
  function handlePhoto(e, recipeId){
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const url=ev.target.result;
      if(recipeId){
        setRecipes(p=>p.map(r=>r.id===recipeId?{...r,image:url}:r));
        if(selected?.id===recipeId) setSelected(p=>({...p,image:url}));
        showToast("📸 Foto aggiornata!");
      } else { setNr(p=>({...p,image:url})); }
    };
    reader.readAsDataURL(file);
  }

  /* ── Salva ricetta manuale ── */
  function saveManual(){
    if(!nr.title) return showToast(t.titleRequired,true);
    const ings=nr.ingredientsRaw.split("\n").filter(Boolean);
    const r={id:Date.now(),title:nr.title,category:nr.category,cuisine:nr.cuisine||"Internazionale",
      author:nr.author||"",source:nr.source||"Manuale",sourceUrl:nr.sourceUrl,platform:nr.platform,
      image:nr.image||getPhoto(nr.title,ings),tags:nr.tags.split(",").map(x=>x.trim()).filter(Boolean),
      servings:Number(nr.servings)||2,time:nr.time,difficulty:nr.difficulty,ingredients:ings,
      steps:nr.stepsRaw.split("\n").filter(Boolean).map((s,i)=>({title:`${t.stepLabel} ${i+1}`,text:s})),
      nutrition:{kcal:0,proteine:0,carbo:0,grassi:0},rating:0,saved:true,
      notes:nr.notes,date:new Date().toISOString().split("T")[0],shared:false};
    setRecipes(p=>[r,...p]); setNr(blank());
    showToast(t.saved); setTab("home");
  }

  function addToShop(recipe){
    setShopping(p=>[...p,...recipe.ingredients.map(i=>({id:Date.now()+Math.random(),text:i,done:false,from:recipe.title}))]);
    showToast("🛒 "+recipe.title);
  }

  async function doShare(r){
    setShareModal(null);
    const text=t.shareText(r);
    if(navigator.share){ try{ await navigator.share({title:r.title,text}); return; }catch(e){ if(e.name==="AbortError") return; } }
    try{ await navigator.clipboard.writeText(text); }catch{}
    showToast(t.copyClipboard);
  }

  async function publishToShared(recipe){
    setSharedLoading(true);
    try{
      const r={...recipe,sharedBy:recipe.author||"Anonimo",sharedAt:new Date().toISOString()};
      const next=[r,...sharedRecipes.filter(x=>x.id!==recipe.id)];
      setSharedRecipes(next);
      localStorage.setItem("mfj:shared",JSON.stringify(next));
      showToast(t.published);
    }catch{ showToast("❌ Errore",true); }
    setSharedLoading(false);
  }

  async function triggerInstall(){ if(installPrompt){ await installPrompt.prompt(); setInstallPrompt(null); } else setShowInstall(true); }

  /* ── Loading ── */
  if(!storageReady) return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{fontSize:56}}>🍽️</div>
      <div style={{fontSize:24,fontWeight:700,color:C.text}}>My Food Journal</div>
      <Spinner/>
    </div>
  );

  /* ─── stile input riusato ─── */
  const inp={width:"100%",background:C.card,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"11px 14px",fontSize:14,color:C.text,outline:"none",fontFamily:"'DM Sans',sans-serif"};
  const lbl={fontSize:12,fontWeight:700,color:C.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5,display:"block"};

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return(
    <div dir={isRTL?"rtl":"ltr"} style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,minHeight:"100vh",maxWidth:430,margin:"0 auto",position:"relative",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        ::-webkit-scrollbar{width:0}
        input,textarea,select,button{font-family:'DM Sans',sans-serif}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .tap:active{transform:scale(.95);transition:transform .1s}
        .card-tap:active{transform:scale(.97);transition:transform .1s}
      `}</style>

      {/* INPUT FILE NASCOSTI */}
      <input ref={photoNewRef}  type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhoto(e,null)}/>
      <input ref={photoEditRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handlePhoto(e,selected?.id)}/>

      {/* TOAST */}
      {toast&&(
        <div style={{position:"fixed",bottom:88,left:"50%",transform:"translateX(-50%)",background:toast.err?C.accent:C.text,color:"#fff",padding:"11px 20px",borderRadius:28,fontSize:13,fontWeight:600,zIndex:9999,whiteSpace:"nowrap",boxShadow:"0 6px 24px rgba(0,0,0,.2)",animation:"fadeUp .3s"}}>
          {toast.msg}
        </div>
      )}

      {/* MENU LINGUA */}
      {showLangMenu&&(
        <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:800,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowLangMenu(false)}>
          <div style={{background:C.card,borderRadius:"24px 24px 0 0",width:"100%",padding:24,animation:"fadeUp .22s"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:17,fontWeight:700,color:C.text,marginBottom:16}}>🌐 Lingua / Language</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {LANGUAGES.map(l=>(
                <button key={l.code} onClick={()=>changeLang(l.code)} className="tap"
                  style={{background:lang===l.code?C.olive:C.bg,color:lang===l.code?"#fff":C.text,border:`1.5px solid ${lang===l.code?C.olive:C.border}`,borderRadius:14,padding:"12px 16px",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:22}}>{l.flag}</span>{l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL INSTALLAZIONE */}
      {showInstall&&(
        <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:700,display:"flex",alignItems:"flex-end"}} onClick={()=>setShowInstall(false)}>
          <div style={{background:C.card,borderRadius:"24px 24px 0 0",width:"100%",padding:28,animation:"fadeUp .25s",maxHeight:"88vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:52,marginBottom:8}}>📲</div>
              <div style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:6}}>{t.installApp}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{t.installHint}</div>
            </div>
            {[[t.iosTitle,C.accent,t.installStepsIos],[t.androidTitle,"#22C55E",t.installStepsAndroid]].map(([title,col,steps])=>(
              <div key={title} style={{background:C.bg,borderRadius:14,padding:16,marginBottom:12}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:12,color:C.text}}>{title}</div>
                {steps.map(([n,txt,ic])=>(
                  <div key={n} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                    <div style={{width:26,height:26,background:col,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0}}>{n}</div>
                    <div style={{fontSize:13,flex:1,color:C.text}}>{txt}</div>
                    <span style={{fontSize:16}}>{ic}</span>
                  </div>
                ))}
              </div>
            ))}
            <div style={{background:"#FFF8EE",border:`1.5px solid #FDE68A`,borderRadius:14,padding:14,marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:"#92400E",marginBottom:4}}>💡</div>
              <div style={{fontSize:12,color:"#92400E",lineHeight:1.7}}>{t.installAfter}</div>
            </div>
            <Btn onClick={()=>setShowInstall(false)} style={{width:"100%",borderRadius:16,padding:"15px",fontSize:15}}>{t.installDone}</Btn>
          </div>
        </div>
      )}

      {/* MODAL CONDIVISIONE */}
      {shareModal&&(
        <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:600,display:"flex",alignItems:"flex-end"}} onClick={()=>setShareModal(null)}>
          <div style={{background:C.card,borderRadius:"24px 24px 0 0",width:"100%",padding:28,animation:"fadeUp .25s"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:22}}>
              <img src={shareModal.image} alt="" style={{width:58,height:58,borderRadius:14,objectFit:"cover",flexShrink:0}}/>
              <div>
                <div style={{fontSize:16,fontWeight:700,color:C.text,lineHeight:1.3}}>{shareModal.title}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:3}}>⏱️ {shareModal.time} · 👥 {shareModal.servings}</div>
              </div>
            </div>
            <Btn onClick={()=>doShare(shareModal)} style={{width:"100%",marginBottom:10,background:C.text,borderRadius:16,padding:"15px",fontSize:15}}>{t.tapShare}</Btn>
            <Btn onClick={async()=>{setShareModal(null);await publishToShared(shareModal);}} style={{width:"100%",marginBottom:10,background:C.olive,borderRadius:16,padding:"15px",fontSize:15}}>{t.publishShared}</Btn>
            <button onClick={()=>setShareModal(null)} style={{width:"100%",background:C.bg,color:C.muted,border:"none",borderRadius:14,padding:"13px",fontSize:14,cursor:"pointer"}}>{t.cancelBtn}</button>
          </div>
        </div>
      )}

      {/* ════ HOME ════ */}
      {tab==="home"&&(
        <div style={{paddingBottom:88}}>
          {/* Header */}
          <div style={{padding:"20px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:13,color:C.muted,fontWeight:500}}>{t.greeting}</div>
              <div style={{fontSize:26,fontWeight:700,color:C.text,lineHeight:1.1,marginTop:2}}>My Food<br/><span style={{color:C.accent}}>Journal</span></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button onClick={()=>setShowLangMenu(true)} style={{background:C.card,border:`1.5px solid ${C.border}`,borderRadius:"50%",width:38,height:38,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {LANGUAGES.find(l=>l.code===lang)?.flag||"🌐"}
              </button>
              {!isInstalled&&(
                <button onClick={triggerInstall} style={{background:C.card,border:`1.5px solid ${C.border}`,borderRadius:"50%",width:38,height:38,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>📲</button>
              )}
              <button onClick={()=>setTab("ai")} style={{background:C.accent,border:"none",borderRadius:"50%",width:44,height:44,fontSize:20,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px rgba(232,82,26,.35)`}}>✨</button>
            </div>
          </div>

          {/* Toggle personale / condiviso */}
          <div style={{margin:"16px 20px 0",display:"flex",background:C.card,border:`1.5px solid ${C.border}`,borderRadius:14,padding:3,gap:2}}>
            {[[false,t.myRecipes],[true,t.sharedBook]].map(([mode,label])=>(
              <button key={String(mode)} onClick={()=>{setSharedMode(mode);setCategory("Tutte");setSearch("");}}
                style={{flex:1,background:sharedMode===mode?C.accent:"transparent",color:sharedMode===mode?"#fff":C.muted,border:"none",borderRadius:11,padding:"9px 8px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
                {label}
              </button>
            ))}
          </div>

          {/* Import bar */}
          {!sharedMode&&(
            <div style={{margin:"12px 20px 0",background:C.card,borderRadius:14,padding:"11px 14px",display:"flex",gap:8,boxShadow:`0 2px 10px rgba(0,0,0,.05)`,border:`1px solid ${C.border}`}}>
              <span style={{fontSize:16,flexShrink:0,marginTop:1}}>🔗</span>
              <input value={importUrl} onChange={e=>setImportUrl(e.target.value)}
                placeholder={t.importPlaceholder}
                style={{flex:1,border:"none",outline:"none",fontSize:13,background:"transparent",color:C.text}}
                onKeyDown={e=>e.key==="Enter"&&importFromUrl()}/>
              <button onClick={importFromUrl} disabled={importLoading}
                style={{background:C.accent,color:"#fff",border:"none",borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                {importLoading?<Spinner white/>:t.save}
              </button>
            </div>
          )}

          {sharedMode&&(
            <div style={{margin:"12px 20px 0",background:"#F0FDF4",border:"1.5px solid #BBF7D0",borderRadius:14,padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:22}}>👥</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#166534"}}>{t.sharedBook}</div>
                <div style={{fontSize:11,color:"#166534",opacity:.8}}>{sharedRecipes.length} {t.sharedCount}</div>
              </div>
            </div>
          )}

          {/* Ricerca */}
          <div style={{margin:"10px 20px 0",position:"relative"}}>
            <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:C.muted,fontSize:15}}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t.search}
              style={{...inp,paddingLeft:38,borderRadius:12}}/>
          </div>

          {/* Categorie */}
          <div style={{overflowX:"auto",padding:"12px 20px 0",display:"flex",gap:7}}>
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setCategory(c)}
                style={{flexShrink:0,background:category===c?C.accent:C.card,color:category===c?"#fff":C.muted,border:`1.5px solid ${category===c?C.accent:C.border}`,borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s"}}>
                {c}
              </button>
            ))}
          </div>

          <div style={{padding:"12px 20px 8px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:12,color:C.muted,fontWeight:600}}>{filtered.length} {filtered.length===1?t.recipe:t.recipes}</div>
            {!sharedMode&&<button onClick={()=>setTab("add")} style={{background:C.accent,color:"#fff",border:"none",borderRadius:20,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{t.newRecipe}</button>}
          </div>

          {/* Griglia */}
          <div style={{padding:"0 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {filtered.map((r,i)=>(
              <div key={r.id} className="card-tap"
                style={{background:C.card,borderRadius:16,overflow:"hidden",boxShadow:"0 2px 10px rgba(26,26,26,.08)",cursor:"pointer",animation:`fadeUp .3s ${i*.04}s both`,border:`1px solid ${C.border}`}}
                onClick={()=>{setSelected(r);setCookStep(0);setTab("detail");}}>
                <div style={{height:115,background:`url(${r.image}) center/cover`,position:"relative"}}>
                  <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 55%,rgba(26,26,26,.42) 100%)"}}/>
                  {r.cuisine&&(
                    <div style={{position:"absolute",top:8,left:8,background:"rgba(255,255,255,.93)",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700,color:C.accent}}>
                      {CUISINE_FLAG[r.cuisine]||"🌍"} {r.cuisine}
                    </div>
                  )}
                  <button onClick={e=>{e.stopPropagation();setShareModal(r);}} className="tap"
                    style={{position:"absolute",bottom:8,right:8,background:"rgba(255,255,255,.92)",border:"none",borderRadius:"50%",width:28,height:28,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>↗️</button>
                  {sharedMode&&r.sharedBy&&(
                    <div style={{position:"absolute",bottom:8,left:8,background:`rgba(45,106,79,.88)`,borderRadius:20,padding:"2px 7px",fontSize:9,fontWeight:700,color:"#fff"}}>👥 {r.sharedBy}</div>
                  )}
                </div>
                <div style={{padding:"10px 12px 11px"}}>
                  <div style={{fontSize:14,fontWeight:600,color:C.text,lineHeight:1.3,marginBottom:2,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{r.title}</div>
                  {r.author&&<div style={{fontSize:10,color:C.accent,fontWeight:600,marginBottom:3}}>by {r.author}</div>}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{fontSize:11,color:C.muted}}>⏱️ {r.time}</div>
                    <Stars n={r.rating}/>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length===0&&(
            <div style={{textAlign:"center",padding:"60px 20px",color:C.muted}}>
              <div style={{fontSize:48,marginBottom:12}}>🍽️</div>
              <div style={{fontSize:16,fontWeight:600,color:C.text}}>Nessuna ricetta trovata</div>
            </div>
          )}
        </div>
      )}

      {/* ════ DETTAGLIO ════ */}
      {tab==="detail"&&selected&&(
        <div style={{paddingBottom:100}}>
          <div style={{position:"relative",height:270}}>
            <img src={selected.image} alt={selected.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(0,0,0,.22) 0%,transparent 38%,rgba(26,26,26,.68) 100%)"}}/>
            <button onClick={()=>setTab("home")} style={{position:"absolute",top:16,left:16,background:"rgba(255,255,255,.9)",border:"none",borderRadius:"50%",width:38,height:38,fontSize:17,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{t.backBtn}</button>
            {/* Cambia foto */}
            <button onClick={()=>photoEditRef.current?.click()} className="tap"
              style={{position:"absolute",top:16,left:64,background:"rgba(255,255,255,.88)",border:"none",borderRadius:20,padding:"8px 12px",fontSize:11,fontWeight:700,cursor:"pointer",color:C.text,display:"flex",alignItems:"center",gap:4}}>
              📷 {t.photoHint}
            </button>
            <button onClick={()=>setShareModal(selected)} className="tap"
              style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.9)",border:"none",borderRadius:20,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",color:C.text}}>
              {t.share}
            </button>
            <div style={{position:"absolute",bottom:16,left:20,right:20}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                {selected.tags.map(tag=><span key={tag} style={{background:"rgba(255,255,255,.18)",backdropFilter:"blur(4px)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{tag}</span>)}
              </div>
              <div style={{fontSize:22,fontWeight:700,color:"#fff",lineHeight:1.2}}>{selected.title}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:5,alignItems:"center"}}>
                {selected.cuisine&&<span style={{background:"rgba(255,255,255,.18)",backdropFilter:"blur(4px)",color:"#fff",fontSize:10,fontWeight:700,padding:"3px 10px",borderRadius:20}}>{CUISINE_FLAG[selected.cuisine]||"🌍"} {selected.cuisine}</span>}
                {selected.author&&<span style={{color:"rgba(255,255,255,.75)",fontSize:11}}>by {selected.author}</span>}
                <span style={{marginLeft:"auto"}}><Stars n={selected.rating}/></span>
              </div>
            </div>
          </div>

          <div style={{padding:"16px 20px"}}>
            {/* Badge salvato */}
            <div style={{background:"#F0FDF4",border:"1.5px solid #BBF7D0",borderRadius:12,padding:"9px 14px",marginBottom:12,display:"flex",gap:8,alignItems:"center"}}>
              <span>💾</span>
              <span style={{fontSize:11,color:"#166534",fontWeight:600}}>{t.savedBadge}</span>
            </div>

            {/* Meta pills */}
            <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
              {[["⏱️",selected.time],["👥",selected.servings],["📊",selected.difficulty]].map(([e,v])=>(
                <div key={e} style={{background:C.card,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"7px 12px",display:"flex",alignItems:"center",gap:5,fontSize:13,fontWeight:600,color:C.text}}>
                  {e} {v}
                </div>
              ))}
            </div>

            {/* Valori nutrizionali */}
            <div style={{background:C.card,borderRadius:14,padding:14,marginBottom:16,border:`1px solid ${C.border}`}}>
              <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.7,marginBottom:10}}>{t.nutrition}</div>
              <div style={{display:"flex",gap:8}}>
                <NutriBadge label={t.calories}  val={selected.nutrition.kcal}         unit="kcal" color={C.accent}/>
                <NutriBadge label={t.protein}   val={selected.nutrition.proteine+"g"} unit="g"    color={C.olive}/>
                <NutriBadge label={t.carbs}     val={selected.nutrition.carbo+"g"}    unit="g"    color="#D97706"/>
                <NutriBadge label={t.fat}       val={selected.nutrition.grassi+"g"}   unit="g"    color="#7C3AED"/>
              </div>
            </div>

            {/* Ingredienti */}
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:16,fontWeight:700,color:C.text}}>{t.ingredients}</div>
                <button onClick={()=>addToShop(selected)} style={{background:C.tag,color:C.tagText,border:"none",borderRadius:20,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{t.addToCart}</button>
              </div>
              {selected.ingredients.map((ing,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                  <div style={{width:24,height:24,background:C.tag,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.accent,flexShrink:0}}>{i+1}</div>
                  <div style={{fontSize:14,color:C.text}}>{ing}</div>
                </div>
              ))}
            </div>

            {/* Preparazione */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:10}}>{t.preparation}</div>
              {selected.steps.map((s,i)=>(
                <div key={i} style={{background:C.bg,borderRadius:12,padding:14,marginBottom:8,borderLeft:`3px solid ${C.accent}`}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.accent,marginBottom:4,textTransform:"uppercase",letterSpacing:0.5}}>{t.stepLabel} {i+1} · {s.title}</div>
                  <div style={{fontSize:14,color:C.text,lineHeight:1.65}}>{s.text}</div>
                </div>
              ))}
            </div>

            <Btn onClick={()=>{setCookStep(0);setTab("cook");}} style={{width:"100%",borderRadius:16,padding:"15px",fontSize:15,marginBottom:10,boxShadow:"0 4px 14px rgba(232,82,26,.3)"}}>
              {t.cookMode}
            </Btn>

            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <Btn onClick={()=>setShareModal(selected)} bg={C.text} style={{flex:1}}>{t.share}</Btn>
              <Btn onClick={async()=>await publishToShared(selected)} disabled={sharedLoading} bg={C.olive} style={{flex:1}}>
                {sharedLoading?<Spinner white/>:t.publish}
              </Btn>
              <Btn onClick={()=>{setRecipes(p=>p.filter(r=>r.id!==selected.id));setTab("home");showToast(t.deleted);}} bg="#FEF2F2" color="#EF4444" style={{flex:0.6,border:"1.5px solid #FEE2E2"}}>🗑️</Btn>
            </div>

            {selected.notes&&(
              <div style={{background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:12,padding:14,marginBottom:12}}>
                <div style={{fontSize:11,fontWeight:700,color:"#92400E",marginBottom:4}}>{t.notes}</div>
                <div style={{fontSize:13,color:"#78350F",lineHeight:1.6}}>{selected.notes}</div>
              </div>
            )}

            <div style={{background:C.card,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",border:`1px solid ${C.border}`}}>
              <div style={{fontSize:13,fontWeight:600,color:C.text}}>{t.yourRating}</div>
              <Stars n={selected.rating} onSet={s=>{setRecipes(p=>p.map(r=>r.id===selected.id?{...r,rating:s}:r));setSelected(p=>({...p,rating:s}));}}/>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODALITÀ COTTURA ════ */}
      {tab==="cook"&&selected&&(
        <div style={{minHeight:"100vh",background:"#1A1A1A",color:"#fff",display:"flex",flexDirection:"column"}}>
          <div style={{padding:"20px 20px 14px",display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
            <button onClick={()=>setTab("detail")} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:"50%",width:38,height:38,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>{t.backBtn}</button>
            <div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.4)",fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>{t.cookModeLabel}</div>
              <div style={{fontSize:18,fontWeight:700}}>{selected.title}</div>
            </div>
          </div>
          <div style={{padding:"0 20px",marginBottom:20,flexShrink:0}}>
            <div style={{background:"rgba(255,255,255,.1)",borderRadius:20,height:4}}>
              <div style={{background:C.accent,height:4,borderRadius:20,transition:"width .4s",width:`${((cookStep+1)/selected.steps.length)*100}%`}}/>
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:5,fontWeight:600}}>{t.stepLabel} {cookStep+1} {t.stepOf} {selected.steps.length}</div>
          </div>
          <div style={{flex:1,padding:"0 20px",display:"flex",flexDirection:"column"}}>
            <div style={{background:"rgba(255,255,255,.05)",borderRadius:24,padding:26,flex:1,display:"flex",flexDirection:"column",justifyContent:"center",animation:"fadeUp .3s",border:"1px solid rgba(255,255,255,.07)"}}>
              <div style={{fontSize:54,textAlign:"center",marginBottom:16}}>{["🔪","🫕","🍳","🥗","🍽️","✅"][cookStep%6]}</div>
              <div style={{fontSize:22,fontWeight:700,textAlign:"center",marginBottom:14,color:C.accent}}>{selected.steps[cookStep].title}</div>
              <div style={{fontSize:16,lineHeight:1.75,textAlign:"center",color:"rgba(255,255,255,.85)"}}>{selected.steps[cookStep].text}</div>
            </div>
            <div style={{background:"rgba(255,255,255,.04)",borderRadius:14,padding:14,marginTop:12,border:"1px solid rgba(255,255,255,.06)"}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,.3)",fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>{t.ingredients}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {selected.ingredients.map((ing,i)=><span key={i} style={{background:"rgba(255,255,255,.07)",color:"rgba(255,255,255,.65)",fontSize:12,padding:"4px 10px",borderRadius:20}}>{ing}</span>)}
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:14,paddingBottom:28}}>
              {cookStep>0&&<Btn onClick={()=>setCookStep(p=>p-1)} bg="rgba(255,255,255,.1)" style={{flex:1,borderRadius:14,padding:"14px"}}>{t.prevBtn}</Btn>}
              {cookStep<selected.steps.length-1
                ?<Btn onClick={()=>setCookStep(p=>p+1)} style={{flex:2,borderRadius:14,padding:"14px",fontSize:15}}>{t.nextBtn}</Btn>
                :<Btn onClick={()=>{setTab("detail");showToast(t.finishBtn);}} bg="#22C55E" style={{flex:2,borderRadius:14,padding:"14px",fontSize:15}}>{t.finishBtn}</Btn>
              }
            </div>
          </div>
        </div>
      )}

      {/* ════ AGGIUNGI ════ */}
      {tab==="add"&&(
        <div style={{paddingBottom:100}}>
          {/* Header */}
          <div style={{padding:"20px 20px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.border}`}}>
            <button onClick={()=>setTab("home")} style={{background:C.card,border:`1.5px solid ${C.border}`,borderRadius:"50%",width:38,height:38,fontSize:17,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{t.backBtn}</button>
            <div style={{fontSize:18,fontWeight:700,color:C.text}}>{t.newRecipe}</div>
          </div>
          <div style={{padding:"20px 20px 0"}}>

            {/* Upload foto */}
            <div style={{marginBottom:18}}>
              <label style={lbl}>📸 Foto</label>
              {nr.image?(
                <div style={{position:"relative",borderRadius:16,overflow:"hidden",height:170,marginBottom:8}}>
                  <img src={nr.image} alt="preview" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  <button onClick={()=>photoNewRef.current?.click()}
                    style={{position:"absolute",inset:0,background:"rgba(0,0,0,.3)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fff",fontWeight:700,gap:6}}>
                    📷 {t.photoHint}
                  </button>
                </div>
              ):(
                <button onClick={()=>photoNewRef.current?.click()} className="tap"
                  style={{width:"100%",background:C.card,border:`1.5px dashed ${C.border}`,borderRadius:14,padding:"18px 16px",fontSize:13,fontWeight:600,cursor:"pointer",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:8}}>
                  {t.imageUpload}
                </button>
              )}
              <input value={nr.image?.startsWith("data")?"":nr.image} onChange={e=>setNr(p=>({...p,image:e.target.value}))}
                placeholder={t.imageUrlField} style={{...inp,fontSize:13}}/>
            </div>

            {[["title",t.titleField,"text"],["author",t.authorField,"text"],["source",t.sourceField,"text"],["sourceUrl",t.sourceUrlField,"url"],["time",t.prepTimeField,"text"]].map(([key,label,type])=>(
              <div key={key} style={{marginBottom:14}}>
                <label style={lbl}>{label}</label>
                <input type={type} value={nr[key]} onChange={e=>setNr(p=>({...p,[key]:e.target.value}))} style={inp}/>
              </div>
            ))}

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
              {[["category",t.categoryField,CATEGORIES.filter(c=>c!=="Tutte")],["difficulty",t.difficultyField,t.difficulties]].map(([key,label,opts])=>(
                <div key={key}>
                  <label style={lbl}>{label}</label>
                  <select value={nr[key]} onChange={e=>setNr(p=>({...p,[key]:e.target.value}))} style={{...inp,cursor:"pointer"}}>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{marginBottom:14}}>
              <label style={lbl}>{t.cuisineField}</label>
              <select value={nr.cuisine} onChange={e=>setNr(p=>({...p,cuisine:e.target.value}))} style={{...inp,cursor:"pointer"}}>
                {CUISINES.map(o=><option key={o} value={o}>{o?`${CUISINE_FLAG[o]||"🌍"} ${o}`:t.selectCuisine}</option>)}
              </select>
            </div>

            <div style={{marginBottom:14}}>
              <label style={lbl}>{t.tagsField}</label>
              <input value={nr.tags} onChange={e=>setNr(p=>({...p,tags:e.target.value}))} placeholder={t.tagsPlaceholder} style={inp}/>
            </div>

            {[["ingredientsRaw",t.ingredientsField,5,"200g pasta\n2 uova\n..."],["stepsRaw",t.stepsField,6,"Cuoci la pasta\nRosola..."],["notes",t.notesField,3,t.notesPlaceholder]].map(([key,label,rows,ph])=>(
              <div key={key} style={{marginBottom:14}}>
                <label style={lbl}>{label}</label>
                <textarea value={nr[key]} onChange={e=>setNr(p=>({...p,[key]:e.target.value}))} rows={rows} placeholder={ph}
                  style={{...inp,resize:"vertical"}}/>
              </div>
            ))}

            <Btn onClick={saveManual} style={{width:"100%",borderRadius:16,padding:"16px",fontSize:15,marginBottom:28,background:C.olive,boxShadow:"0 4px 14px rgba(45,106,79,.3)"}}>
              {t.saveBtn}
            </Btn>
          </div>
        </div>
      )}

      {/* ════ SPESA ════ */}
      {tab==="shop"&&(
        <div style={{paddingBottom:100}}>
          <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontSize:24,fontWeight:700,color:C.text}}>{t.shoppingList}</div>
            <div style={{fontSize:13,color:C.muted,marginTop:2}}>{shopping.filter(i=>!i.done).length} {t.itemsToBuy}</div>
          </div>
          <div style={{padding:"16px 20px"}}>
            {shopping.length===0?(
              <div style={{textAlign:"center",padding:"60px 0",color:C.muted}}>
                <div style={{fontSize:48,marginBottom:12}}>🛒</div>
                <div style={{fontSize:16,fontWeight:600,color:C.text}}>{t.emptyCart}</div>
                <div style={{fontSize:13,marginTop:4}}>{t.emptyCartHint}</div>
              </div>
            ):(
              <>
                <div style={{display:"flex",gap:8,marginBottom:16}}>
                  <button onClick={()=>setShopping(p=>p.map(i=>({...i,done:true})))} style={{background:"#F0FDF4",color:"#166534",border:"1.5px solid #BBF7D0",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{t.checkAll}</button>
                  <button onClick={()=>setShopping([])} style={{background:"#FEF2F2",color:"#EF4444",border:"1.5px solid #FEE2E2",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{t.clearList}</button>
                </div>
                {[...new Set(shopping.map(i=>i.from))].map(from=>(
                  <div key={from} style={{marginBottom:20}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.7,marginBottom:8}}>{from}</div>
                    {shopping.filter(i=>i.from===from).map(item=>(
                      <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",background:C.card,borderRadius:12,marginBottom:7,border:`1px solid ${C.border}`}}>
                        <div onClick={()=>setShopping(p=>p.map(i=>i.id===item.id?{...i,done:!i.done}:i))}
                          style={{width:22,height:22,borderRadius:6,border:`2px solid ${item.done?C.olive:C.border}`,background:item.done?C.olive:"transparent",cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,transition:"all .2s"}}>
                          {item.done?"✓":""}
                        </div>
                        <div style={{fontSize:14,flex:1,color:item.done?C.muted:C.text,textDecoration:item.done?"line-through":"none"}}>{item.text}</div>
                        <button onClick={()=>setShopping(p=>p.filter(i=>i.id!==item.id))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:18}}>×</button>
                      </div>
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}

      {/* ════ AI CHEF ════ */}
      {tab==="ai"&&(
        <div style={{display:"flex",flexDirection:"column",height:"100vh"}}>
          <div style={{padding:"18px 20px 14px",background:C.card,borderBottom:`1px solid ${C.border}`,flexShrink:0,display:"flex",alignItems:"center",gap:12}}>
            <button onClick={()=>setTab("home")} style={{background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:"50%",width:36,height:36,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{t.backBtn}</button>
            <div>
              <div style={{fontSize:17,fontWeight:700,color:C.text}}>{t.aiChef}</div>
              <div style={{fontSize:12,color:C.muted}}>{t.aiSubtitle}</div>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"16px 20px",display:"flex",flexDirection:"column",gap:12,background:C.bg}}>
            {aiChat.length===0&&(
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{fontSize:52,marginBottom:10}}>👨‍🍳</div>
                <div style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:6}}>{t.aiWelcome}</div>
                <div style={{fontSize:13,color:C.muted,lineHeight:1.7,marginBottom:18}}>{t.aiHint}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
                  {t.aiSuggestions.map(s=>(
                    <button key={s} onClick={()=>askAI(s.slice(3))} style={{background:C.tag,color:C.tagText,border:"none",borderRadius:20,padding:"8px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {aiChat.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",animation:"fadeUp .25s"}}>
                <div style={{maxWidth:"82%",background:m.role==="user"?C.accent:C.card,color:m.role==="user"?"#fff":C.text,borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"12px 16px",fontSize:14,lineHeight:1.65,boxShadow:"0 2px 8px rgba(0,0,0,.07)",border:m.role==="user"?"none":`1px solid ${C.border}`}}>
                  {m.content}
                </div>
              </div>
            ))}
            {aiLoading&&(
              <div style={{display:"flex",gap:5,padding:"12px 16px",background:C.card,borderRadius:"18px 18px 18px 4px",width:"fit-content",border:`1px solid ${C.border}`}}>
                {[0,1,2].map(i=><div key={i} style={{width:7,height:7,background:C.muted,borderRadius:"50%",animation:`pulse .9s ${i*.2}s infinite`}}/>)}
              </div>
            )}
            <div ref={chatEndRef}/>
          </div>
          <div style={{padding:"12px 20px 24px",background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",gap:10,flexShrink:0}}>
            <input value={aiInput} onChange={e=>setAiInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!aiLoading&&aiInput.trim()&&askAI(aiInput)}
              placeholder={t.aiPlaceholder}
              style={{flex:1,background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:24,padding:"12px 16px",fontSize:14,color:C.text,outline:"none"}}/>
            <button onClick={()=>aiInput.trim()&&!aiLoading&&askAI(aiInput)}
              style={{background:C.accent,color:"#fff",border:"none",borderRadius:"50%",width:46,height:46,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>→</button>
          </div>
        </div>
      )}

      {/* ════ BOTTOM NAV ════ */}
      {tab!=="cook"&&tab!=="ai"&&(
        <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-around",padding:"10px 0 18px",zIndex:200,boxShadow:"0 -4px 20px rgba(26,26,26,.06)"}}>
          {[["home","🏠",t.navRecipes],["shop","🛒",t.navCart],["add","✏️",t.navAdd],["ai","✨",t.navAI]].map(([key,icon,label])=>(
            <button key={key} onClick={()=>setTab(key)}
              style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"0 12px",opacity:tab===key?1:0.4,transform:tab===key?"scale(1.1)":"scale(1)",transition:"all .2s"}}>
              <span style={{fontSize:22}}>{icon}</span>
              <span style={{fontSize:10,fontWeight:700,color:tab===key?C.accent:C.muted,letterSpacing:0.2}}>{label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
