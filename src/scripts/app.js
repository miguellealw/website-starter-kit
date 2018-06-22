/* Absolute Imports */
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import ScrollReveal from 'scrollreveal';

/* Relative Imports */
import Swiper from './vendor/swiper.min';

// const toRem = px => px / 16;

/*
<========================================>
  Swiper
<========================================>
*/

/* eslint-disable no-unused-vars */
const mySwiper = new Swiper('.swiper-container', {
  grabCursor: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  autoplay: {
    delay: 3000,
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },
});
/* eslint-enable */

/*
<========================================>
  Masonry Layout
<========================================>
*/

const grid = document.querySelector('.grid');
const msnry = new Masonry(grid, {
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  gutter: 20,
  fitWidth: true,
  // percentPosition: true,
});

imagesLoaded(grid).on('progress', () => {
  // layout Masonry after each image loads
  msnry.layout();
});

/*
<========================================>
  ScrollReveal
<========================================>
*/

/* eslint-disable */
window.sr = ScrollReveal({ duration: 500 });
sr.reveal('.image-container', 50);
sr.reveal('.grid-item', { duration: 500 }, 50);
/* eslint-enable */
