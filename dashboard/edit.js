const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

get_btn_post();

async function get_btn_post() {

    const dataContainer = document.getElementById('hide-post');
    if (!postId) return;
    try {
        const response = await fetch(`${databaseUrl}/news/${postId}.json`);
        if (!response.ok) {
            console.error('Không thể lấy dữ liệu từ server.');
            return;
        }

        const post = await response.json();

        let htmlContent = '';
        if (post.status == 'hide') {
            htmlContent = `<button onclick="public_post()">Chuyển sang công khai </button>`;
        } else {
            htmlContent = `<button onclick="hide_post()">Chuyển sang ẩn </button>`;
        }

        dataContainer.innerHTML = htmlContent;
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu:', error);
    }
}

async function public_post() {
    const postData = {
        status: 'public',
    };

    const method = postId ? 'PATCH' : 'POST';
    const url = postId
        ? `${databaseUrl}/news/${postId}.json`
        : `${databaseUrl}/news.json`;
    if (confirm('Bạn có chắc chắn muốn Chuyển bài viết này sang công khai?')) {
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });
        get_btn_post();
        fetchPostData();
    }
}

async function hide_post() {
    const postData = {
        status: 'hide',
    };

    const method = postId ? 'PATCH' : 'POST';
    const url = postId
        ? `${databaseUrl}/news/${postId}.json`
        : `${databaseUrl}/news.json`;

    if (confirm('Bạn có chắc chắn muốn Ẩn bài viết này?')) {
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });
        get_btn_post();
        fetchPostData();
    }
}



// Lấy dữ liệu bài viết để hiển thị
async function fetchPostData() {

    const dataContainer = document.getElementById('hbody');
    if (!postId) return;

    try {
        const response = await fetch(`${databaseUrl}/news/${postId}.json`);
        if (!response.ok) {
            console.error('Không thể lấy dữ liệu từ server.');
            return;
        }

        const post = await response.json();

        // Kiểm tra và hiển thị dữ liệu
        let htmlContent = '';
        htmlContent += `<tr>
                                <td style="width: 100px; height: 40px;">Đường dẫn</td>
                                <td>${postId}</td>
                            </tr>`;
        if (post.name) {
            htmlContent += `<tr>
                                <td style="width: 100px; height: 40px;">Tên bài viết</td>
                                <td>${textOutput(post.name)}</td>
                            </tr>`;
        }
        if (post.summary) {
            htmlContent += `<tr>
                                <td style="width: 100px; height: 40px;">Thumbnail</td>
                                <td><img src="${post.summary}" alt="${post.name}" /></td>
                            </tr>`;
        }
        if (post.timestamp) {
            htmlContent += `<tr>
                                <td style="width: 100px; height: 40px;">Ngày đăng</td>
                                <td><small>${new Date(post.timestamp).toLocaleString()}</small></td>
                            </tr>`;
        }
        if (post.status) {
            htmlContent += `<tr>
                                <td style="width: 100px; height: 40px;">Trạng thái</td>
                                <td style"display: flex;">${post.status}</td>
                            </tr>`;
        }

        dataContainer.innerHTML = htmlContent;
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu:', error);
    }
}


async function fetchAndDisplayData() {
    if (!postId) {
        alert('Không tìm thấy ID bài viết!');
        return;
    }

    const fetchUrl = `${databaseUrl}/news/${postId}.json`;
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) {
            alert('Không thể lấy dữ liệu từ Firebase.');
            return;
        }

        const data = await response.json(); // Chuyển đổi dữ liệu JSON từ phản hồi
        const dataContainer = document.getElementById('tbody'); // Lấy thẻ div có id là tbody
        let htmlContent = '';

        for (const key in data) {
            const { field, value } = data[key]; // Lấy field và value từ từng object
            if (field === 'title') {
                htmlContent += `
                                <tr>
                                    <td style="width: 100px; height: 40px;">Tiêu đề</td>
                                    <td>${textOutput(value)}</td>
                                    <td style="width: 150px; height: auto;">
                                        <button onclick="Update('${key}', this)">Sửa</button>
                                        <button onclick="removeID('${key}')">Xóa</button>
                                    </td>
                                </tr>`;
            } else if (field === 'content') {
                htmlContent += `
                                <tr>
                                    <td style="width: 100px; height: 40px;">Nội dung</td>
                                    <td>${textOutput(value)}</td>
                                    <td style="width: 150px; height: auto;">
                                        <button onclick="Update('${key}', this)">Sửa</button>
                                        <button onclick="removeID('${key}')">Xóa</button>
                                    </td>
                                </tr>`;
            } else if (field === 'image') {
                htmlContent += `
                                <tr>
                                    <td style="width: 100px; height: 40px;">Ảnh</td>
                                    <td><img src="${value}" width="300" height="auto" /></td>
                                    <td style="width: 150px; height: auto;">
                                        <button onclick="Update('${key}', this)">Sửa</button>
                                        <button onclick="removeID('${key}')">Xóa</button>
                                    </td>
                                </tr>`;
            } else if (field === 'link') {
                htmlContent += `
                                <tr>
                                    <td style="width: 100px; height: 40px;">Liên kết</td>
                                    <td><a href="${value}" target="_blank" title="Đường liên kết">${value}</a></td>
                                    <td style="width: 150px; height: auto;">
                                        <button onclick="Update('${key}', this)">Sửa</button>
                                        <button onclick="removeID('${key}')">Xóa</button>
                                    </td>
                                </tr>`;
            }
        }

        dataContainer.innerHTML = htmlContent; // Hiển thị nội dung vào div tbody
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu:', error);
        alert('Đã xảy ra lỗi khi lấy dữ liệu.');
    }
}

