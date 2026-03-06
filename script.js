document.addEventListener('DOMContentLoaded', () => {
    const indicator = document.getElementById('nav-indicator');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoButton = document.getElementById('logo-button');
    const langSwitchBtn = document.getElementById('lang-switch');
    const allNavItems = [...navLinks, logoButton];

    // 1. 精確計算位移的函數
    function moveIndicator(element) {
        if (!element || !indicator) return;
        const { offsetLeft, offsetWidth } = element;
        indicator.style.width = `${offsetWidth}px`;
        indicator.style.left = `${offsetLeft}px`;
    }

    // 2. 更新 Active 狀態的統一入口
    function setActive(targetElement) {
        allNavItems.forEach(i => i.classList.remove('active'));
        targetElement.classList.add('active');
        moveIndicator(targetElement);
    }

    // 3. 點擊事件
    allNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // 如果點擊 Logo
            if (item.id === 'logo-button') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActive(logoButton);
            } else {
                // 點擊一般連結，setActive 會由下方的 Scroll 監聽觸發，
                // 但為了反應更即時，這裡也可以先設定一次
                setActive(item);
            }
        });
    });

    // 4. 核心功能：監聽捲動 (Scroll Spy)
    // 利用 IntersectionObserver 偵測區塊何時進入視窗
    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // 偵測區塊進入視窗中心區域時觸發
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // 找到對應的導覽連結 (href 為 #id 的連結)
                const targetLink = document.querySelector(`.nav-link[href="#${id}"]`);
                
                if (targetLink) {
                    setActive(targetLink);
                } else if (window.scrollY < 200) { 
                    // 如果接近頂部且沒匹配到區塊，設回 Logo
                    setActive(logoButton);
                }
            }
        });
    }, observerOptions);

    // 綁定要監聽的 Section (假設你的區塊有這些 ID)
    const sections = document.querySelectorAll('section[id], header[id], div[id]');
    sections.forEach(section => observer.observe(section));

    // 補足：當捲動到最頂端時，強制歸位到 Logo
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            setActive(logoButton);
        }
    });

    // 5. 語言切換邏輯
    if (langSwitchBtn) {
        langSwitchBtn.addEventListener('click', () => {
            const isEn = document.body.classList.toggle('en-mode');
            langSwitchBtn.textContent = isEn ? 'ZH' : 'EN';
            
            setTimeout(() => {
                const activeItem = document.querySelector('.active') || logoButton;
                moveIndicator(activeItem);
            }, 50); 
        });
    }

    // 6. 視窗縮放監聽
    window.addEventListener('resize', () => {
        const activeItem = document.querySelector('.active') || logoButton;
        moveIndicator(activeItem);
    });

    // 7. 初始化
    setTimeout(() => {
        const initialActive = document.querySelector('.active') || logoButton;
        moveIndicator(initialActive);
    }, 300);
});