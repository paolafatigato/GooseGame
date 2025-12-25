// cellcontent.js

// Define which tiles are question tiles and event tiles
const QUESTION_TILES = [5, 12, 19, 26, 33, 40, 47, 54, 61];
const EVENT_TILES = [6, 13, 20, 27, 34, 48, 55, 62];

// Category data structure (solo contenuti testuali)
const CATEGORIES = {


rivers: {
  name: "Fiumi",

  // Domande rosa (carte domanda)
  questions: [
    "Completa un cruciverba di geografia insieme agli altri giocatori; allo scattare dei 4 minuti, avanza di tante caselle quante parole hai scritto.",
    "In 5 minuti, mima parole relative alla geografia senza parlare. Avanzi di 1 casella per ogni parola indovinata (anche chi la indovina avanza).",
    "In 4 minuti, mima parole relative alla geografia senza parlare. Avanzi di 1 casella per ogni parola indovinata (anche chi la indovina avanza).",
    "Ripassa ad alta voce il significato di ‘meandro’ e ‘affluente’.",
    "Nomina un fiume italiano e indica in quale mare sfocia.",
    "Nomina un fiume europeo e lo Stato principale che attraversa.",
    "Spiega la differenza tra sorgente e foce.",
    "Indica un esempio di sport praticato nei fiumi e spiega se può essere pericoloso.",
    "Nomina un possibile effetto positivo di una diga.",
    "Nomina un possibile effetto negativo dell’inquinamento su un fiume.",
    "Racconta un fiume che conosci vicino a casa tua o nella tua regione.",
    "Spiega perché è importante proteggere gli argini dei fiumi.",
    "Nomina un animale che vive in ambiente fluviale.",
    "Nomina una città europea famosa per il fiume che la attraversa."
    
  ],

  // Imprevisti verdi (dal pdf + aggiunte) [file:2]
  events: [
    "Descrivi un fiume famoso (es. Nilo, Po, Danubio...) senza dire il suo nome. Chi lo indovina avanza di 3 caselle insieme a te!",
    "Tutti i giocatori nominano a turno un fiume italiano o europeo. Chi resta per ultimo senza sbagliare o ripetere avanza di 3 caselle!",
    "Indica il fiume Volga sulla cartina di pag. 163. Se ci riesci, avanza di 2 caselle; se sbagli retrocedi di 1.",
    "Indica il fiume Po sulla cartina della classe. Se sbagli, stai fermo il prossimo turno e tutti avanzano di 1.",
    "Il giocatore alla tua destra sceglie un fiume da pagina 147, il primo di voi a trovarlo nella cartina avanza di 2.",
    "Il giocatore alla tua sinistra sceglie un fiume da pagina 147, il primo di voi a trovarlo nella cartina avanza di 2.",
    "Ogni giocatore dice una parola collegata al fiume che inizia con l’iniziale del suo nome (Paola → “piena”); l’ultimo retrocede di 1.",
    "Ogni giocatore, partendo da te, dice una parola collegata al fiume che inizia con la lettera A, poi B, ecc. Chi non trova parole retrocede di 1.",
    "Scambia la tua pedina con quella di un altro giocatore a tua scelta. Se è il primo, perdi 1 turno.",
    "Mulino: fai una domanda di storia ad un compagno a tua scelta; se risponde bene, avanza di 1 casella.",
    "Diga: stai fermo un turno.",
    "Meandro: fai un’ampia curva che ti tiene lontano dalla foce, retrocedi di 1.",
    "Affluente: un fiume si getta nelle tue acque aumentando la tua portata, avanzi di 1!",
    "Tutti i giocatori nominano a turno un fattore di inquinamento fluviale. Chi resta per ultimo senza sbagliare o ripetere avanza di 3 caselle!",

    // nuovi imprevisti aggiunti
    "Piena improvvisa: il fiume esonda, torna alla casella fiume precedente.",
    "Secca estiva: il corso d’acqua si riduce, salta il prossimo turno.",
    "Argine rotto: aiuta a sistemarlo! Ferma il gioco per un turno e poi avanza di 2 caselle.",
    "Centrale idroelettrica: l’energia del fiume ti dà una spinta, avanza di 3 caselle.",
    "Inquinamento: lancia il dado; se esce pari retrocedi di 2, se esce dispari resta dove sei.",
    "Navigazione fluviale: prendi una scorciatoia in battello, vai alla prossima casella foce."
  ],

  // Caselle normali gialle (attività brevi) [file:2]
  normalContents: ["Che cos'è l'alveo di un fiume?",
    "Quali sono le due principali tipologie di foce di un fiume?",
    "Cosa sono gli affluenti?",
    "Quali caratteristiche ha il corso di un fiume in alta pianura?",
    "Che cosa sono i meandri?",
    "In quale parte del percorso del fiume si formano i meandri?",
    "Perché si formano i rami alla foce del fiume?",
    "Quale tipo di foce si forma con una forte marea?",
    "Che significa “corso d’acqua perenne”?",
    "Cosa sono le rapide?",
    "Come si chiama un fiume piccolo che confluisce in uno più grande?",
    "Qual è il fiume più lungo d’Europa?",
    "Qual è il fiume più lungo d’Italia?",
    "Qual è il fiume più lungo del mondo?",
    "Dove si trova solitamente la sorgente del fiume?",
    "Qual è la differenza tra fiume e torrente?",
    "Come si chiama un corso d’acqua che si secca d’estate?",
    "Nomina un fiume di Sicilia o Sardegna.",
    "Qual è il fiume che bagna Roma?",
    "In che mare sfocia il Po?",
    "In che regione si trova l’Ofanto?",
    "Quale fiume si diceva fosse nato dalle lacrime della dea della Luna?",
    "Che pianure formano i fiumi in piena?",
    "Nomina almeno uno sport che si pratica nei fiumi.",
    "Cos’è un “immissario”?",
    "Come si chiama la quantità d’acqua che passa ogni secondo?",
    "Come possiamo produrre elettricità con i fiumi?",
    "Se un fiume finisce in un mare, si dice che ne è un __________.",
    "Quale tipo di foce viene dal nome di una lettera greca?",
    "Come si chiamano rocce, rami e sassi trascinati a valle dal fiume?",
    "Come si chiama la parete costruita per arginare l’acqua?",
    "Perché si costruiscono le dighe?"
  ]
},


    leopardi: {
        name: "Leopardi",

  // Domande di grammatica/teoria: qui diventano domande sui pessimismi
  questions: [
    // PESSIMISMO INDIVIDUALE
    "PESSIMISMO INDIVIDUALE: Qual è il ruolo della natura?",
    "PESSIMISMO INDIVIDUALE: Qual è la causa dell’infelicità?",
    "PESSIMISMO INDIVIDUALE: Perché Leopardi è pessimista in questa fase?",

    // PESSIMISMO COSMICO
    "PESSIMISMO COSMICO: Qual è il ruolo della natura?",
    "PESSIMISMO COSMICO: Qual è la causa dell’infelicità?",
    "PESSIMISMO COSMICO: C’è speranza per l’uomo in questa visione?",

    // PESSIMISMO STORICO
    "PESSIMISMO STORICO: Qual è il ruolo della natura?",
    "PESSIMISMO STORICO: Qual è la causa dell’infelicità?",
    "PESSIMISMO STORICO: Chi è felice e perché?",
    "PESSIMISMO STORICO: Chi era felice secondo Leopardi?"
  ],

  // Eventi “imprevisti” collegati al mondo leopardiano presenti nel tabellone. [file:1]
  events: [
    "Il pessimismo ti colpisce: vai alla precedente casella filosofia.",
    "Evasione dalla routine: vai alla prossima casella vita.",
    "RECANATI: parlaci di Recanati e resta fermo un turno.",
    "Incontro con la Natura: Leopardi trova momentaneo conforto, avanza di 2 caselle.",
    "Salute da buttare: perdi il prossimo turno."
  ],

  // Contenuti delle caselle normali: domande personali/di ripasso su Leopardi e sui testi. [file:1]
  normalContents: [
    "Dove è nato Giacomo Leopardi?",
    "Quando è nato Leopardi?",
    "Quando è morto Leopardi?",
    "Come era la salute di Leopardi durante la sua vita?",
    "Dove ha ricevuto la sua educazione?",
    "Si è mai innamorato? Racconta brevemente.",
    "In quale stato si trovava Recanati quando Leopardi era vivo?",
    "Perché Leopardi si sentiva in solitudine?",
    "È riuscito a scappare di casa? Spiega.",
    "Che lavoro ha fatto Leopardi?",
    "Come definiresti il ruolo della natura nel pessimismo individuale?",
    "Come definiresti il ruolo della natura nel pessimismo cosmico?",
    "Come definiresti il ruolo della natura nel pessimismo storico?",
    "Qual è la causa dell’infelicità nel pessimismo individuale?",
    "Qual è la causa dell’infelicità nel pessimismo cosmico?",
    "Qual è la causa dell’infelicità nel pessimismo storico?",
    "Chi è felice nel pessimismo storico e perché?",
    "Che cosa significa per Leopardi ‘pessimismo cosmico’?",
    "Che cosa significa per Leopardi ‘pessimismo storico’?",
    "Che cosa significa per Leopardi ‘pessimismo individuale’?",
    "Come cambia l’immagine della natura tra le diverse fasi del pessimismo?",
    "Come pensi che l’esperienza biografica di Leopardi influenzi il suo pessimismo?"
  ]
},


    gettingToKnow: {
        name: "Getting to Know Each Other",
        // Tutte le carte bianche di grammatica dal PDF
        questions: [
            // POSSESSIVE 'S
            "JOIN THESE PAIRS WITH THE POSSESSIVE 'S OR ': THE BOYS / BIKES",
            "JOIN THESE PAIRS WITH THE POSSESSIVE 'S OR ': MY PARENTS / CAR",
            "JOIN THESE PAIRS WITH THE POSSESSIVE 'S OR ': THE TEACHER / PURSE",
            "JOIN THESE PAIRS WITH THE POSSESSIVE 'S OR ': EMILY / BROTHER",
            "JOIN THESE PAIRS WITH THE POSSESSIVE 'S OR ': THE TWINS / BEDROOM",
            "CHOOSE THE CORRECT OPTION: THE BOYS’ / BOY’S JACKET IS BLUE.",
            "CHOOSE THE CORRECT OPTION: YOUR PARENTS’ / PARENT’S ROOM IS UPSTAIRS.",
            "CHOOSE THE CORRECT OPTION: THE DOG’S / DOGS’ FOOD IS ON THE TABLE.",
            "WRITE THE POSSESSIVE FORM: THE DOG OF LUCA",
            "WRITE THE POSSESSIVE FORM: THE SHOES OF THE GIRLS",
            "WRITE THE POSSESSIVE FORM: THE BEDROOM OF MY BROTHER",
            "CHOOSE THE CORRECT OPTION: THEIR AUNT’S / AUNTS’ SISTER IS SHY.",
            "CHOOSE THE CORRECT OPTION: YOUR SISTERS’ / SISTER’S GIRLFRIEND IS CHATTY.",
            "CHOOSE THE CORRECT OPTION: OUR TURTLES’ / TURTLE’S NAME IS GRONK.",
            "WRITE THE POSSESSIVE FORM: THE BIKE OF YOUR DAD",
            "WRITE THE POSSESSIVE FORM: THE FRIENDS OF MARIA",
            "WRITE THE POSSESSIVE FORM: THE TOYS OF THE BABIES",

            // 3RD PERSON SINGULAR & DO/DOES
            "WRITE THE 3RD PERSON SINGULAR OF THESE VERBS: RUN, STUDY, WATCH.",
            "CHOOSE THE CORRECT OPTION: SHE GO / GOES TO BED AT 10.",
            "CHOOSE THE CORRECT OPTION: HE WATCH / WATCHES TV EVERY DAY.",
            "CHOOSE THE CORRECT OPTION: THE TEACHER TEACH / TEACHES MATHS.",
            "CHOOSE THE CORRECT OPTION: DO / DOES YOU DO DRAMA?",
            "CHOOSE THE CORRECT OPTION: THE DOG LIKE / LIKES APPLES.",
            "CHOOSE THE CORRECT OPTION: THE TEACHERS NEED / NEEDS A DEGREE.",
            "WRITE THE 3RD PERSON SINGULAR OF THESE VERBS: CARRY, FIX, WASH.",
            "WRITE THE 3RD PERSON SINGULAR OF THESE VERBS: FLY, TEACH, CRY.",

            // NEGATIVE FORM & QUESTIONS (1)
            "CHANGE TO THE NEGATIVE FORM: I LIKE HORROR FILMS.",
            "CHOOSE THE CORRECT OPTION: DO / DOES LINA DO VOLUNTARY WORK?",
            "CHOOSE THE CORRECT OPTION: DO / DOES YOUR SISTER LISTEN TO ROCK MUSIC?",
            "CHOOSE THE CORRECT OPTION: DO / DOES SHE PLAY IN YOUR TEAM?",
            "CHOOSE THE CORRECT OPTION: DO / DOES YOUR FRIEND GO TO THE DEBATING CLUB?",
            "CHOOSE THE CORRECT OPTION: DO / DOES YOUR CLASS STUDY GERMAN?",
            "CHOOSE THE CORRECT OPTION: DO / DOES THEY PLAY IN A BAND?",
            "CHANGE TO THE NEGATIVE FORM: SHE PLAYS THE PIANO EVERY DAY.",
            "CHANGE TO THE NEGATIVE FORM: WE READ BOOKS IN ENGLISH.",

            // POSSESSIVE ADJECTIVES & SHORT ANSWERS
            "COMPLETE WITH THE CORRECT POSSESSIVE ADJECTIVE: SHE HAS ___ PHONE IN HER HAND.",
            "CHOOSE THE CORRECT OPTION: DO YOUR COUSINS HAVE A PET? A. YES, THEY DOES. B. NO, THEY DON’T. C. YES, HE DOES.",
            "CHOOSE THE CORRECT OPTION: DOES YOUR DAD WORK AT THE WEEKEND? A. YES, HE DOES. B. YES, THEY DO. C. NO, SHE DOESN’T.",
            "CHOOSE THE CORRECT OPTION: DO YOU AND YOUR SISTER WALK TO SCHOOL? A. YES, I DOES. B. NO, THEY DOESN’T. C. YES, WE DO.",
            "CHOOSE THE CORRECT OPTION: DOES THE CAT SLEEP IN YOUR BED? A. YES, THEY DO. B. YES, IT DOES. C. NO, YOU DON’T.",
            "CHOOSE THE CORRECT OPTION: DO YOU LIKE READING? A. YES, I DO. B. NO, HE DOESN’T. C. YES, SHE DOES.",
            "CHOOSE THE CORRECT OPTION: DOES YOUR BEST FRIEND PLAY VIDEO GAMES? A. YES, HE DOES. B. NO, THEY DON’T. C. YES, YOU DO.",
            "COMPLETE WITH THE CORRECT POSSESSIVE ADJECTIVE: THE CAT EATS ___ FOOD.",
            "COMPLETE WITH THE CORRECT POSSESSIVE ADJECTIVE: ___ NAME IS LUCA.",
            "COMPLETE WITH THE CORRECT POSSESSIVE ADJECTIVE: WE DO ___ HOMEWORK IN THE EVENING.",
            "COMPLETE WITH THE CORRECT POSSESSIVE ADJECTIVE: TOM AND ANNA CLEAN ___ BIKES.",
            "COMPLETE WITH THE CORRECT POSSESSIVE ADJECTIVE: ___ NAME IS JULIE.",

            // INTERROGATIVE FORM
            "CHANGE TO THE INTERROGATIVE FORM: YOU LIKE MUSIC.",
            "CHANGE TO THE INTERROGATIVE FORM: SHE PLAYS THE PIANO.",
            "CHANGE TO THE INTERROGATIVE FORM: THEY LIVE IN MILAN.",
            "CHANGE TO THE INTERROGATIVE FORM: WE GO TO THE SAME GYM.",
            "CHANGE TO THE INTERROGATIVE FORM: YOU GO TO BED AT 10.",
            "CHANGE TO THE INTERROGATIVE FORM: HE HAS A DOG.",

            // NEGATIVE & AFFIRMATIVE FORM (2)
            "CHANGE TO THE NEGATIVE FORM: MY DOG SLEEPS ON MY BED.",
            "CHOOSE THE CORRECT OPTION: DOES YOUR TEACHER LIVE NEAR THE SCHOOL? A. YES, SHE DOES. B. NO, YOU DON’T. C. YES, WE DO.",
            "CHOOSE THE CORRECT OPTION: DO YOUR FRIENDS PLAY FOOTBALL? A. NO, HE DOESN’T. B. YES, THEY DO. C. YES, SHE DOES.",
            "CHOOSE THE CORRECT OPTION: DOES YOUR MUM LIKE PIZZA? A. YES, SHE DOES. B. NO, THEY DON’T. C. YES, WE DO.",
            "CHANGE TO THE NEGATIVE FORM: TOM EATS VEGETABLES.",
            "CHANGE TO THE NEGATIVE FORM: ANNA STUDIES FRENCH.",
            "CHANGE TO THE NEGATIVE FORM: MY BABY BROTHER CRIES AT NIGHT.",
            "CHANGE TO THE AFFIRMATIVE FORM: THEY DON’T PLAY TENNIS.",
            "CHANGE TO THE AFFIRMATIVE FORM: HE DOESN’T WATCH CARTOONS."
        ],

        // Imprevisti in inglese
        events: [
            "You forgot your homework. Go back 2 spaces.",
            "You helped a classmate. Move forward 3 spaces.",
            "You are late for school. Miss a turn.",
            "You get a gold star. Roll the dice again.",
            "Swap places with another player of your choice.",
            "Go to the nearest question tile and answer a card.",
            "Your phone rings in class. Go back to the previous special tile.",
            "You answer a question perfectly. Move forward 4 spaces."
        ],

        // Domande delle caselle del tabellone (START/FINISH escluse)
normalContents: [
   "What’s your favorite color?",
   "Do you have any brothers or sisters?",
   "Where do you live?",
   "Do you have a favourite book?",
   "In what room do you study?",
   "Do you share your room?",
   "Do you play any instruments?",
   "How do you get to school?",
   "Who is your best friend?",
   "Do you have any pets?",
  "Do you study with the music on?",
   "What is your favorite movie?",
   "Which subject do you find the most difficult?",
   "Do you help at home?",
   "What’s your favorite food?",
   "What languages do you speak?",
   "What’s your favorite sport?",
   "What is your favorite subject?",
   "What makes you laugh?",
   "Do you like boardgames?",
   "Where do you like to travel to?",


]


    }
};

