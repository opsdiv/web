// script.js

// Function to toggle the mobile menu
const toggleMenu = () => {
  const menuIcon = document.querySelector('.menu-icon');
  const menu = document.querySelector('.menu');

  menuIcon.classList.toggle('active');
  menu.classList.toggle('active');
};

// Get the menu icon and add an event listener
const menuIcon = document.querySelector('.menu-icon');
menuIcon.addEventListener('click', toggleMenu);

// Get all testimonial videos and add event listeners
const testimonialVideos = document.querySelectorAll('.video-item video');

testimonialVideos.forEach(video => {
  video.addEventListener('click', () => {
      video.play();
  });
});

// Function to change header opacity on scroll
const handleScroll = () => {
  const switchY = document.querySelector('.hero').offsetHeight;
  const scrollPosition = window.scrollY;

  if (scrollPosition > switchY) {
      document.querySelector('header').style.backgroundColor = 'rgba(252, 243, 237, 1)'; 
  } else {
      document.querySelector('header').style.backgroundColor = 'rgba(252, 243, 237, 0.3)';
  }
};

// Add event listener for scroll
window.addEventListener('scroll', handleScroll);