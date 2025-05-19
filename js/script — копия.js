// Инициализация данных в localStorage, если их нет
const initializeData = () => {
    if (!localStorage.getItem('specialOffers')) {
        localStorage.setItem('specialOffers', JSON.stringify([
            { id: 1, title: 'Honeymoon', description: 'Indulge in a Memorable One-Time Romantic Dinner for Two', price: '699', image: 'img/Rectangle 13.png' },
            { id: 2, title: 'Meetings', description: 'Experience an Exclusively Private Environment to Boost Your Productivity', price: '999', image: 'img/Rectangle 14.png' },
            { id: 3, title: 'Honeymoon', description: 'Indulge in a Memorable One-Time Romantic Dinner for Two', price: '499', image: 'img/Rectangle 15.png' }
        ]));
    }
    if (!localStorage.getItem('rooms')) {
        localStorage.setItem('rooms', JSON.stringify([
            { id: 1, title: 'Standard Room', description: 'Cozy room with a single bed', price: '200', image: 'img/standard-room.png' }
        ]));
    }
    if (!localStorage.getItem('services')) {
        localStorage.setItem('services', JSON.stringify([
            { id: 1, title: 'Dining', description: 'Fine dining experience', image: 'img/Dining.png' }
        ]));
    }
};

// Запуск инициализации
initializeData();

// Получение элементов модального окна
const modal = document.getElementById('adminModal');
const closeModal = document.querySelector('.modal__close');
const adminForm = document.getElementById('adminForm');
const modalTitle = document.getElementById('modalTitle');

// Функция загрузки данных в таблицы
const loadTableData = (tableId, dataKey) => {
    const table = document.getElementById(tableId);
    table.innerHTML = ''; // Очищаем таблицу
    const data = JSON.parse(localStorage.getItem(dataKey)) || [];
    data.forEach(item => {
        const row = `
            <div class="adminn__table__row" data-id="${item.id}">
                <div>${item.id}</div>
                <div>${item.title}</div>
                <div>${item.description}</div>
                <div>${item.price ? `$${item.price}` : ''}</div>
                <div>${item.image || ''}</div>
                <div>
                    <button class="adminn__table__edit-btn" data-type="${dataKey.replace('Table', '')}" data-id="${item.id}">Edit</button>
                    <button class="adminn__table__delete-btn" data-id="${item.id}">Delete</button>
                </div>
            </div>`;
        table.insertAdjacentHTML('beforeend', row);
    });
};

// Загрузка данных при старте
document.addEventListener('DOMContentLoaded', () => {
    loadTableData('special-offers-table', 'specialOffers');
    loadTableData('rooms-table', 'rooms');
    loadTableData('services-table', 'services');
});

// Функция открытия модального окна
function openModal(type, id, title, description, price, image) {
    modal.style.display = 'flex';
    modalTitle.textContent = id ? 'Edit Item' : 'Add Item';
    document.getElementById('itemType').value = type;
    document.getElementById('title').value = title || '';
    document.getElementById('description').value = description || '';
    document.getElementById('price').value = price || '';
    document.getElementById('image').value = image || '';
    adminForm.dataset.id = id || '';
    adminForm.dataset.table = type === 'special-offer' ? 'special-offers-table' : type === 'room' ? 'rooms-table' : 'services-table';
    adminForm.dataset.dataKey = type === 'special-offer' ? 'specialOffers' : type === 'room' ? 'rooms' : 'services';
}

// Закрытие модального окна
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Обработка кнопок "Add"
document.querySelectorAll('.adminn__section__add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        openModal(type, '', '', '', '', '');
    });
});

// Обработка кнопок "Edit"
document.querySelectorAll('.adminn__table__edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const row = btn.closest('.adminn__table__row');
        const type = btn.dataset.type;
        const id = row.dataset.id;
        const cells = row.children;
        const title = cells[1].textContent;
        const description = cells[2].textContent;
        const price = cells[3].textContent.replace('$', '');
        const image = cells[4].textContent;

        openModal(type, id, title, description, price, image);
    });
});

// Обработка кнопок "Delete"
document.querySelectorAll('.adminn__table__delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.closest('.adminn__table__row').dataset.id;
        const table = btn.closest('.adminn__table__body');
        const dataKey = table.id === 'special-offers-table' ? 'specialOffers' : table.id === 'rooms-table' ? 'rooms' : 'services';
        if (confirm('Are you sure you want to delete this item?')) {
            let data = JSON.parse(localStorage.getItem(dataKey)) || [];
            data = data.filter(item => item.id !== parseInt(id));
            localStorage.setItem(dataKey, JSON.stringify(data));
            loadTableData(table.id, dataKey);
        }
    });
});

// Обработка отправки формы
adminForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = adminForm.dataset.id;
    const type = document.getElementById('itemType').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const image = document.getElementById('image').value;
    const tableId = adminForm.dataset.table;
    const dataKey = adminForm.dataset.dataKey;

    let data = JSON.parse(localStorage.getItem(dataKey)) || [];

    if (id) {
        // Редактирование существующей записи
        data = data.map(item =>
            item.id === parseInt(id)
                ? { ...item, title, description, price, image }
                : item
        );
    } else {
        // Добавление новой записи
        const newId = Date.now();
        data.push({ id: newId, title, description, price, image });
    }

    localStorage.setItem(dataKey, JSON.stringify(data));
    loadTableData(tableId, dataKey);
    modal.style.display = 'none';
});