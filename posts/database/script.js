// Function to copy code to clipboard
function copyCode(button) {
    const codeBlock = button.nextElementSibling; // Get the <pre> element
    const codeText = codeBlock.querySelector('code').textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeText).then(() => {
            button.textContent = 'Copied!';
            setTimeout(() => {
                // Restore the original button content with SVG icon
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M11.397 2.148A.75.75 0 0 0 10.5 1.5h-8.25A.75.75 0 0 0 1.5 2.25v12.75a.75.75 0 0 0 .75.75h-.065a.75.75 0 0 0-.568 1.156l3.427 4.493a.75.75 0 0 0 1.112.006l.891-1.16a.75.75 0 1 0-1.173-.902L4.743 17.25h9.514a.75.75 0 0 0 .75-.75V2.25a.75.75 0 0 0-.75-.75h-8.25a.75.75 0 0 0-.897.648ZM16.5 4.5a.75.75 0 0 0-.75-.75h-.825a.75.75 0 0 0-.75.75v.825a.75.75 0 0 0 .75.75h.825a.75.75 0 0 0 .75-.75V4.5Z" clip-rule="evenodd" />
                        <path fill-rule="evenodd" d="M19.5 7.5a.75.75 0 0 0-.75-.75h-8.25A.75.75 0 0 0 10.5 7.5v9.75a.75.75 0 0 0 .75.75h8.25a.75.75 0 0 0 .75-.75V7.5Zm-7.5-.75h5.25a.75.75 0 0 0 .75-.75v-.825a.75.75 0 0 0-.75-.75H12a.75.75 0 0 0-.75.75v.825a.75.75 0 0 0 .75.75Z" clip-rule="evenodd" />
                    </svg>
                    Copy Code
                `;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text using Clipboard API: ', err);
            fallbackCopyTextToClipboard(codeText, button);
        });
    } else {
        fallbackCopyTextToClipboard(codeText, button);
    }
}

// Fallback for copying text if Clipboard API is not available
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // Avoid scrolling to bottom
    textArea.style.opacity = "0"; // Hide it
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M11.397 2.148A.75.75 0 0 0 10.5 1.5h-8.25A.75.75 0 0 0 1.5 2.25v12.75a.75.75 0 0 0 .75.75h-.065a.75.75 0 0 0-.568 1.156l3.427 4.493a.75.75 0 0 0 1.112.006l.891-1.16a.75.75 0 1 0-1.173-.902L4.743 17.25h9.514a.75.75 0 0 0 .75-.75V2.25a.75.75 0 0 0-.75-.75h-8.25a.75.75 0 0 0-.897.648ZM16.5 4.5a.75.75 0 0 0-.75-.75h-.825a.75.75 0 0 0-.75.75v.825a.75.75 0 0 0 .75.75h.825a.75.75 0 0 0 .75-.75V4.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M19.5 7.5a.75.75 0 0 0-.75-.75h-8.25A.75.75 0 0 0 10.5 7.5v9.75a.75.75 0 0 0 .75.75h8.25a.75.75 0 0 0 .75-.75V7.5Zm-7.5-.75h5.25a.75.75 0 0 0 .75-.75v-.825a.75.75 0 0 0-.75-.75H12a.75.75 0 0 0-.75.75v.825a.75.75 0 0 0 .75.75Z" clip-rule="evenodd" /></svg>
                    Copy Code
                `;
            }, 2000);
        } else {
            console.error('Fallback: Unable to copy text');
            button.textContent = 'Failed!';
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        button.textContent = 'Failed!';
    }
    document.body.removeChild(textArea);
}

document.addEventListener('DOMContentLoaded', () => {
    const tocNav = document.getElementById('toc-nav');
    const contentSections = document.querySelectorAll('#blog-post h2, #blog-post h3'); 

    // Function to generate the Table of Contents
    function generateTableOfContents() {
        tocNav.innerHTML = ''; // Clear existing TOC
        const fragment = document.createDocumentFragment(); 
        let currentH2List = null;

        contentSections.forEach((heading, index) => {
            // Ensure unique and valid IDs for headings
            if (!heading.id) {
                let idText = heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                if (idText.length > 50) idText = idText.substring(0, 50); 
                heading.id = `${idText}-${index}`;
            }

            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;
            a.classList.add('toc-link', 'block', 'py-1', 'px-2', 'rounded-md', 'hover:bg-stone-100', 'transition-colors', 'duration-150');
            
            if (heading.tagName === 'H2') {
                fragment.appendChild(a);
                currentH2List = null; // Reset sub-list context for new H2
            } else if (heading.tagName === 'H3') {
                if (!currentH2List) {
                    const lastH2Link = fragment.lastElementChild;
                    if (lastH2Link) {
                        currentH2List = document.createElement('ul');
                        currentH2List.classList.add('space-y-1', 'mt-1');
                        lastH2Link.parentNode.insertBefore(currentH2List, lastH2Link.nextSibling);
                    } else {
                        currentH2List = document.createElement('ul');
                        currentH2List.classList.add('space-y-1', 'mt-1');
                        fragment.appendChild(currentH2List);
                    }
                }
                const li = document.createElement('li');
                li.appendChild(a);
                currentH2List.appendChild(li);
            }
        });
        tocNav.appendChild(fragment); // Append once for performance
    }

    // Function to highlight active link in TOC based on scroll position
    function highlightActiveLink() {
        const observer = new IntersectionObserver((entries) => {
            // Remove active state from all links first
            tocNav.querySelectorAll('.toc-link').forEach(link => {
                link.classList.remove('active', 'text-teal-600', 'font-semibold');
                link.classList.add('text-stone-700');
                link.style.borderLeft = ''; // Remove border for non-active
                link.style.paddingLeft = '0.5rem'; // Reset padding
            });

            // Find the most visible section and activate its link
            let activeSectionId = null;
            // Iterate in reverse to prioritize headings higher up on the screen
            for (let i = entries.length - 1; i >= 0; i--) {
                const entry = entries[i];
                // Consider a section "active" if it's intersecting and at least 20% visible
                if (entry.isIntersecting && entry.intersectionRatio >= 0.20) { 
                    activeSectionId = entry.target.id;
                    break;
                }
            }

            if (activeSectionId) {
                const tocLink = tocNav.querySelector(`a[href="#${activeSectionId}"]`);
                if (tocLink) {
                    tocLink.classList.add('active', 'text-teal-600', 'font-semibold');
                    tocLink.classList.remove('text-stone-700');
                    tocLink.style.borderLeft = '3px solid #0d9488';
                    tocLink.style.paddingLeft = '0.75rem';
                }
            }
        }, {
            root: null, 
            rootMargin: '-10% 0px -60% 0px', // Adjust rootMargin to make active detection more precise
            threshold: [0, 0.25, 0.5, 0.75, 1.0] // Check multiple visibility thresholds
        });

        contentSections.forEach(section => {
            observer.observe(section);
        });
    }

    // Initialize TOC and active link highlighting
    generateTableOfContents();
    highlightActiveLink(); 

    // Smooth scrolling for TOC links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header/navigation if any, or just a little padding
                const header = document.querySelector('header');
                const offset = (header ? header.offsetHeight : 0) + 20; // Added 20px extra padding

                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementRect - bodyRect - offset; 

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});