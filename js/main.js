const header = document.querySelector("header");
const nav = document.getElementById("primary-nav");
const navToggle = document.querySelector(".nav-toggle");
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
            entry.target.querySelectorAll(".progress-bar").forEach((bar) => {
                const value = bar.dataset.width || "0%";
                requestAnimationFrame(() => { bar.style.width = value; });
            });
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0, rootMargin: "0px 0px -40px 0px" });

sections.forEach((section) => {
    section.classList.add("reveal");
    revealObserver.observe(section);
});

highlightActiveLink();

/* ---------------- Mobile navigation ---------------- */

function closeMobileNav() {
    nav.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => link.addEventListener("click", closeMobileNav));

/* ---------------- Card reveal (each card animates individually) ---------------- */

document.querySelectorAll(
    ".project-grid > *, .certificate-grid > *, #skills .row > *"
).forEach((card) => {
    card.classList.add("reveal-card");
    revealObserver.observe(card);
});

/* Skill bars start empty and fill when their card is revealed */
document.querySelectorAll(".skill-item .progress-bar").forEach((bar) => {
    bar.dataset.width = bar.style.width;
    bar.style.width = "0";
});

/* ---------------- Typing effect ---------------- */

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

/* ---------------- Lightbox ---------------- */

const lightbox = document.getElementById("lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxClose = lightbox.querySelector(".lightbox-close");

document.querySelectorAll(".certificate-image").forEach((item) => {
    item.addEventListener("click", () => {
        const img = item.querySelector("img");
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightbox.classList.add("open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    });
});

function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeLightbox();
        closeMobileNav();
    }
});

/* ---------------- Footer year ---------------- */

const yearSpan = document.getElementById("year");
if (yearSpan) yearSpan.textContent = new Date().getFullYear();
