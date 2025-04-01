import { ref } from "vue";
const shoplist = [
  {
    id: 1,
    imgSrc: "/assets/img/photos/sh1.jpg",
    imgSrcSet: "/assets/img/photos/sh1@2x.jpg 2x",
    category: "Shoes",
    sale: true,
    new: false,
    ratings: "five",
    title: "Nike Air Sneakers",

    oldPrice: 55.0,
    price: 45.0,
  },
  {
    id: 2,
    imgSrc: "/assets/img/photos/sh2.jpg",
    imgSrcSet: "/assets/img/photos/sh2@2x.jpg 2x",
    category: "Electronics",
    sale: false,
    new: false,
    ratings: "four",
    title: "Apple Watch",

    price: 55.0,
  },
  {
    id: 3,
    imgSrc: "/assets/img/photos/sh3.jpg",
    imgSrcSet: "/assets/img/photos/sh3@2x.jpg 2x",
    category: "Electronics",
    sale: false,
    new: true,
    ratings: "",
    title: "Headphones",

    price: 55.0,
  },
  {
    id: 4,
    imgSrc: "/assets/img/photos/sh4.jpg",
    imgSrcSet: "/assets/img/photos/sh4@2x.jpg 2x",
    category: "Shoes",
    sale: false,
    new: false,
    ratings: "three",
    title: "Colorful Sneakers",

    price: 55.0,
  },
  {
    id: 5,
    imgSrc: "/assets/img/photos/sh5.jpg",
    imgSrcSet: "/assets/img/photos/sh5@2x.jpg 2x",
    category: "Electronics",
    sale: false,
    new: false,
    ratings: "one",
    title: "Polaroid Camera",

    price: 55.0,
  },
  {
    id: 6,
    imgSrc: "/assets/img/photos/sh6.jpg",
    imgSrcSet: "/assets/img/photos/sh6@2x.jpg 2x",
    category: "Cosmetics",
    sale: false,
    new: false,
    ratings: "two",
    title: "Curology Cleanser",

    price: 55.0,
  },
  {
    id: 7,
    imgSrc: "/assets/img/photos/sh7.jpg",
    imgSrcSet: "/assets/img/photos/sh7@2x.jpg 2x",
    category: "Home & Kitchen",
    sale: false,
    new: false,
    ratings: "four",
    title: "Q&Q Wall Clock",

    price: 55.0,
  },
  {
    id: 8,
    imgSrc: "/assets/img/photos/sh8.jpg",
    imgSrcSet: "/assets/img/photos/sh8@2x.jpg 2x",
    category: "Electronics",
    sale: false,
    new: false,
    ratings: "",
    title: "Earphones",

    price: 55.0,
  },
  {
    id: 9,
    imgSrc: "/assets/img/photos/sh9.jpg",
    imgSrcSet: "/assets/img/photos/sh9@2x.jpg 2x",
    category: "Accessories",
    sale: false,
    new: false,
    ratings: "five",
    title: "Apple Watch Milano Loop",

    price: 55.0,
  },
];
export const cartProducts = ref([]);

export const setCartProducts = (val) => {
  cartProducts.value = val;
};

export const addProductToCart = (id) => {
  if (!cartProducts.value.filter((elm) => elm.id == id)[0]) {
    const item = {
      ...shoplist.filter((elm) => elm.id == id)[0],
      quantity: 1,
    };
    setCartProducts([...cartProducts.value, item]);
  }
};

export const isAddedToCartProducts = (id) => {
  if (cartProducts.value.filter((elm) => elm.id == id)[0]) {
    return true;
  }
  return false;
};
