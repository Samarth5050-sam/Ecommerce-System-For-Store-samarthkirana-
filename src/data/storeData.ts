import { Product, Category, StoreInfo } from "@/types/store";

// Product Images - Grains
import basmatiRice from "@/assets/products/basmati-rice.jpg";
import wheatFlour from "@/assets/products/wheat-flour.jpg";
import poha from "@/assets/products/poha.jpg";
import sonaMasoori from "@/assets/products/sona-masoori.jpg";
import brownRice from "@/assets/products/brown-rice.jpg";
import sujiRava from "@/assets/products/suji-rava.jpg";
import besan from "@/assets/products/besan.jpg";
import maida from "@/assets/products/maida.jpg";

// Product Images - Pulses & Dals
import toorDal from "@/assets/products/toor-dal.jpg";
import moongDal from "@/assets/products/moong-dal.jpg";
import chanaDal from "@/assets/products/chana-dal.jpg";
import uradDal from "@/assets/products/urad-dal.jpg";
import masoorDal from "@/assets/products/masoor-dal.jpg";
import rajma from "@/assets/products/rajma.jpg";
import kabuliChana from "@/assets/products/kabuli-chana.jpg";

// Product Images - Spices (Generic)
import turmeric from "@/assets/products/turmeric.jpg";
import redChilli from "@/assets/products/red-chilli.jpg";
import garamMasala from "@/assets/products/garam-masala.jpg";
import coriander from "@/assets/products/coriander.jpg";

// Product Images - Everest Spices
import everestTurmeric from "@/assets/products/everest-turmeric.jpg";
import everestChilli from "@/assets/products/everest-chilli.jpg";
import everestGaramMasala from "@/assets/products/everest-garam-masala.jpg";

// Product Images - Suhana Spices
import suhanaCoriander from "@/assets/products/suhana-coriander.jpg";
import suhanaBiryani from "@/assets/products/suhana-biryani.jpg";
import suhanaKitchenKing from "@/assets/products/suhana-kitchen-king.jpg";

// Product Images - Rambandhu Spices
import rambandhuCumin from "@/assets/products/rambandhu-cumin.jpg";
import rambandhuChaat from "@/assets/products/rambandhu-chaat.jpg";
import rambandhuPavBhaji from "@/assets/products/rambandhu-pavbhaji.jpg";

// Product Images - Whole Spices
import blackPepper from "@/assets/products/black-pepper.jpg";
import mustardSeeds from "@/assets/products/mustard-seeds.jpg";
import cuminSeeds from "@/assets/products/cumin-seeds.jpg";
import hing from "@/assets/products/hing.jpg";
import methiSeeds from "@/assets/products/methi-seeds.jpg";
import ajwain from "@/assets/products/ajwain.jpg";

// Product Images - Oils & Ghee
import sunflowerOil from "@/assets/products/sunflower-oil.jpg";
import pureGhee from "@/assets/products/pure-ghee.jpg";
import groundnutOil from "@/assets/products/groundnut-oil.jpg";
import fortuneOil from "@/assets/products/fortune-oil.jpg";
import saffolaOil from "@/assets/products/saffola-oil.jpg";
import mustardOil from "@/assets/products/mustard-oil.jpg";
import amulGhee from "@/assets/products/amul-ghee.jpg";

// Product Images - Dairy
import paneer from "@/assets/products/paneer.jpg";
import amulButter from "@/assets/products/amul-butter.jpg";
import curd from "@/assets/products/curd.jpg";
import amulMilk from "@/assets/products/amul-milk.jpg";
import amulCheese from "@/assets/products/amul-cheese.jpg";
import lassi from "@/assets/products/lassi.jpg";

// Product Images - Snacks
import sevBhujia from "@/assets/products/sev-bhujia.jpg";
import mixture from "@/assets/products/mixture.jpg";
import parleG from "@/assets/products/parle-g.jpg";
import alooBhujia from "@/assets/products/aloo-bhujia.jpg";
import moongDalNamkeen from "@/assets/products/moong-dal-namkeen.jpg";
import marieGold from "@/assets/products/marie-gold.jpg";
import goodDay from "@/assets/products/good-day.jpg";
import kurkure from "@/assets/products/kurkure.jpg";
import lays from "@/assets/products/lays.jpg";

// Product Images - Beverages
import tataTea from "@/assets/products/tata-tea.jpg";
import nescafe from "@/assets/products/nescafe.jpg";
import sugar from "@/assets/products/sugar.jpg";
import redLabelTea from "@/assets/products/red-label-tea.jpg";
import bruCoffee from "@/assets/products/bru-coffee.jpg";
import horlicks from "@/assets/products/horlicks.jpg";
import bournvita from "@/assets/products/bournvita.jpg";

// Product Images - Personal Care (Soaps & Detergents)
import lifebuoy from "@/assets/products/lifebuoy.jpg";
import colgate from "@/assets/products/colgate.jpg";
import hairOil from "@/assets/products/hair-oil.jpg";
import santoorSoap from "@/assets/products/santoor-soap.jpg";
import luxSoap from "@/assets/products/lux-soap.jpg";
import dettolSoap from "@/assets/products/dettol-soap.jpg";
import pearsSoap from "@/assets/products/pears-soap.jpg";
import motiSoap from "@/assets/products/moti-soap.jpg";
import wheelDetergent from "@/assets/products/wheel-detergent.jpg";
import vimBar from "@/assets/products/vim-bar.jpg";
import surfExcel from "@/assets/products/surf-excel.jpg";
import godrejSoap from "@/assets/products/godrej-soap.jpg";
import nirmaPowder from "@/assets/products/nirma-powder.jpg";
import cintholSoap from "@/assets/products/cinthol-soap.jpg";
import hamamSoap from "@/assets/products/hamam-soap.jpg";
import medimixSoap from "@/assets/products/medimix-soap.jpg";
import doveSoap from "@/assets/products/dove-soap.jpg";
import rinBar from "@/assets/products/rin-bar.jpg";
import closeup from "@/assets/products/closeup.jpg";
import pepsodent from "@/assets/products/pepsodent.jpg";
import parachuteOil from "@/assets/products/parachute-oil.jpg";
import clinicPlus from "@/assets/products/clinic-plus.jpg";

