// Tryout form settings. Registrations and visits go to the GS Baseball Hub
// (Team tab → Tryout Signups, owner only).
window.TRYOUT_CONFIG = {
  TEAM_NAME: "GS Baseball",
  SEASON: "Spring 2027",
  // Tryout sessions families can pick from — edit freely
  SESSIONS: [
    "Sunday, Dec 6 — 2:00 PM · TC Rec Fields, Butler"
  ],
  AGE_GROUPS: ["8U", "9U", "10U", "11U", "12U", "13U", "14U"],
  // The Hub's Firebase project (public identifiers; the database rules protect the data)
  FIREBASE: {
    apiKey: "AIzaSyBfTjGdAr9nXPEp30X7c9Ot01fT5oGV7_0",
    authDomain: "stingerz-scorebook.firebaseapp.com",
    projectId: "stingerz-scorebook",
    appId: "1:667344236029:web:9f1372d2e6d96321587d94"
  }
};
