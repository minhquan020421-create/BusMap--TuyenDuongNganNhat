(() => {
  // A fixed walkthrough for the illustrated graph, independent of transit data.
  const steps = [
    {title: 'Khởi tạo', text: 'Chi phí đến A bằng 0. Ba trạm còn lại có chi phí tạm thời là vô cực (∞).', costs: [0, '∞', '∞', '∞'], settled: '', edges: []},
    {title: 'Chốt A', text: 'Từ A, đi đến B mất 4 km và đến C mất 1 km. Trong các trạm chưa chốt, C có chi phí nhỏ nhất.', costs: [0, 4, 1, '∞'], settled: 'A', edges: ['AB', 'AC']},
    {title: 'Chốt C', text: 'Qua C, đường tới B giảm từ 4 xuống 3 km. Đường đầu tiên tới D dài 1 + 6 = 7 km.', costs: [0, 3, 1, 7], settled: 'AC', edges: ['CB', 'CD']},
    {title: 'Chốt B', text: 'Qua B, đường tới D chỉ còn 3 + 1 = 4 km. Ghi B là trạm đứng trước D.', costs: [0, 3, 1, 4], settled: 'ACB', edges: ['BD']},
    {title: 'Chốt D và truy vết', text: 'Đường ngắn nhất là A → C → B → D. Tổng quãng đường bằng 1 + 2 + 1 = 4 km.', costs: [0, 3, 1, 4], settled: 'ACBD', edges: ['AC', 'CB', 'BD']}
  ];
  const prev = document.getElementById('prev-step');
  const next = document.getElementById('next-step');
  let index = 0;

  function render() {
    const step = steps[index];
    document.getElementById('step-count').textContent = 'Bước ' + (index + 1) + ' / ' + steps.length;
    document.getElementById('step-heading').textContent = step.title;
    document.getElementById('step-body').textContent = step.text;
    document.querySelectorAll('.distances dd').forEach((cell, i) => { cell.textContent = step.costs[i]; });
    document.querySelectorAll('.vertex').forEach(node => {
      node.classList.toggle('settled', step.settled.includes(node.id.slice(-1)));
    });
    document.querySelectorAll('.tracks path').forEach(edge => {
      edge.classList.toggle('traced', step.edges.includes(edge.id.slice(5)));
    });
    prev.disabled = index === 0;
    next.textContent = index === steps.length - 1 ? 'Xem lại từ đầu' : 'Bước tiếp →';
  }
  prev.addEventListener('click', () => { index = Math.max(index - 1, 0); render(); });
  next.addEventListener('click', () => { index = (index + 1) % steps.length; render(); });
  render();
})();
