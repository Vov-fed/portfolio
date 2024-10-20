cdocument.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();

        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        const headerHeight = document.querySelector('header').offsetHeight; // Define headerHeight here
        const additionalOffset = 80; // Adjust this value as needed
        if(window.innerWidth >= 760){
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight - additionalOffset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }else{
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - additionalOffset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active link highlighting using scroll event
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let currentSection = '';
    const headerHeight = document.querySelector('header').offsetHeight; // Define headerHeight here as well
            if (window.innerWidth >= 760){
            const additionalOffset = 80; // Adjust this value as needed
        } else{
            const additionalOffset = 0;
        }

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
