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
    
    function applyLanguage(lang) {
        if (!langBtn) return;
        langBtn.textContent = lang === "ZH" ? "EN" : "繁中";
        
        const zhElements = document.querySelectorAll(".lang-zh");
        const enElements = document.querySelectorAll(".lang-en");

        // 1. 切換顯示/隱藏
        if (lang === "EN") {
            zhElements.forEach(el => el.style.display = "none");
            enElements.forEach(el => el.style.display = "inline-block");
        } else {
            zhElements.forEach(el => el.style.display = "inline-block");
            enElements.forEach(el => el.style.display = "none");
        }

        // 2. 修正「隱藏元素」帶有 active 類別的問題
        document.querySelectorAll('.nav-link.active').forEach(link => {
            const href = link.getAttribute('href');
            // 找出目前「非隱藏」的對應連結
            const visibleLink = document.querySelector(`.nav-link[href="${href}"]:not([style*="display: none"])`);
            if (visibleLink && visibleLink !== link) {
                link.classList.remove('active');
                visibleLink.classList.add('active');
            }
        });

        // 3. 重新同步位置
        setTimeout(syncIndicator, 50);
    }

    if (langBtn) {
        langBtn.addEventListener("click", () => {
            currentLang = currentLang === "ZH" ? "EN" : "ZH";
            localStorage.setItem("preferredLang", currentLang);
            applyLanguage(currentLang);
        });
    }

    // 初始化語言
    applyLanguage(currentLang);

    // --- 3. 導覽滑塊更新邏輯 ---
    function updateIndicator(element) {
        if (!element || !indicator) return;
        
        // 如果元素被隱藏了（寬度為0），不更新，避免滑塊飛走
        if (element.offsetWidth === 0) return;

        // 移除舊的 active 類別
        navLinks.forEach(link => link.classList.remove('active'));
        if (logoButton) logoButton.classList.remove('active');
        
        // 加入新的 active 類別
        element.classList.add('active');

        // 計算位置
        const rect = element.getBoundingClientRect();
        const navRect = document.querySelector('.navbar').getBoundingClientRect();
        const relativeLeft = rect.left - navRect.left;
        
        const padding = 20; 
        indicator.style.width = `${rect.width + padding}px`;
        indicator.style.left = `${relativeLeft - (padding / 2)}px`;
        indicator.style.opacity = "1";
    }

    function syncIndicator() {
        // 優先找顯示中的 active 連結，若無則預設到 logo
        const activeEl = document.querySelector('.nav-link.active:not([style*="display: none"])') || logoButton;
        updateIndicator(activeEl);
    }

    window.addEventListener('resize', syncIndicator);

    // --- 4. 點擊與平滑捲動 ---
    const handleNavClick = (e, targetEl, scrollTarget) => {
        e.preventDefault();
        isManualScrolling = true;
        updateIndicator(targetEl);
        
        window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
        });

        // 確保滾動結束後才恢復自動監聽
        setTimeout(() => { isManualScrolling = false; }, 800);
    };

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const targetElement = document.getElementById(href.substring(1));
                if (targetElement) {
                    handleNavClick(e, this, targetElement.offsetTop - 80);
                }
            }
        });
    });

    if (logoButton) {
        logoButton.addEventListener('click', (e) => {
            handleNavClick(e, logoButton, 0);
        });
    }

    // --- 5. Intersection Observer (解決重複宣告錯誤) ---
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px', // 讓偵測區間靠近視窗頂部
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        if (isManualScrolling) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                let target;
                if (id === 'home' || !id) {
                    target = logoButton;
                } else {
                    // 關鍵修正：只選取「當前顯示中」的語系連結
                    target = document.querySelector(`.nav-link[href="#${id}"]:not([style*="display: none"])`);
                }
                if (target) updateIndicator(target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section) observer.observe(section);
    });

    // --- 6. 初始化位置 ---
    window.addEventListener('load', syncIndicator);
});