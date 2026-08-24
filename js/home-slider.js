(() => {
  const slides = [
    {
      src: "picter/VILLA/VILLA_YOLO_D/thum.jpg",
      alt: "정원과 전용 수영장이 있는 호치민 프라이빗 풀빌라",
      category: "빌라",
      position: "center"
    },
    {
      src: "picter/villa-sheet/villa-paradise/01.png",
      alt: "야간 조명과 전용 수영장을 갖춘 호치민 풀빌라",
      category: "빌라",
      position: "center"
    },
    {
      src: "picter/villa-sheet/four-seasons/01.jpg",
      alt: "정원과 야외 수영장을 갖춘 호치민 프라이빗 빌라",
      category: "빌라",
      position: "center"
    },
    {
      src: "picter/longthanh/San%20Golf%20Long%20Thanh%2005-l.jpg",
      alt: "페어웨이와 호수가 어우러진 롱탄 골프장",
      category: "골프",
      position: "center"
    },
    {
      src: "picter/dongnai_golf/thumnail.jpg",
      alt: "호수와 녹지가 펼쳐진 동나이 골프장 전경",
      category: "골프",
      position: "center"
    },
    {
      src: "picter/The%20Bluffs%20Grand%20Ho%20Tram/San-golf-The-Bluffs-Ho-Tram-2.jpg",
      alt: "해안 지형을 따라 조성된 더 블러프 호짬 골프장",
      category: "골프",
      position: "center"
    }
  ];

  const mediaLayers = Array.from(document.querySelectorAll(".hero-media"));
  const previousButton = document.getElementById("hero-slide-prev");
  const nextButton = document.getElementById("hero-slide-next");
  const toggleButton = document.getElementById("hero-slide-toggle");
  const status = document.getElementById("hero-slide-status");

  if (mediaLayers.length < 2 || !previousButton || !nextButton || !toggleButton || !status) return;

  const shuffle = (items) => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  };

  let order = [0, ...shuffle(slides.map((_, index) => index).slice(1))];
  let orderPosition = 0;
  let activeLayerIndex = 0;
  let isTransitioning = false;
  let timerId = null;
  let isPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateStatus = (slideIndex) => {
    status.textContent = `${slides[slideIndex].category} · ${orderPosition + 1} / ${slides.length}`;
  };

  const updateToggle = () => {
    toggleButton.textContent = isPaused ? "▶" : "Ⅱ";
    toggleButton.setAttribute("aria-pressed", String(isPaused));
    toggleButton.setAttribute("aria-label", isPaused ? "자동 재생 시작" : "자동 재생 일시 정지");
  };

  const preloadFollowingSlide = () => {
    const nextPosition = (orderPosition + 1) % order.length;
    const preloadImage = new Image();
    preloadImage.src = slides[order[nextPosition]].src;
  };

  const showSlide = (slideIndex) => {
    if (isTransitioning) return;

    const currentLayer = mediaLayers[activeLayerIndex];
    const nextLayerIndex = 1 - activeLayerIndex;
    const nextLayer = mediaLayers[nextLayerIndex];
    const slide = slides[slideIndex];
    let hasActivated = false;
    isTransitioning = true;

    const activate = () => {
      if (hasActivated) return;
      hasActivated = true;
      nextLayer.removeEventListener("load", activate);
      nextLayer.removeEventListener("error", skipBrokenImage);
      nextLayer.alt = slide.alt;
      nextLayer.style.objectPosition = slide.position;
      nextLayer.removeAttribute("aria-hidden");
      currentLayer.setAttribute("aria-hidden", "true");

      requestAnimationFrame(() => {
        nextLayer.classList.add("is-active");
        currentLayer.classList.remove("is-active");
        activeLayerIndex = nextLayerIndex;
        updateStatus(slideIndex);
        window.setTimeout(() => {
          currentLayer.alt = "";
          isTransitioning = false;
          preloadFollowingSlide();
        }, 1150);
      });
    };

    const skipBrokenImage = () => {
      if (hasActivated) return;
      hasActivated = true;
      nextLayer.removeEventListener("load", activate);
      nextLayer.removeEventListener("error", skipBrokenImage);
      isTransitioning = false;
      move(1);
    };

    nextLayer.addEventListener("load", activate, { once: true });
    nextLayer.addEventListener("error", skipBrokenImage, { once: true });
    nextLayer.src = slide.src;
    if (nextLayer.complete && nextLayer.naturalWidth > 0) activate();
  };

  const rebuildOrder = (direction) => {
    const currentSlide = order[orderPosition];
    const candidates = shuffle(slides.map((_, index) => index));
    const targetPosition = direction > 0 ? 0 : candidates.length - 1;
    if (candidates[targetPosition] === currentSlide) {
      const swapPosition = targetPosition === 0 ? 1 : targetPosition - 1;
      [candidates[targetPosition], candidates[swapPosition]] = [candidates[swapPosition], candidates[targetPosition]];
    }
    order = candidates;
    orderPosition = targetPosition;
  };

  function move(direction) {
    if (isTransitioning) return;
    const proposedPosition = orderPosition + direction;
    if (proposedPosition < 0 || proposedPosition >= order.length) {
      rebuildOrder(direction);
    } else {
      orderPosition = proposedPosition;
    }
    showSlide(order[orderPosition]);
  }

  const stopTimer = () => {
    if (timerId !== null) window.clearInterval(timerId);
    timerId = null;
  };

  const startTimer = () => {
    stopTimer();
    if (!isPaused && !document.hidden) timerId = window.setInterval(() => move(1), 5800);
  };

  const restartTimer = () => {
    if (!isPaused) startTimer();
  };

  previousButton.addEventListener("click", () => {
    move(-1);
    restartTimer();
  });

  nextButton.addEventListener("click", () => {
    move(1);
    restartTimer();
  });

  toggleButton.addEventListener("click", () => {
    isPaused = !isPaused;
    updateToggle();
    if (isPaused) stopTimer();
    else startTimer();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  updateToggle();
  const initializeRotation = () => {
    preloadFollowingSlide();
    startTimer();
  };

  if (document.readyState === "complete") {
    window.setTimeout(initializeRotation, 200);
  } else {
    window.addEventListener("load", initializeRotation, { once: true });
  }
})();
