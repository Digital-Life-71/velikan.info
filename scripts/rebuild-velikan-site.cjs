const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const sourceRows = JSON.parse(fs.readFileSync(path.join(root, 'content', 'site-source.json'), 'utf8'));
const reviews = JSON.parse(fs.readFileSync(path.join(root, 'content', 'reviews.json'), 'utf8'));

function row(index) {
  return clean(sourceRows[index]?.[1] || '');
}

function clean(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripEmoji(value) {
  return String(value || '').replace(/\p{Extended_Pictographic}/gu, '').trim();
}

function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function plain(value) {
  return stripEmoji(clean(value)).replace(/\s+/g, ' ').trim();
}

function firstLine(value) {
  return clean(value).split('\n').find(Boolean) || '';
}

function excerpt(value, max = 190) {
  const text = plain(value);
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 120)).trim()}...`;
}

function depthFor(file) {
  const dir = path.dirname(file).replace(/\\/g, '/');
  if (!dir || dir === '.') return 0;
  return dir.split('/').filter(Boolean).length;
}

function prefixFor(file) {
  return '../'.repeat(depthFor(file));
}

function href(prefix, target) {
  return `${prefix}${target}`;
}

const content = {
  org: row(2),
  oncology: row(3),
  campaign: row(4),
  facts: row(5),
  partners: row(6),
  requisites: row(7),
  contacts: row(9),
  legalMedication: row(12),
  legalMoscow: row(13),
  telemedicine: row(15),
  headache: row(16),
  vitaminD: row(17),
  cushing: row(18).replace(/^\*Есть в электронном виде\s*/i, ''),
};

const safeOncologyArticle = clean(`
Психологическая поддержка во время онкологического лечения
Онкологическое лечение меняет привычный ритм жизни, влияет на внешность, силы, планы и отношения с близкими. В такой период человеку особенно важны понятная информация, бережное общение и возможность не оставаться одному.
Важно говорить прямо: психологическое состояние не является доказанной причиной рака. Но поддержка, устойчивые социальные связи, право выражать эмоции и ощущение смысла помогают людям легче проходить лечение, восстанавливаться и сохранять качество жизни.
Что может поддержать пациента
Регулярный контакт с близким человеком, которому можно честно сказать о страхе, усталости или злости.
Психолог или группа поддержки, где можно говорить без необходимости быть удобным и сильным.
Маленькие личные цели: прогулка, встреча, творческое занятие, возвращение к привычному делу.
Адресная помощь, если из-за лечения изменился внешний вид, появились бытовые или эмоциональные трудности.
Проект «Добрый парик»
ВЕЛИКАН развивает программу помощи людям после химиотерапии и радиохирургии. В рамках проекта из натуральных донорских волос изготавливаются парики по индивидуальным размерам для детей, подростков и взрослых.
Цель проекта — дать человеку не обещание чудес, а реальную поддержку: возможность чувствовать себя увереннее, спокойнее выходить из дома, возвращаться к учебе, работе и общению.
Когда обращаться
Если после лечения выпали волосы, нужна консультация по участию в проекте или вы хотите поддержать движение «Донорство волос», напишите координатору ВЕЛИКАНА. Команда подскажет, какие данные понадобятся и какой следующий шаг будет самым удобным.
`);

const newsArticles = [
  {
    path: 'blog/pravo-na-pravo/index.html',
    title: firstLine(content.legalMedication),
    category: 'Юридические материалы',
    date: '2026',
    image: 'velikan-service-legal.jpg',
    text: content.legalMedication,
  },
  {
    path: 'blog/akromegaliya-v-moskve/index.html',
    title: firstLine(content.legalMoscow),
    category: 'Лекарственное обеспечение',
    date: '2026',
    image: 'velikan-banner-rights-photo.png',
    text: content.legalMoscow,
  },
  {
    path: 'blog/telemedicina-v-rossii/index.html',
    title: firstLine(content.telemedicine),
    category: 'Телемедицина',
    date: '2026',
    image: 'velikan-service-telemedicine.jpg',
    text: content.telemedicine,
  },
];

const diseaseArticles = [
  {
    path: 'adenomy-gipofiza/articles/golovnaya-bol-pri-akromegalii/index.html',
    title: firstLine(content.headache),
    category: 'Акромегалия',
    date: '2026',
    image: 'velikan-banner-experts-photo.png',
    text: content.headache,
  },
  {
    path: 'adenomy-gipofiza/articles/vitamin-d-pri-giperkortitsizme-i-akromegalii/index.html',
    title: firstLine(content.vitaminD),
    category: 'Акромегалия',
    date: '2026',
    image: 'velikan-banner-diagnostics-photo.png',
    text: content.vitaminD,
  },
  {
    path: 'adenomy-gipofiza/cushing/index.html',
    title: 'Синдром и болезнь Кушинга',
    category: 'Кушинг',
    date: '2026',
    image: 'velikan-cushing-adrenal.png',
    text: content.cushing,
  },
  {
    path: 'oncology/psikhologicheskaya-podderzhka/index.html',
    title: firstLine(safeOncologyArticle),
    category: 'Онкология',
    date: '2026',
    image: 'velikan-oncology-support.png',
    text: safeOncologyArticle,
  },
];

const allArticles = [...newsArticles, ...diseaseArticles];

const team = [
  ['Андрусова Екатерина', 'Председатель правления «Великана»', 'team-andrusova-ekaterina.jpg'],
  ['Андрусов Андрей', 'Международное сотрудничество, WAPO', 'team-andrusov-andrey.jpg'],
  ['Осипова Наталия', 'Юридическая поддержка пациентов', 'team-osipova-natalia.jpg'],
  ['Суполова Наталья', 'Руководитель интернет-проектов', 'team-supolova-natalia.jpg'],
  ['Риттер Татьяна', 'Программы поддержки пациентов', 'team-ritter-tatiana.jpeg'],
  ['Лебединцева Нина', 'Бухгалтер', 'team-lebedintseva-nina.jpeg'],
  ['Карадаг Александра', 'Волонтер, Новосибирск', 'team-karadag-alexandra.jpg'],
  ['Пепеляев Константин', 'Волонтер, Санкт-Петербург', 'team-pepeliaev-konstantin.jpg'],
];

function nav(prefix) {
  const h = (target) => href(prefix, target);
  return `
                            <a href="${h('index.html')}">Главная</a>

                            <div class="has-sub-menu">
                                <a role="button">О нас</a>
                                <div class="ul-header-submenu">
                                    <ul>
                                        <li><a href="${h('about/index.html')}">Об организации</a></li>
                                        <li><a href="${h('team/index.html')}">Команда</a></li>
                                        <li><a href="${h('reviews/index.html')}">Отзывы</a></li>
                                        <li><a href="${h('about/reports/index.html')}">Отчеты</a></li>
                                        <li><a href="${h('about/partners/index.html')}">Партнеры</a></li>
                                        <li><a href="${h('requisites/index.html')}">Реквизиты</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="has-sub-menu">
                                <a role="button">Проекты</a>
                                <div class="ul-header-submenu">
                                    <ul>
                                        <li><a href="${h('projects/index.html')}">Все проекты</a></li>
                                        <li><a href="${h('pariki-posle-himioterapii/index.html')}">Добрый парик</a></li>
                                        <li><a href="${h('akromegaliya-znaet-vsya-rossiya/index.html')}">Акромегалия знает вся Россия</a></li>
                                        <li><a href="${h('events/index.html')}">Школы пациентов</a></li>
                                        <li><a href="${h('help/index.html')}">Получить помощь</a></li>
                                    </ul>
                                </div>
                            </div>

                            <div class="has-sub-menu">
                                <a role="button">Заболевания</a>
                                <div class="ul-header-submenu">
                                    <ul>
                                        <li><a href="${h('adenomy-gipofiza/index.html')}">Аденомы гипофиза</a></li>
                                        <li><a href="${h('adenomy-gipofiza/acromegaly/index.html')}">Акромегалия</a></li>
                                        <li><a href="${h('adenomy-gipofiza/cushing/index.html')}">Кушинг</a></li>
                                        <li><a href="${h('adenomy-gipofiza/articles/index.html')}">Статьи и исследования</a></li>
                                    </ul>
                                </div>
                            </div>

                            <a href="${h('blog/index.html')}">Новости</a>
                            <a href="${h('donations/index.html')}">Пожертвование</a>
                            <a href="${h('contact/index.html')}">Контакты</a>`;
}

function head(prefix, title, description) {
  return `    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description || 'ВЕЛИКАН помогает пациентам с акромегалией, патологиями гипофиза и людям после онкологического лечения.')}">

    <link rel="icon" type="image/png" href="${href(prefix, 'assets/img/favicon.png')}">
    <link rel="apple-touch-icon" href="${href(prefix, 'assets/img/apple-touch-icon.png')}">
    <link rel="stylesheet" href="${href(prefix, 'assets/icon/flaticon_charitics.css')}">
    <link rel="stylesheet" href="${href(prefix, 'assets/vendor/bootstrap/bootstrap.min.css')}">
    <link rel="stylesheet" href="${href(prefix, 'assets/vendor/splide/splide.min.css')}">
    <link rel="stylesheet" href="${href(prefix, 'assets/vendor/swiper/swiper-bundle.min.css')}">
    <link rel="stylesheet" href="${href(prefix, 'assets/vendor/slim-select/slimselect.css')}">
    <link rel="stylesheet" href="${href(prefix, 'assets/vendor/animate-wow/animate.min.css')}">
    <link rel="stylesheet" href="${href(prefix, 'assets/vendor/flatpickr/flatpickr.min.css')}">
    <link rel="stylesheet" href="${href(prefix, 'assets/css/style.css')}">`;
}

function searchModal(prefix) {
  return `
    <div class="ul-search-form-wrapper flex-grow-1 flex-shrink-0">
        <button class="ul-search-closer"><i class="flaticon-close"></i></button>
        <form action="${href(prefix, 'index.html')}#" class="ul-search-form">
            <div class="ul-search-form-right">
                <input type="search" name="search" id="ul-search" placeholder="Поиск по сайту">
                <button type="submit"><span class="icon"><i class="flaticon-search"></i></span></button>
            </div>
            <div class="velikan-search-results" aria-live="polite"></div>
        </form>
    </div>`;
}

function header(prefix, isHome = false) {
  const h = (target) => href(prefix, target);
  return `
    <div class="preloader" id="preloader">
        <div class="loader"></div>
    </div>

    <div class="ul-sidebar">
        <div class="ul-sidebar-header">
            <div class="ul-sidebar-header-logo">
                <a href="${h('index.html')}" class="velikan-brand">
                    <img src="${h('assets/img/logo.png')}" alt="ВЕЛИКАН" class="logo">
                    <span class="velikan-brand-copy">
                        <span class="velikan-brand-name">ВЕЛИКАН</span>
                        <span class="velikan-brand-subtitle">помощь пациентам</span>
                    </span>
                </a>
            </div>
            <button class="ul-sidebar-closer"><i class="flaticon-close"></i></button>
        </div>
        <div class="ul-sidebar-header-nav-wrapper d-block d-lg-none"></div>
        <div class="ul-sidebar-footer">
            <span class="ul-sidebar-footer-title">Мы в соцсетях</span>
            <div class="ul-sidebar-footer-social">
                <a href="https://vk.com/club44620319" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте"><i class="flaticon-facebook"></i></a>
                <a href="https://rutube.ru/channel/24360766/" target="_blank" rel="noopener noreferrer" aria-label="RUTUBE"><i class="flaticon-youtube"></i></a>
                <a href="https://t.me/velikanorg" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><i class="flaticon-twitter"></i></a>
            </div>
        </div>
    </div>

