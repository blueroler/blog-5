function show_sidebar() {
    const sidebar = document.getElementById("sidebar");
    const content = document.querySelector(".content");

    // Kiểm tra trạng thái sidebar
    if (sidebar.classList.contains("show")) {
        sidebar.classList.remove("show"); // Ẩn sidebar
        content.classList.remove("sidebar-visible"); // Trả lại trạng thái ban đầu cho main
    } else {
        sidebar.classList.add("show"); // Hiển thị sidebar
        content.classList.add("sidebar-visible"); // Đẩy main sang phải
    }
}


function lol() {
    clear_main();
    alert('HeHe Tính năng đang phát triển');
}

function clear_main() {
    const clear_dashboard = document.getElementById('admin-dashboard');
    const clear_blogs = document.getElementById('admin-blogs');
    const clear_add_blogs = document.getElementById('admin-add-blogs');
    const admin_ads = document.getElementById('admin-ads');

    clear_dashboard.innerHTML = '';
    clear_blogs.innerHTML = '';
    clear_add_blogs.innerHTML = '';
    admin_ads.innerHTML = ``;
}

// admin_dashboard();
admin_dashboard();
// manager_blogs();

function admin_dashboard() {
    clear_main();
    const admin_dashboard = document.getElementById('admin-dashboard');
    admin_dashboard.innerHTML = `
    <div class="admin-dashboard-container">
        <h2>Tổng quan bài viết</h2>
        <div class="admin-box">
            <div class="count-box">
                <h3>Total</h3>
                <div id="count-total"></div>
            </div>
            <div class="count-box">
                <h3>Public</h3>
                <div id="count-posted"></div>
            </div>
            <div class="count-box">
                <h3>Private</h3>
                <div id="count-draft"></div>
            </div>
        </div>

        <h2>Theo các chủ đề</h2>
        <div class="admin-box">
            <div class="count-box">
                <h3>Politics</h3>
                <div id="count-politics-post"></div>
            </div>
            <div class="count-box">
                <h3>Shows</h3>
                <div id="count-shows-post"></div>
            </div>
            <div class="count-box">
                <h3>Sport</h3>
                <div id="count-sport-post"></div>
            </div>
        </div>
    </div>
    `;
    count_total();
}
async function count_total() {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;
    const response = await fetch(`${databaseUrl}/news.json`);
    const posts = await response.json();

    const postsArray = Object.entries(posts || {}).map(([id, item]) => ({
        id,
        ...item,
    }));

    postsArray.sort((a, b) => b.timestamp - a.timestamp);

    const count_total = document.getElementById('count-total');
    for (let post of postsArray) {
        count1++;
    }
    count_total.innerHTML = `<h4>${count1}</h4>`;

    const count_posted = document.getElementById('count-posted');
    for (let post of postsArray) {
        if (post.status == "public") {
            count2++;
        } else { }

    }
    count_posted.innerHTML = `<h4>${count2}</h4>`;

    const count_draft = document.getElementById('count-draft');
    for (let post of postsArray) {
        if (post.status == "hide") {
            count3++;
        } else { }

    }
    count_draft.innerHTML = `<h4>${count3}</h4>`;
}

async function manager_blogs() {
    clear_main();

    const admin_blogs = document.getElementById('admin-blogs');
    admin_blogs.innerHTML += `<div class="table-list">
    <div style="height: 50px; display: flex; justify-content: center; gap: 20px; margin-bottom: 10px;" id="selec-topic"></div>
    <table id="scroll-topic"></table>
    </div>`;

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

        if (!putArray.includes(topic)) {
            putArray.push(topic);
        }
    }

    const show = document.getElementById('selec-topic');
    show.innerHTML = `<button onclick="blogs_list()">All</button>`;
    for (let ID of putArray) {
        show.innerHTML += `<button onclick="scroll_topic('${ID}')">${ID}</button>`;
    }
    blogs_list();
}

