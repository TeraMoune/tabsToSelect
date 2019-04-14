# tabsToSelect
Плагин для реализации табов, ~~превращающихся в селект~~ с колбэками и адаптивностью.

[пример](https://codepen.io/teramoune/full/zXEZax)

 - Костыль убран.
 - Активация табов происходит сразу при иницилизации плагина.
 - Класс `active` в `tts-tabs-switcher` определяет какой таб будет ативен в начале. Если не указан то активным будет первый там.
 - Аттрибут `data-color` у `tts-tabs-switcher` использует для выделения цветом в зависимости от настройки каких либо элементов.
 - Одновременно может быть задействовано лишь одно, либо цвет меняется в border-top либо у фона либо у стороннего объекта.
 - Опция `mainWrapperClass` пока лучше испльзовать лишь для класса с добавлением `transition` эффекта, так как при добавлении класса
при смене табов есть задержка при смене цветов (Дайте знать как это лучше сделать, если есть мысли)

## HTML
```html

<div class="tts-tabs">
    <ul class="tts-tabs-switchers">
        <li class="tts-tabs-switcher active">таб 1</li>
        <li class="tts-tabs-switcher">таб 2</li>
        <li class="tts-tabs-switcher">таб 3</li>
    </ul>

    <div class="tts-tabs-item">контент таба 1</div>      
    <div class="tts-tabs-item">контент таба 2</div> 
    <div class="tts-tabs-item">контент таба 3</div> 
</div>
```

## минимум js для работы плагина 
`$('.tts-tabs').tabsToSelect();`

## js (полный пример)
```js
$('.tts-tabs').tabsToSelect({
    // Класс, добавляемый с селекту
    selectCalss: 'styler', 
    // Класс, добавляемый с обёртке селекта
    selectWrapperCalss: 'styler-wrapper', 
    // Куда вставлять сформированный селект (селектор внутри блока с табами)
    selectAppendTo: '',
    // Добавляет класс клавному контейнеру (в нашем случае .tts-tabs)
    mainWrapperClass: '',
    // Определяет объект которому будет применён цвет фона
    ObjbgColor: '',
    // true - Добавляет селект (Подумал, а зачем, не всегда и нужен этот селект)
    selectEnable: false,
    // Если true то цвет изменяет только у border-top стиля, если false то цвет меняет у фона
    topBorderTabsColor: true,
    onInit: function () {
       // Срабатывает при инициализации плагина
    },
    beforeTabSwich: function (e) {
        // Срабатывает перед сменой активного таба
        // Если функция вернёт false - смена таба не произойдёт
    },
    afterTabSwich: function (e) {
        // Срабатывает после смены активного таба
    },
    onResized: function () {
        // Срабатывает при изменении размера окна
    }
});
```

