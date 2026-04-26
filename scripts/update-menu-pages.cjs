const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'about', 'index.html');

let template = fs.readFileSync(templatePath, 'utf8');
template = template.replace(/<form action="[^"]*index\.html#\s+class="ul-search-form"/g, '<form action="index.html#" class="ul-search-form"');
template = template.replace(/<form action="[^"]*index\.html#"\s+class="ul-search-form"/g, '<form action="index.html#" class="ul-search-form"');
template = template.replace(/<nav class="ul-header-nav">[\s\S]*?<\/nav>/, '<nav class="ul-header-nav">__NAV__</nav>');
template = template.replace(/<main>[\s\S]*?<\/main>/, '<main>__MAIN__</main>');

function depthFor(file) {
  const dir = path.dirname(file).replace(/\\/g, '/');
  if (dir === '.' || dir === '') return 0;
  return dir.split('/').filter(Boolean).length;
}

function prefixFor(file) {
  const depth = depthFor(file);
  return depth === 0 ? '' : '../'.repeat(depth);
}

function href(prefix, target) {
  return `${prefix}${target}`;
}

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nav(prefix) {
  const h = (target) => href(prefix, target);

  return `
                            <a href="${h('index.html')}">Главная</a>

                            <div class="has-sub-menu">
                                <a role="button">О нас</a>
                                <div class="ul-header-submenu">
                                    <ul>
                                        <li><a href="${h('about/index.html')}">Об организации</a></li>
                                        <li><a href="${h('about/reports/index.html')}">Отчеты о деятельности</a></li>
                                        <li><a href="${h('team/index.html')}">Наша команда</a></li>
                                        <li><a href="${h('requisites/index.html')}">Реквизиты</a></li>
                                        <li><a href="${h('about/partners/index.html')}">Партнеры</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="has-sub-menu">
                                <a role="button">Ведущие специалисты</a>
                                <div class="ul-header-submenu">
                                    <ul>
                                        <li><a href="${h('spec/index.html')}">Все специалисты</a></li>
                                        <li><a href="${h('spec-consultation/index.html')}">Запись на консультацию</a></li>
                                        <li><a href="${h('spec-telemedicine/index.html')}">Телемедицина</a></li>
                                        <li><a href="${h('spec-neurosurgeons/index.html')}">Врачи-нейрохирурги</a></li>
                                        <li><a href="${h('spec-endocrinologists/index.html')}">Врачи-эндокринологи</a></li>
                                    </ul>
                                </div>
                            </div>

                            <a href="${h('pariki-posle-himioterapii/index.html')}">Заявка на парик</a>

                            <div class="has-sub-menu">
                                <a role="button">Аденомы гипофиза</a>
                                <div class="ul-header-submenu">
                                    <ul>
                                        <li><a href="${h('adenomy-gipofiza/index.html')}">О заболевании</a></li>
                                        <li><a href="${h('adenomy-gipofiza/articles/index.html')}">Статьи и исследования</a></li>
                                        <li><a href="${h('help/index.html')}">Получить помощь</a></li>
                                        <li><a href="${h('adenomy-gipofiza/acromegaly/index.html')}">Акромегалия</a></li>
                                        <li><a href="${h('adenomy-gipofiza/cushing/index.html')}">Кушинг</a></li>
                                        <li><a href="${h('adenomy-gipofiza/soputstvuyushhie-zabolevaniya/index.html')}">Сопутствующие заболевания</a></li>
                                    </ul>
                                </div>
                            </div>

                            <a href="${h('events/index.html')}">Школы пациентов</a>
                            <a href="${h('blog/index.html')}">Новости</a>
                            <a href="${h('contact/index.html')}">Контакты</a>`;
}

function footerQuickLinks(prefix) {
  const h = (target) => href(prefix, target);

  return `<div class="ul-footer-widget-links">
                            <a href="${h('about/index.html')}">Об организации</a>
                            <a href="${h('help/index.html')}">Получить помощь</a>
                            <a href="${h('adenomy-gipofiza/index.html')}">Аденомы гипофиза</a>
                            <a href="${h('spec/index.html')}">Ведущие специалисты</a>
                            <a href="${h('contact/index.html')}">Контакты</a>
                        </div>`;
}