async function blogs_list() {
    let count = 1;
    const response = await fetch(`${databaseUrl}/news.json`);
    const posts = await response.json();

    const postsArray = Object.entries(posts || {}).map(([id, item]) => ({
        id,
        ...item,
    }));

    postsArray.sort((a, b) => b.timestamp - a.timestamp);

    const listContainer = document.getElementById('scroll-topic');
    listContainer.innerHTML = '';

    let htmlContent = `
                    <tr>
                        <td style="width: 50px; height: 50px;"><h4>STT</h4></td>
                        <td style="min-width: 150px; height: 50px;"><h4>Tên bài viết </h4></td>
                        <td><h4>Chủ đề </h4></td>
                        <td><h4>Thời Gian </h4></td>
                        <td><h4>Trạng thái </h4></td>
                        <td style="min-width: 130px; height: 50px;"><h4>Hành động </h4></td>
                    </tr>
    `;
    for (let post of postsArray) {
        htmlContent += `
                    <tr>
                        <td>${count}</td>
                        <td>${textOutput(post.name)}</td>
                        <td><h4>${post.topic}</h4></td>
                        <td>${new Date(post.timestamp).toLocaleDateString()}</td>
                        <td><h4>${post.status}</h4></td>
                        <td>
                            <button onclick="Edit('${post.id}')">Sửa</button>
                            <button onclick="Delete('${post.id}')">Xóa</button></td>
                    </tr>
    `;
        count++;
    }
    listContainer.innerHTML = htmlContent;
}

async function scroll_topic(ID) {
    let count = 1;
    const response = await fetch(`${databaseUrl}/news.json`);
    const posts = await response.json();

    const postsArray = Object.entries(posts || {}).map(([id, item]) => ({
        id,
        ...item,
    }));

    postsArray.sort((a, b) => b.timestamp - a.timestamp);

    const listContainer = document.getElementById('scroll-topic');
    listContainer.innerHTML = '';

    let htmlContent = `
                    <tr>
                        <td style="width: 50px; height: 50px;"><h4>STT</h4></td>
                        <td style="min-width: 150px; height: 50px;"><h4>Tên bài viết </h4></td>
                        <td><h4>Thời Gian </h4></td>
                        <td><h4>Trạng thái </h4></td>
                        <td style="min-width: 130px; height: 50px;"><h4>Hành động </h4></td>
                    </tr>
    `;
    for (let post of postsArray) {
        if (post.topic == ID) {
            htmlContent += `
                        <tr>
                            <td>${count}</td>
                            <td>${textOutput(post.name)}</td>
                            <td>${new Date(post.timestamp).toLocaleDateString()}</td>
                            <td><h4>${post.status}</h4></td>
                            <td>
                                <button onclick="Edit('${post.id}')">Sửa</button>
                                <button onclick="Delete('${post.id}')">Xóa</button></td>
                        </tr>
        `;
            count++;
        } else { }
    }
    listContainer.innerHTML = htmlContent;
}

function Edit(id) {
    hide_post();
    async function hide_post() {
        const postData = {
            status: 'hide',
        };

        const method = id ? 'PATCH' : 'POST';
        const url = id
            ? `${databaseUrl}/news/${id}.json`
            : `${databaseUrl}/news.json`;

        if (confirm('Nếu bạn sửa bài viết này sẽ chuyển sang dạng ẩn')) {
            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData),
            });
            window.location.href = `edit.html?id=${id}`;
            // window.open(`edit.html?id=${id}`, '_blank');
        }
    }
}

async function Delete(id) {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
        await fetch(`${databaseUrl}/news/${id}.json`, { method: 'DELETE' });
        manager_blogs();
    }
}

async function add_blogs() {
    clear_main();
    const admin_add_blogs = document.getElementById('admin-add-blogs');
    admin_add_blogs.innerHTML = `
    <div class="admin-add-container">
        <form id='put-blogs'>
            <input style="display: none;" id="post-id" />
            <div>
            <label for="category">Chủ đề bài viết:</label>
            <input id="get-category" list="category" type="text" required>
            <datalist id="category"></datalist>
            </div>

            <div>
            <label for="name">Tên bài viết:</label>
            <input type="text" id="name" required />
            </div>

            <div>
            <label for="summary">Ảnh thumbnail:</label>
            <textarea rows="4" cols="50" id="summary" placeholder="Link ảnh nhúng" required></textarea>
            </div>

            <div class="just-center">
            <button type="submit">Tạo bài viết</button>
            <!-- <button id="addnews" type="button">Tạo bài viết</button> -->
            </div>
        </form>
    </div>
  `;

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

        if (!putArray.includes(topic)) {
            putArray.push(topic);
        }
    }

    const show = document.getElementById('category');
    for (let post of putArray) {
        show.innerHTML += `<option value="${post}"></option>`;
    }
    add_Post();
}

