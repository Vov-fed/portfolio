const updateSlides = (slideId) => {
    // Remove active class from all slides
    document.querySelectorAll('.slide').forEach(slide => {
        slide.classList.remove('active');
    });

    // Add active class to the selected slide
    const selectedSlide = document.getElementById(`slide-${slideId}`);
    if (selectedSlide) {
        selectedSlide.classList.add('active');
    }

    // Update active class for thumbnails
    const imgs = document.querySelectorAll('.about-abilities-img');
    imgs.forEach(img => {
        img.classList.remove('active'); // Remove active from all
    });
    
    const activeImg = document.querySelector(`.about-abilities-img[data-slide="${slideId}"]`);
    if (activeImg) {
        activeImg.classList.add('active'); // Add active to the clicked thumbnail
    }
};

// Event listeners for each thumbnail
const imgs = document.querySelectorAll('.about-abilities-img');
imgs.forEach(img => {
    img.addEventListener('click', () => {
        const slideId = img.getAttribute('data-slide');
        updateSlides(slideId);
    });
});

// Initialize the first slide as active
updateSlides(1);
const activeAside = document.getElementsByClassName('aside')[0]; // Select the first element
const activeAdd = document.getElementsByClassName('aside-main-button')[0]; // Select the first element

// Check if the elements exist before adding the event listener
if (activeAdd && activeAside) {
    activeAdd.addEventListener('click', () => {
        activeAside.classList.toggle('active');
    });
} else {
    console.error('Element not found');
}




let newNav = document.getElementsByClassName('header-nav') [0];
let allPage = document.querySelector('main');
let footer = document.getElementsByClassName('footer')[0];
document.getElementById('burger').addEventListener('click', function() {
    this.classList.toggle('active');
    newNav.classList.toggle('active');
    allPage.classList.toggle('active');
    document.body.classList.toggle('active');
    footer.classList.toggle('active');
});


const showMore = document.getElementsByClassName('projects-more')[0];
const project = document.getElementsByClassName('projects-wrapper')[0];
showMore.addEventListener('click', () => {
    showMore.classList.toggle('active');
    project.classList.toggle('active')
})




document.addEventListener('DOMContentLoaded', () => {
    const aside = document.getElementsByClassName('aside')[0];
    const footer = document.querySelector('footer');

    window.addEventListener('scroll', () => {
        const footerRect = footer.getBoundingClientRect();
        const asideRect = aside.getBoundingClientRect();

        // Check if the aside is overlapping with the footer
        if (asideRect.bottom > footerRect.top) {
            aside.classList.add('hidden'); // Hide the aside
        } else {
            aside.classList.remove('hidden'); // Show the aside
        }
    });
});



// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const headerHeight = document.querySelector('header').offsetHeight; // Define headerHeight here
        const additionalOffset = 80; // Adjust this value as needed

        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight - additionalOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Active link highlighting using scroll event
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let currentSection = '';
    const headerHeight = document.querySelector('header').offsetHeight; // Define headerHeight here as well
    const additionalOffset = 80; // Make sure this matches the one in the smooth scroll

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - headerHeight - additionalOffset && scrollY < sectionTop + sectionHeight - headerHeight - additionalOffset) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});