${searchModal(prefix)}

    <header class="ul-header${isHome ? ' ul-header-2' : ''}">
        <div class="ul-header-bottom to-be-sticky">
            <div class="ul-header-bottom-wrapper ul-header-container">
                <div class="logo-container">
                    <a href="${h('index.html')}" class="velikan-brand">
                        <img src="${h('assets/img/logo.png')}" alt="ВЕЛИКАН" class="logo">
                        <span class="velikan-brand-copy">
                            <span class="velikan-brand-name">ВЕЛИКАН</span>
                            <span class="velikan-brand-subtitle">помощь пациентам</span>
                        </span>
                    </a>
                </div>
                <div class="ul-header-nav-wrapper">
                    <div class="to-go-to-sidebar-in-mobile">
                        <nav class="ul-header-nav">${nav(prefix)}
                        </nav>
                    </div>
                </div>
                <div class="ul-header-actions">
                    <button class="ul-header-search-opener"><i class="flaticon-search"></i></button>
                    <a href="${h('donations/index.html')}" class="ul-btn d-sm-inline-flex d-none"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Поддержать</a>
                    <button class="ul-header-sidebar-opener d-lg-none d-inline-flex"><i class="flaticon-menu"></i></button>
                </div>
            </div>
        </div>
    </header>`;
}

function footer(prefix) {
  const h = (target) => href(prefix, target);
  const posts = newsArticles.slice(0, 2).map((item) => `
                            <div class="ul-blog-sidebar-post ul-footer-post">
                                <div class="img"><img src="${h(`assets/img/${item.image}`)}" alt="${esc(item.title)}"></div>
                                <div class="txt">
                                    <span class="date"><span class="icon"><i class="flaticon-calendar"></i></span><span>${esc(item.date)}</span></span>
                                    <h4 class="title"><a href="${h(item.path)}">${esc(item.title)}</a></h4>
                                </div>
                            </div>`).join('');

  return `
    <footer class="ul-footer">
        <div class="ul-footer-top">
            <div class="ul-footer-container">
                <div class="ul-footer-top-contact-infos">
                    <div class="ul-footer-top-contact-info">
                        <div class="ul-footer-top-contact-info-icon"><div class="ul-footer-top-contact-info-icon-inner"><i class="flaticon-pin"></i></div></div>
                        <div class="ul-footer-top-contact-info-txt">
                            <span class="ul-footer-top-contact-info-label">Адрес</span>
                            <h5 class="ul-footer-top-contact-info-address">Санкт-Петербург, Богатырский пр., 18 к. 3, оф. 310</h5>
                        </div>
                    </div>
                    <div class="ul-footer-top-contact-info">
                        <div class="ul-footer-top-contact-info-icon"><div class="ul-footer-top-contact-info-icon-inner"><i class="flaticon-email"></i></div></div>
                        <div class="ul-footer-top-contact-info-txt">
                            <span class="ul-footer-top-contact-info-label">Почта</span>
                            <h5 class="ul-footer-top-contact-info-address"><a href="mailto:mail@velikan.info">mail@velikan.info</a></h5>
                        </div>
                    </div>
                    <div class="ul-footer-top-contact-info">
                        <div class="ul-footer-top-contact-info-icon"><div class="ul-footer-top-contact-info-icon-inner"><i class="flaticon-telephone-call-1"></i></div></div>
                        <div class="ul-footer-top-contact-info-txt">
                            <span class="ul-footer-top-contact-info-label">WhatsApp</span>
                            <h5 class="ul-footer-top-contact-info-address"><a href="tel:+79117773277">+7 (911) 777-32-77</a></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ul-footer-middle">
            <div class="ul-footer-container">
                <div class="ul-footer-middle-wrapper wow animate__fadeInUp">
                    <div class="ul-footer-about">
                        <a href="${h('index.html')}" class="velikan-brand">
                            <img src="${h('assets/img/logo.png')}" alt="ВЕЛИКАН" class="logo">
                            <span class="velikan-brand-copy"><span class="velikan-brand-name">ВЕЛИКАН</span><span class="velikan-brand-subtitle">помощь пациентам</span></span>
                        </a>
                        <p class="ul-footer-about-txt">МБООППГ «Великан» помогает пациентам с патологиями гипофиза, тяжелыми эндокринными заболеваниями и людям после онкологического лечения.</p>
                        <div class="ul-footer-socials">
                            <a href="https://vk.com/club44620319" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте"><i class="flaticon-facebook"></i></a>
                            <a href="https://rutube.ru/channel/24360766/" target="_blank" rel="noopener noreferrer" aria-label="RUTUBE"><i class="flaticon-youtube"></i></a>
                            <a href="https://t.me/velikanorg" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><i class="flaticon-twitter"></i></a>
                        </div>
                    </div>
                    <div class="ul-footer-widget">
                        <h3 class="ul-footer-widget-title">Быстрые ссылки</h3>
                        <div class="ul-footer-widget-links">
                            <a href="${h('about/index.html')}">Об организации</a>
                            <a href="${h('help/index.html')}">Получить помощь</a>
                            <a href="${h('pariki-posle-himioterapii/index.html')}">Добрый парик</a>
                            <a href="${h('akromegaliya-znaet-vsya-rossiya/index.html')}">Акромегалия знает вся Россия</a>
                            <a href="${h('reviews/index.html')}">Отзывы</a>
                        </div>
                    </div>
                    <div class="ul-footer-widget ul-footer-recent-posts">
                        <h3 class="ul-footer-widget-title">Новости</h3>
                        <div class="ul-blog-sidebar-posts">${posts}
                        </div>
                    </div>
                    <div class="ul-footer-widget ul-nwsltr-widget">
                        <h3 class="ul-footer-widget-title">Контакты</h3>
                        <div class="ul-footer-widget-links ul-footer-contact-links velikan-footer-contacts">
                            <a href="mailto:mail@velikan.info"><i class="flaticon-mail"></i> mail@velikan.info</a>
                            <a href="tel:+79117773277"><i class="flaticon-telephone-call"></i> WhatsApp: +7 (911) 777-32-77</a>
                            <span><i class="flaticon-pin"></i> Богатырский пр., 18 к. 3, оф. 310</span>
                            <a href="${h('requisites/index.html')}"><i class="flaticon-right"></i> Реквизиты для пожертвования</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="ul-footer-bottom">
            <div class="ul-footer-container">
                <div class="ul-footer-bottom-wrapper">
                    <p class="copyright-txt">&copy; <span id="footer-copyright-year"></span> ВЕЛИКАН. Все права защищены</p>
                    <div class="ul-footer-bottom-nav"><a href="${h('privacy-policy/index.html')}">Политика конфиденциальности</a> <a href="${h('cookie-policy/index.html')}">Использование cookie</a> <a href="${h('contact/index.html')}">Контакты</a></div>
                </div>
            </div>
        </div>
        <div class="ul-footer-vectors">
            <img src="${h('assets/img/footer-vector-img.png')}" alt="Декор подвала" class="ul-footer-vector-1">
        </div>
    </footer>`;
}

function scripts(prefix) {
  const h = (target) => href(prefix, target);
  return `
    <script src="${h('assets/vendor/bootstrap/bootstrap.bundle.min.js')}"></script>
    <script src="${h('assets/vendor/splide/splide.min.js')}"></script>
    <script src="${h('assets/vendor/splide/splide-extension-auto-scroll.min.js')}"></script>
    <script src="${h('assets/vendor/swiper/swiper-bundle.min.js')}"></script>
    <script src="${h('assets/vendor/slim-select/slimselect.min.js')}"></script>
    <script src="${h('assets/vendor/animate-wow/wow.min.js')}"></script>
    <script src="${h('assets/vendor/splittype/index.min.js')}"></script>
    <script src="${h('assets/vendor/mixitup/mixitup.min.js')}"></script>
    <script src="${h('assets/vendor/fslightbox/fslightbox.js')}"></script>
    <script src="${h('assets/vendor/flatpickr/flatpickr.js')}"></script>
    <script src="${h('assets/js/main.js')}"></script>
    <script src="${h('assets/js/tab.js')}"></script>
    <script src="${h('assets/js/accordion.js')}"></script>
    <script src="${h('assets/js/progressbar.js')}"></script>
    <script src="${h('assets/js/donate-form.js')}"></script>
    <script src="${h('assets/js/site-search.js')}" data-site-root="${prefix}"></script>`;
}

function layout(file, page) {
  const prefix = prefixFor(file);
  return `<!DOCTYPE html>
