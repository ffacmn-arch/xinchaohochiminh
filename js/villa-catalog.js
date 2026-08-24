(() => {
  const buttons = Array.from(document.querySelectorAll('.villa-filter [data-filter]'));
  const cards = Array.from(document.querySelectorAll('.villa-card[data-district]'));
  const empty = document.querySelector('.villa-empty-message');
  const count = document.querySelector('[data-villa-count]');

  if (!buttons.length || !cards.length) return;

  const applyFilter = (value) => {
    let visible = 0;
    cards.forEach((card) => {
      const show = value === 'all' || card.dataset.district === value;
      card.hidden = !show;
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });

    buttons.forEach((button) => {
      const active = button.dataset.filter === value;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (empty) empty.style.display = visible ? 'none' : 'block';
    if (count) count.textContent = String(visible);
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.filter || 'all'));
  });

  applyFilter('all');
})();
