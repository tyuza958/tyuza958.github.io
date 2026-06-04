/* ==========================================
   RESUME & PORTFOLIO INTERACTIVE BEHAVIORS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Switcher Core ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Load saved theme or fall back to system default (dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- Tab Switcher Logic ---
    const tabs = document.querySelectorAll('.nav-tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');

            // Deactivate active states
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Activate new target states
            tab.classList.add('active');
            const targetContent = document.getElementById(target);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // --- Skills Filtering Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const skillItems = document.querySelectorAll('.skill-item-wrapper');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Toggle active filter button style
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show or hide skill items
            skillItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // --- Form Mock Submission ---
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable submit button during animation
            submitBtn.disabled = true;
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

            // Simulate server network latency
            setTimeout(() => {
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Show success feedback
                formFeedback.classList.remove('hidden');

                // Auto-hide toast notification after 5 seconds
                setTimeout(() => {
                    formFeedback.classList.add('hidden');
                }, 5000);
            }, 1200);
        });
    }

    // --- Print Functionality ---
    const printBtn = document.getElementById('print-btn');
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // --- Interactive Visual Edit Mode ---
    const editToggleBtn = document.getElementById('edit-toggle-btn');
    const editInstructions = document.getElementById('edit-instructions');
    const closeInstructionsBtn = document.getElementById('close-instructions-btn');
    const editModeControls = document.getElementById('edit-mode-controls');
    const exitEditBtn = document.getElementById('exit-edit-btn');
    const exportHtmlBtn = document.getElementById('export-html-btn');
    const editableElements = document.querySelectorAll('.editable');

    let isEditModeActive = false;

    // Enable/Disable Edit Mode function
    function toggleEditMode(activate) {
        isEditModeActive = activate;
        
        if (isEditModeActive) {
            document.body.classList.add('edit-mode');
            editToggleBtn.classList.add('active');
            editInstructions.classList.remove('hidden');
            editModeControls.classList.remove('hidden');
            
            // Set elements to be editable
            editableElements.forEach(el => {
                el.setAttribute('contenteditable', 'true');
                el.setAttribute('spellcheck', 'false');
            });
        } else {
            document.body.classList.remove('edit-mode');
            editToggleBtn.classList.remove('active');
            editInstructions.classList.add('hidden');
            editModeControls.classList.add('hidden');
            
            // Disable element editability
            editableElements.forEach(el => {
                el.removeAttribute('contenteditable');
                el.removeAttribute('spellcheck');
            });
        }
    }

    // Toggle click binding
    editToggleBtn.addEventListener('click', () => {
        toggleEditMode(!isEditModeActive);
    });

    // Exit edit mode click binding
    exitEditBtn.addEventListener('click', () => {
        toggleEditMode(false);
    });

    // Close instructions panel binding
    closeInstructionsBtn.addEventListener('click', () => {
        editInstructions.classList.add('hidden');
    });

    // Clean HTML Export Action
    exportHtmlBtn.addEventListener('click', () => {
        // Temporarily exit edit mode formatting for a clean clone representation
        const currentlyActiveTab = document.querySelector('.nav-tab.active').getAttribute('data-target');
        
        // Clone the document object model
        const clone = document.documentElement.cloneNode(true);
        
        // Clean editable status
        clone.querySelectorAll('.editable').forEach(el => {
            el.removeAttribute('contenteditable');
            el.removeAttribute('spellcheck');
        });
        
        // Remove class tags and control nodes
        const bodyEl = clone.querySelector('body');
        bodyEl.classList.remove('edit-mode');
        
        const controls = clone.querySelector('#edit-mode-controls');
        if (controls) controls.classList.add('hidden');
        
        const instructions = clone.querySelector('#edit-instructions');
        if (instructions) instructions.classList.add('hidden');
        
        const editToggle = clone.querySelector('#edit-toggle-btn');
        if (editToggle) editToggle.classList.remove('active');

        // Make sure all tabs are reset to default first-tab active state for the fresh load layout
        const tabBtns = clone.querySelectorAll('.nav-tab');
        const tabPanels = clone.querySelectorAll('.tab-content');
        
        tabBtns.forEach(tab => {
            if (tab.getAttribute('data-target') === 'about') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        tabPanels.forEach(panel => {
            if (panel.id === 'about') {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Generate dynamic file content buffer
        const htmlFileContent = '<!DOCTYPE html>\n' + clone.outerHTML;
        const blob = new Blob([htmlFileContent], { type: 'text/html;charset=utf-8' });
        
        // Setup anchor to download file automatically
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'index.html';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
});
