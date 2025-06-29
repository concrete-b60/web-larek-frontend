# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Общая архитектура

Приложение построено по паттерну MVP (Model–View–Presenter) в сочетании с событийно-ориентированным подходом. Основное взаимодействие между компонентами реализовано через EventEmitter.

## Основные слои приложения:

### Модель (Model)

Служит для хранения и управления данными (товары, корзина, заказ, доставка и т.п.).

### Представление (View)

Отвечает за отображение данных и взаимодействие с пользователем.

### Событийный посредник (EventEmitter)

Обеспечивает работу событий. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.

## API

В проекте используется универсальный API-клиент, реализующий сетевые запросы к серверу и инкапсулирующий детали HTTP-взаимодействия.

### Базовый класс Api

Класс служит основой для всех запросов к серверу. Он принимает базовый URL и дополнительные параметры (например, заголовки).

### Класс WebLarekApi

Класс расширяет Api и реализует методы используемые для приложения.

Методы:

-getItemList() Загружает каталог товаров, преобразует изображения с svg в png через CDN

-order(data) Отправляет заказ, объединяя контактные и адресные данные

## Слой Модели

### Класс AppState

Данный класс содержит в себе все данные и логику работы с ними. Для удобства работы с данными в модели реализованы методы: получения каталога товара, работы с корзиной товаров и оформления заказа.

Свойства:

catalog: IItem[] — список товаров

preview: string | null — выбранный товар

order: IOrder — данные заказа (способ оплаты, адрес, товары)

contacts: IContact — контактные данные

formErrors — ошибки валидации формы

Методы:

setCatalog(items) — обновление каталога, эмитирует 'catalog:changed'

setPreview(id) — установка предпросмотра товара, эмитирует 'product:selected'

toggleItemInBasket(id, isBasket) — добавление/удаление товара из корзины, эмитирует 'basket:updated'

addToBasket, removeFromBasket, clearBasket — управление содержимым корзины

getBasketItems, getTotal — получение списка и общей стоимости товаров

setOrderField, setContactField — установка полей заказа/контактов с валидацией

validateOrder, validateContact — проверка корректности ввода, эмитируют 'formErrors:change:\*'

## Слои представления

### Базовый класс Component<T>

Базовый класс Component<T>
Абстрактный класс Component<T> служит основой для всех визуальных компонентов проекта. Он инкапсулирует базовую логику работы с DOM-элементами и предоставляет методы для отображения данных, управления стилями и взаимодействием с элементами.

Каждый компонент принимает контейнер t и предоставляет интерфейс для обновления его состояния и визуального представления. Тип T описывает структуру данных, с которыми работает компонент при рендеринге.

### Базовый класс Form<T>

Представляет обобщённый компонент формы, предназначен для работы с HTML-формами в связке с событийной системой (IEvents). Форма автоматически отслеживает ввод и отправку данных, эмитируя события соответствующего формата.

Работает с любой структурой данных T, где T — объект, содержащий имена полей формы. Реализует двухстороннюю привязку: изменения в полях вызывают события field:change, а изменения извне могут быть переданы через render.
Поддерживает валидацию: блокирует кнопку отправки при невалидном состоянии и отображает список ошибок.

### Класс Popup

Класс Popup представляет собой модальное окно, используемое для отображения вложенного контента (форм, уведомлений, успешного заказа и т.п.).
Наследуется от Component<IModalData> и использует событийную модель IEvents для взаимодействия с другими слоями приложения.

Методы:
open(): void - Открывает модальное окно, добавляя класс modal_active и эмитируя событие:

close(): void - Закрывает модальное окно, удаляя класс modal_active, очищая содержимое и эмитируя событие:

render(data: IModalData): HTMLElement - Устанавливает содержимое модального окна и открывает его:

### Класс Card

Класс Card представляет компонент карточки товара. Реализует логику отображения товара и его взаимодействия.

Свойства
id - Устанавливает или возвращает идентификатор карточки, привязанный к data-id в DOM

title - Устанавливает заголовок товара

description - Устанавливает описание товара, если соответствующий DOM-элемент существует

category - Устанавливает категорию товара

price - Устанавливает цену товара:

Если цена передана, отображается с надписью синапсов.

Если цена отсутствует или равна нулю, отображается бесценно.

При нулевой или отрицательной цене кнопка блокируется.

image - Устанавливает путь к изображению товара:

inBasket - Изменяет надпись на кнопке: «Удалить» или «В корзину»

Поведение кнопки
Если передан обработчик onClick:

при наличии .card\_\_button — вешается на неё,

иначе — на всю карточку (container).

Это позволяет гибко использовать компонент как с интерактивной кнопкой, так и с кликабельной карточкой целиком.

### Класс Basket

Класс представляет собой компонент отображения содержимого корзины. Он отвечает за рендер списка выбранных товаров, отображение общей суммы заказа и активацию/деактивацию кнопки перехода к оформлению.

items - Устанавливает список элементов корзины.Если массив пустой, в список добавляется текст Корзина пуста.

selected - Массив ID выбранных товаров. Используется для активации или деактивации кнопки оформления заказа. Если массив пустой — кнопка блокируется.Если в массиве есть элементы — кнопка становится активной.

total - Общая сумма заказа. Также активирует/деактивирует кнопку оформления в зависимости от значения: 0 или отрицательное число → кнопка блокируется Положительное число → кнопка активна.

События
При клике на кнопку генерируется событие:
events.emit('order:open') - инициирует переход к оформлению заказа.

### Класс Page

Класс отвечает за управление основными областями страницы, включая каталог товаров, счётчик корзины и состояние блокировки интерфейса при оформлении заказа.

counter - Устанавливает значение счётчика товаров в корзине.

catalog - Устанавливает список DOM-элементов карточек товаров в галерее.

locked - Блокирует или разблокирует интерфейс. Используется для визуального блокирования страницы при открытом модальном окне или оформлении заказа.

События
basket:open - При клике на элемент корзины генерируется событие: events.emit('basket:open') - Это сигнал для отображения корзины.

### Класс Order

Класс расширяет функциональность базовой формы заказа и включает дополнительную логику для управления вкладками способов оплаты.

payment - Способ оплаты. Устанавливает/возвращает текущую вкладку (card, cash).

address - Адрес доставки. Автоматически находит поле с именем address и устанавливает его значение.

События
order.payment:change — генерируется при переключении вкладки оплаты.

### Класс Contacts

Форма для ввода контактных данных покупателя: электронной почты и номера телефона.

email - Электронная почта

phone - телефон

### Класс Success

Класс представляет компонент страницы подтверждения заказа. Используется для отображения информации о завершённой покупке, включая итоговую сумму заказа, и предоставляет кнопку закрытия.

total - Устанавливает отображаемую сумму списанных синапсов:

## Ссылка на репозиторий

https://github.com/concrete-b60/web-larek-frontend