<html lang="ru">

<head>
${head(prefix, page.title, page.description)}
</head>

<body>
${header(prefix, page.isHome)}

    <main>
${page.main(prefix)}
    </main>

${footer(prefix)}
${scripts(prefix)}
</body>

</html>
`;
}

function breadcrumb(prefix, title, parent) {
  const crumbs = [`<li><a href="${href(prefix, 'index.html')}">Главная</a></li>`];
  if (parent) {
    crumbs.push('<li><span class="separator"><i class="flaticon-right"></i></span></li>');
    crumbs.push(`<li><a href="${href(prefix, parent.href)}">${esc(parent.label)}</a></li>`);
  }
  crumbs.push('<li><span class="separator"><i class="flaticon-right"></i></span></li>');
  crumbs.push(`<li>${esc(title)}</li>`);

  return `
        <section class="ul-breadcrumb ul-section-spacing">
            <div class="ul-container">
                <h2 class="ul-breadcrumb-title">${esc(title)}</h2>
                <ul class="ul-breadcrumb-nav">
                    ${crumbs.join('\n                    ')}
                </ul>
            </div>
        </section>`;
}

function introBlock(prefix, page) {
  return `
        <section class="ul-about ul-section-spacing wow animate__fadeInUp">
            <div class="ul-container">
                <div class="row row-cols-md-2 row-cols-1 align-items-center gy-4 ul-about-row">
                    <div class="col">
                        <div class="ul-about-imgs velikan-about-page-img">
                            <div class="img-wrapper">
                                <img src="${href(prefix, `assets/img/${page.image}`)}" alt="${esc(page.imageAlt || page.title)}">
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
                            <span class="ul-section-sub-title ul-section-sub-title--2">${esc(page.subtitle)}</span>
                            <h2 class="ul-section-title">${esc(page.heading)}</h2>
                            <p class="ul-section-descr">${esc(page.text)}</p>
                            <div class="ul-banner-btns">
                                <a href="${href(prefix, page.ctaHref || 'contact/index.html')}" class="ul-btn"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> ${esc(page.ctaText || 'Связаться')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
}

