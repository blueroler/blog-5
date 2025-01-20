// xây dựng một thư viện nhỏ để escape dữ liệu đầu vào.
function textOutput(input) {
    const div = document.createElement('div');
    div.textContent = input; // Escape toàn bộ dữ liệu
    return div.innerHTML; // Trả về dữ liệu đã được escape
}