function breadcrumb(prefix, page) {
  const crumbs = [`<li><a href="${href(prefix, 'index.html')}">Главная</a></li>`];

  if (page.parent) {
    crumbs.push('<li><span class="separator"><i class="flaticon-right"></i></span></li>');
    crumbs.push(`<li><a href="${href(prefix, page.parent.href)}">${esc(page.parent.label)}</a></li>`);
  }

  crumbs.push('<li><span class="separator"><i class="flaticon-right"></i></span></li>');
  crumbs.push(`<li>${esc(page.breadcrumb || page.title)}</li>`);

  return `
        <section class="ul-breadcrumb ul-section-spacing">
            <div class="ul-container">
                <h2 class="ul-breadcrumb-title">${esc(page.heading || page.title)}</h2>
                <ul class="ul-breadcrumb-nav">
                    ${crumbs.join('\n                    ')}
                </ul>
            </div>
        </section>`;
}

function hero(prefix, page) {
  return `
        <section class="ul-about ul-section-spacing wow animate__fadeInUp">
            <div class="ul-container">
                <div class="row row-cols-md-2 row-cols-1 align-items-center gy-4 ul-about-row">
                    <div class="col">
                        <div class="ul-about-imgs velikan-about-page-img">
                            <div class="img-wrapper">
                                <img src="${href(prefix, `assets/img/${page.image || 'velikan-about-patients-photo.png'}`)}" alt="${esc(page.imageAlt || page.title)}">
                            </div>
                            <div class="velikan-about-page-badge">
                                <span class="number">${esc(page.badgeNumber || 'ВЕЛИКАН')}</span>
                                <span class="txt">${esc(page.badgeText || 'помощь пациентам')}</span>
                            </div>
                            <div class="ul-about-imgs-vectors">
                                <img src="${href(prefix, 'assets/img/about-img-vector-2.svg')}" alt="" class="vector-2">
                            </div>
                        </div>
                    </div>

                    <div class="col">
                        <div class="ul-about-txt">
                            <span class="ul-section-sub-title ul-section-sub-title--2">${esc(page.subTitle)}</span>
                            <h2 class="ul-section-title">${esc(page.introTitle)}</h2>
                            <p class="ul-section-descr">${esc(page.description)}</p>

                            <div class="ul-banner-btns">
                                <a href="${href(prefix, page.ctaHref || 'contact/index.html')}" class="ul-btn"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> ${esc(page.ctaText || 'Связаться с нами')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
}

function cardSection(prefix, page) {
  if (!page.cards || !page.cards.length) return '';

  const cards = page.cards.map((card) => `
                    <div class="col wow animate__fadeInUp">
                        <div class="ul-service ul-service--inner">
                            <div class="ul-service-img">
                                <img src="${href(prefix, `assets/img/${card.image || page.cardImage || 'velikan-service-info.jpg'}`)}" alt="${esc(card.title)}">
                            </div>
                            <div class="ul-service-txt">
                                <h3 class="ul-service-title"><a href="${href(prefix, card.href || page.ctaHref || 'contact/index.html')}">${esc(card.title)}</a></h3>
                                <p class="ul-service-descr">${esc(card.text)}</p>
                                <a href="${href(prefix, card.href || page.ctaHref || 'contact/index.html')}" class="ul-service-btn"><i class="flaticon-up-right-arrow"></i> ${esc(card.linkText || 'Подробнее')}</a>
                            </div>
                        </div>
                    </div>`).join('\n');

  return `
        <section class="ul-section-spacing pt-0">
            <div class="ul-container">
                <div class="row row-cols-md-3 row-cols-1 ul-bs-row">
                    ${cards}
                </div>
            </div>
        </section>`;
}

function noteSection(page) {
  return '';
}

function main(prefix, page) {
  return `${breadcrumb(prefix, page)}\n${hero(prefix, page)}\n${cardSection(prefix, page)}\n${noteSection(page)}`;
}

const pages = [
  {
    file: 'about/reports/index.html',
    title: 'Отчеты о деятельности | ВЕЛИКАН',
    heading: 'Отчеты о деятельности',
    breadcrumb: 'Отчеты о деятельности',
    parent: { label: 'О нас', href: 'about/index.html' },
    subTitle: 'Открытость организации',
    introTitle: 'Показываем, как работает помощь пациентам',
    description: 'Раздел собран для прозрачной картины деятельности ВЕЛИКАНА: пациентские школы, консультации, юридическая поддержка, информационные проекты и грантовые инициативы. На оригинальном сайте организация отдельно подчеркивает открытость финансовой деятельности, отчетность перед Минюстом и участие в проверенных благотворительных платформах.',
    image: 'velikan-service-info.jpg',
    imageAlt: 'Документы и отчеты организации ВЕЛИКАН',
    badgeNumber: '12+',
    badgeText: 'лет работы',
    blockTitle: 'Что входит в отчетность',
    bullets: ['ежегодная отчетность и документы организации', 'грантовые и информационные проекты', 'мероприятия, школы пациентов и консультационная работа'],
    ctaText: 'Запросить документы',
    ctaHref: 'contact/index.html',
    cards: [
      { title: 'Ежегодная отчетность', text: 'Финансовая и организационная отчетность помогает пациентам, партнерам и благотворителям видеть, как устроена работа объединения.', image: 'velikan-service-info.jpg' },
      { title: 'Грантовые проекты', text: 'ВЕЛИКАН развивает проекты при поддержке грантовых программ, партнеров и профессионального сообщества.', image: 'velikan-service-school.jpg' },
      { title: 'Практическая помощь', text: 'В отчетах удобно собирать результаты школ пациентов, консультаций, маршрутизации и юридического сопровождения.', image: 'velikan-service-route.jpg' }
    ],
    note: { title: 'Примечание', items: ['Если нужен конкретный отчет или подтверждающий документ, лучше запросить его у организации через официальный контактный email mail@velikan.info.'] }
  },
  {
    file: 'requisites/index.html',
    title: 'Реквизиты | ВЕЛИКАН',
    heading: 'Реквизиты',
    breadcrumb: 'Реквизиты',
    parent: { label: 'О нас', href: 'about/index.html' },
    subTitle: 'Официальные данные',
    introTitle: 'Реквизиты организации для документов и пожертвований',
    description: 'На странице собраны основные юридические и платежные данные Межрегиональной общественной организации пациентов с акромегалией «ВЕЛИКАН». Информацию удобно использовать для договоров, благотворительных переводов и официальной переписки.',
    image: 'velikan-contact-header-bg.png',
    imageAlt: 'Контакты и реквизиты ВЕЛИКАНА',
    badgeNumber: 'ИНН',
    badgeText: '7810436567',
    blockTitle: 'Основные реквизиты',
    bullets: ['полное наименование: МРО пациентов с акромегалией «ВЕЛИКАН»', 'ОГРН 1127800006949, ИНН 7810436567, КПП 781401001', 'юридический адрес: 197341, Санкт-Петербург, Коломяжский пр., д. 20, лит. А, пом. 10-Н'],
    ctaText: 'Связаться по реквизитам',
    ctaHref: 'contact/index.html',
    cards: [
      { title: 'Расчетный счет', text: '40703810600000001587. Банк: ПАО «Банк Санкт-Петербург». БИК 044030790, к/с 30101810900000000790.', image: 'velikan-service-info.jpg' },
      { title: 'Назначение платежа', text: 'Для пожертвований можно указывать: благотворительное пожертвование на уставную деятельность, без НДС.', image: 'velikan-service-legal.jpg' },
      { title: 'Руководитель', text: 'Президент организации: Андрусова Екатерина Вадимовна. Почта для связи: mail@velikan.info.', image: 'velikan-service-consult.jpg' }
    ]
  },
  {
    file: 'about/partners/index.html',
    title: 'Партнеры | ВЕЛИКАН',
    heading: 'Партнеры',
    breadcrumb: 'Партнеры',
    parent: { label: 'О нас', href: 'about/index.html' },
    subTitle: 'Сотрудничество',
    introTitle: 'ВЕЛИКАН работает вместе с врачами, центрами и пациентскими организациями',
    description: 'Поддержка пациентов с заболеваниями гипофиза требует сотрудничества врачей, клиник, экспертных центров, благотворительных платформ и информационных партнеров. На оригинальном сайте перечислены федеральные медицинские центры, университеты, компании и пациентские сообщества, с которыми организация взаимодействует в проектах.',
    image: 'velikan-service-consult.jpg',
    imageAlt: 'Партнерское взаимодействие ВЕЛИКАНА',
    badgeNumber: 'партнеры',
    badgeText: 'и эксперты',
    blockTitle: 'Зачем нужны партнеры',
    bullets: ['проводить школы пациентов и консультационные проекты', 'делиться проверенной медицинской информацией', 'развивать маршрутизацию, поддержку и просвещение'],
    ctaText: 'Предложить сотрудничество',
    ctaHref: 'contact/index.html',
    cards: [
      { title: 'Медицинские центры', text: 'Среди партнеров и экспертов упоминаются НМИЦ эндокринологии, НМИЦ им. Алмазова, НМИЦ нейрохирургии им. Бурденко и другие профильные центры.', image: 'velikan-specialists-preview.jpg' },
      { title: 'Социальные платформы', text: 'Организация представлена на благотворительных и добровольческих платформах, включая Добро Mail.ru, СберВместе и VK Добро.', image: 'velikan-service-info.jpg' },
      { title: 'Пациентские сообщества', text: 'ВЕЛИКАН участвует в международном и российском пациентском движении, включая направления по редким заболеваниям и акромегалии.', image: 'velikan-service-school.jpg' }
    ]
  },
  {
    file: 'pariki-posle-himioterapii/index.html',
    title: 'Заявка на парик | ВЕЛИКАН',
    heading: 'Заявка на парик',
    breadcrumb: 'Заявка на парик',
    subTitle: 'Проект «Добрый парик»',
    introTitle: 'Помогаем вернуть уверенность после лечения',
    description: 'ВЕЛИКАН развивает проект помощи людям, которые столкнулись с потерей волос после химиотерапии. Заявка на парик помогает связаться с организацией, рассказать о ситуации и получить понятный следующий шаг по участию в программе.',
    image: 'velikan-home-support-bg.jpg',
    imageAlt: 'Поддержка пациента после лечения',
    badgeNumber: 'заявка',
    badgeText: 'на поддержку',
    blockTitle: 'Кому может помочь проект',
    bullets: ['детям, подросткам и взрослым после химиотерапии', 'людям, которым важна психологическая поддержка и восстановление образа жизни', 'семьям, которым нужна помощь в поиске решения'],
    ctaText: 'Оставить заявку',
    ctaHref: 'contact/index.html',
    cards: [
      { title: 'Расскажите о ситуации', text: 'Укажите контактные данные, город, возраст получателя помощи и кратко опишите, какая поддержка нужна сейчас.', image: 'velikan-service-route.jpg', linkText: 'Связаться' },
      { title: 'Подготовьте документы', text: 'Если есть медицинские документы или подтверждение лечения, их можно приложить при дальнейшем общении с координатором.', image: 'velikan-service-legal.jpg' },
      { title: 'Дождитесь ответа', text: 'Координатор уточнит детали заявки и подскажет, какие варианты участия в проекте возможны.', image: 'velikan-service-consult.jpg', linkText: 'Написать' }
    ]
  },
  {
    file: 'adenomy-gipofiza/index.html',
    title: 'Аденомы гипофиза | ВЕЛИКАН',
    heading: 'Аденомы гипофиза',
    breadcrumb: 'Аденомы гипофиза',
    subTitle: 'Информация пациентам',
    introTitle: 'Что важно знать о заболеваниях гипофиза',
    description: 'Аденомы гипофиза могут влиять на гормональный фон, зрение, обмен веществ и общее самочувствие. Пациенту важно не теряться между анализами и врачами: нужно понимать, какие симптомы требуют внимания, как готовиться к консультации и где искать профильную помощь.',
    image: 'velikan-banner-diagnostics-photo.png',
    imageAlt: 'Диагностика заболеваний гипофиза',
    badgeNumber: 'маршрут',
    badgeText: 'пациента',
    blockTitle: 'Раздел помогает разобраться',
    bullets: ['какие состояния связаны с аденомами гипофиза', 'когда нужны эндокринолог, нейрохирург и офтальмолог', 'где найти статьи, школы пациентов и консультации'],
    ctaText: 'Получить помощь',
    ctaHref: 'help/index.html',
    cards: [
      { title: 'Статьи и исследования', text: 'Материалы о диагностике, лечении, лекарственном обеспечении и правах пациентов.', href: 'adenomy-gipofiza/articles/index.html', image: 'velikan-service-info.jpg' },
      { title: 'Акромегалия', text: 'Раздел о заболевании, связанном с избытком гормона роста у взрослых.', href: 'adenomy-gipofiza/acromegaly/index.html', image: 'velikan-service-consult.jpg' },
      { title: 'Кушинг', text: 'Информация о гиперкортицизме, симптомах, диагностике и маршруте к специалистам.', href: 'adenomy-gipofiza/cushing/index.html', image: 'velikan-service-route.jpg' }
    ]
  },
  {
    file: 'adenomy-gipofiza/articles/index.html',
    title: 'Статьи и исследования | ВЕЛИКАН',
    heading: 'Статьи и исследования',
    breadcrumb: 'Статьи и исследования',
    parent: { label: 'Аденомы гипофиза', href: 'adenomy-gipofiza/index.html' },
    subTitle: 'База знаний',
    introTitle: 'Материалы о диагностике, терапии и правах пациентов',
    description: 'Этот раздел собирает понятные материалы по заболеваниям гипофиза: от первых симптомов и анализов до лекарственного обеспечения, хирургического лечения, реабилитации и юридических вопросов. Формат адаптирован для пациентов и их близких.',
    image: 'velikan-service-info.jpg',
    imageAlt: 'Статьи и исследования о заболеваниях гипофиза',
    badgeNumber: 'знания',
    badgeText: 'для пациента',
    blockTitle: 'Что здесь будет полезно',
    bullets: ['объяснения медицинских терминов простым языком', 'обзор маршрута диагностики и наблюдения', 'информация о правах пациента и получении помощи'],
    ctaText: 'Задать вопрос',
    ctaHref: 'contact/index.html',
    cards: [
      { title: 'Диагностика', text: 'Симптомы, гормональные исследования, МРТ, консультации эндокринолога, нейрохирурга и офтальмолога.', href: 'help/index.html', image: 'velikan-banner-diagnostics-photo.png' },
      { title: 'Лечение и наблюдение', text: 'Лекарственная терапия, операции, динамическое наблюдение и подготовка вопросов к специалистам.', href: 'spec/index.html', image: 'velikan-specialists-preview.jpg' },
      { title: 'Права пациента', text: 'Документы, обращения, лекарственное обеспечение, маршрутизация и юридическая поддержка.', href: 'help/index.html', image: 'velikan-service-legal.jpg' }
    ]
  },
  {
    file: 'help/index.html',
    title: 'Получить помощь | ВЕЛИКАН',
    heading: 'Получить помощь',
    breadcrumb: 'Получить помощь',
    subTitle: 'Пациентская поддержка',
    introTitle: 'Помогаем пройти путь от подозрения на диагноз до лечения',
    description: 'ВЕЛИКАН помогает пациентам разобраться с диагнозом, подготовиться к консультации, найти профильных специалистов, понять маршрут обследований, получить юридическую поддержку и принять участие в школах пациентов. Задача организации — сделать сложный путь понятнее и безопаснее.',
    image: 'velikan-banner-support-photo.png',
    imageAlt: 'Помощь пациентам ВЕЛИКАНА',
    badgeNumber: 'помощь',
    badgeText: 'рядом',
    blockTitle: 'С чем можно обратиться',
    bullets: ['подозрение на акромегалию, аденому гипофиза или Кушинга', 'сложности с лекарственным обеспечением, документами и маршрутизацией', 'поиск школ пациентов, консультаций и экспертной информации'],
    ctaText: 'Написать координатору',
    ctaHref: 'contact/index.html',
    cards: [
      { title: 'Маршрутизация', text: 'Подскажем, какие вопросы задать врачу, какие документы собрать и куда обратиться дальше.', image: 'velikan-service-route.jpg' },
      { title: 'Консультации специалистов', text: 'Поможем сориентироваться в профильных направлениях: эндокринология, нейрохирургия, офтальмология.', href: 'spec/index.html', image: 'velikan-service-consult.jpg' },
      { title: 'Юридическая поддержка', text: 'Разберем ситуации с отказами, лекарственным обеспечением, документами и обращениями.', image: 'velikan-service-legal.jpg' }
    ]
  },
  {
    file: 'adenomy-gipofiza/acromegaly/index.html',
    title: 'Акромегалия | ВЕЛИКАН',
    heading: 'Акромегалия',
    breadcrumb: 'Акромегалия',
    parent: { label: 'Аденомы гипофиза', href: 'adenomy-gipofiza/index.html' },
    subTitle: 'Заболевание гипофиза',
    introTitle: 'Акромегалия требует ранней диагностики и наблюдения у специалистов',
    description: 'Акромегалия связана с избыточной выработкой гормона роста у взрослых. Заболевание может развиваться постепенно: меняются черты лица, размер кистей и стоп, появляются головные боли, нарушения обмена веществ, проблемы с суставами, сердцем и сном. При подозрении важно обратиться к эндокринологу и пройти профильное обследование.',
    image: 'velikan-banner-experts-photo.png',
    imageAlt: 'Консультация по акромегалии',
    badgeNumber: 'ИФР-1',
    badgeText: 'важный анализ',
    blockTitle: 'Когда стоит насторожиться',
    bullets: ['изменение внешности, увеличение кистей, стоп или размера обуви', 'головные боли, потливость, слабость, боли в суставах', 'сахарный диабет, гипертония, апноэ сна или нарушения зрения'],
    ctaText: 'Получить помощь',
    ctaHref: 'help/index.html',
    cards: [
      { title: 'Диагностика', text: 'Обычно обсуждают ИФР-1, гормональные исследования, МРТ гипофиза и оценку зрения.', href: 'help/index.html', image: 'velikan-banner-diagnostics-photo.png' },
      { title: 'Лечение', text: 'Маршрут может включать наблюдение эндокринолога, нейрохирурга, лекарственную терапию или операцию.', href: 'spec/index.html', image: 'velikan-specialists-preview.jpg' },
      { title: 'Поддержка', text: 'Школы пациентов помогают понять заболевание, лечение и права пациента.', href: 'events/index.html', image: 'velikan-service-school.jpg' }
    ]
  },
  {
    file: 'adenomy-gipofiza/cushing/index.html',
    title: 'Кушинг | ВЕЛИКАН',
    heading: 'Кушинг',
    breadcrumb: 'Кушинг',
    parent: { label: 'Аденомы гипофиза', href: 'adenomy-gipofiza/index.html' },
    subTitle: 'Гиперкортицизм',
    introTitle: 'Синдром и болезнь Кушинга важно распознать как можно раньше',
    description: 'Кушинг связан с избытком кортизола и может проявляться изменением веса, давления, кожи, настроения, уровня сахара, мышечной силы и общего самочувствия. Такие симптомы часто выглядят «обычными», поэтому пациенту особенно важно попасть к врачу, который умеет работать с эндокринными причинами состояния.',
    image: 'velikan-service-consult.jpg',
    imageAlt: 'Консультация пациента при Кушинге',
    badgeNumber: 'кортизол',
    badgeText: 'под контролем',
    blockTitle: 'Что важно обсудить с врачом',
    bullets: ['какие анализы помогут подтвердить или исключить гиперкортицизм', 'нужна ли визуализация гипофиза или надпочечников', 'какой специалист должен вести пациента дальше'],
    ctaText: 'Нужна консультация',
    ctaHref: 'spec-consultation/index.html',
    cards: [
      { title: 'Симптомы', text: 'Повышенное давление, изменение веса, слабость мышц, растяжки, синяки и нарушения обмена могут требовать проверки.', href: 'help/index.html', image: 'velikan-service-route.jpg' },
      { title: 'Диагностика', text: 'Решение о тестах принимает врач: пациенту важно не заниматься самодиагностикой и не отменять препараты самостоятельно.', href: 'spec/index.html', image: 'velikan-banner-diagnostics-photo.png' },
      { title: 'Поддержка', text: 'ВЕЛИКАН помогает с маршрутом, вопросами к специалисту и юридическими ситуациями.', href: 'contact/index.html', image: 'velikan-service-legal.jpg' }
    ]
  },
  {
    file: 'adenomy-gipofiza/soputstvuyushhie-zabolevaniya/index.html',
    title: 'Сопутствующие заболевания | ВЕЛИКАН',
    heading: 'Сопутствующие заболевания',
    breadcrumb: 'Сопутствующие заболевания',
    parent: { label: 'Аденомы гипофиза', href: 'adenomy-gipofiza/index.html' },
    subTitle: 'Комплексный подход',
    introTitle: 'Заболевания гипофиза могут влиять на весь организм',
    description: 'При акромегалии, Кушинге и других состояниях, связанных с гипофизом, пациент может сталкиваться не только с основным диагнозом. Часто требуется контроль сердечно-сосудистых рисков, обмена веществ, суставов, сна, зрения и психологического состояния. Поэтому маршрут лечения должен быть междисциплинарным.',
    image: 'velikan-service-route.jpg',
    imageAlt: 'Маршрут пациента с сопутствующими заболеваниями',
    badgeNumber: 'команда',
    badgeText: 'специалистов',
    blockTitle: 'На что обратить внимание',
    bullets: ['артериальное давление, сердце, сахар крови и вес', 'суставы, позвоночник, головные боли, сон и зрение', 'качество жизни, тревога, усталость и социальная поддержка'],
    ctaText: 'Составить маршрут',
    ctaHref: 'help/index.html',
    cards: [
      { title: 'Эндокринолог', text: 'Координирует гормональную диагностику, терапию и наблюдение.', href: 'spec-endocrinologists/index.html', image: 'velikan-specialist-endocrinologists.png' },
      { title: 'Нейрохирург', text: 'Оценивает показания к операции и тактику при образованиях гипофиза.', href: 'spec-neurosurgeons/index.html', image: 'velikan-specialist-neurosurgeons.png' },
      { title: 'Юридическая помощь', text: 'Может понадобиться при сложностях с лекарствами, документами, квотами и обращениями.', href: 'help/index.html', image: 'velikan-service-legal.jpg' }
    ]
  }
];

for (const page of pages) {
  const filePath = path.join(root, page.file);
  const prefix = prefixFor(page.file);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  let html = template
    .replace(/href="\.\.\//g, `href="${prefix}`)
    .replace(/src="\.\.\//g, `src="${prefix}`)
    .replace(/action="index\.html#"/g, `action="${prefix}index.html#"`);

  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace('__NAV__', nav(prefix))
    .replace('__MAIN__', main(prefix, page));

  fs.writeFileSync(filePath, html, 'utf8');
}

function allHtml(dir) {
  const out = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;

    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...allHtml(full));
    if (entry.isFile() && entry.name.endsWith('.html') && !entry.name.startsWith('_')) out.push(full);
  }

  return out;
}

for (const filePath of allHtml(root)) {
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const prefix = prefixFor(rel);

  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(
    /<nav class="ul-header-nav">[\s\S]*?<\/nav>/,
    `<nav class="ul-header-nav">${nav(prefix)}
                        </nav>`
  );

  html = html.replace(
    /<a href="[^"]*(?:contact|help)\/index\.html" class="ul-btn d-sm-inline-flex d-none"><i class="flaticon-fast-forward-double-right-arrows-symbol"><\/i>\s*[^<]*<\/a>/g,
    `<a href="${href(prefix, 'help/index.html')}" class="ul-btn d-sm-inline-flex d-none"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Получить помощь </a>`
  );

  html = html.replace(
    /<form action="[^"]*index\.html#\s+class="ul-search-form"/g,
    `<form action="${prefix}index.html#" class="ul-search-form"`
  );

  html = html.replace(
    /<form action="[^"]*index\.html#"\s+class="ul-search-form"/g,
    `<form action="${prefix}index.html#" class="ul-search-form"`
  );

  html = html.replace(
    /(<h3 class="ul-footer-widget-title">Быстрые ссылки<\/h3>\s*)<div class="ul-footer-widget-links">[\s\S]*?<\/div>/,
    `$1${footerQuickLinks(prefix)}`
  );

  fs.writeFileSync(filePath, html, 'utf8');
}

console.log(`Created ${pages.length} pages and updated navigation.`);