function add_Post() {
    document.getElementById('put-blogs').addEventListener('submit', savePost);

    async function savePost(event) {
        event.preventDefault();

        const topic = document.getElementById('get-category').value;
        // const postId = document.getElementById('post-id').value;
        const postId = Date.now();
        const name = document.getElementById('name').value;
        const summary = document.getElementById('summary').value;

        const postData = {
            status: 'public',
            topic,
            name,
            summary,
            timestamp: postId ? Date.now() : Date.now(),
        };

        const method = postId ? 'PUT' : 'POST';
        const url = postId
            ? `${databaseUrl}/news/${postId}.json`
            : `${databaseUrl}/news.json`;

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });

        document.getElementById('put-blogs').reset();
        manager_blogs();
    }
}

function admin_ads() {
    clear_main();
    const admin_ads = document.getElementById('admin-ads');
    admin_ads.innerHTML = `
    <div class="admin-ads-container">
        <div class="ads-container">
            <h2 style="text-align: center; margin: 10px 0;">Quảng cáo Qua Banner</h2>
            <p style="text-align: center; font-size: 15px; margin-top: 5px; color: #999;">quảng cáo sẽ tự động tắt nếu không có dữ liệu</p>
            <div id="check-ads-status"></div>
            <table>
                <tbody id="get-local-ads">
                </tbody>
            </table>
            <form id='add-local-ads'>
                <div>
                    <label for="ads-id">Thêm mới một item </label>
                    <input type="text" id="img-id" placeholder="Img banner" required />
                    <input type="text" id="ads-id" placeholder="ADS link" required>
                </div>
                <div class="just-center">
                    <button type="submit">Tạo</button>
                </div>
            </form>
        </div>

        <div class="ads-container">
            <h2 style="text-align: center; margin: 10px 0;">Quảng cáo bằng mã Script</h2>
            <p style="text-align: center; font-size: 15px; margin-top: 5px; color: #999;">(mã sẽ được chèn trong thẻ head)</p>
            <table>
                <tbody id="get-global-ads">
                </tbody>
            </table>
            <form id='add-global-ads'>
                <div>
                    <label for="ads-id">Chèn ADS Script</label>
                    <input type="text" id="name-ads" placeholder="Name" required />
                    <input type="text" id="script-ads-id" placeholder="Script" required>
                </div>
                <div class="just-center">
                    <button type="submit">Tạo</button>
                </div>
            </form>
        </div>
    </div>
    `;
    check_ads_status();
    put_ads_global();
}

async function check_ads_status() {

    const dataContainer = document.getElementById('check-ads-status');
    const response = await fetch(`${databaseUrl}/status_element.json`);
    const post = await response.json();

    let htmlContent = '';
    if (post.ads == 0) {
        htmlContent = `
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 30px;">
            <div style="display: inline-block; width: 150px; text-align: center; color: red;">Đang TẮT</div>
            <button id="button-check-data" disabled style="width: 100px;" onclick="on_ads()">Enable</button>
        </div>`;
    } else {
        htmlContent = `
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 30px;">
            <div style="display: inline-block; width: 150px; text-align: center; color: blue;">Đang BẬT</div>
            <button id="button-check-data" enable style="width: 100px;" onclick="off_ads()">Disable</button>
        </div>`;
    }

    dataContainer.innerHTML = htmlContent;
    const myButton = document.getElementById('button-check-data');
    put_ads_local(myButton);

}

async function on_ads() {
    const postData = {
        ads: 1,
    };

    const method = 'PUT';
    const url = `${databaseUrl}/status_element.json`;
    if (confirm('Bạn có chắc chắn muốn BẬT quảng cáo?')) {
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });
        check_ads_status();
    }
}

async function off_ads() {
    const postData = {
        ads: 0,
    };

    const method = 'PUT';
    const url = `${databaseUrl}/status_element.json`;
    if (confirm('Bạn có chắc chắn muốn TẮT quảng cáo?')) {
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });
        check_ads_status();
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


