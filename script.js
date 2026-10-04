const header = document.getElementById('header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 20));

const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
menuButton?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

/* Task scenarios */
const taskData = {
  new: {
    number: '01',
    title: 'Новая инженерная сеть',
    text: 'Соберем исходные данные, оценим ограничения объекта, выполним расчеты и сформируем состав работ до выхода на строительство.',
    flow: ['Исходные данные','Расчет','Решение','Реализация']
  },
  connect: {
    number: '02',
    title: 'Подключение объекта к сетям',
    text: 'Разберем доступные точки подключения, исходные условия и необходимые этапы, чтобы сформировать понятный маршрут реализации.',
    flow: ['Исходные данные','Обследование','Техрешение','Подключение']
  },
  reconstruct: {
    number: '03',
    title: 'Реконструкция существующей сети',
    text: 'Оценим фактическое состояние и ограничения существующих коммуникаций, после чего определим вариант реконструкции.',
    flow: ['Обследование','Диагностика','Решение','Реконструкция']
  },
  docs: {
    number: '04',
    title: 'Проект и документация',
    text: 'Определим необходимый состав исходных данных, расчетов и документации для дальнейшего согласования и реализации.',
    flow: ['Исходные данные','Расчеты','Проект','Документация']
  },
  problem: {
    number: '05',
    title: 'Проблема на существующей сети',
    text: 'Начнем с диагностики ситуации, локализуем проблему и предложим технически обоснованный следующий шаг.',
    flow: ['Диагностика','Причина','Решение','Работы']
  },
  consult: {
    number: '06',
    title: 'Инженерная консультация',
    text: 'Если пока непонятно, с чего начать, достаточно описать требуемый результат. Поможем сформировать задачу и определить исходные данные.',
    flow: ['Задача','Уточнение','Варианты','Следующий шаг']
  }
};

const taskTitle = document.getElementById('taskTitle');
const taskText = document.getElementById('taskText');
const taskNumber = document.getElementById('taskNumber');
const taskFlow = document.getElementById('taskFlow');

document.querySelectorAll('.task-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.task-option').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const d = taskData[btn.dataset.task];
    taskTitle.textContent = d.title;
    taskText.textContent = d.text;
    taskNumber.textContent = d.number;
    taskFlow.innerHTML = d.flow.map((x, i) => `<span>${x}</span>${i < d.flow.length-1 ? '<i>→</i>' : ''}`).join('');
  });
});

/* Carousel */
const carousel = document.getElementById('workCarousel');
const prev = document.querySelector('[data-carousel-prev]');
const next = document.querySelector('[data-carousel-next]');

function carouselStep(){
  const first = carousel?.querySelector('.gallery-slide');
  return first ? first.getBoundingClientRect().width + 18 : 360;
}
prev?.addEventListener('click', () => carousel.scrollBy({left: -carouselStep(), behavior: 'smooth'}));
next?.addEventListener('click', () => carousel.scrollBy({left: carouselStep(), behavior: 'smooth'}));

/* drag carousel */
let isDown = false, startX = 0, startScroll = 0;
carousel?.addEventListener('pointerdown', e => {
  isDown = true; startX = e.clientX; startScroll = carousel.scrollLeft;
  carousel.setPointerCapture?.(e.pointerId);
});
carousel?.addEventListener('pointermove', e => {
  if (!isDown) return;
  carousel.scrollLeft = startScroll - (e.clientX - startX);
});
['pointerup','pointercancel','mouseleave'].forEach(evt => carousel?.addEventListener(evt, () => isDown = false));

/* Lightbox */
const slides = [...document.querySelectorAll('.gallery-slide')];
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
let currentSlide = 0;