function serviceCards(prefix, cards, opts = {}) {
  if (!cards?.length) return '';
  return `
        <section class="ul-section-spacing ${opts.noTop ? 'pt-0' : ''}">
            <div class="ul-container">
                ${opts.heading ? `<div class="ul-section-heading justify-content-center text-center"><div><span class="ul-section-sub-title">${esc(opts.subtitle || '')}</span><h2 class="ul-section-title">${esc(opts.heading)}</h2></div></div>` : ''}
                <div class="row row-cols-md-3 row-cols-1 ul-bs-row">
                    ${cards.map((card) => `
                    <div class="col wow animate__fadeInUp">
                        <div class="ul-service ul-service--inner">
                            <div class="ul-service-img">
                                <img src="${href(prefix, `assets/img/${card.image}`)}" alt="${esc(card.title)}">
                            </div>
                            <div class="ul-service-txt">
                                <h3 class="ul-service-title"><a href="${href(prefix, card.href || 'contact/index.html')}">${esc(card.title)}</a></h3>
                                <p class="ul-service-descr">${esc(card.text)}</p>
                                <a href="${href(prefix, card.href || 'contact/index.html')}" class="ul-service-btn"><i class="flaticon-up-right-arrow"></i> ${esc(card.linkText || 'Подробнее')}</a>
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>`;
}

function factPackages(prefix, title, subtitle, packages) {
  return `
        <section class="ul-section-spacing pt-0">
            <div class="ul-container">
                <div class="ul-section-heading justify-content-center text-center">
                    <div>
                        <span class="ul-section-sub-title">${esc(subtitle)}</span>
                        <h2 class="ul-section-title">${esc(title)}</h2>
                    </div>
                </div>
                <div class="ul-pricing-packages">
                    ${packages.map((pack) => `
                    <div class="ul-pricing-package">
                        <div class="ul-pricing-package-heading">
                            <span class="ul-pricing-package-name">${esc(pack.title)}</span>
                            <p class="ul-pricing-package-descr">${esc(pack.text)}</p>
                        </div>
                        <div class="ul-pricing-package-body">
                            <ul class="ul-pricing-package-body-list">
                                ${pack.items.map((item) => `<li>${esc(item)}</li>`).join('')}
                            </ul>
                            ${pack.href ? `<a href="${href(prefix, pack.href)}" class="ul-pricing-package-btn">${esc(pack.cta || 'Подробнее')}</a>` : ''}
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>`;
}

function standardMain(page) {
  return (prefix) => `${breadcrumb(prefix, page.title, page.parent)}
${introBlock(prefix, page)}
${page.afterIntro ? page.afterIntro(prefix) : ''}
${serviceCards(prefix, page.cards || [], { heading: page.cardsTitle, subtitle: page.cardsSubtitle, noTop: true })}
${page.afterCards ? page.afterCards(prefix) : ''}`;
}

function articleCards(prefix, articles, opts = {}) {
  return `
        <section class="ul-blogs-2 ul-section-spacing ${opts.className || ''}">
            <div class="ul-container wow animate__fadeInUp">
                ${opts.heading ? `<div class="ul-section-heading"><div><span class="ul-section-sub-title">${esc(opts.subtitle || 'Материалы')}</span><h2 class="ul-section-title">${esc(opts.heading)}</h2></div></div>` : ''}
                <div class="row row-cols-lg-3 row-cols-md-2 row-cols-1 ul-bs-row">
                    ${articles.map((item) => `
                    <div class="col">
                        <div class="ul-blog ul-blog-2">
                            <div class="ul-blog-img"><a href="${href(prefix, item.path)}"><img src="${href(prefix, `assets/img/${item.image}`)}" alt="${esc(item.title)}"></a></div>
                            <div class="ul-blog-txt">
                                <div class="ul-blog-infos">
                                    <span class="ul-blog-info"><i class="flaticon-calendar"></i> ${esc(item.date || '2026')}</span>
                                    <span class="ul-blog-info"><i class="flaticon-price-tag"></i> ${esc(item.category)}</span>
                                </div>
                                <a href="${href(prefix, item.path)}" class="ul-blog-title">${esc(item.title)}</a>
                                <p class="velikan-news-card-text">${esc(item.excerpt || excerpt(item.text))}</p>
                                <a href="${href(prefix, item.path)}" class="ul-blog-btn">Читать подробнее <span class="icon"><i class="flaticon-next"></i></span></a>
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>`;
}

function renderArticleBody(text) {
  const lines = clean(text).split('\n').map((line) => stripEmoji(line).trim()).filter(Boolean);
  const body = lines.slice(1);
  return body.map((line) => {
    const normalized = line.replace(/^[-•]\s*/, '').trim();
    const headingLike = (
      /^(\d+\.\s|[А-ЯЁA-Z][^.!?]{8,90}\??$)/.test(normalized) ||
      (/^[А-ЯЁA-Z].{5,80}:$/.test(normalized))
    );

    if (headingLike && normalized.length < 110) {
      return `<h3>${esc(normalized.replace(/:$/, ''))}</h3>`;
    }

    if (/^(врачей|идентификацию|документирование|снижению|мышечной|повышенному|нарушениям|Солнце|Пища|Пищевые|Печень|Почки)/i.test(normalized)) {
      return `<p>${esc(normalized)}</p>`;
    }

    return `<p>${esc(normalized)}</p>`;
  }).join('\n                                ');
}

function articlePage(article, parent) {
  return (prefix) => `${breadcrumb(prefix, article.category, parent)}
        <div class="ul-section-spacing">
            <div class="ul-container">
                <div class="row ul-bs-row gy-5 flex-column-reverse flex-md-row">
                    <div class="col-lg-4 col-md-5">
                        <aside class="ul-inner-sidebar">
                            <div class="ul-inner-sidebar-widget posts">
                                <h3 class="ul-inner-sidebar-widget-title">Еще материалы</h3>
                                <div class="ul-inner-sidebar-widget-content">
                                    <div class="ul-inner-sidebar-posts">
                                        ${allArticles.filter((item) => item.path !== article.path).slice(0, 4).map((item) => `
                                        <div class="ul-inner-sidebar-post">
                                            <div class="img"><img src="${href(prefix, `assets/img/${item.image}`)}" alt="${esc(item.title)}"></div>
                                            <div class="txt">
                                                <h4 class="title"><a href="${href(prefix, item.path)}">${esc(item.title)}</a></h4>
                                                <span class="date"><span>${esc(item.category)}</span></span>
                                            </div>
                                        </div>`).join('')}
                                    </div>
                                </div>
                            </div>
                            <div class="ul-inner-sidebar-widget categories">
                                <h3 class="ul-inner-sidebar-widget-title">Разделы</h3>
                                <div class="ul-inner-sidebar-widget-content">
                                    <div class="ul-inner-sidebar-categories">
                                        <a href="${href(prefix, 'blog/index.html')}">Новости <span>${newsArticles.length}</span></a>
                                        <a href="${href(prefix, 'adenomy-gipofiza/articles/index.html')}">О заболевании <span>${diseaseArticles.length}</span></a>
                                        <a href="${href(prefix, 'help/index.html')}">Получить помощь <span>?</span></a>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                    <div class="col-lg-8 col-md-7">
                        <article class="ul-blog ul-blog-inner velikan-single-news">
                            <div class="ul-blog-img">
                                <img src="${href(prefix, `assets/img/${article.image}`)}" alt="${esc(article.title)}">
                            </div>
                            <div class="ul-blog-txt">
                                <div class="ul-event-details-infos">
                                    <div class="ul-event-details-info"><span class="icon"><i class="flaticon-calendar"></i></span><span class="text">${esc(article.date || '2026')}</span></div>
                                    <div class="ul-event-details-info"><span class="icon"><i class="flaticon-account"></i></span><span class="text">ВЕЛИКАН</span></div>
                                    <div class="ul-event-details-info"><span class="icon"><i class="flaticon-price-tag"></i></span><span class="text">${esc(article.category)}</span></div>
                                </div>
                                <h1 class="ul-blog-title">${esc(article.title)}</h1>
                                <p class="ul-blog-excerpt">${esc(article.excerpt || excerpt(article.text, 240))}</p>
                                ${renderArticleBody(article.text)}
                                <div class="velikan-event-detail-note">
                                    <h3>Нужна помощь по теме?</h3>
                                    <p>Напишите в ВЕЛИКАН: команда подскажет, как подготовить вопрос, собрать документы или найти следующий шаг.</p>
                                    <div class="velikan-event-detail-actions">
                                        <a href="${href(prefix, 'contact/index.html')}" class="ul-btn"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Связаться</a>
                                        <a href="${href(prefix, 'help/index.html')}" class="ul-btn ul-btn--2"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Получить помощь</a>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </div>`;
}

function homeMain(prefix) {
  const slides = [
    ['МБООППГ «Великан»', 'Помогаем пациентам пройти путь от диагноза до лечения', 'С 2012 года ВЕЛИКАН объединяет пациентов с тяжелыми эндокринными заболеваниями, развивает социальные проекты и поддерживает людей после онкологического лечения.', 'velikan-banner-support-photo.png', 'about/index.html', 'Об организации'],
    ['Проект «Добрый парик»', 'Поддержка после химиотерапии', 'Адресная помощь детям, подросткам и взрослым: индивидуальные парики из натуральных донорских волос и движение «Донорство волос» по всей России.', 'velikan-oncology-support.png', 'pariki-posle-himioterapii/index.html', 'Узнать о проекте'],
    ['Акромегалия знает вся Россия', 'Ранняя диагностика должна стать нормой', 'Проект направлен на информирование, доступную диагностику ИФР-1 по ОМС и сокращение пути от первых симптомов до постановки диагноза.', 'velikan-banner-diagnostics-photo.png', 'akromegaliya-znaet-vsya-rossiya/index.html', 'О проекте'],
  ];

  return `
        <section class="ul-banner ul-banner-2">
            <div class="ul-banner-2-slider swiper">
                <div class="swiper-wrapper">
                    ${slides.map((slide) => `
                    <div class="swiper-slide">
                        <div class="ul-banner-2-slide">
                            <img src="${href(prefix, `assets/img/${slide[3]}`)}" alt="${esc(slide[1])}" class="ul-banner-2-slide-bg-img">
                            <div class="row gy-4 align-items-center">
                                <div class="col-md-7">
                                    <div class="ul-banner-txt">
                                        <div class="wow animate__fadeInUp">
                                            <span class="ul-banner-sub-title ul-section-sub-title">${esc(slide[0])}</span>
                                            <h1 class="ul-banner-title">${esc(slide[1])}</h1>
                                            <p class="ul-banner-descr">${esc(slide[2])}</p>
                                            <div class="ul-banner-btns">
                                                <a href="${href(prefix, slide[4])}" class="ul-btn"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> ${esc(slide[5])}</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>

        <section class="ul-features ul-section-spacing">
            <div class="ul-container">
                <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4 justify-content-center">
                    ${[
                      ['help/index.html', 'flaticon-support', 'Правовая поддержка'],
                      ['help/index.html', 'flaticon-care', 'ОМС, ВМП и МСЭ'],
                      ['pariki-posle-himioterapii/index.html', 'flaticon-donation', 'Добрый парик'],
                      ['events/index.html', 'flaticon-charity', 'Школы пациентов'],
                    ].map(([target, icon, title]) => `
                    <div class="col">
                        <a href="${href(prefix, target)}" class="ul-feature">
                            <div class="ul-feature-icon"><i class="${icon}"></i></div>
                            <h3 class="ul-feature-title">${esc(title)}</h3>
                        </a>
                    </div>`).join('')}
                </div>
            </div>
        </section>

${introBlock(prefix, {
  subtitle: 'Об организации',
  heading: 'Социальные программы для пациентов и семей',
  text: excerpt(content.org, 520),
  image: 'velikan-about-patients-photo.png',
  badgeNumber: '2012',
  badgeText: 'работаем с пациентами',
  ctaHref: 'about/index.html',
  ctaText: 'Подробнее о ВЕЛИКАНЕ',
})}

${serviceCards(prefix, [
  { title: 'Информационная и правовая поддержка', text: 'Юридические консультации по лекарственному обеспечению, МСЭ, ОМС и ВМП.', image: 'velikan-service-legal.jpg', href: 'help/index.html' },
  { title: 'Маршрутизация пациента', text: 'Помощь в постановке, подтверждении или опровержении диагноза и подготовке документов.', image: 'velikan-service-route.jpg', href: 'help/index.html' },
  { title: 'Образовательные проекты', text: 'Очные и онлайн-школы с эндокринологами, нейрохирургами и экспертами реабилитации.', image: 'velikan-service-school.jpg', href: 'events/index.html' },
], { heading: 'Наша деятельность', subtitle: 'Поддержка на каждом этапе', noTop: true })}

${serviceCards(prefix, [
  { title: 'Добрый парик', text: 'Парики по индивидуальным размерам из натуральных донорских волос для людей после химиотерапии.', image: 'velikan-oncology-support.png', href: 'pariki-posle-himioterapii/index.html' },
  { title: 'Акромегалия знает вся Россия', text: 'Проект ранней диагностики акромегалии и других патологий гипофиза.', image: 'velikan-banner-diagnostics-photo.png', href: 'akromegaliya-znaet-vsya-rossiya/index.html' },
  { title: 'Закрытое сообщество', text: 'Группа поддержки, где пациенты и близкие могут обмениваться опытом и не оставаться одни.', image: 'velikan-banner-community-photo.png', href: 'reviews/index.html' },
], { heading: 'Ключевые проекты', subtitle: 'Социальные программы', noTop: true })}

${articleCards(prefix, [...newsArticles.slice(0, 2), ...diseaseArticles.slice(0, 1)], { heading: 'Новые материалы', subtitle: 'Новости и статьи' })}

        <section class="ul-cta">
            <div class="ul-container">
                <span class="ul-section-sub-title">Поддержать работу</span>
                <h2 class="ul-cta-title">Ваше пожертвование помогает запускать программы помощи</h2>
                <p class="ul-cta-descr">Средства помогают проводить школы пациентов, развивать правовую поддержку, информационные проекты и адресные программы.</p>
                <a href="${href(prefix, 'donations/index.html')}" class="ul-btn"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Сделать пожертвование</a>
            </div>
        </section>`;
}

const simplePages = [
  {
    files: ['about/index.html', 'about.html'],
    title: 'Об организации',
    docTitle: 'Об организации | ВЕЛИКАН',
    description: excerpt(content.org),
    subtitle: 'Миссия и деятельность',
    heading: 'ВЕЛИКАН развивает социальные программы с 2012 года',
    text: excerpt(content.org, 650),
    image: 'velikan-about-patients-photo.png',
    badgeNumber: '2012',
    badgeText: 'начало работы',
    ctaHref: 'help/index.html',
    ctaText: 'Получить помощь',
    cardsTitle: 'Наша деятельность',
    cardsSubtitle: 'Что делает организация',
    cards: [
      { title: 'Правовая поддержка', text: 'Бесплатные юридические консультации по лекарственному обеспечению и прохождению МСЭ.', image: 'velikan-service-legal.jpg', href: 'help/index.html' },
      { title: 'Медицинская маршрутизация', text: 'Помощь в получении консультаций и проведении операций у ведущих специалистов России.', image: 'velikan-service-consult.jpg', href: 'help/index.html' },
      { title: 'Образовательные проекты', text: 'Бесплатные очные и онлайн-школы для пациентов с участием профильных экспертов.', image: 'velikan-service-school.jpg', href: 'events/index.html' },
    ],
    afterCards: (prefix) => factPackages(prefix, 'О ВЕЛИКАНЕ в фактах', 'Открытость и доверие', [
      { title: 'Открытая работа', text: 'Организация ведет прозрачную финансовую деятельность.', items: ['Ежегодные отчеты в Минюсте', 'Работа с пациентами по всей России', 'Закрытое сообщество поддержки'], href: 'about/reports/index.html', cta: 'Смотреть отчеты' },
      { title: 'Профессиональные связи', text: 'ВЕЛИКАН входит в профессиональное пациентское движение.', items: ['Создатели и члены WAPO', 'Партнерства с федеральными центрами', 'Школы с ведущими специалистами'], href: 'about/partners/index.html', cta: 'Партнеры' },
      { title: 'Подтвержденные площадки', text: 'Организация работает на благотворительных и социальных платформах.', items: ['ВК Добро', 'Сбер.Вместе', 'Добро.рф и Planeta.ru'], href: 'donations/index.html', cta: 'Поддержать' },
    ]),
  },
  {
    files: ['help/index.html'],
    title: 'Получить помощь',
    docTitle: 'Получить помощь | ВЕЛИКАН',
    description: 'Поддержка пациентов: консультации, документы, ОМС, ВМП, МСЭ и маршрутизация.',
    subtitle: 'Пациентская поддержка',
    heading: 'Помогаем разобраться с диагнозом, документами и маршрутом лечения',
    text: 'Обратитесь в ВЕЛИКАН, если нужна юридическая консультация, помощь с лекарственным обеспечением, МСЭ, ОМС, ВМП, консультацией специалиста или подготовкой документов к медицинским процедурам.',
    image: 'velikan-banner-support-photo.png',
    badgeNumber: 'помощь',
    badgeText: 'рядом',
    ctaHref: 'contact/index.html',
    ctaText: 'Написать координатору',
    cardsTitle: 'С чем можно обратиться',
    cardsSubtitle: 'Практические направления',
    cards: [
      { title: 'Лекарственное обеспечение', text: 'Разбор отказов, льгот, региональных маршрутов и обращений.', image: 'velikan-service-legal.jpg', href: 'blog/pravo-na-pravo/index.html' },
      { title: 'ОМС и ВМП', text: 'Помощь в понимании права на бесплатную медицинскую помощь и высокотехнологичное лечение.', image: 'velikan-service-route.jpg', href: 'contact/index.html' },
      { title: 'Консультации специалистов', text: 'Содействие в получении консультаций эндокринологов, нейрохирургов и других экспертов.', image: 'velikan-service-consult.jpg', href: 'spec/index.html' },
    ],
  },
  {
    files: ['pariki-posle-himioterapii/index.html'],
    title: 'Добрый парик',
    docTitle: 'Добрый парик | ВЕЛИКАН',
    description: excerpt(content.oncology),
    subtitle: 'Онкология и реабилитация',
    heading: 'Адресная помощь людям после химиотерапии',
    text: content.oncology.replace(/\n/g, ' '),
    image: 'velikan-oncology-support.png',
    badgeNumber: 'донорство',
    badgeText: 'волос',
    ctaHref: 'contact/index.html',
    ctaText: 'Оставить заявку',
    cardsTitle: 'Как работает проект',
    cardsSubtitle: 'Добрый парик',
    cards: [
      { title: 'Индивидуальный размер', text: 'Парики изготавливаются под человека, которому нужна поддержка после лечения.', image: 'velikan-service-route.jpg', href: 'contact/index.html' },
      { title: 'Натуральные волосы', text: 'Проект развивается вместе с движением «Донорство волос» по всей России.', image: 'velikan-home-support-bg.jpg', href: 'donations/index.html' },
      { title: 'Качество жизни', text: 'Цель программы — моральная поддержка и возвращение уверенности в повседневной жизни.', image: 'velikan-service-consult.jpg', href: 'oncology/psikhologicheskaya-podderzhka/index.html' },
    ],
  },
  {
    files: ['akromegaliya-znaet-vsya-rossiya/index.html'],
    title: 'Акромегалия знает вся Россия',
    docTitle: 'Акромегалия знает вся Россия | ВЕЛИКАН',
    description: excerpt(content.campaign),
    subtitle: 'Федеральный проект',
    heading: 'Ранняя диагностика акромегалии должна стать доступной',
    text: content.campaign.replace(/\n/g, ' '),
    image: 'velikan-banner-diagnostics-photo.png',
    badgeNumber: '20 000',
    badgeText: 'цель выявления',
    ctaHref: 'adenomy-gipofiza/acromegaly/index.html',
    ctaText: 'Об акромегалии',
    cardsTitle: 'Задачи проекта',
    cardsSubtitle: 'Системные изменения',
    cards: [
      { title: 'Информирование', text: 'Распространять знания о ранних симптомах акромегалии и патологиях гипофиза.', image: 'velikan-service-info.jpg', href: 'adenomy-gipofiza/acromegaly/index.html' },
      { title: 'Диагностика по ОМС', text: 'Добиваться включения анализа ИФР-1 в программу ОМС и доступного маршрута обследования.', image: 'velikan-banner-diagnostics-photo.png', href: 'help/index.html' },
      { title: 'Регистр пациентов', text: 'Выявить новых пациентов и сформировать культуру самоконтроля здоровья.', image: 'velikan-service-school.jpg', href: 'contact/index.html' },
    ],
  },
  {
    files: ['projects/index.html', 'projects.html'],
    title: 'Проекты',
    docTitle: 'Проекты | ВЕЛИКАН',
    description: 'Социальные и образовательные проекты ВЕЛИКАНА.',
    subtitle: 'Социальные программы',
    heading: 'Проекты, которые помогают пациентам и меняют маршрут диагностики',
    text: 'ВЕЛИКАН развивает программы ранней диагностики, адресной помощи, школ пациентов, правовой поддержки и реабилитации людей после онкологического лечения.',
    image: 'velikan-home-help-bg.jpg',
    badgeNumber: 'проекты',
    badgeText: 'для людей',
    ctaHref: 'donations/index.html',
    ctaText: 'Поддержать проекты',
    cardsTitle: 'Основные направления',
    cardsSubtitle: 'Что можно открыть',
    cards: [
      { title: 'Добрый парик', text: 'Адресная помощь детям, подросткам и взрослым после химиотерапии.', image: 'velikan-oncology-support.png', href: 'pariki-posle-himioterapii/index.html' },
      { title: 'Акромегалия знает вся Россия', text: 'Система ранней диагностики и информирования о патологиях гипофиза.', image: 'velikan-banner-diagnostics-photo.png', href: 'akromegaliya-znaet-vsya-rossiya/index.html' },
      { title: 'Школы пациентов', text: 'Бесплатные очные и онлайн-встречи с ведущими врачами и экспертами.', image: 'velikan-service-school.jpg', href: 'events/index.html' },
    ],
  },
  {
    files: ['adenomy-gipofiza/index.html'],
    title: 'Аденомы гипофиза',
    docTitle: 'Аденомы гипофиза | ВЕЛИКАН',
    description: 'Информация о заболеваниях гипофиза, акромегалии, Кушинге и маршруте пациента.',
    subtitle: 'О заболевании',
    heading: 'Понятная информация о патологиях гипофиза',
    text: 'Раздел помогает пациентам и близким разобраться в симптомах, диагностике, консультациях специалистов, головной боли при акромегалии, обмене витамина D и синдроме Кушинга.',
    image: 'velikan-banner-experts-photo.png',
    badgeNumber: 'ИФР-1',
    badgeText: 'важный анализ',
    ctaHref: 'help/index.html',
    ctaText: 'Получить помощь',
    cardsTitle: 'Материалы раздела',
    cardsSubtitle: 'Заболевания и исследования',
    cards: [
      { title: 'Акромегалия', text: 'Симптомы, диагностика, лечение и вопросы, которые важно обсудить с врачом.', image: 'velikan-service-consult.jpg', href: 'adenomy-gipofiza/acromegaly/index.html' },
      { title: 'Кушинг', text: 'Что такое синдром и болезнь Кушинга, как работает кортизол и почему нужна профильная диагностика.', image: 'velikan-cushing-adrenal.png', href: 'adenomy-gipofiza/cushing/index.html' },
      { title: 'Статьи и исследования', text: 'Головная боль, витамин D, телемедицина и другие материалы для пациентов.', image: 'velikan-service-info.jpg', href: 'adenomy-gipofiza/articles/index.html' },
    ],
  },
  {
    files: ['adenomy-gipofiza/acromegaly/index.html'],
    title: 'Акромегалия',
    docTitle: 'Акромегалия | ВЕЛИКАН',
    description: 'Информация об акромегалии, диагностике и поддержке пациентов.',
    subtitle: 'О заболевании',
    heading: 'Акромегалия требует ранней диагностики и наблюдения',
    text: 'Акромегалия связана с избыточной выработкой гормона роста и ИФР-1. ВЕЛИКАН помогает пациентам искать профильную информацию, готовиться к консультациям и не оставаться один на один с диагнозом.',
    image: 'velikan-banner-diagnostics-photo.png',
    badgeNumber: 'раньше',
    badgeText: 'значит лучше',
    ctaHref: 'akromegaliya-znaet-vsya-rossiya/index.html',
    ctaText: 'Проект диагностики',
    cardsTitle: 'Читайте также',
    cardsSubtitle: 'Материалы об акромегалии',
    cards: [
      { title: diseaseArticles[0].title, text: excerpt(diseaseArticles[0].text), image: diseaseArticles[0].image, href: diseaseArticles[0].path },
      { title: diseaseArticles[1].title, text: excerpt(diseaseArticles[1].text), image: diseaseArticles[1].image, href: diseaseArticles[1].path },
      { title: 'Получить консультацию', text: 'Подготовить документы, задать вопросы и подобрать следующий шаг.', image: 'velikan-service-consult.jpg', href: 'help/index.html' },
    ],
  },
  {
    files: ['about/partners/index.html'],
    title: 'Партнеры',
    docTitle: 'Партнеры | ВЕЛИКАН',
    description: excerpt(content.partners),
    subtitle: 'Партнерство',
    heading: 'Работаем вместе с медицинскими центрами, экспертами и социальными платформами',
    text: excerpt(content.partners, 520),
    image: 'velikan-specialists-preview.jpg',
    badgeNumber: 'партнеры',
    badgeText: 'и эксперты',
    ctaHref: 'contact/index.html',
    ctaText: 'Предложить сотрудничество',
    cardsTitle: 'Ключевые группы партнеров',
    cardsSubtitle: 'С кем взаимодействуем',
    cards: [
      { title: 'Федеральные центры', text: 'НМИЦ эндокринологии, НМИЦ им. Алмазова, Центр нейрохирургии им. Бурденко и другие профильные учреждения.', image: 'velikan-specialists-preview.jpg', href: 'spec/index.html' },
      { title: 'Фармацевтические компании', text: 'Биофармацевтические и медицинские компании, участвующие в проектах информирования и поддержки.', image: 'velikan-service-info.jpg', href: 'contact/index.html' },
      { title: 'Социальные платформы', text: 'ВК Добро, Сбер.Вместе, Добро.рф, Planeta.ru и другие площадки для прозрачной поддержки.', image: 'velikan-service-school.jpg', href: 'donations/index.html' },
    ],
  },
  {
    files: ['about/reports/index.html'],
    title: 'Отчеты',
    docTitle: 'Отчеты | ВЕЛИКАН',
    description: 'Отчетность ВЕЛИКАНА и открытая финансовая деятельность.',
    subtitle: 'Прозрачность',
    heading: 'Отчеты о деятельности и проектах организации',
    text: 'В документе отмечено, что отчетность нужно перенести с действующего сайта. Раздел подготовлен в новой теме: здесь удобно разместить ежегодные отчеты, документы Минюста, грантовые результаты и сведения о социальных программах.',
    image: 'velikan-service-info.jpg',
    badgeNumber: 'отчеты',
    badgeText: 'и документы',
    ctaHref: 'contact/index.html',
    ctaText: 'Запросить документ',
    cardsTitle: 'Что размещать в разделе',
    cardsSubtitle: 'Структура отчетности',
    cards: [
      { title: 'Ежегодные отчеты', text: 'Финансовая и организационная отчетность для пациентов, партнеров и благотворителей.', image: 'velikan-service-info.jpg', href: 'contact/index.html' },
      { title: 'Грантовые проекты', text: 'Результаты проектов при поддержке Фонда президентских грантов, Фонда Потанина и других программ.', image: 'velikan-service-school.jpg', href: 'projects/index.html' },
      { title: 'Социальные программы', text: 'Школы пациентов, адресная помощь, консультации и информационные кампании.', image: 'velikan-service-route.jpg', href: 'projects/index.html' },
    ],
  },
];

function requisitesMain(prefix) {
  return `${breadcrumb(prefix, 'Реквизиты', { label: 'О нас', href: 'about/index.html' })}
${introBlock(prefix, {
  subtitle: 'Официальные данные',
  heading: 'Реквизиты для документов и пожертвований',
  text: 'Межрегиональная Благотворительная Общественная Организация пациентов с патологией гипофиза «Великан». Данные из нового документа вынесены в удобные блоки для переводов, договоров и официальной переписки.',
  image: 'velikan-contact-header-bg.png',
  badgeNumber: 'ИНН',
  badgeText: '7810436567',
  ctaHref: 'donations/index.html',
  ctaText: 'Сделать пожертвование',
})}
${factPackages(prefix, 'Основные реквизиты', 'МБООППГ «Великан»', [
  { title: 'Организация', text: 'Межрегиональная Благотворительная Общественная Организация пациентов с патологией гипофиза «Великан».', items: ['МБООППГ «Великан»', 'ИНН 7810436567', 'КПП 781001001', 'ОГРН 1127800006949', 'ОКВЭД 91.33'] },
  { title: 'Адреса и контакты', text: 'Официальная информация для связи и документов.', items: ['Юридический адрес: 196084, Санкт-Петербург, наб. Обводного канала, 92', 'Почтовый адрес: 197348, Санкт-Петербург, Богатырский пр-т, 18к3, оф. 327', 'Председатель правления: Андрусова Екатерина Александровна', '+7 (911) 777-32-77', 'mail@velikan.info'] },
  { title: 'Банк', text: 'Реквизиты для перевода пожертвований.', items: ['Филиал «Корпоративный» ПАО «Совкомбанк»', 'Расчетный счет: 4070381091201079277', 'К/с: 30101810445250000360', 'БИК: 044525360', 'Назначение: благотворительное пожертвование на уставную деятельность'] },
])}`;
}

function donationsMain(prefix) {
  return `${breadcrumb(prefix, 'Пожертвование')}
        <section class="ul-volunteer">
            <div class="row row-cols-md-2 row-cols-1 g-0">
                <div class="col">
                    <div class="ul-volunteer-block">
                        <h2 class="ul-volunteer-title">Поддержать работу ВЕЛИКАНА</h2>
                        <p class="ul-volunteer-descr">Пожертвования помогают проводить школы пациентов, развивать юридическую поддержку, информационные проекты и адресные программы вроде «Доброго парика».</p>
                        <ul class="ul-volunteer-list">
                            <li>помощь пациентам с документами, ОМС, ВМП и МСЭ</li>
                            <li>образовательные школы с ведущими специалистами</li>
                            <li>реабилитационные и адресные программы</li>
                        </ul>
                        <a href="${href(prefix, 'requisites/index.html')}" class="ul-btn"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Реквизиты</a>
                    </div>
                </div>
                <div class="col">
                    <div class="ul-volunteer-block ul-donate-form-wrapper-2">
                        <h2 class="ul-volunteer-title">Банковский перевод</h2>
                        <p class="ul-volunteer-descr">Используйте реквизиты организации. В назначении платежа можно указать: «Благотворительное пожертвование на уставную деятельность, без НДС».</p>
                        <ul class="ul-volunteer-list">
                            <li>ИНН 7810436567</li>
                            <li>Расчетный счет 4070381091201079277</li>
                            <li>ПАО «Совкомбанк», БИК 044525360</li>
                        </ul>
                        <a href="${href(prefix, 'contact/index.html')}" class="ul-btn"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Уточнить перевод</a>
                    </div>
                </div>
            </div>
        </section>
${serviceCards(prefix, [
  { title: 'Школы пациентов', text: 'Помогают людям получать ответы врачей и понимать маршрут лечения.', image: 'velikan-service-school.jpg', href: 'events/index.html' },
  { title: 'Правовая помощь', text: 'Поддерживает пациентов в вопросах лекарств, льгот, МСЭ, ОМС и ВМП.', image: 'velikan-service-legal.jpg', href: 'help/index.html' },
  { title: 'Добрый парик', text: 'Адресная поддержка людей после химиотерапии и радиохирургии.', image: 'velikan-oncology-support.png', href: 'pariki-posle-himioterapii/index.html' },
], { heading: 'На что идут пожертвования', subtitle: 'Прозрачная помощь' })}`;
}

function contactMain(prefix) {
  return `${breadcrumb(prefix, 'Контакты')}
        <div class="ul-contact-infos">
            <div class="ul-section-spacing ul-container">
                <div class="row row-cols-lg-4 row-cols-md-2 row-cols-1 ul-bs-row">
                    ${[
                      ['flaticon-phone-call', 'WhatsApp', '<a href="tel:+79117773277">+7 (911) 777-32-77</a>'],
                      ['flaticon-email', 'Электронная почта', '<a href="mailto:mail@velikan.info">mail@velikan.info</a>'],
                      ['flaticon-location', 'Адрес', '<span class="descr">Санкт-Петербург, Богатырский пр., 18 к. 3, оф. 310</span>'],
                      ['flaticon-pin', 'Организация', '<span class="descr">МБООППГ «Великан»</span>'],
                    ].map(([icon, title, value]) => `
                    <div class="col">
                        <div class="ul-contact-info">
                            <div class="icon"><i class="${icon}"></i></div>
                            <div class="txt"><span class="title">${title}</span>${value}</div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </div>
        <div class="ul-contact-map">
            <iframe src="https://www.google.com/maps?q=197348%2C%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%2C%20%D0%91%D0%BE%D0%B3%D0%B0%D1%82%D1%8B%D1%80%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D1%80.%2018%D0%BA3&output=embed" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        <section class="ul-inner-contact ul-section-spacing">
            <div class="ul-section-heading justify-content-center text-center">
                <div>
                    <span class="ul-section-sub-title">Форма обращения</span>
                    <h2 class="ul-section-title">Напишите, если вам нужна помощь</h2>
                    <p class="ul-section-descr ul-contact-section-descr">Укажите город, диагноз или тему обращения: консультация, маршрутизация, юридическая поддержка, проект «Добрый парик» или пожертвование.</p>
                </div>
            </div>
            <div class="ul-inner-contact-container">
                <form action="mailto:mail@velikan.info" method="post" enctype="text/plain" class="ul-contact-form ul-form">
                    <div class="row row-cols-2 row-cols-xxs-1 ul-bs-row">
                        <div class="col"><div class="form-group"><input type="text" name="name" placeholder="Имя"></div></div>
                        <div class="col"><div class="form-group"><input type="text" name="surname" placeholder="Фамилия"></div></div>
                        <div class="col"><div class="form-group"><input type="tel" name="phone" placeholder="Телефон"></div></div>
                        <div class="col"><div class="form-group"><input type="email" name="email" placeholder="E-mail"></div></div>
                        <div class="col-12"><div class="form-group"><input type="text" name="city" placeholder="Город"></div></div>
                        <div class="col-12"><div class="form-group"><textarea name="message" placeholder="Ваш вопрос"></textarea></div></div>
                        <div class="col-12">
                            <button type="submit" class="ul-btn"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Отправить</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>`;
}

function teamMain(prefix) {
  return `${breadcrumb(prefix, 'Команда', { label: 'О нас', href: 'about/index.html' })}
        <section class="ul-team ul-inner-team ul-section-spacing">
            <div class="ul-container">
                <div class="ul-team-intro">
                    <span class="ul-section-sub-title">Команда ВЕЛИКАНА</span>
                    <h2 class="ul-section-title">Люди, которые помогают пациентам</h2>
                    <p class="ul-section-descr">Раздел перенесен из действующей структуры сайта: команда объединяет руководителей направлений, юристов, волонтеров и специалистов проектов.</p>
                </div>
                <div class="row row-cols-md-4 row-cols-sm-3 row-cols-2 row-cols-xxs-1 ul-team-row justify-content-center">
                    ${team.map(([name, role, image]) => `
                    <div class="col">
                        <div class="ul-team-member">
                            <div class="ul-team-member-img"><img src="${href(prefix, `assets/img/${image}`)}" alt="${esc(name)}"></div>
                            <div class="ul-team-member-info">
                                <h3 class="ul-team-member-name"><a href="${href(prefix, 'team/index.html')}">${esc(name)}</a></h3>
                                <p class="ul-team-member-designation">${esc(role)}</p>
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>`;
}

function reviewsMain(prefix) {
  return `${breadcrumb(prefix, 'Отзывы', { label: 'О нас', href: 'about/index.html' })}
        <section class="ul-reviews ul-section-spacing">
            <div class="ul-container">
                <div class="ul-section-heading justify-content-between">
                    <div>
                        <span class="ul-section-sub-title">Отзывы пациентов</span>
                        <h2 class="ul-section-title">Что люди пишут о поддержке ВЕЛИКАНА</h2>
                        <p class="ul-reviews-heading-descr">Отзывы перенесены с публичной гостевой книги velikan.info/about/reviews/.</p>
                    </div>
                    <a href="${href(prefix, 'contact/index.html')}" class="ul-btn"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Оставить отзыв</a>
                </div>
                <div class="row row-cols-lg-3 row-cols-md-2 row-cols-1 ul-bs-row">
                    ${reviews.slice(0, 9).map((review, index) => `
                    <div class="col">
                        <div class="ul-review">
                            <div class="ul-review-rating"><i class="flaticon-star"></i><i class="flaticon-star"></i><i class="flaticon-star"></i><i class="flaticon-star"></i><i class="flaticon-star"></i></div>
                            <p class="ul-review-descr">${esc(excerpt(review.text, 430))}</p>
                            <div class="ul-review-bottom">
                                <div class="ul-review-reviewer">
                                    <div class="reviewer-image"><img src="${href(prefix, `assets/img/user-${(index % 3) + 1}.png`)}" alt="Пациент"></div>
                                    <div>
                                        <h4 class="reviewer-name">Пациент ВЕЛИКАНА</h4>
                                        <span class="reviewer-role">Гостевая книга</span>
                                    </div>
                                </div>
                                <div class="ul-review-icon"><i class="flaticon-quote"></i></div>
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>`;
}

function articleIndexMain(prefix) {
  return `${breadcrumb(prefix, 'Статьи и исследования', { label: 'Аденомы гипофиза', href: 'adenomy-gipofiza/index.html' })}
${introBlock(prefix, {
  subtitle: 'База знаний',
  heading: 'Материалы о диагностике, лечении и качестве жизни',
  text: 'Здесь собраны статьи из нового наполнения сайта: головная боль при акромегалии, витамин D при гиперкортицизме и акромегалии, синдром Кушинга и материалы о поддержке во время онкологического лечения.',
  image: 'velikan-service-info.jpg',
  badgeNumber: 'знания',
  badgeText: 'для пациента',
  ctaHref: 'help/index.html',
  ctaText: 'Задать вопрос',
})}
${articleCards(prefix, diseaseArticles, { heading: 'О заболевании', subtitle: 'Читайте материалы', className: 'pt-0' })}`;
}

function blogMain(prefix) {
  return `${breadcrumb(prefix, 'Новости')}
${articleCards(prefix, [...newsArticles, ...diseaseArticles.slice(0, 2)], { heading: 'Новости и материалы ВЕЛИКАНА', subtitle: 'Юридические, медицинские и проектные публикации' })}`;
}

function writePage(file, page) {
  const out = path.join(root, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, layout(file, page), 'utf8');
}

writePage('index.html', {
  title: 'ВЕЛИКАН — помощь пациентам и социальные программы',
  description: 'ВЕЛИКАН помогает пациентам с патологиями гипофиза, акромегалией, тяжелыми эндокринными заболеваниями и людям после онкологического лечения.',
  isHome: true,
  main: homeMain,
});

for (const page of simplePages) {
  for (const file of page.files) {
    writePage(file, {
      title: page.docTitle,
      description: page.description,
      main: standardMain(page),
    });
  }
}

for (const file of ['requisites/index.html', 'requisites.html']) {
  writePage(file, {
    title: 'Реквизиты | ВЕЛИКАН',
    description: 'Реквизиты МБООППГ «Великан» для документов и благотворительных переводов.',
    main: requisitesMain,
  });
}

for (const file of ['donations/index.html', 'donations.html']) {
  writePage(file, {
    title: 'Пожертвование | ВЕЛИКАН',
    description: 'Поддержать работу ВЕЛИКАНА: реквизиты и направления помощи пациентам.',
    main: donationsMain,
  });
}

for (const file of ['contact/index.html', 'contact.html']) {
  writePage(file, {
    title: 'Контакты | ВЕЛИКАН',
    description: 'Контакты ВЕЛИКАНА: телефон, почта, адрес и форма обращения.',
    main: contactMain,
  });
}

for (const file of ['team/index.html', 'team.html']) {
  writePage(file, {
    title: 'Команда | ВЕЛИКАН',
    description: 'Команда ВЕЛИКАНА: руководители направлений, волонтеры и специалисты поддержки пациентов.',
    main: teamMain,
  });
}

for (const file of ['reviews/index.html', 'reviews.html']) {
  writePage(file, {
    title: 'Отзывы | ВЕЛИКАН',
    description: 'Отзывы пациентов и участников сообщества ВЕЛИКАН.',
    main: reviewsMain,
  });
}

for (const file of ['blog/index.html', 'blog.html']) {
  writePage(file, {
    title: 'Новости | ВЕЛИКАН',
    description: 'Новости, юридические материалы и статьи ВЕЛИКАНА.',
    main: blogMain,
  });
}

writePage('adenomy-gipofiza/articles/index.html', {
  title: 'Статьи и исследования | ВЕЛИКАН',
  description: 'Статьи и исследования о заболеваниях гипофиза, акромегалии, Кушинге и поддержке пациентов.',
  main: articleIndexMain,
});

for (const item of allArticles) {
  writePage(item.path, {
    title: `${item.title} | ВЕЛИКАН`,
    description: excerpt(item.text),
    main: articlePage(item, item.path.startsWith('blog/') ? { label: 'Новости', href: 'blog/index.html' } : { label: 'Статьи', href: 'adenomy-gipofiza/articles/index.html' }),
  });
}

for (const file of ['blog-details/index.html', 'blog-details.html']) {
  const item = newsArticles[0];
  writePage(file, {
    title: `${item.title} | ВЕЛИКАН`,
    description: excerpt(item.text),
    main: articlePage(item, { label: 'Новости', href: 'blog/index.html' }),
  });
}

function allHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'templates', 'node_modules', 'content'].includes(entry.name)) continue;
    if (entry.name.startsWith('_')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...allHtml(full));
    if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function syncShell() {
  for (const filePath of allHtml(root)) {
    const rel = path.relative(root, filePath).replace(/\\/g, '/');
    const prefix = prefixFor(rel);
    let html = fs.readFileSync(filePath, 'utf8');

    html = html.replace(/<html lang="en">/g, '<html lang="ru">');
    html = html.replace(/placeholder="Search Here"/g, 'placeholder="Поиск по сайту"');
    html = html.replace(/<span class="ul-sidebar-footer-title">Follow us<\/span>/g, '<span class="ul-sidebar-footer-title">Мы в соцсетях</span>');
    html = html.replace(
      /<nav class="ul-header-nav">[\s\S]*?<\/nav>/,
      `<nav class="ul-header-nav">${nav(prefix)}
                        </nav>`
    );
    html = html.replace(
      /<a href="[^"]*" class="ul-btn d-sm-inline-flex d-none"><i class="flaticon-fast-forward-double-right-arrows-symbol"><\/i>\s*[^<]*<\/a>/,
      `<a href="${href(prefix, 'donations/index.html')}" class="ul-btn d-sm-inline-flex d-none"><i class="flaticon-fast-forward-double-right-arrows-symbol"></i> Поддержать</a>`
    );
    html = html.replace(/<form action="[^"]*index\.html#"?\s+class="ul-search-form">[\s\S]*?<\/form>/, searchModal(prefix).match(/<form[\s\S]*<\/form>/)[0]);

    html = html.replace(
      /(<h3 class="ul-footer-widget-title">Быстрые ссылки<\/h3>\s*)<div class="ul-footer-widget-links">[\s\S]*?<\/div>/,
      `$1<div class="ul-footer-widget-links">
                            <a href="${href(prefix, 'about/index.html')}">Об организации</a>
                            <a href="${href(prefix, 'help/index.html')}">Получить помощь</a>
                            <a href="${href(prefix, 'pariki-posle-himioterapii/index.html')}">Добрый парик</a>
                            <a href="${href(prefix, 'akromegaliya-znaet-vsya-rossiya/index.html')}">Акромегалия знает вся Россия</a>
                            <a href="${href(prefix, 'reviews/index.html')}">Отзывы</a>
                        </div>`
    );

    if (!html.includes('assets/js/site-search.js')) {
      html = html.replace('</body>', `${scripts(prefix).match(/<script src="[^"]*assets\/js\/site-search\.js"[^>]*><\/script>/)[0]}\n</body>`);
    }

    fs.writeFileSync(filePath, html, 'utf8');
  }
}

function buildSearchIndex() {
  const index = allHtml(root)
    .map((filePath) => {
      const rel = path.relative(root, filePath).replace(/\\/g, '/');
      const html = fs.readFileSync(filePath, 'utf8')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ');
      const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || rel)
        .replace(/\s*\|\s*ВЕЛИКАН/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const text = html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
      return {
        title,
        url: rel.replace(/\\/g, '/'),
        text: text.slice(0, 900),
      };
    })
    .filter((item, index, arr) => item.title && arr.findIndex((candidate) => candidate.url === item.url) === index);

  fs.writeFileSync(path.join(root, 'assets', 'search-index.json'), JSON.stringify(index, null, 2), 'utf8');
}

syncShell();
buildSearchIndex();

console.log(`Generated ${allHtml(root).length} HTML files and ${path.join('assets', 'search-index.json')}.`);
