document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }

    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            if (navLinks && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                if (hamburger) hamburger.classList.remove("active");
            }
        });
    });

    // --- 2. Smooth Scrolling & Header Offset Alignment ---
    const headerOffset = 70;
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const href = this.getAttribute("href");
            const targetId = href ? href.substring(1) : "";
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });

                // Add active class to nav links
                updateActiveNavLink(targetId);
            }
        });
    });

    // --- 3. Update Active Nav Link on Scroll ---
    function updateActiveNavLink(id) {
        document.querySelectorAll(".nav-links a").forEach((link) => {
            link.classList.remove("active");
        });
        const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (activeLink) {
            activeLink.classList.add("active");
        }
    }

    // Update active link on scroll
    window.addEventListener("scroll", () => {
        let currentSection = "";
        const sections = document.querySelectorAll("section");

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute("id");
            }
        });

        if (currentSection) {
            updateActiveNavLink(currentSection);
        }
    });

    // --- 4. Interactive Milestone Accordion ---
    const accordionHeaders = document.querySelectorAll(".accordion-header");
    accordionHeaders.forEach((header) => {
        header.addEventListener("click", function () {
            accordionHeaders.forEach((otherHeader) => {
                if (otherHeader !== this && otherHeader.classList.contains("active")) {
                    otherHeader.classList.remove("active");
                    const otherIcon = otherHeader.querySelector("span");
                    if (otherIcon) otherIcon.textContent = "+";
                    const otherContent = otherHeader.nextElementSibling;
                    if (otherContent) {
                        otherContent.style.maxHeight = null;
                        otherContent.style.paddingTop = "0";
                        otherContent.style.paddingBottom = "0";
                    }
                }
            });

            this.classList.toggle("active");
            const icon = this.querySelector("span");
            if (icon) {
                icon.textContent = this.classList.contains("active") ? "−" : "+";
            }

            const content = this.nextElementSibling;
            if (!content) return;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.style.paddingTop = "0";
                content.style.paddingBottom = "0";
            } else {
                content.style.maxHeight = `${content.scrollHeight}px`;
                content.style.paddingTop = "10px";
                content.style.paddingBottom = "20px";
            }
        });
    });

    // --- 5. Document Links Handler ---
    const docLinks = document.querySelectorAll(".doc-link");
    docLinks.forEach((link) => {
        link.addEventListener("click", async function (e) {
            const action = this.getAttribute("data-action");
            const href = this.getAttribute("href");

            if (!href || href === "#") {
                e.preventDefault();
                const titleElement = this.closest(".doc-card")?.querySelector("h4");
                const docName = titleElement ? titleElement.innerText.trim() : "selected";
                alert(`The ${docName} document is not linked yet.`);
                return;
            }

            if (action !== "Download") return;

            // Force file download for PDFs/files even if browser prefers inline preview.
            e.preventDefault();
            try {
                const response = await fetch(href);
                if (!response.ok) throw new Error("Could not fetch file");

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);
                const tempLink = document.createElement("a");
                tempLink.href = objectUrl;
                tempLink.download = this.getAttribute("download") || href.split("/").pop() || "download";
                document.body.appendChild(tempLink);
                tempLink.click();
                tempLink.remove();
                URL.revokeObjectURL(objectUrl);
            } catch (error) {
                // Fall back to default behavior if fetch is blocked or file is unavailable.
                window.location.href = href;
            }
        });
    });

    // --- 6. Hero Image Slider ---
    // FIX: Slider code must run AFTER DOM is ready.
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');

    if (!slides.length || !dots.length) return;

    let currentSlide = 0;
    const slideInterval = 5000;
    let sliderTimer;

    function showSlide(index) {
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
        resetTimer();
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
        resetTimer();
    }

    function resetTimer() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(nextSlide, slideInterval);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    // Ensure first slide is visible and start autoplay
    showSlide(0);
    sliderTimer = setInterval(nextSlide, slideInterval);
});
