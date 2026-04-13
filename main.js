document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Mobile Menu Toggle ---
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");

    // Toggle menu visibility when clicking the hamburger icon
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    // Close the mobile menu automatically when a link is clicked
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            if (navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
            }
        });
    });

    // --- 2. Smooth Scrolling & Header Offset Alignment ---
    // This ensures that when you click a nav link, the page scrolls 
    // down but stops just before the fixed header covers the section title.
    const headerOffset = 70; // Adjust this if your navbar height changes
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- 3. Interactive Milestone Accordion ---
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", function () {
            // Close all other open accordions before opening the clicked one
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this && otherHeader.classList.contains("active")) {
                    otherHeader.classList.remove("active");
                    otherHeader.querySelector("span").textContent = "+";
                    const otherContent = otherHeader.nextElementSibling;
                    otherContent.style.maxHeight = null;
                    otherContent.style.paddingTop = "0";
                    otherContent.style.paddingBottom = "0";
                }
            });

            // Toggle active state of the clicked button
            this.classList.toggle("active");
            
            // Toggle the '+' and '-' icon indicator
            const span = this.querySelector("span");
            if (this.classList.contains("active")) {
                span.textContent = "−"; // Minus sign
            } else {
                span.textContent = "+"; // Plus sign
            }

            // Animate the content expansion/collapse
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                // If it's open, close it
                content.style.maxHeight = null;
                content.style.paddingTop = "0";
                content.style.paddingBottom = "0";
            } else {
                // If it's closed, open it to its full scroll height
                content.style.maxHeight = content.scrollHeight + 32 + "px"; // +32 accounts for padding
                content.style.paddingTop = "1.2rem";
                content.style.paddingBottom = "1.2rem";
            }
        });
    });

    // --- 4. Document Links Placeholder Handler ---
    const docLinks = document.querySelectorAll('.doc-link');
    
    docLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevents the page from jumping to the top
            
            const action = this.getAttribute('data-action');
            const docName = this.closest('.doc-card').querySelector('h4').innerText;
            
            // Alert to show interaction works. 
            // NOTE: Remove this section once you replace the href="#" in your HTML with actual PDF file paths.
            alert(`[Action: ${action}]\nYou clicked to ${action.toLowerCase()} the ${docName} document.\n\n(Remember to replace the href="#" in your HTML with actual file paths when your PDFs are ready!)`);
        });
    });

});