async function put_ads_local(myButton) {
    try {
        // Gắn sự kiện submit cho form
        document.getElementById('add-local-ads').addEventListener('submit', saveAdsLocal);

        // Lấy dữ liệu từ Firebase
        const response = await fetch(`${databaseUrl}/ads/ads_local.json`);

        // Kiểm tra nếu phản hồi không thành công
        if (!response.ok) {
            throw new Error(`Lỗi khi lấy dữ liệu: ${response.status}`);
        }

        const news = await response.json();
        const newsArray = Object.entries(news || {}).map(([id, item]) => ({ id, ...item }));
        newsArray.sort((a, b) => b.timestamp - a.timestamp);

        // Tạo nội dung hiển thị
        let htmlData = `
            <tr>
                <td style="width: 80px;"><h4>Thứ tự</h4></td>
                <td><h4>Img</h4></td>
                <td><h4>ADS</h4></td>
                <td style="width: 170px;"><h4>Hành động</h4></td>
            </tr>
        `;

        if (newsArray.length === 0) {
            const response1 = await fetch(`${databaseUrl}/status_element.json`);
            const post1 = await response1.json();

            if (post1.ads == 0) {
                htmlData += `
                <tr>
                    <td colspan="4" style="text-align: center;">Không có dữ liệu.</td>
                </tr>
            `;
            } else {
                auto_off_ads();
                htmlData += `
                <tr>
                    <td colspan="4" style="text-align: center;">Không có dữ liệu.</td>
                </tr>
            `;
            }
        } else {
            myButton.disabled = false;
            newsArray.forEach((item, index) => {
                htmlData += `
                    <tr>
                        <td><p>${index + 1}</p></td>
                        <td><p>${item.img}</p></td>
                        <td>${item.ads}</td>
                        <td>
                            <button onclick="readyForUpdate('${item.id}', this)">Edit</button>
                            <button onclick="moveUp('${item.id}', ${index})">˄</button>
                            <button onclick="removeAds('${item.id}')">Delete</button>
                            <button onclick="moveDown('${item.id}', ${index})">˅</button>
                        </td>
                    </tr>
                `;
            });
        }

        // Hiển thị nội dung lên bảng
        document.querySelector('#get-local-ads').innerHTML = htmlData;

    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);

        // Hiển thị thông báo lỗi lên giao diện
        document.querySelector('#get-local-ads').innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: red;">Lỗi khi tải dữ liệu. Vui lòng thử lại sau.</td>
            </tr>
        `;
    }
}


async function put_ads_global() {
    document.getElementById('add-global-ads').addEventListener('submit', saveAdsGlobal);
    try {
        // Lấy dữ liệu từ Firebase
        const response = await fetch(`${databaseUrl}/ads/ads_global/customer.json`);
        const customer = await response.json();

        // Kiểm tra nếu không có dữ liệu
        if (!customer) {
            document.querySelector('#get-global-ads').innerHTML = '<tr><td colspan="3">Không có dữ liệu.</td></tr>';
            return;
        }

        const htmlData = `
            <tr>
                <td><h4>Name</h4></td>
                <td><h4>Script</h4></td>
                <td style="width: 150px;"><h4>Hành động</h4></td>
            </tr>
            <tr>
                <td>${customer.name}</td>
                <td>${textOutput(customer.script)}</td>
                <td>
                    <button onclick="removeGlobalAd()">Delete</button>
                </td>
            </tr>
        `;

        document.querySelector('#get-global-ads').innerHTML = htmlData;
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        document.querySelector('#get-global-ads').innerHTML = '<tr><td colspan="3">Lỗi tải dữ liệu.</td></tr>';
    }
}


async function moveUp(id, index) {
    const response = await fetch(`${databaseUrl}/ads/ads_local.json`);
    const news = await response.json();
    const newsArray = Object.entries(news || {}).map(([id, item]) => ({ id, ...item }));
    newsArray.sort((a, b) => b.timestamp - a.timestamp);

    if (index > 0) {
        const currentItem = newsArray[index];
        const prevItem = newsArray[index - 1];

        // Hoán đổi timestamp
        const updates = {
            [`/ads/ads_local/${currentItem.id}/timestamp`]: prevItem.timestamp,
            [`/ads/ads_local/${prevItem.id}/timestamp`]: currentItem.timestamp,
        };

        await fetch(`${databaseUrl}/.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });

        check_ads_status(); // Load lại dữ liệu
    }
}

