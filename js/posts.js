// Lấy ID bài viết từ URL
const urlParams = new URLSearchParams(window.location.search);
const get_topic = urlParams.get('topic');
const postId = urlParams.get('id');

const count_sub_post = 8; // lấy số lượng bài viết trong phần sub 

show_list();

if (postId == 'null') {
  show_topic();

  updateBox2Height();
} else {
  show_posts();
  updateBox2Height();
  show_foot_content();
}

/////////////////////////////////////////////////////////////////////////////////////

function show_foot_content() {
  const show_foot_content = document.getElementById('foot-content');
  show_foot_content.innerHTML = `
    <div class="sub-section" id="${get_topic}-section"></div>
    `;
  show_next_content();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function show_posts() {
  const show_posts = document.getElementById('posts-content');
  show_posts.innerHTML = `
    <div id="posts-title"></div>
    <div class="calc-posts" id="body-posts"></div>`;
  posts_id()
}

async function posts_id() {
  const dataContainer = document.getElementById('posts-title');
  try {
    const response = await fetch(`${databaseUrl}/news/${postId}.json`);
    const post = await response.json();
    let htmlContent = '';
    if (post.status === "public") {
      htmlContent =
        `<div class="posts-title">
                    <h4>${post.topic}</h4>
                    <small>Ngày đăng: ${new Date(post.timestamp).toLocaleString()}</small>
                </div>
                <h1>${textOutput(post.name)}</h1>
            `;
      dataContainer.innerHTML = htmlContent;
      fetchAndDisplayData();
    } else { shows_error(); }
  } catch (error) { shows_error(); }
}

async function fetchAndDisplayData() {
  const fetchUrl = `${databaseUrl}/news/${postId}.json`;
  try {
    const response = await fetch(fetchUrl);
    if (!response.ok) {
      alert('Không thể lấy dữ liệu từ Firebase.');
      return;
    }

    const data = await response.json(); // Chuyển đổi dữ liệu JSON từ phản hồi
    const dataContainer = document.getElementById('body-posts'); // Lấy thẻ div có id là tbody
    let htmlContent = '';

    for (const key in data) {
      const { field, value } = data[key]; // Lấy field và value từ từng object
      if (field === 'title') {
        htmlContent += `<h3>${textOutput(value)}</h3>`;
      } else if (field === 'content') {
        htmlContent += `<p>${textOutput(value)}</p>`;
      } else if (field === 'image') {
        htmlContent += `
                <div class="posts-img skeleton-active">
                    <img src="${value}" alt="${value}" onload="removeSkeleton(this)" onerror="handleImageError(this)" />
                </div>`;
      }
    }

    dataContainer.innerHTML = htmlContent; // Hiển thị nội dung vào div tbody
  } catch (error) {
    shows_error();
  }
}

function shows_error() {
  document.getElementById('posts-content').innerHTML = '';
  document.getElementById('posts-content').innerHTML = `
    <div class="error-noti">
      <h1>Bài viết không tồn tại</h1>
      <button onclick="Return_home()">Return 🏠</button>
    </div>
    `;
}

function Return_home() {
  // window.location.href = "/";
  document.body.style.transition = "opacity 1s";
  document.body.style.opacity = 0;
  setTimeout(() => {
    window.location.href = '/';
  }, 1000);
}

///////////////////////////////////////////////////////////////////////////////////
function updateBox2Height() {
  const calc = 70;
  const box1 = document.querySelector('.calc-posts');
  const box2 = document.querySelector('.calc-list');
  box2.style.height = `${calc + box1.offsetHeight}px`;
}

const observer = new ResizeObserver(updateBox2Height);
observer.observe(document.querySelector('.calc-posts'));

//////////////////////////////////////////////////////////////////////////////

function show_topic() {
  const show_topic = document.getElementById('posts-content');
  show_topic.innerHTML = `
    <h2>Breaking News</h2>
    <div class="calc-posts" id="topic-content"></div>`;
  topic_content();
}

async function topic_content() {
  let count = 0;
  const response = await fetch(`${databaseUrl}/news.json`);
  const news = await response.json();
  const newsArray = Object.entries(news || {}).map(([id, item]) => ({
    id,
    ...item,
  }));

  newsArray.sort((a, b) => b.timestamp - a.timestamp);

  const container = document.getElementById('topic-content');
  container.innerHTML = '';

  let contentHTML = '';
  for (let article of newsArray) {
    if (count >= 20) break;
    if (article.topic == get_topic && article.status == 'public') {
      contentHTML += `
        <a href="./posts.html?topic=${article.topic}&id=${article.id}" class="news-item")">
          <div class="topic-item">
            <div class="topic-img skeleton-active">
              <img src="${article.summary}" onload="removeSkeleton(this)" onerror="handleImageError(this)" />
            </div>
            <div class="topic-text">
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
  container.innerHTML = contentHTML;

}

//////////////////////////////////////////////////////////////////////////////////////

function show_next_content() {
  const show_hots = document.getElementById(get_topic + '-section');
  show_hots.innerHTML = `
    <div class="section-title">
      <h2>Tiếp theo</h2>
      <div class="carousel-buttons">
        <button class="carousel-button left" onclick="moveCarousel_next_content(-1)">&#10094;</button>
        <button class="carousel-button right" onclick="moveCarousel_next_content(1)">&#10095;</button>
      </div>
    </div>
    <div class="carousel-container">
      <div class="carousel" id="${get_topic}-carousel"></div>
    </div>`;
  next_content();
}

const carousel_next_content = document.getElementById(get_topic + '-carousel'); // Lấy phần tử băng chuyền
let currentIndex_next_content = 0; // Chỉ số hiện tại của băng chuyền

// Hàm dịch chuyển băng chuyền
function moveCarousel_next_content(direction) {
  const itemsVisible = 4; // Số mục hiển thị cùng lúc
  const totalItems = document.querySelectorAll('.topic-carousel-item').length; // Tổng số mục trong băng chuyền

  currentIndex_next_content += direction; // Cập nhật chỉ số theo hướng di chuyển

  // Đảm bảo chỉ số không vượt quá giới hạn
  if (currentIndex_next_content < 0) {
    currentIndex_next_content = 0;
  } else if (currentIndex_next_content > totalItems - itemsVisible) {
    currentIndex_next_content = totalItems - itemsVisible;
  }

  const offset = currentIndex_next_content * -25; // Tính toán khoảng cách dịch chuyển (25% mỗi mục)
  carousel_next_content.style.transform = `translateX(${offset}%)`; // Áp dụng dịch chuyển cho băng chuyền
}

// Hàm lấy dữ liệu bài viết từ database và hiển thị
async function next_content() {
  let count = 0; // Bộ đếm số bài viết được thêm
  const response = await fetch(`${databaseUrl}/news.json`); // Gửi yêu cầu lấy dữ liệu từ database
  const news = await response.json(); // Chuyển đổi phản hồi JSON thành object
  const newsArray = Object.entries(news || {}).map(([id, item]) => ({
    id,
    ...item,
  })); // Chuyển object thành mảng để dễ xử lý

  newsArray.sort((a, b) => b.timestamp - a.timestamp); // Sắp xếp bài viết theo thời gian giảm dần

  let contentHTML = ''; // Chuỗi chứa nội dung HTML

  for (let article of newsArray) {
    if (count >= count_sub_post) break; // Chỉ lấy tối đa số bài viết cho phép

    // Chỉ lấy các bài viết thuộc chủ đề chính trị và công khai
    if (article.topic === get_topic && article.status === 'public' && article.id !== postId) {
      contentHTML += `
        <a href="posts.html?topic=${article.topic}&id=${article.id}" class="topic-carousel-item carousel-item")">
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
        </a>
      `;
      count++; // Tăng bộ đếm
    }
  }

  carousel_next_content.innerHTML = contentHTML; // Gán nội dung HTML một lần
}

//////////////////////////////////////////////////////////////////////////////////////////////////

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
    if (article.id !== postId && article.status !== 'hide' && article.topic !== get_topic) {
      contentHTML += `
        <a href="./posts.html?id=${article.id}" class="news-item">
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
