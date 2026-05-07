export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "accessories" | "audio" | "consoles";
  image: string;
  specs: string[];
};

export const products: Product[] = [
  // --- ACCESSOIRES (5 produits) ---
  {
    id: "keyboard-rgb",
    name: "Neon RGB Keyboard",
    description: "Clavier mécanique ultra-réactif avec switches optiques.",
    price: 890,
    category: "accessories",
    image: "/keyboard.jpg",
    specs: ["Switches Red", "RGB Dynamic", "USB-C Détachable"]
  },
  {
    id: "gaming-mouse",
    name: "Phantom Gaming Mouse",
    description: "Précision extrême 16000 DPI pour une réactivité totale.",
    price: 450,
    category: "accessories",
    image: "/mouse.jpg",
    specs: ["16000 DPI", "Capteur Optique", "Ultra léger (60g)"]
  },
  {
    id: "mousepad-xl",
    name: "Neon Matrix Pad",
    description: "Tapis XXL avec bordures LED synchronisées.",
    price: 250,
    category: "accessories",
    image: "/mousepad.jpg",
    specs: ["Surface Micro-tissée", "Base antidérapante", "LED RGB"]
  },
  {
    id: "streaming-mic",
    name: "Neon Stream Mic",
    description: "Microphone cardioïde pour un son cristallin en stream.",
    price: 1200,
    category: "accessories",
    image: "/mic.jpg",
    specs: ["Condensateur Pro", "Filtre anti-pop intégré", "USB Plug & Play"]
  },
  {
    id: "monitor-arm",
    name: "Cyber Arm Mount",
    description: "Bras articulé pour écran avec passage de câbles intégré.",
    price: 750,
    category: "accessories",
    image: "/arm.jpg",
    specs: ["Rotation 360°", "Vérins à gaz", "Support double écran"]
  },

  // --- AUDIO (4 produits) ---
  {
    id: "gaming-headset",
    name: "Strike Gaming Headset",
    description: "Immersion sonore totale avec son spatial 7.1.",
    price: 650,
    category: "audio",
    image: "/headset.jpg",
    specs: ["7.1 Surround", "Micro Noise Canceling", "Mousse à mémoire"]
  },
  {
    id: "earbuds-pro",
    name: "Neon Buds Pro",
    description: "Écouteurs sans fil basse latence pour le gaming mobile.",
    price: 550,
    category: "audio",
    image: "/earbuds.jpg",
    specs: ["Bluetooth 5.3", "Mode Gaming 40ms", "IPX5"]
  },
  {
    id: "soundbar-neon",
    name: "Neon Blast Soundbar",
    description: "Barre de son compacte avec caisson de basses intégré.",
    price: 1400,
    category: "audio",
    image: "/soundbar.jpg",
    specs: ["Dolby Atmos", "RGB Sync", "Bluetooth & Optique"]
  },
  {
    id: "studio-headphones",
    name: "Neon Studio Master",
    description: "Casque monitoring pour une précision audio absolue.",
    price: 1800,
    category: "audio",
    image: "/studio.jpg",
    specs: ["Drivers 50mm", "Réponse plate", "Câble torsadé"]
  },

  // --- CONSOLES (3 produits) ---
  {
    id: "neon-console-x",
    name: "Neon Console X",
    description: "La puissance ultime pour jouer en 4K 120 FPS.",
    price: 5400,
    category: "consoles",
    image: "/console.jpg",
    specs: ["Ray Tracing", "SSD 1TB NVMe", "4K Native"]
  },
  {
    id: "retro-strike-box",
    name: "Retro Strike Box",
    description: "Retrouvez plus de 10 000 jeux classiques dans une box mini.",
    price: 950,
    category: "consoles",
    image: "/retro.jpg",
    specs: ["Émulation 4K", "2 Manettes incluses", "Plug & Play TV"]
  },
  {
    id: "neon-vr-headset",
    name: "Neon VR Vision",
    description: "Plongez dans la réalité virtuelle avec une résolution 8K.",
    price: 4800,
    category: "consoles",
    image: "/vr.jpg",
    specs: ["Écrans OLED 8K", "Tracking de mouvement", "Sans fil"]
  }
];