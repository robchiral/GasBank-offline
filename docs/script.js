document.addEventListener("DOMContentLoaded", () => {
  const slideshows = document.querySelectorAll("[data-slideshow]");

  slideshows.forEach((slideshow) => {
    const track = slideshow.querySelector("[data-track]");
    const slides = Array.from(slideshow.querySelectorAll(".slideshow__slide"));
    const dotsContainer = slideshow.querySelector("[data-dots]");
    const prevBtn = slideshow.querySelector('[data-action="prev"]');
    const nextBtn = slideshow.querySelector('[data-action="next"]');
    const autoplayInterval = 6500;
    let index = 0;
    let timer = null;

    if (!track || slides.length === 0 || !dotsContainer) {
      return;
    }

    const renderDots = () => {
      dotsContainer.innerHTML = "";
      slides.forEach((_slide, idx) => {
        const dot = document.createElement("button");
        dot.className = "slideshow__dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
        dot.addEventListener("click", () => goToSlide(idx));
        dotsContainer.appendChild(dot);
      });
    };

    const updateTrackPosition = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((slide, idx) => {
        slide.classList.toggle("is-active", idx === index);
      });
      dotsContainer.querySelectorAll(".slideshow__dot").forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === index);
      });
    };

    const goToSlide = (target) => {
      index = (target + slides.length) % slides.length;
      updateTrackPosition();
      restartAutoplay();
    };

    const restartAutoplay = () => {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(() => {
        goToSlide(index + 1);
      }, autoplayInterval);
    };

    renderDots();
    updateTrackPosition();
    restartAutoplay();

    prevBtn?.addEventListener("click", () => goToSlide(index - 1));
    nextBtn?.addEventListener("click", () => goToSlide(index + 1));

    slideshow.addEventListener("mouseenter", () => {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    });

    slideshow.addEventListener("mouseleave", () => {
      if (!timer) {
        restartAutoplay();
      }
    });
  });
});
