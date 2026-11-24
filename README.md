# BUS ROUTE

Giao diện HTML, CSS và JavaScript cho đồ án tìm đường xe buýt TP.HCM. Mở thư mục chứa `index.html` bằng Zed, nhấn Ctrl + Shift + R và chọn **BUS ROUTE - Mở website**. Trên Windows cũng có thể nhấp đúp `run.bat` nếu máy đã có Python trong PATH.

Máy chủ mở trình duyệt mặc định. Cổng ưu tiên là 5500. Nếu đang bận, máy chủ thử 5501 rồi dùng một cổng còn trống và in địa chỉ trong terminal. Nhấn Ctrl + C để dừng.

## Trang và mã nguồn

- `index.html`, `map.html`, `directions.html`, `routes.html` là các màn hình chính.
- `info.html`, `guide.html`, `algorithm.html`, `news.html`, `places.html`, `feedback.html` là sáu trang Thông tin.
- `css/style.css` chứa kiểu nền tảng. `css/interface.css` bổ sung bố cục trang Thông tin, tương tác và quy tắc giảm chuyển động.
- `js/interface.js` điều khiển sáng/tối, âm thanh, hoán đổi hai trạm và góp ý cục bộ.
- `js/algorithm-demo.js` điều khiển ví dụ bốn đỉnh trên trang thuật toán.

## Phạm vi bản thiết kế

Các trang Thông tin đọc được trước khi có API hoặc cơ sở dữ liệu. Phần Dijkstra dùng ví dụ học tập cố định. Ảnh xe buýt và địa danh là ảnh minh họa, tin tức là bài mẫu. Góp ý và đánh giá chỉ lưu trong trình duyệt.

Các trang bản đồ, tìm đường và tra cứu có trạng thái chờ kết nối dữ liệu cùng nút mở bản minh họa. Biểu mẫu trên trang chủ dùng trạm minh họa để xem hành trình. Chế độ minh họa dùng dữ liệu cục bộ trong `data/network.js`, thuật toán trong `js/graph.js` và bản đồ trong `js/map.js`. Nếu Leaflet không tải kịp, giao diện dùng sơ đồ ngoại tuyến. Dữ liệu tuyến, thời gian và giá vé trong bản minh họa chỉ dùng để thử giao diện.

Chạy bộ kiểm tra dữ liệu minh họa bằng `node tests/graph.test.js`.