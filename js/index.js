show_hots();
show_list();
updateBox2Height();
load_topic();


///////////////////////////////////////////////////////////////////////////////

const count_sub_post = 8; // lấy số lượng bài viết trong phần sub 

///////////////////////////////////////////////////////////////////////////////////
function updateBox2Height() {
  const box1 = document.querySelector('.calc-hots');
  const box2 = document.querySelector('.calc-list');
  box2.style.height = `${box1.offsetHeight}px`;
}

const observer = new ResizeObserver(updateBox2Height);
observer.observe(document.querySelector('.calc-hots'));

/////////////////////////////////////////////////////////////////////////////

async function load_topic() {
  const response = await fetch(`${databaseUrl}/news.json`); // Gửi yêu cầu lấy dữ liệu từ database
  const news = await response.json(); // Chuyển đổi phản hồi JSON thành object

  const newsArray = Array.isArray(news)
    ? news // Nếu là mảng thì dùng trực tiếp
    : Object.entries(news || {}).map(([id, item]) => ({
      id,
      ...item,
    })); // Nếu là object thì chuyển sang mảng

  let putArray = [];
  for (let item of newsArray) {
    let topic = item.topic;
    if (topic !== 'hots') {
      if (!putArray.includes(topic)) {
        putArray.push(topic);
      }
    }
  }
  put_topic(putArray);
}

function put_topic(putArray) {
  const show = document.getElementById('foot-content');
  for (let post of putArray) {
    show.innerHTML += `<div class="${post}-section" id="${post}-section"></div>`;
  }
  initializeSections(putArray);
}

///////////////////////////////////////////////////////////////////////////////

function show_hots() {
  const show_hots = document.getElementById('hots-section');
  show_hots.innerHTML = `
    <h2>Breaking News</h2>
    <div class="calc-hots" id="get-data-hots"></div>`;
  hots();
}

