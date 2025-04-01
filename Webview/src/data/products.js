export const categories = [
  {
    id: 1,
    name: "Technology",
    name_en: "Technology",
    name_lo: "ເທັກໂນໂລຢີ",
    image: "product-categories/images (3).jpeg",
  },
  {
    id: 2,
    name_en: "Men Clothes",
    name_lo: "ເສື້ອຜ້າຜູ້ຊາຍ",
    image: "product-categories/images (4).jpeg",
  },
  {
    id: 3,
    name: "Bags",
    icon: "https://www.apple.com/newsroom/images/2024/09/apple-introduces-iphone-16-and-iphone-16-plus/article/Apple-iPhone-16-hero-240909_inline.jpg.large.jpg",
  },
  // ... other categories
];

export const products = [
  {
    id: 1,
    name: "iPhone 14",
    name_en: "iPhone 14",
    name_lo: "ໄອໂຟນ 14",
    price: 1000000,
    originalPrice: 1200000,
    discount: 10,
    description: "Latest Apple smartphone",
    description_en: "Latest Apple smartphone",
    description_lo: "ໂທລະສັບ Apple ລ່າສຸດ",
    location: "Apple Store",
    location_en: "Apple Store",
    location_lo: "ຮ້ານ Apple",
    shippingFee: 5000,
    available: 50,
    coverImage: "products/image1.jpg",
    subImages: [
      "products/image1.jpg",
      "products/image2.jpg",
      "products/image3.jpg",
      "products/image4.jpg",
    ],
    category: {
      id: 1,
      name: "Technology",
      name_en: "Technology",
      name_lo: "ເທັກໂນໂລຢີ",
      image: "product-categories/image1.jpg"
    }
  },
  // ... other products
];
