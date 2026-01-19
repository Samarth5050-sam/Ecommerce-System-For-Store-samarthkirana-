import { Product, Category, StoreInfo } from "@/types/store";

// Product Images
import basmatiRice from "@/assets/products/basmati-rice.jpg";
import wheatFlour from "@/assets/products/wheat-flour.jpg";
import poha from "@/assets/products/poha.jpg";
import toorDal from "@/assets/products/toor-dal.jpg";
import moongDal from "@/assets/products/moong-dal.jpg";
import chanaDal from "@/assets/products/chana-dal.jpg";
import turmeric from "@/assets/products/turmeric.jpg";
import redChilli from "@/assets/products/red-chilli.jpg";
import garamMasala from "@/assets/products/garam-masala.jpg";
import coriander from "@/assets/products/coriander.jpg";
import sunflowerOil from "@/assets/products/sunflower-oil.jpg";
import pureGhee from "@/assets/products/pure-ghee.jpg";
import groundnutOil from "@/assets/products/groundnut-oil.jpg";
import paneer from "@/assets/products/paneer.jpg";
import amulButter from "@/assets/products/amul-butter.jpg";
import curd from "@/assets/products/curd.jpg";
import sevBhujia from "@/assets/products/sev-bhujia.jpg";
import mixture from "@/assets/products/mixture.jpg";
import parleG from "@/assets/products/parle-g.jpg";
import tataTea from "@/assets/products/tata-tea.jpg";
import nescafe from "@/assets/products/nescafe.jpg";
import sugar from "@/assets/products/sugar.jpg";
import lifebuoy from "@/assets/products/lifebuoy.jpg";
import colgate from "@/assets/products/colgate.jpg";
import hairOil from "@/assets/products/hair-oil.jpg";

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
  { id: "1", name: "Basmati Rice", nameHindi: "बासमती चावल", price: 120, unit: "1 kg", category: "grains", image: basmatiRice, inStock: true, discount: 10 },
  { id: "2", name: "Wheat Flour (Atta)", nameHindi: "गेहूं का आटा", price: 45, unit: "1 kg", category: "grains", image: wheatFlour, inStock: true },
  { id: "3", name: "Poha", nameHindi: "पोहा", price: 35, unit: "500 g", category: "grains", image: poha, inStock: true },
  
  // Pulses & Dals
  { id: "4", name: "Toor Dal", nameHindi: "तूर दाल", price: 140, unit: "1 kg", category: "pulses", image: toorDal, inStock: true, discount: 5 },
  { id: "5", name: "Moong Dal", nameHindi: "मूंग दाल", price: 130, unit: "1 kg", category: "pulses", image: moongDal, inStock: true },
  { id: "6", name: "Chana Dal", nameHindi: "चना दाल", price: 85, unit: "1 kg", category: "pulses", image: chanaDal, inStock: true },
  
  // Spices & Masalas
  { id: "7", name: "Turmeric Powder", nameHindi: "हल्दी", price: 25, unit: "100 g", category: "spices", image: turmeric, inStock: true },
  { id: "8", name: "Red Chilli Powder", nameHindi: "लाल मिर्च", price: 40, unit: "100 g", category: "spices", image: redChilli, inStock: true },
  { id: "9", name: "Garam Masala", nameHindi: "गरम मसाला", price: 55, unit: "100 g", category: "spices", image: garamMasala, inStock: true, discount: 8 },
  { id: "10", name: "Coriander Powder", nameHindi: "धनिया पाउडर", price: 30, unit: "100 g", category: "spices", image: coriander, inStock: true },
  
  // Oils & Ghee
  { id: "11", name: "Sunflower Oil", nameHindi: "सूरजमुखी तेल", price: 180, unit: "1 L", category: "oils", image: sunflowerOil, inStock: true },
  { id: "12", name: "Pure Ghee", nameHindi: "शुद्ध घी", price: 550, unit: "1 L", category: "oils", image: pureGhee, inStock: true, discount: 12 },
  { id: "13", name: "Groundnut Oil", nameHindi: "मूंगफली तेल", price: 200, unit: "1 L", category: "oils", image: groundnutOil, inStock: true },
  
  // Dairy Products
  { id: "14", name: "Fresh Paneer", nameHindi: "ताजा पनीर", price: 80, unit: "200 g", category: "dairy", image: paneer, inStock: true },
  { id: "15", name: "Amul Butter", nameHindi: "अमूल मक्खन", price: 56, unit: "100 g", category: "dairy", image: amulButter, inStock: true },
  { id: "16", name: "Curd", nameHindi: "दही", price: 40, unit: "400 g", category: "dairy", image: curd, inStock: true },
  
  // Snacks & Namkeen
  { id: "17", name: "Sev Bhujia", nameHindi: "सेव भुजिया", price: 45, unit: "200 g", category: "snacks", image: sevBhujia, inStock: true },
  { id: "18", name: "Mixture Namkeen", nameHindi: "मिक्सचर", price: 50, unit: "200 g", category: "snacks", image: mixture, inStock: true },
  { id: "19", name: "Parle-G Biscuits", nameHindi: "पारले-जी", price: 10, unit: "80 g", category: "snacks", image: parleG, inStock: true },
  
  // Tea & Beverages
  { id: "20", name: "Tata Tea Gold", nameHindi: "टाटा टी गोल्ड", price: 95, unit: "250 g", category: "beverages", image: tataTea, inStock: true },
  { id: "21", name: "Nescafe Coffee", nameHindi: "नेस्कैफे कॉफी", price: 120, unit: "50 g", category: "beverages", image: nescafe, inStock: true },
  { id: "22", name: "Sugar", nameHindi: "चीनी", price: 42, unit: "1 kg", category: "beverages", image: sugar, inStock: true },
  
  // Personal Care
  { id: "23", name: "Lifebuoy Soap", nameHindi: "लाइफबॉय साबुन", price: 35, unit: "100 g", category: "personal", image: lifebuoy, inStock: true },
  { id: "24", name: "Colgate Toothpaste", nameHindi: "कोलगेट", price: 55, unit: "100 g", category: "personal", image: colgate, inStock: true },
  { id: "25", name: "Hair Oil", nameHindi: "बालों का तेल", price: 85, unit: "200 ml", category: "personal", image: hairOil, inStock: true },
];
