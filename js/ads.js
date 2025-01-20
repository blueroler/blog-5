const show_ads = document.getElementById('ads-section');
show_ads.innerHTML = `<div class="ads-banner" id="ads-banner"></div>`;

const banner = document.getElementById('ads-banner');
banner.style.display = 'none';
let items = [];
let currentIndex = 0;

ads_to_head();
check_ads_status();

async function check_ads_status() {
    const response = await fetch(`${databaseUrl}/status_element.json`);
    const post = await response.json();

    if (post.ads == 0) {

    } else {
        fetchAds();
    }
}

async function auto_off_ads() {
    const postData = {
        ads: 0,
    };

    const method = 'PUT';
    const url = `${databaseUrl}/status_element.json`;
    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    });
    check_ads_status();
}

// Lấy dữ liệu từ Firebase và xử lý
async function fetchAds() {
    try {
        const response = await fetch(`${databaseUrl}/ads/ads_local.json`);
        const data = await response.json();

        if (data) {
            // Chuyển đổi dữ liệu từ Firebase thành mảng và sắp xếp theo timestamp
            const newsArray = Object.entries(data).map(([id, item]) => ({ id, ...item }));
            newsArray.sort((a, b) => b.timestamp - a.timestamp);

            // Tạo mảng chỉ chứa 'img' và 'ads' (url quảng cáo)
            const items = newsArray.map(item => ({
                img: item.img, // giá trị img dùng cho background-image
                url: item.ads  // giá trị url là link quảng cáo
            }));

            renderBanner(items);
        } else {
            banner.style.display = 'none';
            auto_off_ads();
            // console.warn("Không có dữ liệu quảng cáo trong database.");
            // banner.innerHTML = '<p>Không có quảng cáo để hiển thị.</p>';
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ Firebase:", error);
    }
}


function renderBanner(items) {
    banner.style.display = 'block';
    // Xóa các item cũ
    banner.innerHTML = '';

    // Thêm các item mới vào DOM dưới dạng thẻ <a>
    items.forEach((item, index) => {
        const anchor = document.createElement('a');
        anchor.className = 'banner-item';
        anchor.href = item.url;  // Link đến quảng cáo
        anchor.style.backgroundImage = `url('${item.img}')`;  // Background là hình ảnh quảng cáo

        // Đặt item đầu tiên làm active
        if (index === 0) {
            anchor.classList.add('active');
            anchor.style.zIndex = 2;  // Đặt z-index cao cho item đầu tiên
        } else {
            anchor.style.zIndex = 1;  // Đặt z-index thấp cho các item khác
        }

        banner.appendChild(anchor);
    });

    // Khởi động hiệu ứng chuyển đổi nếu có nhiều hơn 1 item
    if (items.length > 1) {
        initializeBanner();
    }
}

function showNextItem() {
    const allItems = document.querySelectorAll('.banner-item');
    const currentItem = allItems[currentIndex];
    const nextIndex = (currentIndex + 1) % allItems.length;
    const nextItem = allItems[nextIndex];

    // Gán hiệu ứng cho item hiện tại
    currentItem.classList.remove('active');
    currentItem.classList.add('exiting');
    currentItem.style.zIndex = 1; // Đặt z-index của item cũ thấp

    // Đưa item tiếp theo vào khung nhìn và gán z-index cao
    nextItem.style.left = '100%'; // Vị trí bắt đầu ngoài khung nhìn
    nextItem.style.zIndex = 2; // Đặt z-index của item mới cao hơn item hiện tại

    setTimeout(() => {
        nextItem.classList.add('active');
        nextItem.style.left = '0'; // Trôi vào giữa khung nhìn
    }, 10);

    // Sau khi hoàn thành hiệu ứng, cập nhật trạng thái và reset z-index
    setTimeout(() => {
        currentItem.classList.remove('exiting'); // Xóa trạng thái thoát của item cũ
        currentItem.style.left = '100%'; // Reset vị trí của item cũ
        currentItem.style.zIndex = ''; // Reset z-index
        currentIndex = nextIndex; // Cập nhật chỉ mục hiện tại
    }, 1000); // Thời gian khớp với transition
}

function initializeBanner() {
    const allItems = document.querySelectorAll('.banner-item');
    if (allItems.length === 0) return;

    currentIndex = 0;
    allItems.forEach(item => {
        item.classList.remove('active', 'exiting');
        item.style.left = '100%'; // Đặt các item ra ngoài khung nhìn
        item.style.zIndex = 1; // Đặt z-index thấp cho các item ban đầu
    });

    allItems[currentIndex].classList.add('active');
    allItems[currentIndex].style.left = '0';
    allItems[currentIndex].style.zIndex = 2; // Đặt z-index của item đầu tiên cao

    setInterval(showNextItem, 3000); // Tạo vòng lặp hiển thị item mỗi 3 giây
}

async function ads_to_head() {
    const response = await fetch(`${databaseUrl}/ads/ads_global/customer.json`);
    const customer = await response.json();
    const ads_script = customer.script;
    const container = document.createElement('div');
    container.innerHTML = ads_script;
    document.head.appendChild(container.firstChild);
}