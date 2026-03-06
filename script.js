document.addEventListener('DOMContentLoaded', () => {
    // 1. 選取所有必要的 DOM 元素
    const indicator = document.getElementById('nav-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoButton = document.getElementById('logo-button');
    const langSwitchBtn = document.getElementById('lang-switch'); // 桌機版語系按鈕
    const allNavItems = [...navLinks, logoButton];

    // 手機版專屬元素
    const hamburger = document.getElementById('hamburger-toggle');
    const navMenu = document.querySelector('.nav-menu-wrapper');
    const mobileLangBtn = document.getElementById('lang-switch-mobile'); // 手機版語系按鈕

    // --- A. 核心功能函數 ---

    // 精確計算位移的函數 (僅桌機版有效)
    function moveIndicator(element) {
        if (!element || !indicator || window.innerWidth <= 768) return;
        const { offsetLeft, offsetWidth } = element;
        indicator.style.width = `${offsetWidth}px`;
        indicator.style.left = `${offsetLeft}px`;
    }

    // 更新 Active 狀態的統一入口
    function setActive(targetElement) {
        if (!targetElement) return;
        allNavItems.forEach(i => i.classList.remove('active'));
        targetElement.classList.add('active');
        
        // 只有在非手機版時才移動藍色塊
        if (window.innerWidth > 768) {
            moveIndicator(targetElement);
        }
    }

    // 同步語言切換狀態
    function toggleLanguage(isEn) {
        if (isEn) {
            document.body.classList.add('en-mode');
        } else {
            document.body.classList.remove('en-mode');
        }
        
        const newText = isEn ? 'ZH' : 'EN';
        if (langSwitchBtn) langSwitchBtn.textContent = newText;
        if (mobileLangBtn) mobileLangBtn.textContent = newText;

        // 語言切換後，字體長度會變，桌機版需要重新計算 Indicator 位置
        setTimeout(() => {
            const activeItem = document.querySelector('.nav-link.active') || logoButton;
            moveIndicator(activeItem);
        }, 50);
    }

    // --- B. 事件監聽 (桌機 + 通用) ---

    // 點擊事件
    allNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.id === 'logo-button') {
                // 如果點擊 Logo 回到頂部
                if (window.location.hash && window.location.hash !== '#home') {
                    // 若在子頁面或有 hash 則讓它自然跳轉，否則 smooth scroll
                } else {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setActive(logoButton);
                }
            } else {
                setActive(item);
            }
        });
    });

    // 桌機版語言切換
    if (langSwitchBtn) {
        langSwitchBtn.addEventListener('click', () => {
            const currentIsEn = document.body.classList.contains('en-mode');
            toggleLanguage(!currentIsEn);
        });
    }

    // --- C. 手機版專屬功能 ---

    // 1. 漢堡選單開關
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('open');
        });
    }

    // 2. 點擊連結後自動關閉選單 (手機版)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navMenu) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('open');
            }
        });
    });

    // 3. 手機版語言切換同步
    if (mobileLangBtn) {
        mobileLangBtn.addEventListener('click', () => {
            const currentIsEn = document.body.classList.contains('en-mode');
            toggleLanguage(!currentIsEn);
        });
    }

    // --- D. 核心功能：監聽捲動 (Scroll Spy) ---

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // 偵測區塊進入視窗中心區域
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const targetLink = document.querySelector(`.nav-link[href="#${id}"]`);
                
                if (targetLink) {
                    setActive(targetLink);
                } else if (window.scrollY < 200) { 
                    setActive(logoButton);
                }
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section[id], header[id]');
    sections.forEach(section => observer.observe(section));

    // 當捲動到最頂端時，強制歸位到 Logo
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            setActive(logoButton);
        }
    });

    // --- E. 初始化與視窗縮放 ---

    window.addEventListener('resize', () => {
        const activeItem = document.querySelector('.nav-link.active') || logoButton;
        if (window.innerWidth > 768) {
            moveIndicator(activeItem);
        } else {
            if (indicator) indicator.style.width = '0px'; // 手機版隱藏 Indicator
        }
    });

    // 頁面加載後的初始化位置
    setTimeout(() => {
        const initialActive = document.querySelector('.nav-link.active') || logoButton;
        moveIndicator(initialActive);
    }, 300);
});