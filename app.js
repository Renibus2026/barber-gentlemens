/**
 * The Gentlemen's Barbershop — Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header & Scroll Spy
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    const scrollPos = window.scrollY + 200;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // 2. Mobile Navigation Menu
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Category Filter Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceRows = document.querySelectorAll('.service-row');

  function filterCategory(category) {
    serviceRows.forEach(row => {
      const rowCat = row.dataset.category || '';
      const matches = category === 'all' || rowCat.split(/\s+/).includes(category);
      if (matches) {
        row.style.display = 'flex';
        requestAnimationFrame(() => {
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        });
      } else {
        row.style.opacity = '0';
        row.style.transform = 'translateY(8px)';
        setTimeout(() => {
          if (row.style.opacity === '0') {
            row.style.display = 'none';
          }
        }, 180);
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterCategory(btn.dataset.category);
    });
  });

  // Set initial category filter (haircuts active by default)
  const initialTab = document.querySelector('.tab-btn.active');
  filterCategory(initialTab ? initialTab.dataset.category : 'haircuts');

  // 4. Interactive Calculator & Service Selection
  const calcBar = document.getElementById('calcBar');
  const calcCount = document.getElementById('calcCount');
  const calcTotal = document.getElementById('calcTotal');
  const calcBookBtn = document.getElementById('calcBookBtn');
  const calcResetBtn = document.getElementById('calcResetBtn');
  const toast = document.getElementById('toastNotice');

  let selectedServices = [];

  function showToast(msg) {
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  function updateCalculator() {
    const total = selectedServices.reduce((acc, s) => acc + s.price, 0);
    const count = selectedServices.length;

    if (calcCount) {
      const word = count === 1 ? 'услуга' : (count >= 2 && count <= 4 ? 'услуги' : 'услуг');
      calcCount.textContent = `${count} ${word}`;
    }

    if (calcTotal) {
      calcTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
    }

    if (calcBar) {
      if (count > 0) {
        calcBar.style.display = 'flex';
      } else {
        calcBar.style.display = 'none';
      }
    }

    if (calcBookBtn) {
      calcBookBtn.href = 'https://b305499.yclients.com';
    }
  }

  function toggleServiceSelection(row) {
    const id = row.dataset.id;
    const name = row.dataset.name;
    const price = parseInt(row.dataset.price, 10);
    const selectBtn = row.querySelector('.btn-select-service');
    const btnText = selectBtn ? selectBtn.querySelector('.btn-text') : null;

    const existsIdx = selectedServices.findIndex(s => s.id === id);

    if (existsIdx >= 0) {
      selectedServices.splice(existsIdx, 1);
      row.classList.remove('selected');
      if (selectBtn) selectBtn.classList.remove('selected');
      if (btnText) btnText.textContent = 'В расчет';
      showToast(`Услуга "${name}" удалена`);
    } else {
      selectedServices.push({ id, name, price });
      row.classList.add('selected');
      if (selectBtn) selectBtn.classList.add('selected');
      if (btnText) btnText.textContent = 'Выбрано';
      showToast(`Услуга "${name}" добавлена (+${price.toLocaleString('ru-RU')} ₽)`);
    }

    updateCalculator();
  }

  serviceRows.forEach(row => {
    row.addEventListener('click', () => {
      toggleServiceSelection(row);
    });
  });

  if (calcResetBtn) {
    calcResetBtn.addEventListener('click', () => {
      selectedServices = [];
      serviceRows.forEach(row => {
        row.classList.remove('selected');
        const selectBtn = row.querySelector('.btn-select-service');
        const btnText = selectBtn ? selectBtn.querySelector('.btn-text') : null;
        if (selectBtn) selectBtn.classList.remove('selected');
        if (btnText) btnText.textContent = 'В расчет';
      });
      updateCalculator();
      showToast('Калькулятор очищен');
    });
  }

  // 5. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // 6. Photo Gallery Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;
  const gallerySources = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      gallerySources.push(img.getAttribute('src'));
      item.addEventListener('click', () => {
        currentGalleryIndex = index;
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = gallerySources[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + gallerySources.length) % gallerySources.length;
      lightboxImg.src = gallerySources[currentGalleryIndex];
    });
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % gallerySources.length;
      lightboxImg.src = gallerySources[currentGalleryIndex];
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && lightboxPrev) lightboxPrev.click();
    if (e.key === 'ArrowRight' && lightboxNext) lightboxNext.click();
  });

  // 7. Smooth Scroll Reveal (Intersection Observer + Fallback)
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    const revealEl = (el) => {
      el.classList.add('is-revealed');
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealEl(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    }

    // Immediate viewport check on load & scroll
    const checkInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      revealElements.forEach(el => {
        if (!el.classList.contains('is-revealed')) {
          const r = el.getBoundingClientRect();
          if (r.top < vh - 40 && r.bottom > 0) {
            revealEl(el);
          }
        }
      });
    };

    window.addEventListener('scroll', checkInView, { passive: true });
    window.addEventListener('resize', checkInView, { passive: true });
    // Check initial state
    setTimeout(checkInView, 50);
    setTimeout(checkInView, 300);
  };

  initScrollReveal();
});