// remove message function
async function removeID(key) {
    if (!postId) {
        alert('Không tìm thấy ID bài viết!');
        return;
    }

    const deleteUrl = `${databaseUrl}/news/${postId}/${key}.json`;
    try {
        const response = await fetch(deleteUrl, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchAndDisplayData(); // Cập nhật lại danh sách sau khi xóa
        } else {
            alert('Xóa dữ liệu thất bại.');
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi khi xóa dữ liệu:', error);
        alert('Đã xảy ra lỗi khi xóa dữ liệu.');
    }
}


// Update function
function Update(key, elem) {
    // Lấy tất cả các ô trong hàng
    const siblingTd = elem.parentElement.parentElement.getElementsByTagName('td');

    // Biến ô giá trị (value) thành có thể chỉnh sửa
    const valueCell = siblingTd[1]; // Cột thứ 2 là nơi chứa giá trị
    valueCell.contentEditable = true;
    valueCell.classList.add('temp-update-class');

    // Chuyển đổi nút Sửa thành nút Lưu
    elem.setAttribute('onclick', `updateNow('${key}', this)`);
    elem.innerHTML = 'Lưu';
}

// updateNow function
async function updateNow(key, elem) {
    // Lấy giá trị mới từ ô được chỉnh sửa
    const editableCell = document.querySelector('.temp-update-class');
    const newValue = editableCell.textContent.trim();

    // URL API để cập nhật
    const updateUrl = `${databaseUrl}/news/${postId}/${key}.json`;

    // Tạo payload chỉ thay đổi giá trị
    const payload = { value: newValue };

    try {
        const response = await fetch(updateUrl, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            // Reset ô thành không thể chỉnh sửa
            editableCell.contentEditable = false;
            editableCell.classList.remove('temp-update-class');

            // Đổi nút Sửa thành Lưu
            elem.setAttribute('onclick', `Update('${key}', this)`);
            elem.innerHTML = 'Lưu';

        } else {
            alert('Cập nhật dữ liệu thất bại.');
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi khi cập nhật dữ liệu:', error);
        alert('Đã xảy ra lỗi khi cập nhật dữ liệu.');
    }

    // Cập nhật lại hiển thị sau khi chỉnh sửa
    fetchAndDisplayData();
}


// Tạo ref mới và lưu dữ liệu
async function createNewRef(field, value) {
    if (!postId) {
        alert('Không tìm thấy ID bài viết!');
        return;
    }

    const newRefUrl = `${databaseUrl}/news/${postId}.json`;
    const payload = {
        field,
        value,
    };

    try {
        const response = await fetch(newRefUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            // Xóa dữ liệu trong trường nhập liệu
            if (field === 'title') {
                document.getElementById('title').value = '';
            } else if (field === 'content') {
                document.getElementById('content').value = '';
            } else if (field === 'image') {
                document.getElementById('image').value = '';
            } else if (field === 'link') {
                document.getElementById('link').value = '';
            }
        } else {
            alert('Lưu dữ liệu thất bại.');
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lưu dữ liệu:', error);
        alert('Đã xảy ra lỗi khi lưu dữ liệu.');
    }

    fetchAndDisplayData(); // Cập nhật dữ liệu hiển thị
}

// Tải dữ liệu khi mở trang
fetchAndDisplayData();
fetchPostData();