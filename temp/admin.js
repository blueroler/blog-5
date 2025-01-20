// Lấy danh sách bài viết khi tải trang
fetchNews();

// Lấy bài viết news và sắp xếp theo timestamp
async function fetchNews() {
    const response = await fetch(`${databaseUrl}/news.json`);
    const posts = await response.json();

    const postsArray = Object.entries(posts || {}).map(([id, item]) => ({
        id,
        ...item,
    }));

    // Sắp xếp bài viết theo timestamp từ mới nhất đến cũ nhất
    postsArray.sort((a, b) => b.timestamp - a.timestamp);

    const listContainer = document.getElementById('news');
    listContainer.innerHTML = ''; // Xóa nội dung cũ nếu có

    // Thêm nội dung vào các thẻ div đã tạo sẵn trong HTML
    let htmlContent = '';
    for (let post of postsArray) {
    htmlContent += `
        <div class="post-container">
            <img src="${post.summary}" alt="${post.name}" />
            <div class="text-section">
                <h3>${post.name}</h3>
                <small>Ngày đăng: ${new Date(post.timestamp).toLocaleString()}</small>
            </div>
            <div class="button-group">
                <button onclick="Edit('${post.id}')">Sửa</button>
                <button onclick="Delete('${post.id}')">Xóa</button>
            </div>
        </div>
    `;
    }

    // Cập nhật nội dung cho container
    listContainer.innerHTML = htmlContent;

}

//////////////////////////////////////////////////////////////////////////////////////////

function Edit(id) {
    window.location.href = `edit.html?id=${id}`;
}

async function Delete(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        await fetch(`${databaseUrl}/news/${id}.json`, { method: 'DELETE' });
        fetchNews();
    }
}