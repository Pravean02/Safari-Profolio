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