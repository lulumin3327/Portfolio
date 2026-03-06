document.addEventListener('DOMContentLoaded', () => {
    const indicator = document.getElementById('nav-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoButton = document.getElementById('logo-button');
    const navContainer = document.querySelector('.navbar-container');
    const langSwitchBtn = document.getElementById('lang-switch');

    // --- 1. 統一移動 Indicator 的函數 ---
    function moveIndicator(element) {
        if (!element || !indicator) return;
        
        // 取得目標元素的位置資訊
        const rect = element.getBoundingClientRect();
        const navRect = navContainer.getBoundingClientRect();

        // 核心邏輯：計算相對於 navbar-container 的位置
        // 如果是隱藏狀態的元素，getBoundingClientRect() 會是 0，這裡要確保選中顯示中的那個
        if (rect.width === 0) return; 

        indicator.style.width = `${rect.width + 20}px`;
        indicator.style.left = `${rect.left - navRect.left - 10}px`;
        indicator.style.opacity = "1"; 
        
        // 移除所有人的 active 狀態
        navLinks.forEach(link => link.classList.remove('active'));
        logoButton.classList.remove('active');
        
        // 給當前元素加上 active
        element.classList.add('active');
    }

    // --- 2. 語言切換邏輯 ---
    langSwitchBtn.addEventListener('click', () => {
        // 切換 body 的 class
        const isEnMode = document.body.classList.toggle('en-mode');
        
        // 更新按鈕文字
        langSwitchBtn.textContent = isEnMode ? 'ZH' : 'EN';

        // 語言切換後，導覽列文字寬度會變，需要重新計算 Indicator 位置
        // 我們找目前帶有 .active 的元素重新對準一次
        setTimeout(() => {
            const activeLink = document.querySelector('.nav-link.active') || logoButton;
            moveIndicator(activeLink);
        }, 10); // 微小延遲確保 CSS 已渲染
    });

    // --- 3. 滾動偵測邏輯 ---
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // 調整偵測區間
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                if (id === 'home') {
                    moveIndicator(logoButton);
                } else {
                    // 根據當前語言模式，找到對應區塊的 nav-link
                    const isEn = document.body.classList.contains('en-mode');
                    const targetLink = document.querySelector(`.nav-link[href="#${id}"].lang-${isEn ? 'en' : 'zh'}`);
                    if (targetLink) moveIndicator(targetLink);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // 點擊 Logo 回到頂部
    logoButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});