function showSlide(index){
  if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length;
  const slide = slides[currentSlide];
  lightboxImage.src = slide.dataset.image;
  lightboxImage.alt = slide.dataset.title;
  lightboxCaption.textContent = slide.dataset.title;
}
function openLightbox(index){
  showSlide(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
  document.body.classList.add('no-scroll');
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.classList.remove('no-scroll');
}

slides.forEach((slide, index) => slide.addEventListener('click', e => {
  if (Math.abs(carousel.scrollLeft - startScroll) > 8) return;
  openLightbox(index);
}));
document.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
document.querySelector('.lightbox__arrow--prev')?.addEventListener('click', () => showSlide(currentSlide - 1));
document.querySelector('.lightbox__arrow--next')?.addEventListener('click', () => showSlide(currentSlide + 1));
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showSlide(currentSlide - 1);
  if (e.key === 'ArrowRight') showSlide(currentSlide + 1);
});

/* Demo form */
const leadForm = document.getElementById('leadForm');
const formState = document.getElementById('formState');
leadForm?.addEventListener('submit', e => {
  e.preventDefault();
  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }
  formState.textContent = 'Демо: заявка подготовлена. Перед запуском подключим CRM / email / Telegram.';
});

/* Review mode */
(() => {
  const KEY = 'vodspecstroy-review-laconic-v1';
  const drawer = document.getElementById('reviewDrawer');
  const backdrop = document.getElementById('reviewBackdrop');
  const section = document.getElementById('reviewSection');
  const textarea = document.getElementById('reviewText');
  const list = document.getElementById('reviewList');
  const count = document.getElementById('reviewCount');
  const add = document.getElementById('reviewAdd');
  let notes = [];

  try { notes = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch(e) {}

  const esc = s => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const save = () => { localStorage.setItem(KEY, JSON.stringify(notes)); render(); };

  function render(){
    count.textContent = notes.length;
    if (!notes.length) {
      list.innerHTML = '<div class="review-empty">Пока комментариев нет.</div>';
      return;
    }
    list.innerHTML = notes.map((n,i) => `
      <div class="review-item">
        <div class="review-item__top"><b>${esc(n.section)}</b><button type="button" data-delete="${i}">×</button></div>
        <p>${esc(n.text)}</p><small>${esc(n.time)}</small>
      </div>`).join('');
  }

  function openReview(name){
    if (name) section.value = name;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    setTimeout(() => textarea.focus(), 100);
  }
  function closeReview(){
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
  }

  document.querySelectorAll('[data-open-review]').forEach(b => b.addEventListener('click', () => openReview()));
  document.querySelectorAll('[data-review-section]').forEach(b => b.addEventListener('click', () => openReview(b.dataset.reviewSection)));
  document.querySelectorAll('[data-close-review]').forEach(b => b.addEventListener('click', closeReview));
  backdrop.addEventListener('click', closeReview);

  add.addEventListener('click', () => {
    const value = textarea.value.trim();
    if (!value) return textarea.focus();
    notes.push({section: section.value, text: value, time: new Date().toLocaleString('ru-RU')});
    textarea.value = '';
    save();
  });

  list.addEventListener('click', e => {
    const b = e.target.closest('[data-delete]');
    if (!b) return;
    notes.splice(Number(b.dataset.delete), 1); save();
  });

  document.getElementById('reviewClear').addEventListener('click', () => {
    if (notes.length && confirm('Удалить все комментарии?')) { notes = []; save(); }
  });

  function exportText(){
    return notes.length
      ? ['ВОДСПЕЦСТРОЙ — правки к демо-версии','===================================','',
         ...notes.map((n,i) => `${i+1}. ${n.section}\n${n.text}\n${n.time}\n`)].join('\n')
      : 'Комментариев пока нет.';
  }

  document.getElementById('reviewCopy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(exportText()); }
    catch(e){ alert(exportText()); }
  });

  document.getElementById('reviewDownload').addEventListener('click', () => {
    const blob = new Blob([exportText()], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'vodspecstroy-comments.txt'; a.click();
    URL.revokeObjectURL(url);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeReview();
  });

  render();
})();
