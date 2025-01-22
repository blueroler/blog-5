// Hàm chuyển đổi thuần văn bản cho dữ liệu đầu vào.
function textOutput(input) {
    const div = document.createElement('div');
    div.textContent = input; // Escape toàn bộ dữ liệu
    return div.innerHTML; // Trả về dữ liệu đã được escape
}

// Hàm viết hoa chữ cái đầu tiên của từ.
function capitalizeFirstLetter(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
}