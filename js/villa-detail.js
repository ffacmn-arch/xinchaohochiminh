(() => {
  const main = document.getElementById('main-image');
  const thumbs = Array.from(document.querySelectorAll('#gallery-thumbs img'));
  const popup = document.getElementById('popup');
  const popupImage = document.getElementById('popup-img');
  const close = popup?.querySelector('.close');

  if (main && thumbs.length) {
    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        main.src = thumb.src;
        main.alt = thumb.alt;
        thumbs.forEach((item) => item.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  }

  const closePopup = () => {
    if (popup) popup.style.display = 'none';
  };

  if (main && popup && popupImage) {
    main.addEventListener('click', () => {
      popupImage.src = main.src;
      popupImage.alt = main.alt;
      popup.style.display = 'flex';
    });
    popup.addEventListener('click', (event) => {
      if (event.target === popup) closePopup();
    });
    close?.addEventListener('click', closePopup);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closePopup();
    });
  }
})();
