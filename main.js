document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
        });
    }

    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            if (navLinks && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
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
            }
        });
    });

    // --- 6. Hero Image Slider ---
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-arrow');
    const nextBtn = document.querySelector('.next-arrow');
    let currentSlide = 0;
    const slideInterval = 5000; // Time per slide (5000ms = 5 seconds)
    let sliderTimer;

    // Function to change the slide
    function showSlide(index) {
        // Handle looping around the ends
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to the current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Go to next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
        resetTimer();
    }

    // Go to previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
        resetTimer();
    }

    // Reset the automatic timer when user manually clicks
    function resetTimer() {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(nextSlide, slideInterval);
    }

    // Event Listeners for Arrows
    if(nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }

    // Event Listeners for Dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });

    // Start the automatic slideshow
    sliderTimer = setInterval(nextSlide, slideInterval);

    // --- 3. Interactive Milestone Accordion ---
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

    // --- 4. Document Links Handler ---
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
});
