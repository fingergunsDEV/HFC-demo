document.addEventListener('DOMContentLoaded', () => {
    // Basic script file - can be expanded later for interactivity
    // e.g., mobile menu toggle

    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links'); // Need to adjust HTML/CSS to make this a toggleable element

    // Placeholder for menu toggle logic
    if (menuButton && navLinks) {
        menuButton.addEventListener('click', () => {
            // In a real implementation, you would toggle a class
            // on a container or the navLinks element itself to show/hide it.
            console.log('Menu button clicked - Implement mobile navigation toggle.');
            // Example: navLinks.classList.toggle('active');
        });
    }

    // Brand Theme Switcher Logic
    const brandSwitcher = document.getElementById('brandSwitcher'); // Define the container
    const brandSwitcherToggle = document.getElementById('brandSwitcherToggle');
    const brandMenu = document.getElementById('brandMenu');

    // Check if elements exist before proceeding
    if (!brandSwitcher || !brandSwitcherToggle || !brandMenu) {
        console.error("Brand switcher elements not found!");
        return; // Stop execution if essential elements are missing
    }

    const brandLinks = brandMenu.querySelectorAll('a[data-brand]');
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    // Color roles to map from brand-specific variables to theme variables
    const colorRoles = [
        'primary-light', 'on-primary-light', 'primary-container-light', 'on-primary-container-light',
        'secondary-light', 'on-secondary-light', 'secondary-container-light', 'on-secondary-container-light',
        'tertiary-light', 'on-tertiary-light', 'tertiary-container-light', 'on-tertiary-container-light',
        'error-light', 'on-error-light', 'error-container-light', 'on-error-container-light',
        'background-light', 'on-background-light',
        'surface-light', 'on-surface-light', 'surface-variant-light', 'on-surface-variant-light',
        'outline-light',
        'surface-container-highest-light', 'surface-container-high-light', 'surface-container-light',
        'surface-container-low-light', 'surface-container-lowest-light'
    ];

    function applyTheme(brand) {
        console.log(`Applying theme: ${brand}`);
        colorRoles.forEach(role => {
            const brandVarName = `--${brand}-${role}`;
            const themeVarName = `--theme-${role}`;
            // Get the computed value of the brand-specific variable
            let value = computedStyle.getPropertyValue(brandVarName).trim();

            // Fallback if a specific brand color isn't defined (use HFC default)
            if (!value) {
                const defaultBrandVarName = `--hfc-${role}`; // Using hfc as the fixed default prefix
                value = computedStyle.getPropertyValue(defaultBrandVarName).trim();
            }

            if (value) {
                // Set the generic theme variable to this value
                root.style.setProperty(themeVarName, value);
            } else {
                console.warn(`Color value not found for ${brandVarName} or default.`);
            }
        });

        // Update the toggle button icon colors after theme application
        // We need to read the *newly set* theme variables
        const newComputedStyle = getComputedStyle(root); // Re-get computed style
        const toggleIconPrimary = newComputedStyle.getPropertyValue('--theme-primary-light').trim();
        const toggleIconContainer = newComputedStyle.getPropertyValue('--theme-primary-container-light').trim();

        brandSwitcherToggle.style.color = toggleIconPrimary || ''; // Fallback to empty string if not found
        const svgPath = brandSwitcherToggle.querySelector('svg path[opacity]');
        if (svgPath) {
          svgPath.style.fill = toggleIconContainer || ''; // Fallback to empty string if not found
        }
    }

    // Toggle brand menu visibility
    brandSwitcherToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from immediately closing menu
        const isActive = brandMenu.classList.toggle('active');
        brandSwitcherToggle.setAttribute('aria-expanded', isActive);
    });

    // Handle brand selection
    brandLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor link behavior
            const selectedBrand = link.getAttribute('data-brand');
            if (selectedBrand) {
                applyTheme(selectedBrand);
            }
            brandMenu.classList.remove('active'); // Close menu after selection
            brandSwitcherToggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu if clicking outside
    document.addEventListener('click', (e) => {
        // Check if the click is outside the brandSwitcher container AND the menu is active
        if (!brandSwitcher.contains(e.target) && brandMenu.classList.contains('active')) {
            brandMenu.classList.remove('active');
            brandSwitcherToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Apply the default theme on initial load (using the actual default brand key)
    applyTheme('homefranchise');

    console.log("Home Franchise Corp site script loaded and initialized.");

});
