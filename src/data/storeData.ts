import { Product, Category, StoreInfo } from "@/types/store";

export const storeInfo: StoreInfo = {
  name: "Samarth Kirana & General Stores",
  owner: "Samarth Shinde",
  contact: "9699374346",
  address: "Bavachi",
  tagline: "Your Trusted Neighborhood Store"
};

export const categories: Category[] = [
  { id: "grains", name: "Grains & Rice", nameHindi: "अनाज और चावल", icon: "🌾", color: "bg-amber-100" },
  { id: "pulses", name: "Pulses & Dals", nameHindi: "दालें", icon: "🫘", color: "bg-orange-100" },
  { id: "spices", name: "Spices & Masalas", nameHindi: "मसाले", icon: "🌶️", color: "bg-red-100" },
  { id: "oils", name: "Oils & Ghee", nameHindi: "तेल और घी", icon: "🫒", color: "bg-yellow-100" },
  { id: "dairy", name: "Dairy Products", nameHindi: "डेयरी उत्पाद", icon: "🥛", color: "bg-blue-100" },
  { id: "snacks", name: "Snacks & Namkeen", nameHindi: "नाश्ता", icon: "🍿", color: "bg-purple-100" },
  { id: "beverages", name: "Tea & Beverages", nameHindi: "चाय और पेय", icon: "☕", color: "bg-emerald-100" },
  { id: "personal", name: "Personal Care", nameHindi: "व्यक्तिगत देखभाल", icon: "🧴", color: "bg-pink-100" },
];

export const products: Product[] = [
  // Grains & Rice
  { id: "1", name: "Basmati Rice", nameHindi: "बासमती चावल", price: 120, unit: "1 kg", category: "grains", image: "/placeholder.svg", inStock: true, discount: 10 },
  { id: "2", name: "Wheat Flour (Atta)", nameHindi: "गेहूं का आटा", price: 45, unit: "1 kg", category: "grains", image: "/placeholder.svg", inStock: true },
  { id: "3", name: "Poha", nameHindi: "पोहा", price: 35, unit: "500 g", category: "grains", image: "/placeholder.svg", inStock: true },
  
  // Pulses & Dals
  { id: "4", name: "Toor Dal", nameHindi: "तूर दाल", price: 140, unit: "1 kg", category: "pulses", image: "/placeholder.svg", inStock: true, discount: 5 },
  { id: "5", name: "Moong Dal", nameHindi: "मूंग दाल", price: 130, unit: "1 kg", category: "pulses", image: "/placeholder.svg", inStock: true },
  { id: "6", name: "Chana Dal", nameHindi: "चना दाल", price: 85, unit: "1 kg", category: "pulses", image: "/placeholder.svg", inStock: true },
  
  // Spices & Masalas
  { id: "7", name: "Turmeric Powder", nameHindi: "हल्दी", price: 25, unit: "100 g", category: "spices", image: "/placeholder.svg", inStock: true },
  { id: "8", name: "Red Chilli Powder", nameHindi: "लाल मिर्च", price: 40, unit: "100 g", category: "spices", image: "/placeholder.svg", inStock: true },
  { id: "9", name: "Garam Masala", nameHindi: "गरम मसाला", price: 55, unit: "100 g", category: "spices", image: "/placeholder.svg", inStock: true, discount: 8 },
  { id: "10", name: "Coriander Powder", nameHindi: "धनिया पाउडर", price: 30, unit: "100 g", category: "spices", image: "/placeholder.svg", inStock: true },
  
  // Oils & Ghee
  { id: "11", name: "Sunflower Oil", nameHindi: "सूरजमुखी तेल", price: 180, unit: "1 L", category: "oils", image: "/placeholder.svg", inStock: true },
  { id: "12", name: "Pure Ghee", nameHindi: "शुद्ध घी", price: 550, unit: "1 L", category: "oils", image: "/placeholder.svg", inStock: true, discount: 12 },
  { id: "13", name: "Groundnut Oil", nameHindi: "मूंगफली तेल", price: 200, unit: "1 L", category: "oils", image: "/placeholder.svg", inStock: true },
  
  // Dairy Products
  { id: "14", name: "Fresh Paneer", nameHindi: "ताजा पनीर", price: 80, unit: "200 g", category: "dairy", image: "/placeholder.svg", inStock: true },
  { id: "15", name: "Amul Butter", nameHindi: "अमूल मक्खन", price: 56, unit: "100 g", category: "dairy", image: "/placeholder.svg", inStock: true },
  { id: "16", name: "Curd", nameHindi: "दही", price: 40, unit: "400 g", category: "dairy", image: "/placeholder.svg", inStock: true },
  
  // Snacks & Namkeen
  { id: "17", name: "Sev Bhujia", nameHindi: "सेव भुजिया", price: 45, unit: "200 g", category: "snacks", image: "/placeholder.svg", inStock: true },
  { id: "18", name: "Mixture Namkeen", nameHindi: "मिक्सचर", price: 50, unit: "200 g", category: "snacks", image: "/placeholder.svg", inStock: true },
  { id: "19", name: "Parle-G Biscuits", nameHindi: "पारले-जी", price: 10, unit: "80 g", category: "snacks", image: "/placeholder.svg", inStock: true },
  
  // Tea & Beverages
  { id: "20", name: "Tata Tea Gold", nameHindi: "टाटा टी गोल्ड", price: 95, unit: "250 g", category: "beverages", image: "/placeholder.svg", inStock: true },
  { id: "21", name: "Nescafe Coffee", nameHindi: "नेस्कैफे कॉफी", price: 120, unit: "50 g", category: "beverages", image: "/placeholder.svg", inStock: true },
  { id: "22", name: "Sugar", nameHindi: "चीनी", price: 42, unit: "1 kg", category: "beverages", image: "/placeholder.svg", inStock: true },
  
  // Personal Care
  { id: "23", name: "Lifebuoy Soap", nameHindi: "लाइफबॉय साबुन", price: 35, unit: "100 g", category: "personal", image: "/placeholder.svg", inStock: true },
  { id: "24", name: "Colgate Toothpaste", nameHindi: "कोलगेट", price: 55, unit: "100 g", category: "personal", image: "/placeholder.svg", inStock: true },
  { id: "25", name: "Hair Oil", nameHindi: "बालों का तेल", price: 85, unit: "200 ml", category: "personal", image: "/placeholder.svg", inStock: true },
];
