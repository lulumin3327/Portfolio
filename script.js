document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 定義常數與變數 ---
    const indicator = document.getElementById('nav-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoButton = document.getElementById('logo-button');
    const sections = document.querySelectorAll('section');
    const langBtn = document.getElementById("lang-switch");
    
    let isManualScrolling = false;

    // --- 2. 語言切換邏輯 ---
    let currentLang = localStorage.getItem("preferredLang") || "ZH";
    applyLanguage(currentLang);

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            currentLang = currentLang === "ZH" ? "EN" : "ZH";
            localStorage.setItem("preferredLang", currentLang);
            applyLanguage(currentLang);
        });
    }

    function applyLanguage(lang) {
        if (!langBtn) return;
        langBtn.textContent = lang === "ZH" ? "EN" : "繁中";
        
        const zhElements = document.querySelectorAll(".lang-zh");
        const enElements = document.querySelectorAll(".lang-en");

        if (lang === "EN") {
            zhElements.forEach(el => el.style.display = "none");
            enElements.forEach(el => el.style.display = "block");
        } else {
            zhElements.forEach(el => el.style.display = "block");
            enElements.forEach(el => el.style.display = "none");
        }
    }

    // --- 3. 導覽滑塊更新邏輯 ---
    function updateIndicator(element) {
        if (!element || !indicator) return;
        
        navLinks.forEach(link => link.classList.remove('active'));
        if (logoButton) logoButton.classList.remove('active');
        
        element.classList.add('active');

        const nav = document.querySelector('.navbar');
        if (!nav) return;

        const navRect = nav.getBoundingClientRect();
        const elRect = element.getBoundingClientRect();
        const relativeLeft = elRect.left - navRect.left;
        const padding = 20;

        indicator.style.width = `${element.offsetWidth + padding}px`;
        indicator.style.left = `${relativeLeft - (padding / 2)}px`;
        indicator.style.opacity = "1";
    }

    // --- 4. 點擊與滾動監聽 ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith(''))) {
                e.preventDefault();
                isManualScrolling = true; 
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    updateIndicator(this); 
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    setTimeout(() => { isManualScrolling = false; }, 800); 
                }
            }
        });
    });

    if (logoButton) {
        logoButton.addEventListener('click', () => {
            if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('')) {
                isManualScrolling = true;
                updateIndicator(logoButton);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => { isManualScrolling = false; }, 800);
            }
        });
    }

    // --- 5. Intersection Observer (捲動監聽) ---
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        if (isManualScrolling) return;
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                if (id === 'home' || !id) {
                    updateIndicator(logoButton);
                } else {
                    const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (activeLink) updateIndicator(activeLink);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section) observer.observe(section);
    });

    // --- 6. 初始化位置 ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            const currentSectionId = window.location.hash.replace('#', '');
            const target = document.querySelector(`.nav-link[href="#${currentSectionId}"]`) || logoButton;
            updateIndicator(target);
        }, 100);
    });
});