export const storeInfo: StoreInfo = {
  name: "Samarth Kirana & General Stores",
  owner: "Samarth Shinde",
  contact: "9699374346",
  address: "Bavachi",
  fullAddress: "Bavachi, Tal. Walwa, Dist. Sangli, Maharashtra 415409, India",
  tagline: "Your Trusted Neighborhood Store",
  whatsappNumber: "919699374346"
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
  // ========== GRAINS & RICE (25+ items) ==========
  { id: "g1", name: "Basmati Rice Premium", nameHindi: "बासमती चावल प्रीमियम", price: 120, unit: "1 kg", category: "grains", image: basmatiRice, inStock: true, discount: 10 },
  { id: "g2", name: "Basmati Rice Regular", nameHindi: "बासमती चावल", price: 85, unit: "1 kg", category: "grains", image: basmatiRice, inStock: true },
  { id: "g3", name: "Sona Masoori Rice", nameHindi: "सोना मसूरी चावल", price: 65, unit: "1 kg", category: "grains", image: sonaMasoori, inStock: true },
  { id: "g4", name: "Sona Masoori Rice", nameHindi: "सोना मसूरी चावल", price: 310, unit: "5 kg", category: "grains", image: sonaMasoori, inStock: true, discount: 5 },
  { id: "g5", name: "Brown Rice", nameHindi: "ब्राउन राइस", price: 95, unit: "1 kg", category: "grains", image: brownRice, inStock: true },
  { id: "g6", name: "Wheat Flour (Atta)", nameHindi: "गेहूं का आटा", price: 45, unit: "1 kg", category: "grains", image: wheatFlour, inStock: true },
  { id: "g7", name: "Wheat Flour (Atta)", nameHindi: "गेहूं का आटा", price: 210, unit: "5 kg", category: "grains", image: wheatFlour, inStock: true, discount: 8 },
  { id: "g8", name: "Wheat Flour (Atta)", nameHindi: "गेहूं का आटा", price: 400, unit: "10 kg", category: "grains", image: wheatFlour, inStock: true, discount: 12 },
  { id: "g9", name: "Chakki Fresh Atta", nameHindi: "चक्की फ्रेश आटा", price: 55, unit: "1 kg", category: "grains", image: wheatFlour, inStock: true },
  { id: "g10", name: "Multigrain Atta", nameHindi: "मल्टीग्रेन आटा", price: 75, unit: "1 kg", category: "grains", image: wheatFlour, inStock: true },
  { id: "g11", name: "Poha (Thick)", nameHindi: "पोहा (मोटा)", price: 35, unit: "500 g", category: "grains", image: poha, inStock: true },
  { id: "g12", name: "Poha (Thin)", nameHindi: "पोहा (पतला)", price: 35, unit: "500 g", category: "grains", image: poha, inStock: true },
  { id: "g13", name: "Poha", nameHindi: "पोहा", price: 65, unit: "1 kg", category: "grains", image: poha, inStock: true },
  { id: "g14", name: "Suji (Semolina)", nameHindi: "सूजी", price: 40, unit: "500 g", category: "grains", image: sujiRava, inStock: true },
  { id: "g15", name: "Suji (Semolina)", nameHindi: "सूजी", price: 75, unit: "1 kg", category: "grains", image: sujiRava, inStock: true },
  { id: "g16", name: "Rava (Sooji)", nameHindi: "रवा", price: 45, unit: "500 g", category: "grains", image: sujiRava, inStock: true },
  { id: "g17", name: "Besan (Gram Flour)", nameHindi: "बेसन", price: 55, unit: "500 g", category: "grains", image: besan, inStock: true },
  { id: "g18", name: "Besan (Gram Flour)", nameHindi: "बेसन", price: 100, unit: "1 kg", category: "grains", image: besan, inStock: true },
  { id: "g19", name: "Maida (All Purpose)", nameHindi: "मैदा", price: 35, unit: "500 g", category: "grains", image: maida, inStock: true },
  { id: "g20", name: "Maida (All Purpose)", nameHindi: "मैदा", price: 65, unit: "1 kg", category: "grains", image: maida, inStock: true },
  { id: "g21", name: "Rice Flour", nameHindi: "चावल का आटा", price: 45, unit: "500 g", category: "grains", image: sonaMasoori, inStock: true },
  { id: "g22", name: "Corn Flour", nameHindi: "कॉर्न फ्लोर", price: 30, unit: "200 g", category: "grains", image: maida, inStock: true },
  { id: "g23", name: "Daliya (Broken Wheat)", nameHindi: "दलिया", price: 40, unit: "500 g", category: "grains", image: wheatFlour, inStock: true },
  { id: "g24", name: "Sabudana", nameHindi: "साबूदाना", price: 65, unit: "500 g", category: "grains", image: poha, inStock: true },
  { id: "g25", name: "Jowar Flour", nameHindi: "ज्वार का आटा", price: 55, unit: "500 g", category: "grains", image: wheatFlour, inStock: true },

  // ========== PULSES & DALS (25+ items) ==========
  { id: "p1", name: "Toor Dal", nameHindi: "तूर दाल", price: 140, unit: "1 kg", category: "pulses", image: toorDal, inStock: true, discount: 5 },
  { id: "p2", name: "Toor Dal", nameHindi: "तूर दाल", price: 75, unit: "500 g", category: "pulses", image: toorDal, inStock: true },
  { id: "p3", name: "Toor Dal Premium", nameHindi: "तूर दाल प्रीमियम", price: 165, unit: "1 kg", category: "pulses", image: toorDal, inStock: true },
  { id: "p4", name: "Moong Dal (Yellow)", nameHindi: "मूंग दाल (पीली)", price: 130, unit: "1 kg", category: "pulses", image: moongDal, inStock: true },
  { id: "p5", name: "Moong Dal", nameHindi: "मूंग दाल", price: 70, unit: "500 g", category: "pulses", image: moongDal, inStock: true },
  { id: "p6", name: "Moong Whole (Green)", nameHindi: "साबुत मूंग", price: 120, unit: "1 kg", category: "pulses", image: moongDal, inStock: true },
  { id: "p7", name: "Chana Dal", nameHindi: "चना दाल", price: 85, unit: "1 kg", category: "pulses", image: chanaDal, inStock: true },
  { id: "p8", name: "Chana Dal", nameHindi: "चना दाल", price: 45, unit: "500 g", category: "pulses", image: chanaDal, inStock: true },
  { id: "p9", name: "Urad Dal (White)", nameHindi: "उड़द दाल (सफेद)", price: 140, unit: "1 kg", category: "pulses", image: uradDal, inStock: true },
  { id: "p10", name: "Urad Dal (Black)", nameHindi: "उड़द दाल (काली)", price: 130, unit: "1 kg", category: "pulses", image: uradDal, inStock: true },
  { id: "p11", name: "Urad Dal Chilka", nameHindi: "उड़द दाल छिलका", price: 125, unit: "1 kg", category: "pulses", image: uradDal, inStock: true },
  { id: "p12", name: "Masoor Dal (Red)", nameHindi: "मसूर दाल", price: 95, unit: "1 kg", category: "pulses", image: masoorDal, inStock: true },
  { id: "p13", name: "Masoor Dal", nameHindi: "मसूर दाल", price: 50, unit: "500 g", category: "pulses", image: masoorDal, inStock: true },
  { id: "p14", name: "Masoor Whole", nameHindi: "साबुत मसूर", price: 85, unit: "1 kg", category: "pulses", image: masoorDal, inStock: true },
  { id: "p15", name: "Rajma (Red)", nameHindi: "राजमा (लाल)", price: 160, unit: "1 kg", category: "pulses", image: rajma, inStock: true, discount: 8 },
  { id: "p16", name: "Rajma (Jammu)", nameHindi: "राजमा (जम्मू)", price: 180, unit: "1 kg", category: "pulses", image: rajma, inStock: true },
  { id: "p17", name: "Rajma", nameHindi: "राजमा", price: 85, unit: "500 g", category: "pulses", image: rajma, inStock: true },
  { id: "p18", name: "Kabuli Chana", nameHindi: "काबुली चना", price: 140, unit: "1 kg", category: "pulses", image: kabuliChana, inStock: true },
  { id: "p19", name: "Kabuli Chana", nameHindi: "काबुली चना", price: 75, unit: "500 g", category: "pulses", image: kabuliChana, inStock: true },
  { id: "p20", name: "Kala Chana", nameHindi: "काला चना", price: 90, unit: "1 kg", category: "pulses", image: chanaDal, inStock: true },
  { id: "p21", name: "Moth Dal", nameHindi: "मोठ दाल", price: 110, unit: "1 kg", category: "pulses", image: moongDal, inStock: true },
  { id: "p22", name: "Lobiya (Black Eyed)", nameHindi: "लोबिया", price: 120, unit: "1 kg", category: "pulses", image: rajma, inStock: true },
  { id: "p23", name: "Mix Dal", nameHindi: "मिक्स दाल", price: 100, unit: "1 kg", category: "pulses", image: toorDal, inStock: true },
  { id: "p24", name: "Kulthi Dal", nameHindi: "कुल्थी दाल", price: 95, unit: "500 g", category: "pulses", image: masoorDal, inStock: true },
  { id: "p25", name: "Val Dal", nameHindi: "वाल दाल", price: 130, unit: "1 kg", category: "pulses", image: uradDal, inStock: true },

  // ========== SPICES & MASALAS (25+ items) ==========
  // Generic Spices
  { id: "s1", name: "Turmeric Powder", nameHindi: "हल्दी पाउडर", price: 25, unit: "100 g", category: "spices", image: turmeric, inStock: true },
  { id: "s2", name: "Turmeric Powder", nameHindi: "हल्दी पाउडर", price: 45, unit: "200 g", category: "spices", image: turmeric, inStock: true },
  { id: "s3", name: "Red Chilli Powder", nameHindi: "लाल मिर्च पाउडर", price: 40, unit: "100 g", category: "spices", image: redChilli, inStock: true },
  { id: "s4", name: "Red Chilli Powder", nameHindi: "लाल मिर्च पाउडर", price: 75, unit: "200 g", category: "spices", image: redChilli, inStock: true },
  { id: "s5", name: "Garam Masala", nameHindi: "गरम मसाला", price: 55, unit: "100 g", category: "spices", image: garamMasala, inStock: true },
  { id: "s6", name: "Coriander Powder", nameHindi: "धनिया पाउडर", price: 30, unit: "100 g", category: "spices", image: coriander, inStock: true },
  
  // Everest Spices
  { id: "s7", name: "Everest Turmeric", nameHindi: "एवरेस्ट हल्दी", price: 45, unit: "100 g", category: "spices", image: everestTurmeric, inStock: true },
  { id: "s8", name: "Everest Turmeric", nameHindi: "एवरेस्ट हल्दी", price: 85, unit: "200 g", category: "spices", image: everestTurmeric, inStock: true },
  { id: "s9", name: "Everest Red Chilli", nameHindi: "एवरेस्ट लाल मिर्च", price: 55, unit: "100 g", category: "spices", image: everestChilli, inStock: true, discount: 5 },
  { id: "s10", name: "Everest Garam Masala", nameHindi: "एवरेस्ट गरम मसाला", price: 75, unit: "100 g", category: "spices", image: everestGaramMasala, inStock: true },
  { id: "s11", name: "Everest Sambhar Masala", nameHindi: "एवरेस्ट सांभर मसाला", price: 45, unit: "50 g", category: "spices", image: everestGaramMasala, inStock: true },
  { id: "s12", name: "Everest Meat Masala", nameHindi: "एवरेस्ट मीट मसाला", price: 65, unit: "50 g", category: "spices", image: everestChilli, inStock: true },
  
  // Suhana Spices
  { id: "s13", name: "Suhana Coriander", nameHindi: "सुहाना धनिया", price: 40, unit: "100 g", category: "spices", image: suhanaCoriander, inStock: true },
  { id: "s14", name: "Suhana Biryani Masala", nameHindi: "सुहाना बिरयानी मसाला", price: 65, unit: "50 g", category: "spices", image: suhanaBiryani, inStock: true, discount: 10 },
  { id: "s15", name: "Suhana Kitchen King", nameHindi: "सुहाना किचन किंग", price: 70, unit: "100 g", category: "spices", image: suhanaKitchenKing, inStock: true },
  { id: "s16", name: "Suhana Chicken Masala", nameHindi: "सुहाना चिकन मसाला", price: 55, unit: "50 g", category: "spices", image: suhanaBiryani, inStock: true },
  { id: "s17", name: "Suhana Paneer Masala", nameHindi: "सुहाना पनीर मसाला", price: 50, unit: "50 g", category: "spices", image: suhanaKitchenKing, inStock: true },
  
  // Rambandhu Spices
  { id: "s18", name: "Rambandhu Cumin", nameHindi: "रामबंधु जीरा", price: 50, unit: "100 g", category: "spices", image: rambandhuCumin, inStock: true },
  { id: "s19", name: "Rambandhu Chaat Masala", nameHindi: "रामबंधु चाट मसाला", price: 45, unit: "100 g", category: "spices", image: rambandhuChaat, inStock: true },
  { id: "s20", name: "Rambandhu Pav Bhaji", nameHindi: "रामबंधु पाव भाजी", price: 55, unit: "100 g", category: "spices", image: rambandhuPavBhaji, inStock: true, discount: 8 },
  { id: "s21", name: "Rambandhu Goda Masala", nameHindi: "रामबंधु गोडा मसाला", price: 60, unit: "100 g", category: "spices", image: rambandhuCumin, inStock: true },
  
  // Whole Spices
  { id: "s22", name: "Black Pepper", nameHindi: "काली मिर्च", price: 120, unit: "100 g", category: "spices", image: blackPepper, inStock: true },
  { id: "s23", name: "Mustard Seeds", nameHindi: "राई", price: 25, unit: "100 g", category: "spices", image: mustardSeeds, inStock: true },
  { id: "s24", name: "Cumin Seeds (Jeera)", nameHindi: "जीरा", price: 60, unit: "100 g", category: "spices", image: cuminSeeds, inStock: true },
  { id: "s25", name: "Hing (Asafoetida)", nameHindi: "हींग", price: 85, unit: "50 g", category: "spices", image: hing, inStock: true },
  { id: "s26", name: "Methi Seeds", nameHindi: "मेथी दाना", price: 30, unit: "100 g", category: "spices", image: methiSeeds, inStock: true },
  { id: "s27", name: "Ajwain (Carom)", nameHindi: "अजवाइन", price: 35, unit: "100 g", category: "spices", image: ajwain, inStock: true },

  // ========== OILS & GHEE (25+ items) ==========
  { id: "o1", name: "Sunflower Oil", nameHindi: "सूरजमुखी तेल", price: 180, unit: "1 L", category: "oils", image: sunflowerOil, inStock: true },
  { id: "o2", name: "Sunflower Oil", nameHindi: "सूरजमुखी तेल", price: 450, unit: "5 L", category: "oils", image: sunflowerOil, inStock: true, discount: 10 },
  { id: "o3", name: "Fortune Sunflower Oil", nameHindi: "फॉर्चून सूरजमुखी तेल", price: 195, unit: "1 L", category: "oils", image: fortuneOil, inStock: true },
  { id: "o4", name: "Fortune Sunflower Oil", nameHindi: "फॉर्चून सूरजमुखी तेल", price: 490, unit: "5 L", category: "oils", image: fortuneOil, inStock: true, discount: 8 },
  { id: "o5", name: "Saffola Gold Oil", nameHindi: "सफोला गोल्ड तेल", price: 220, unit: "1 L", category: "oils", image: saffolaOil, inStock: true },
  { id: "o6", name: "Saffola Active Oil", nameHindi: "सफोला एक्टिव तेल", price: 200, unit: "1 L", category: "oils", image: saffolaOil, inStock: true },
  { id: "o7", name: "Groundnut Oil", nameHindi: "मूंगफली तेल", price: 200, unit: "1 L", category: "oils", image: groundnutOil, inStock: true },
  { id: "o8", name: "Groundnut Oil", nameHindi: "मूंगफली तेल", price: 500, unit: "5 L", category: "oils", image: groundnutOil, inStock: true, discount: 12 },
  { id: "o9", name: "Mustard Oil", nameHindi: "सरसों का तेल", price: 175, unit: "1 L", category: "oils", image: mustardOil, inStock: true },
  { id: "o10", name: "Mustard Oil", nameHindi: "सरसों का तेल", price: 95, unit: "500 ml", category: "oils", image: mustardOil, inStock: true },
  { id: "o11", name: "Coconut Oil", nameHindi: "नारियल तेल", price: 160, unit: "500 ml", category: "oils", image: groundnutOil, inStock: true },
  { id: "o12", name: "Coconut Oil", nameHindi: "नारियल तेल", price: 300, unit: "1 L", category: "oils", image: groundnutOil, inStock: true },
  { id: "o13", name: "Refined Oil", nameHindi: "रिफाइंड तेल", price: 140, unit: "1 L", category: "oils", image: sunflowerOil, inStock: true },
  { id: "o14", name: "Pure Ghee", nameHindi: "शुद्ध घी", price: 550, unit: "1 L", category: "oils", image: pureGhee, inStock: true, discount: 12 },
  { id: "o15", name: "Pure Ghee", nameHindi: "शुद्ध घी", price: 300, unit: "500 ml", category: "oils", image: pureGhee, inStock: true },
  { id: "o16", name: "Amul Ghee", nameHindi: "अमूल घी", price: 580, unit: "1 L", category: "oils", image: amulGhee, inStock: true },
  { id: "o17", name: "Amul Ghee", nameHindi: "अमूल घी", price: 310, unit: "500 ml", category: "oils", image: amulGhee, inStock: true },
  { id: "o18", name: "Amul Ghee", nameHindi: "अमूल घी", price: 165, unit: "200 ml", category: "oils", image: amulGhee, inStock: true },
  { id: "o19", name: "Patanjali Ghee", nameHindi: "पतंजलि घी", price: 520, unit: "1 L", category: "oils", image: pureGhee, inStock: true },
  { id: "o20", name: "Sesame Oil (Til)", nameHindi: "तिल का तेल", price: 180, unit: "500 ml", category: "oils", image: mustardOil, inStock: true },
  { id: "o21", name: "Rice Bran Oil", nameHindi: "राइस ब्रान तेल", price: 165, unit: "1 L", category: "oils", image: fortuneOil, inStock: true },
  { id: "o22", name: "Olive Oil", nameHindi: "जैतून का तेल", price: 450, unit: "500 ml", category: "oils", image: saffolaOil, inStock: true },
  { id: "o23", name: "Dalda Vanaspati", nameHindi: "डालडा वनस्पति", price: 145, unit: "1 L", category: "oils", image: pureGhee, inStock: true },
  { id: "o24", name: "Dalda Vanaspati", nameHindi: "डालडा वनस्पति", price: 75, unit: "500 g", category: "oils", image: pureGhee, inStock: true },
  { id: "o25", name: "Cooking Oil Pouch", nameHindi: "खाना पकाने का तेल", price: 35, unit: "200 ml", category: "oils", image: sunflowerOil, inStock: true },

  // ========== DAIRY PRODUCTS (25+ items) ==========
  { id: "d1", name: "Amul Milk (Full Cream)", nameHindi: "अमूल दूध (फुल क्रीम)", price: 68, unit: "1 L", category: "dairy", image: amulMilk, inStock: true },
  { id: "d2", name: "Amul Milk (Toned)", nameHindi: "अमूल दूध (टोंड)", price: 56, unit: "1 L", category: "dairy", image: amulMilk, inStock: true },
  { id: "d3", name: "Amul Milk Pouch", nameHindi: "अमूल दूध पाउच", price: 30, unit: "500 ml", category: "dairy", image: amulMilk, inStock: true },
  { id: "d4", name: "Fresh Paneer", nameHindi: "ताजा पनीर", price: 80, unit: "200 g", category: "dairy", image: paneer, inStock: true },
  { id: "d5", name: "Fresh Paneer", nameHindi: "ताजा पनीर", price: 150, unit: "500 g", category: "dairy", image: paneer, inStock: true, discount: 5 },
  { id: "d6", name: "Amul Paneer", nameHindi: "अमूल पनीर", price: 95, unit: "200 g", category: "dairy", image: paneer, inStock: true },
  { id: "d7", name: "Amul Butter", nameHindi: "अमूल मक्खन", price: 56, unit: "100 g", category: "dairy", image: amulButter, inStock: true },
  { id: "d8", name: "Amul Butter", nameHindi: "अमूल मक्खन", price: 270, unit: "500 g", category: "dairy", image: amulButter, inStock: true, discount: 8 },
  { id: "d9", name: "Amul Butter (Unsalted)", nameHindi: "अमूल मक्खन (नमक रहित)", price: 60, unit: "100 g", category: "dairy", image: amulButter, inStock: true },
  { id: "d10", name: "Fresh Curd", nameHindi: "ताजा दही", price: 40, unit: "400 g", category: "dairy", image: curd, inStock: true },
  { id: "d11", name: "Fresh Curd", nameHindi: "ताजा दही", price: 25, unit: "200 g", category: "dairy", image: curd, inStock: true },
  { id: "d12", name: "Amul Dahi", nameHindi: "अमूल दही", price: 45, unit: "400 g", category: "dairy", image: curd, inStock: true },
  { id: "d13", name: "Amul Cheese Slices", nameHindi: "अमूल चीज़ स्लाइस", price: 120, unit: "200 g", category: "dairy", image: amulCheese, inStock: true },
  { id: "d14", name: "Amul Cheese Cubes", nameHindi: "अमूल चीज़ क्यूब्स", price: 95, unit: "200 g", category: "dairy", image: amulCheese, inStock: true },
  { id: "d15", name: "Amul Cheese Block", nameHindi: "अमूल चीज़ ब्लॉक", price: 240, unit: "500 g", category: "dairy", image: amulCheese, inStock: true },
  { id: "d16", name: "Fresh Cream", nameHindi: "ताजा क्रीम", price: 55, unit: "200 ml", category: "dairy", image: amulMilk, inStock: true },
  { id: "d17", name: "Amul Fresh Cream", nameHindi: "अमूल फ्रेश क्रीम", price: 65, unit: "200 ml", category: "dairy", image: amulMilk, inStock: true },
  { id: "d18", name: "Sweet Lassi", nameHindi: "मीठी लस्सी", price: 25, unit: "200 ml", category: "dairy", image: lassi, inStock: true },
  { id: "d19", name: "Buttermilk (Chaas)", nameHindi: "छाछ", price: 20, unit: "500 ml", category: "dairy", image: lassi, inStock: true },
  { id: "d20", name: "Amul Lassi", nameHindi: "अमूल लस्सी", price: 30, unit: "200 ml", category: "dairy", image: lassi, inStock: true },
  { id: "d21", name: "Mango Lassi", nameHindi: "मैंगो लस्सी", price: 35, unit: "200 ml", category: "dairy", image: lassi, inStock: true },
  { id: "d22", name: "Shrikhand", nameHindi: "श्रीखंड", price: 60, unit: "100 g", category: "dairy", image: curd, inStock: true },
  { id: "d23", name: "Milk Powder", nameHindi: "दूध पाउडर", price: 180, unit: "500 g", category: "dairy", image: amulMilk, inStock: true },
  { id: "d24", name: "Condensed Milk", nameHindi: "कंडेंस्ड मिल्क", price: 95, unit: "200 g", category: "dairy", image: amulMilk, inStock: true },
  { id: "d25", name: "Khoya (Mawa)", nameHindi: "खोया (मावा)", price: 120, unit: "200 g", category: "dairy", image: paneer, inStock: true },

  // ========== SNACKS & NAMKEEN (25+ items) ==========
  { id: "sn1", name: "Haldiram Sev Bhujia", nameHindi: "हल्दीराम सेव भुजिया", price: 45, unit: "200 g", category: "snacks", image: sevBhujia, inStock: true },
  { id: "sn2", name: "Haldiram Sev Bhujia", nameHindi: "हल्दीराम सेव भुजिया", price: 85, unit: "400 g", category: "snacks", image: sevBhujia, inStock: true },
  { id: "sn3", name: "Haldiram Aloo Bhujia", nameHindi: "हल्दीराम आलू भुजिया", price: 50, unit: "200 g", category: "snacks", image: alooBhujia, inStock: true },
  { id: "sn4", name: "Haldiram Mixture", nameHindi: "हल्दीराम मिक्सचर", price: 50, unit: "200 g", category: "snacks", image: mixture, inStock: true },
  { id: "sn5", name: "Haldiram Moong Dal", nameHindi: "हल्दीराम मूंग दाल", price: 55, unit: "200 g", category: "snacks", image: moongDalNamkeen, inStock: true },
  { id: "sn6", name: "Parle-G Biscuits", nameHindi: "पारले-जी बिस्किट", price: 10, unit: "80 g", category: "snacks", image: parleG, inStock: true },
  { id: "sn7", name: "Parle-G Biscuits", nameHindi: "पारले-जी बिस्किट", price: 25, unit: "250 g", category: "snacks", image: parleG, inStock: true },
  { id: "sn8", name: "Parle-G Family Pack", nameHindi: "पारले-जी फैमिली पैक", price: 45, unit: "500 g", category: "snacks", image: parleG, inStock: true },
  { id: "sn9", name: "Britannia Marie Gold", nameHindi: "ब्रिटानिया मैरी गोल्ड", price: 35, unit: "200 g", category: "snacks", image: marieGold, inStock: true },
  { id: "sn10", name: "Britannia Marie Gold", nameHindi: "ब्रिटानिया मैरी गोल्ड", price: 60, unit: "400 g", category: "snacks", image: marieGold, inStock: true },
  { id: "sn11", name: "Britannia Good Day", nameHindi: "ब्रिटानिया गुड डे", price: 30, unit: "150 g", category: "snacks", image: goodDay, inStock: true },
  { id: "sn12", name: "Britannia Good Day", nameHindi: "ब्रिटानिया गुड डे", price: 55, unit: "300 g", category: "snacks", image: goodDay, inStock: true },
  { id: "sn13", name: "Kurkure Masala Munch", nameHindi: "कुरकुरे मसाला मंच", price: 10, unit: "35 g", category: "snacks", image: kurkure, inStock: true },
  { id: "sn14", name: "Kurkure Masala Munch", nameHindi: "कुरकुरे मसाला मंच", price: 20, unit: "90 g", category: "snacks", image: kurkure, inStock: true },
  { id: "sn15", name: "Kurkure Family Pack", nameHindi: "कुरकुरे फैमिली पैक", price: 50, unit: "180 g", category: "snacks", image: kurkure, inStock: true },
  { id: "sn16", name: "Lays Classic", nameHindi: "लेज़ क्लासिक", price: 10, unit: "25 g", category: "snacks", image: lays, inStock: true },
  { id: "sn17", name: "Lays Classic", nameHindi: "लेज़ क्लासिक", price: 20, unit: "52 g", category: "snacks", image: lays, inStock: true },
  { id: "sn18", name: "Lays Masala", nameHindi: "लेज़ मसाला", price: 20, unit: "52 g", category: "snacks", image: lays, inStock: true },
  { id: "sn19", name: "Lays Party Pack", nameHindi: "लेज़ पार्टी पैक", price: 85, unit: "177 g", category: "snacks", image: lays, inStock: true },
  { id: "sn20", name: "Chivda Namkeen", nameHindi: "चिवड़ा नमकीन", price: 40, unit: "200 g", category: "snacks", image: mixture, inStock: true },
  { id: "sn21", name: "Khakhra", nameHindi: "खाखरा", price: 35, unit: "200 g", category: "snacks", image: mixture, inStock: true },
  { id: "sn22", name: "Mathri", nameHindi: "मठरी", price: 30, unit: "200 g", category: "snacks", image: sevBhujia, inStock: true },
  { id: "sn23", name: "Chakli", nameHindi: "चकली", price: 45, unit: "200 g", category: "snacks", image: mixture, inStock: true },
  { id: "sn24", name: "Shakkar Para", nameHindi: "शक्कर पारे", price: 50, unit: "250 g", category: "snacks", image: goodDay, inStock: true },
  { id: "sn25", name: "Papdi", nameHindi: "पापड़ी", price: 40, unit: "200 g", category: "snacks", image: sevBhujia, inStock: true },

  // ========== TEA & BEVERAGES (25+ items) ==========
  { id: "b1", name: "Tata Tea Gold", nameHindi: "टाटा टी गोल्ड", price: 95, unit: "250 g", category: "beverages", image: tataTea, inStock: true },
  { id: "b2", name: "Tata Tea Gold", nameHindi: "टाटा टी गोल्ड", price: 180, unit: "500 g", category: "beverages", image: tataTea, inStock: true, discount: 5 },
  { id: "b3", name: "Tata Tea Premium", nameHindi: "टाटा टी प्रीमियम", price: 80, unit: "250 g", category: "beverages", image: tataTea, inStock: true },
  { id: "b4", name: "Red Label Tea", nameHindi: "रेड लेबल चाय", price: 105, unit: "250 g", category: "beverages", image: redLabelTea, inStock: true },
  { id: "b5", name: "Red Label Tea", nameHindi: "रेड लेबल चाय", price: 200, unit: "500 g", category: "beverages", image: redLabelTea, inStock: true, discount: 8 },
  { id: "b6", name: "Wagh Bakri Tea", nameHindi: "वाघ बकरी चाय", price: 110, unit: "250 g", category: "beverages", image: tataTea, inStock: true },
  { id: "b7", name: "Taj Mahal Tea", nameHindi: "ताज महल चाय", price: 130, unit: "250 g", category: "beverages", image: redLabelTea, inStock: true },
  { id: "b8", name: "Nescafe Classic", nameHindi: "नेस्कैफे क्लासिक", price: 120, unit: "50 g", category: "beverages", image: nescafe, inStock: true },
  { id: "b9", name: "Nescafe Classic", nameHindi: "नेस्कैफे क्लासिक", price: 230, unit: "100 g", category: "beverages", image: nescafe, inStock: true, discount: 10 },
  { id: "b10", name: "Bru Coffee", nameHindi: "ब्रू कॉफी", price: 110, unit: "50 g", category: "beverages", image: bruCoffee, inStock: true },
  { id: "b11", name: "Bru Coffee", nameHindi: "ब्रू कॉफी", price: 210, unit: "100 g", category: "beverages", image: bruCoffee, inStock: true },
  { id: "b12", name: "Bru Gold Coffee", nameHindi: "ब्रू गोल्ड कॉफी", price: 145, unit: "50 g", category: "beverages", image: bruCoffee, inStock: true },
  { id: "b13", name: "Sugar", nameHindi: "चीनी", price: 42, unit: "1 kg", category: "beverages", image: sugar, inStock: true },
  { id: "b14", name: "Sugar", nameHindi: "चीनी", price: 200, unit: "5 kg", category: "beverages", image: sugar, inStock: true, discount: 5 },
  { id: "b15", name: "Sugar Cubes", nameHindi: "शक्कर क्यूब्स", price: 55, unit: "500 g", category: "beverages", image: sugar, inStock: true },
  { id: "b16", name: "Jaggery (Gud)", nameHindi: "गुड़", price: 60, unit: "500 g", category: "beverages", image: sugar, inStock: true },
  { id: "b17", name: "Jaggery Powder", nameHindi: "गुड़ पाउडर", price: 70, unit: "500 g", category: "beverages", image: sugar, inStock: true },
  { id: "b18", name: "Horlicks Classic", nameHindi: "हॉर्लिक्स क्लासिक", price: 280, unit: "500 g", category: "beverages", image: horlicks, inStock: true },
  { id: "b19", name: "Horlicks Classic", nameHindi: "हॉर्लिक्स क्लासिक", price: 145, unit: "200 g", category: "beverages", image: horlicks, inStock: true },
  { id: "b20", name: "Bournvita", nameHindi: "बोर्नविटा", price: 240, unit: "500 g", category: "beverages", image: bournvita, inStock: true },
  { id: "b21", name: "Bournvita", nameHindi: "बोर्नविटा", price: 130, unit: "200 g", category: "beverages", image: bournvita, inStock: true },
  { id: "b22", name: "Complan", nameHindi: "कॉम्प्लान", price: 260, unit: "500 g", category: "beverages", image: horlicks, inStock: true },
  { id: "b23", name: "Green Tea", nameHindi: "ग्रीन टी", price: 150, unit: "100 g", category: "beverages", image: tataTea, inStock: true },
  { id: "b24", name: "Honey", nameHindi: "शहद", price: 180, unit: "250 g", category: "beverages", image: sugar, inStock: true },
  { id: "b25", name: "Honey", nameHindi: "शहद", price: 320, unit: "500 g", category: "beverages", image: sugar, inStock: true },

  // ========== PERSONAL CARE - SOAPS (25+ items) ==========
  { id: "pc1", name: "Lifebuoy Soap", nameHindi: "लाइफबॉय साबुन", price: 35, unit: "100 g", category: "personal", image: lifebuoy, inStock: true },
  { id: "pc2", name: "Lifebuoy Soap (4 Pack)", nameHindi: "लाइफबॉय साबुन (4 पैक)", price: 125, unit: "4x100 g", category: "personal", image: lifebuoy, inStock: true, discount: 10 },
  { id: "pc3", name: "Santoor Soap", nameHindi: "संतूर साबुन", price: 40, unit: "100 g", category: "personal", image: santoorSoap, inStock: true },
  { id: "pc4", name: "Santoor Soap (4 Pack)", nameHindi: "संतूर साबुन (4 पैक)", price: 145, unit: "4x100 g", category: "personal", image: santoorSoap, inStock: true, discount: 8 },
  { id: "pc5", name: "Lux Soap", nameHindi: "लक्स साबुन", price: 45, unit: "100 g", category: "personal", image: luxSoap, inStock: true },
  { id: "pc6", name: "Lux Soap (3 Pack)", nameHindi: "लक्स साबुन (3 पैक)", price: 120, unit: "3x100 g", category: "personal", image: luxSoap, inStock: true },
  { id: "pc7", name: "Dettol Soap", nameHindi: "डेटॉल साबुन", price: 48, unit: "100 g", category: "personal", image: dettolSoap, inStock: true },
  { id: "pc8", name: "Dettol Soap (3 Pack)", nameHindi: "डेटॉल साबुन (3 पैक)", price: 130, unit: "3x100 g", category: "personal", image: dettolSoap, inStock: true },
  { id: "pc9", name: "Pears Soap", nameHindi: "पियर्स साबुन", price: 65, unit: "100 g", category: "personal", image: pearsSoap, inStock: true },
  { id: "pc10", name: "Pears Soap (3 Pack)", nameHindi: "पियर्स साबुन (3 पैक)", price: 180, unit: "3x100 g", category: "personal", image: pearsSoap, inStock: true },
  { id: "pc11", name: "Moti Soap", nameHindi: "मोती साबुन", price: 15, unit: "75 g", category: "personal", image: motiSoap, inStock: true },
  { id: "pc12", name: "Moti Soap", nameHindi: "मोती साबुन", price: 25, unit: "125 g", category: "personal", image: motiSoap, inStock: true },
  { id: "pc13", name: "Cinthol Soap", nameHindi: "सिंथोल साबुन", price: 42, unit: "100 g", category: "personal", image: cintholSoap, inStock: true },
  { id: "pc14", name: "Godrej No.1 Soap", nameHindi: "गोदरेज नंबर वन", price: 28, unit: "100 g", category: "personal", image: godrejSoap, inStock: true },
  { id: "pc15", name: "Godrej No.1 (4 Pack)", nameHindi: "गोदरेज नंबर वन (4 पैक)", price: 99, unit: "4x100 g", category: "personal", image: godrejSoap, inStock: true, discount: 12 },
  { id: "pc16", name: "Dove Soap", nameHindi: "डव साबुन", price: 55, unit: "100 g", category: "personal", image: doveSoap, inStock: true },
  { id: "pc17", name: "Dove Soap (3 Pack)", nameHindi: "डव साबुन (3 पैक)", price: 150, unit: "3x100 g", category: "personal", image: doveSoap, inStock: true },
  { id: "pc18", name: "Hamam Soap", nameHindi: "हमाम साबुन", price: 38, unit: "100 g", category: "personal", image: hamamSoap, inStock: true },
  { id: "pc19", name: "Medimix Soap", nameHindi: "मेडिमिक्स साबुन", price: 45, unit: "125 g", category: "personal", image: medimixSoap, inStock: true },
  { id: "pc20", name: "Medimix Soap (3 Pack)", nameHindi: "मेडिमिक्स साबुन (3 पैक)", price: 125, unit: "3x125 g", category: "personal", image: medimixSoap, inStock: true },
  
  // Detergents & Cleaners
  { id: "pc21", name: "Wheel Detergent", nameHindi: "व्हील डिटर्जेंट", price: 10, unit: "130 g", category: "personal", image: wheelDetergent, inStock: true },
  { id: "pc22", name: "Wheel Detergent", nameHindi: "व्हील डिटर्जेंट", price: 95, unit: "1 kg", category: "personal", image: wheelDetergent, inStock: true },
  { id: "pc23", name: "Surf Excel", nameHindi: "सर्फ एक्सेल", price: 35, unit: "200 g", category: "personal", image: surfExcel, inStock: true },
  { id: "pc24", name: "Surf Excel", nameHindi: "सर्फ एक्सेल", price: 155, unit: "1 kg", category: "personal", image: surfExcel, inStock: true, discount: 10 },
  { id: "pc25", name: "Nirma Powder", nameHindi: "निर्मा पाउडर", price: 65, unit: "1 kg", category: "personal", image: nirmaPowder, inStock: true },
  { id: "pc26", name: "Rin Bar", nameHindi: "रिन बार", price: 22, unit: "250 g", category: "personal", image: rinBar, inStock: true },
  { id: "pc27", name: "Vim Bar", nameHindi: "विम बार", price: 12, unit: "155 g", category: "personal", image: vimBar, inStock: true },
  { id: "pc28", name: "Vim Dishwash Gel", nameHindi: "विम डिशवॉश जेल", price: 95, unit: "500 ml", category: "personal", image: vimBar, inStock: true },
  
  // Toothpaste & Dental
  { id: "pc29", name: "Colgate Toothpaste", nameHindi: "कोलगेट टूथपेस्ट", price: 55, unit: "100 g", category: "personal", image: colgate, inStock: true },
  { id: "pc30", name: "Colgate Toothpaste", nameHindi: "कोलगेट टूथपेस्ट", price: 95, unit: "200 g", category: "personal", image: colgate, inStock: true },
  { id: "pc31", name: "Colgate Strong Teeth", nameHindi: "कोलगेट स्ट्रॉंग टीथ", price: 45, unit: "100 g", category: "personal", image: colgate, inStock: true },
  { id: "pc32", name: "Closeup Toothpaste", nameHindi: "क्लोज़अप टूथपेस्ट", price: 50, unit: "100 g", category: "personal", image: closeup, inStock: true },
  { id: "pc33", name: "Pepsodent Toothpaste", nameHindi: "पेप्सोडेंट टूथपेस्ट", price: 48, unit: "100 g", category: "personal", image: pepsodent, inStock: true },
  
  // Hair Care
  { id: "pc34", name: "Parachute Coconut Oil", nameHindi: "पैराशूट नारियल तेल", price: 85, unit: "200 ml", category: "personal", image: parachuteOil, inStock: true },
  { id: "pc35", name: "Parachute Coconut Oil", nameHindi: "पैराशूट नारियल तेल", price: 45, unit: "100 ml", category: "personal", image: parachuteOil, inStock: true },
  { id: "pc36", name: "Parachute Coconut Oil", nameHindi: "पैराशूट नारियल तेल", price: 155, unit: "500 ml", category: "personal", image: parachuteOil, inStock: true, discount: 8 },
  { id: "pc37", name: "Hair Oil", nameHindi: "बालों का तेल", price: 85, unit: "200 ml", category: "personal", image: hairOil, inStock: true },
  { id: "pc38", name: "Clinic Plus Shampoo", nameHindi: "क्लिनिक प्लस शैम्पू", price: 95, unit: "175 ml", category: "personal", image: clinicPlus, inStock: true },
  { id: "pc39", name: "Clinic Plus Shampoo", nameHindi: "क्लिनिक प्लस शैम्पू", price: 10, unit: "Sachet", category: "personal", image: clinicPlus, inStock: true },
  { id: "pc40", name: "Clinic Plus Shampoo", nameHindi: "क्लिनिक प्लस शैम्पू", price: 180, unit: "340 ml", category: "personal", image: clinicPlus, inStock: true },
];