async function hots() {
  let count = 0;
  const response = await fetch(`${databaseUrl}/news.json`);
  const news = await response.json();
  const newsArray = Object.entries(news || {}).map(([id, item]) => ({
    id,
    ...item,
  }));

  newsArray.sort((a, b) => b.timestamp - a.timestamp);

  const container = document.getElementById('get-data-hots');
  container.innerHTML = '';

  let contentHTML = '';
  for (let article of newsArray) {
    if (count >= 6) break;
    if (article.topic === 'hots' && article.status === 'public') {
      contentHTML += `
        <a href="posts.html?topic=${article.topic}&id=${article.id}" class="news-item">
          <div class="hots-news-item">
            <div class="hots-news-img skeleton-active">
              <img src="${article.summary}" onload="removeSkeleton(this)" onerror="handleImageError(this)" />
            </div>
            <div class="hots-news-text">
              <div>
                <h4 style="display: inline-block;">${textOutput(article.name)}</h4>
              </div>
            </div>
          </div>
        </a>
        `;
      count++;
    }
  }
  contentHTML += '<div class="see-more"> <a href="posts.html?topic=hots&id=null">See more</a></div>';
  container.innerHTML = contentHTML;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////

function show_list() {
  const show_list = document.getElementById('list-section');
  show_list.innerHTML = `
    <h2>Latest News</h2>
    <div class="calc-list" id="get-data-list"></div>`;
  list();
}

async function list() {
  const response = await fetch(`${databaseUrl}/news.json`);
  const news = await response.json();
  const newsArray = Object.entries(news || {}).map(([id, item]) => ({
    id,
    ...item,
  }));

  newsArray.sort((a, b) => b.timestamp - a.timestamp);

  const container = document.getElementById('get-data-list');
  container.innerHTML = '';

  let contentHTML = '';
  for (let article of newsArray) {
    if (article.topic !== 'hots' && article.status !== 'hide') {
      contentHTML += `
        <a href="posts.html?topic=${article.topic}&id=${article.id}" class="news-item")">
          <div class="list-news-item">
            <div class="list-news-img skeleton-active">
              <img src="${article.summary}" onload="removeSkeleton(this)" onerror="handleImageError(this)" />
            </div>
            <div class="list-news-text">
              <div>
                <h4 style="display: inline-block;">${textOutput(article.name)}</h4>
              </div>
              <small>${new Date(article.timestamp).toLocaleDateString()}</small>
            </div>
          </div>
        </a>
      `;
    }
  }
  container.innerHTML = contentHTML;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Hàm khởi tạo từng băng chuyền
function initializeSections(putArray) {
  putArray.forEach((section) => {
    const sectionElement = document.getElementById(`${section}-section`);
    sectionElement.innerHTML = `
      <div class="section-title">
        <h2>Tin ${capitalizeFirstLetter(section)}</h2>
        <div class="carousel-buttons">
          <button class="carousel-button left" onclick="moveCarousel('${section}', -1)">&#10094;</button>
          <button class="carousel-button right" onclick="moveCarousel('${section}', 1)">&#10095;</button>
        </div>
      </div>
      <div class="carousel-container">
        <div class="carousel" id="${section}-carousel"></div>
      </div>`;
    loadData(section);
  });
}

// Hàm dịch chuyển băng chuyền
function moveCarousel(section, direction) {
  const carousel = document.getElementById(`${section}-carousel`);
  const items = document.querySelectorAll(`.${section}-carousel-item`);
  const itemsVisible = 4; // Số mục hiển thị cùng lúc
  const totalItems = items.length;

  // Tạo hoặc cập nhật chỉ số hiện tại
  if (!window[`currentIndex_${section}`]) window[`currentIndex_${section}`] = 0;
  window[`currentIndex_${section}`] += direction;

  // Giới hạn chỉ số trong khoảng hợp lệ
  if (window[`currentIndex_${section}`] < 0) {
    window[`currentIndex_${section}`] = 0;
  } else if (window[`currentIndex_${section}`] > totalItems - itemsVisible) {
    window[`currentIndex_${section}`] = totalItems - itemsVisible;
  }

  const offset = window[`currentIndex_${section}`] * -25; // 25% mỗi mục
  carousel.style.transform = `translateX(${offset}%)`;
}

// Hàm tải dữ liệu và hiển thị
async function loadData(section) {
  const carousel = document.getElementById(`${section}-carousel`);
  let count = 0; // Bộ đếm số bài viết được thêm
  const response = await fetch(`${databaseUrl}/news.json`); // Lấy dữ liệu từ database
  const news = await response.json(); // Chuyển đổi phản hồi JSON thành object
  const newsArray = Object.entries(news || {}).map(([id, item]) => ({
    id,
    ...item,
  })); // Chuyển object thành mảng

  newsArray.sort((a, b) => b.timestamp - a.timestamp); // Sắp xếp theo thời gian giảm dần

  let contentHTML = ''; // Chuỗi chứa nội dung HTML
  for (let article of newsArray) {
    if (count >= count_sub_post) break; // Chỉ lấy tối đa số bài viết cho phép
    if (article.topic === section && article.status === 'public') {
      contentHTML += `
        <a href="posts.html?topic=${article.topic}&id=${article.id}" class="${section}-carousel-item carousel-item">
          <div class="cursor-item">
            <div class="section-img skeleton-active">
              <img src="${article.summary}" alt="${article.name}" onload="removeSkeleton(this)" onerror="handleImageError(this)" />
            </div>
            <div class="section-text">
              <div>
                <h4>${textOutput(article.name)}</h4>
              </div>
              <small>${new Date(article.timestamp).toLocaleDateString()}</small>
            </div>
          </div>
        </a>`;
      count++;
    }
  }

  carousel.innerHTML = contentHTML; // Gán nội dung HTML vào băng chuyền
}

// Hàm viết hoa chữ cái đầu tiên của từ
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hàm xóa skeleton loader sau khi ảnh tải xong
function removeSkeleton(img) {
  const imgContainer = img.parentElement;
  imgContainer.classList.remove('skeleton-active'); // Xóa skeleton
  img.style.display = 'block'; // Hiển thị ảnh
}

// Hàm xử lý khi ảnh bị lỗi


function handleImageError(img) {
  setTimeout(() => skeleton_error(img), 5000); // delay 5s khi không thể lấy ảnh 
}

function skeleton_error(img) {
  const imgContainer = img.parentElement;
  imgContainer.classList.remove('skeleton-active'); // Xóa skeleton
  img.style.display = 'none'; // Ẩn ảnh bị lỗi

  imgContainer.innerHTML = `
  <div 
    style=" display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #f0f0f0;
    color: #aaa;
    font-size: 14px;
    border-radius: 8px;">
    Image Error
  </div>`;
}

// Lấy phần tử button
const moveToTopBtn = document.getElementById('moveToTop');

// Theo dõi sự kiện cuộn
window.onscroll = function () {
  if (document.documentElement.scrollTop > 200) {
    moveToTopBtn.classList.add('show'); // Hiện nút với hiệu ứng
  } else {
    moveToTopBtn.classList.remove('show'); // Ẩn nút với hiệu ứng
  }
};

// Thêm sự kiện click cho nút
function moveToTop() {
  scrollToTop(500); // Gọi hàm cuộn mượt trong 2 giây
};

// Hàm cuộn lên với animation trong 2 giây
function scrollToTop(duration) {
  const start = document.documentElement.scrollTop || document.body.scrollTop;
  const startTime = Date.now();

  function animateScroll() {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime; // Thời gian đã trôi qua
    const progress = Math.min(elapsed / duration, 1); // Tiến độ (tối đa 1)

    // Tính toán vị trí cuộn hiện tại
    const currentScroll = start * (1 - progress);
    document.documentElement.scrollTop = currentScroll;
    document.body.scrollTop = currentScroll;

    // Dừng lại nếu đã hoàn tất
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  requestAnimationFrame(animateScroll);
}