async function moveDown(id, index) {
    const response = await fetch(`${databaseUrl}/ads/ads_local.json`);
    const news = await response.json();
    const newsArray = Object.entries(news || {}).map(([id, item]) => ({ id, ...item }));
    newsArray.sort((a, b) => b.timestamp - a.timestamp);

    if (index < newsArray.length - 1) {
        const currentItem = newsArray[index];
        const nextItem = newsArray[index + 1];

        // Hoán đổi timestamp
        const updates = {
            [`/ads/ads_local/${currentItem.id}/timestamp`]: nextItem.timestamp,
            [`/ads/ads_local/${nextItem.id}/timestamp`]: currentItem.timestamp,
        };

        await fetch(`${databaseUrl}/.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });

        check_ads_status(); // Load lại dữ liệu
    }
}

async function saveAdsLocal(event) {
    event.preventDefault();

    try {
        const response = await fetch(`${databaseUrl}/ads/ads_local.json`);
        const news = await response.json();
        const newsArray = Object.entries(news || {}).map(([id, item]) => ({ id, ...item }));
        newsArray.sort((a, b) => b.timestamp - a.timestamp);

        if (newsArray.length === 0) {
            auto_off_ads();
            saveAdsLocal_check();
        } else {
            error
        }

    } catch (error) {
        saveAdsLocal_check();
    }
}

async function saveAdsLocal_check() {
    const data1 = document.getElementById('img-id').value.trim();
    const data2 = document.getElementById('ads-id').value.trim();
    const newAd = {
        img: data1,
        ads: data2,
        timestamp: Date.now(),
    };

    try {
        const response = await fetch(`${databaseUrl}/ads/ads_local.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAd),
        });

        if (response.ok) {
            alert('Thêm thành công!');
            document.getElementById('add-local-ads').reset();
            check_ads_status();
        } else {
            alert('Thêm thất bại.');
        }
    } catch (error) {
        alert('Đã xảy ra lỗi khi thêm.');
    }
}

async function saveAdsGlobal(event) {
    event.preventDefault(); // Ngăn chặn reload form

    // Lấy dữ liệu từ form
    const data1 = document.getElementById('name-ads').value.trim();
    const data2 = document.getElementById('script-ads-id').value.trim();

    // Tạo object mới
    const newAd = {
        name: data1,
        script: data2,
    };

    try {
        // Gửi yêu cầu PUT để ghi đè tại key "global_ad"
        const response = await fetch(`${databaseUrl}/ads/ads_global/customer.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAd),
        });

        if (response.ok) {
            alert('Cập nhật thành công!');
            document.getElementById('add-global-ads').reset(); // Xóa form sau khi lưu
            put_ads_global(); // Cập nhật lại dữ liệu
        } else {
            alert('Cập nhật thất bại.');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu:', error);
        alert('Đã xảy ra lỗi khi cập nhật.');
    }
}

async function removeGlobalAd() {
    if (confirm('Bạn có chắc chắn muốn xóa quảng cáo này không?')) {
        try {
            const response = await fetch(`${databaseUrl}/ads/ads_global/customer.json`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Xóa thành công!');
                put_ads_global(); // Cập nhật lại hiển thị
            } else {
                alert('Xóa thất bại.');
            }
        } catch (error) {
            console.error('Lỗi khi xóa dữ liệu:', error);
            alert('Đã xảy ra lỗi khi xóa.');
        }
    }
}


async function removeAds(key) {
    try {
        const response = await fetch(`${databaseUrl}/ads/ads_local/${key}.json`, { method: 'DELETE' });
        if (response.ok) {
            alert('Xóa thành công!');
            check_ads_status();
        } else {
            alert('Xóa thất bại.');
        }
    } catch (error) {
        console.error('Lỗi khi xóa dữ liệu:', error);
        alert('Đã xảy ra lỗi khi xóa.');
    }
}

function readyForUpdate(key, elem) {
    const siblingTd = elem.parentElement.parentElement.getElementsByTagName('td');
    for (var i = 1; i < siblingTd.length - 1; i++) {
        siblingTd[i].contentEditable = true;
        siblingTd[i].classList.add('temp-update-class');
    }
    elem.setAttribute('onclick', `updateNow('${key}', this)`);
    elem.innerHTML = 'Send';
}

async function updateNow(key, elem) {
    const contentId = document.querySelectorAll('.temp-update-class');
    const obj = {
        img: contentId[0].textContent.trim(),
        ads: contentId[1].textContent.trim(),
    };

    try {
        const response = await fetch(`${databaseUrl}/ads/ads_local/${key}.json`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj),
        });

        if (response.ok) {
            contentId.forEach(cell => {
                cell.contentEditable = false;
                cell.classList.remove('temp-update-class');
            });
            elem.setAttribute('onclick', `readyForUpdate('${key}', this)`);
            elem.innerHTML = 'Edit';
            alert('Cập nhật thành công!');
        } else {
            alert('Cập nhật thất bại.');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật dữ liệu:', error);
        alert('Đã xảy ra lỗi khi cập nhật.');
    }
}