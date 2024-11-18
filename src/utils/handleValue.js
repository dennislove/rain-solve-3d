/**
 * Hàm để cập nhật giá trị trong state dựa trên sự kiện thay đổi
 * @param {Function} setState - Hàm setState để cập nhật state
 * @param {string} key - Tên của thuộc tính trong state cần cập nhật
 * @returns {Function} - Hàm xử lý sự kiện thay đổi
 */
export const handleValueChange = (setState, key) => (event) => {
  const value = parseFloat(event.target.value);
  setState((prevState) => ({
    ...prevState,
    [key]: value
  }));
};
