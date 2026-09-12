const header=document.getElementById('header');
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',window.scrollY>20));

const menu=document.querySelector('.menu-btn'), mobileNav=document.querySelector('.mobile-nav');
menu?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});
document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));

const data={
new:['Новая инженерная сеть','Определим состав работ, исходные данные и оптимальное техническое решение — от обследования и расчетов до реализации.'],
connect:['Подключение объекта к сетям','Поможем определить технические условия, состав работ и оптимальное инженерное решение для подключения объекта.'],
design:['Проектирование системы','Соберем исходные данные, выполним необходимые расчеты и разработаем техническое решение и документацию.'],
reconstruct:['Реконструкция существующих сетей','Оценим состояние коммуникаций, определим ограничения и подготовим решение по реконструкции.'],
docs:['Инженерная документация','Определим необходимый состав документации и поможем подготовить ее под задачу проекта.'],
estimate:['Предварительный расчет','Изучим доступные исходные данные и сформируем предварительную оценку состава работ.'],
problem:['Проблема с коммуникациями','Поможем разобраться в ситуации: обследуем объект, определим причину и возможные технические решения.'],
consult:['Инженерная консультация','Опишите задачу своими словами — специалист поможет определить, с чего начать и какие исходные данные нужны.']
};
document.querySelectorAll('.task-card').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('.task-card').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
 const [title,text]=data[btn.dataset.task];document.getElementById('task-title').textContent=title;document.getElementById('task-text').textContent=text;
}));

document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
 document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
}));

const form=document.getElementById('leadForm'), state=document.getElementById('formState');
form?.addEventListener('submit',e=>{
 e.preventDefault(); if(!form.checkValidity()){form.reportValidity();return}
 state.textContent='Заявка подготовлена. В production здесь подключается CRM / email / Telegram.';
 form.reset();
});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.12});
document.querySelectorAll('.step,.solution,.why-card,.project,.object-card').forEach(el=>observer.observe(el));


// ===== Client review / feedback mode =====
(() => {
  const STORAGE_KEY = 'vodspecstroy-demo-review-v1';
  const drawer = document.getElementById('reviewDrawer');
  const backdrop = document.getElementById('reviewBackdrop');
  const sectionSelect = document.getElementById('reviewSection');
  const text = document.getElementById('reviewText');
  const add = document.getElementById('reviewAdd');
  const list = document.getElementById('reviewList');
  const count = document.getElementById('reviewCount');
  const clear = document.getElementById('reviewClear');
  const copy = document.getElementById('reviewCopy');
  const download = document.getElementById('reviewDownload');

  if (!drawer) return;

  let notes = [];
  try { notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch(e) {}

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    render();
  };

  const open = (section) => {
    if (section) sectionSelect.value = section;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    setTimeout(() => text.focus(), 120);
  };
  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
  };

  const render = () => {
    count.textContent = notes.length;
    if (!notes.length) {
      list.innerHTML = '<div class="review-empty">Пока комментариев нет.</div>';
      return;
    }
    list.innerHTML = notes.map((n,i) => `
      <article class="review-item">
        <div class="review-item__head">
          <b>${escapeHtml(n.section)}</b>
          <button type="button" data-delete-note="${i}" aria-label="Удалить">×</button>
        </div>
        <p>${escapeHtml(n.text)}</p>
        <small>${escapeHtml(n.time)}</small>
      </article>
    `).join('');
  };

  const escapeHtml = s => String(s).replace(/[&<>"']/g, m => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[m]));

  const exportText = () => {
    if (!notes.length) return 'Комментариев к макету пока нет.';
    return [
      'ВОДСПЕЦСТРОЙ — комментарии к демонстрационной версии сайта',
      '===========================================================',
      '',
      ...notes.map((n,i) => `${i+1}. ${n.section}\n${n.text}\nДобавлено: ${n.time}\n`)
    ].join('\n');
  };

  document.querySelectorAll('[data-open-review]').forEach(btn => btn.addEventListener('click', () => open()));
  document.querySelectorAll('[data-close-review]').forEach(btn => btn.addEventListener('click', closeDrawer));
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  document.querySelectorAll('[data-review-section]').forEach(btn => {
    btn.addEventListener('click', () => open(btn.dataset.reviewSection));
  });

  add.addEventListener('click', () => {
    const value = text.value.trim();
    if (!value) {
      text.focus();
      text.style.borderColor = '#d86a5e';
      setTimeout(() => text.style.borderColor = '', 900);
      return;
    }
    notes.push({
      section: sectionSelect.value,
      text: value,
      time: new Date().toLocaleString('ru-RU')
    });
    text.value = '';
    save();
  });

  list.addEventListener('click', e => {
    const btn = e.target.closest('[data-delete-note]');
    if (!btn) return;
    notes.splice(Number(btn.dataset.deleteNote), 1);
    save();
  });

  clear.addEventListener('click', () => {
    if (!notes.length) return;
    if (confirm('Удалить все сохраненные комментарии?')) {
      notes = [];
      save();
    }
  });

  copy.addEventListener('click', async () => {
    const payload = exportText();
    try {
      await navigator.clipboard.writeText(payload);
      const old = copy.textContent;
      copy.textContent = 'Скопировано';
      setTimeout(() => copy.textContent = old, 1400);
    } catch(e) {
      alert(payload);
    }
  });

  download.addEventListener('click', () => {
    const blob = new Blob([exportText()], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vodspecstroy-comments.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  render();
})();
