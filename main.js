const header = document.querySelector("header");
const navLinks = document.querySelectorAll("nav a");   
const sections = document.querySelectorAll("section"); 

function handleScrollDown() {
    if (window.scrollY > 40) {
        header.classList.add("scrolled"); 
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleScrollDown);

function highlightActiveLink() {

    sections.forEach((section) => {
        
        const rect = section.getBoundingClientRect();

        const atTop = rect.top <= 120 && rect.bottom >= 120;

        if (atTop) {
            navLinks.forEach((link) => link.classList.remove("active"));
            const match = document.querySelector(`nav a[href="#${section.id}"]`);
            if (match) match.classList.add("active");
        }
    });
}

window.addEventListener("scroll", highlightActiveLink);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("revealed"); 
            revealObserver.unobserve(entry.target); 
        }
    });
}, { threshold: 0.15 }); 

sections.forEach((section) => {
    section.classList.add("reveal");
    revealObserver.observe(section);
});

highlightActiveLink();

const typingSpan = document.getElementById("typing");
const phrases = [
    "programming",
    "technology",
    "Brain Computer Interface (BCI)"
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
const typeSpeed = 80;        
const deleteSpeed = 45;      
const holdBeforeDelete = 1800;

function type() {
    const current = phrases[phraseIndex];

    if (!deleting) {
        typingSpan.textContent = current.substring(0, ++charIndex);
        if (charIndex === current.length) {
            deleting = true;
            setTimeout(type, holdBeforeDelete); 
        } else {
            setTimeout(type, typeSpeed);
        }
    } else {
        typingSpan.textContent = current.substring(0, --charIndex);
        if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, 300);        
        } else {
            setTimeout(type, deleteSpeed);
        }
    }
}

type();