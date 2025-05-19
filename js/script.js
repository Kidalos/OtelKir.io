document.addEventListener('DOMContentLoaded', () => {
  // Навигация (оставляем без изменений)
  const navbar = document.querySelector('.nawbar__contentnaw');
  const logo = document.querySelector('.nawbar__logo');
  let lastScrollTop = 0;
  let isScrolling;

  if (!navbar || !logo) {
    console.error('Error: Navbar or Logo not found:', { navbar, logo });
    return;
  }

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    console.log({
      scrollTop,
      lastScrollTop,
      navbarClasses: navbar.classList.toString(),
      logoClasses: logo.classList.toString(),
    });

    if (scrollTop > 50) {
      navbar.classList.add('hidden');
      logo.classList.add('fixed', 'visible');
    } else {
      navbar.classList.remove('hidden');
      logo.classList.remove('fixed', 'visible');
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  };

  window.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(handleScroll, 50);
  });

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  // Загрузка Special Offers
  const loadSpecialOffers = () => {
    const cardContainer = document.querySelector('.cpecial__card .card_card1');
    cardContainer.innerHTML = ''; // Очищаем контейнер
    const specialOffers = JSON.parse(localStorage.getItem('specialOffers')) || [];
    specialOffers.forEach(offer => {
      const card = `
                <div>
                    <img src="${offer.image}" alt="Room Image">
                    <p>Room</p>
                    <h3>${offer.title}</h3>
                    <p>${offer.description}</p>
                    <span>
                        <span>$${offer.price}</span>
                        <span>/night</span>
                    </span>
                </div>`;
      cardContainer.insertAdjacentHTML('beforeend', card);
    });
  };

  // Загрузка Services
  const loadServices = () => {
    const carousel = document.querySelector('.services-carousel');
    carousel.innerHTML = ''; // Очищаем карусель
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const defaultServices = [
      { title: 'Rooms', image: 'img/Rectangle 6.png' },
      { title: 'Dining', image: 'img/Dining.png' },
      { title: 'Conferences & Meetings', image: 'img/Rectangle 9.png' },
      { title: 'Service & Facilities', image: 'img/Rectangle 10.png' },
      { title: 'Wedding Package', image: 'img/Rectangle 11.png' }
    ];

    // Объединяем статические и динамические сервисы
    const allServices = [...services, ...defaultServices.filter(ds => !services.some(s => s.title === ds.title))];

    allServices.forEach((service, index) => {
      const item = `
                <div class="services-carousel__item" style="${index === 0 ? 'grid-row: 1 / 3; grid-column: 1 / 2; aspect-ratio: 1 / 2;' : ''}">
                    <img src="${service.image}" alt="${service.title}">
                    <div class="services-carousel__title">${service.title}</div>
                </div>`;
      carousel.insertAdjacentHTML('beforeend', item);
    });
  };

  // Загружаем данные при старте
  loadSpecialOffers();
  loadServices();
});