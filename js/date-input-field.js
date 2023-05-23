function DateInputField(opts) {

    const fieldElem = opts.fieldElem;
    let inputHandler = opts.onInput;
    let focusOutHandler = opts.onFocusOut;

    fieldElem.querySelectorAll('input').forEach(f => f.addEventListener('keydown', e => {
        if ((isNaN(e.key) && !(e.keyCode === 8 || e.key.toLowerCase() === 'backspace') && e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 9) || e.keyCode === 32) {
            e.preventDefault();
        }
    }));

    const dayField = fieldElem.querySelector('.day');
    const monthField = fieldElem.querySelector('.month');
    const yearField = fieldElem.querySelector('.year');

    function isDayValid() {
        const day = +fieldElem.querySelector('.day').value;
        return 0 < day && day <= 31;
    }

    function isMonthValid() {
        const month = +fieldElem.querySelector('.month').value;
        return 0 < month && month <= 12;
    }

    function isYearValid() {
        const year = +fieldElem.querySelector('.year').value;
        return 0 < year && year < new Date().getFullYear() + 1;
    }

    function clearField(fieldName) {
        switch (fieldName) {
            case 'day':
                dayField.value = '';
                break;
            case 'month':
                monthField.value = '';
                break;
            case 'year':
                yearField.value = '';
                break;
        }
    }

    function handleInput() {
        if (inputHandler) {
            inputHandler()
        }
    }

    function handleFocusOut() {
        if (focusOutHandler) {
            focusOutHandler();
        }
    }

    dayField.addEventListener('input', () => {
        const n = +dayField.value;
        if (dayField.value.length === 2 && !(1 <= n && n <= 31)) {
            dayField.value = dayField.value.slice(0, -1);
        }
        if (dayField.value.length === 2) {
            monthField.focus();
        }
        handleInput();
    });
    dayField.addEventListener('focusout', () => {
        if (dayField.value.length === 1) {
            dayField.value = String(dayField.value).padStart(2, '0');
        }
        if (!isDayValid()) {
            clearField('day');
        }
        handleFocusOut();
    });

    monthField.addEventListener('input', () => {
        const n = +monthField.value;
        if (monthField.value.length === 2 && !(1 <= n && n <= 12)) {
            monthField.value = monthField.value.slice(0, -1);
        }
        if (monthField.value.length === 2) {
            yearField.focus();
        }
        handleInput();
    });
    monthField.addEventListener('focusout', () => {
        if (monthField.value.length === 1) {
            monthField.value = String(monthField.value).padStart(2, '0');
        }
        if (!isMonthValid()) {
            clearField('month');
        }
        handleFocusOut();
    });

    yearField.addEventListener('input', () => {
        if (yearField.value.length > 4) {
            yearField.value = yearField.value.slice(0, -1);
        }
        handleInput();
    });
    yearField.addEventListener('focusout', () => {
        if (0 < yearField.value.length && yearField.value.length < 4) {
            yearField.value = String(yearField.value).padStart(4, '0');
        }
        if (!isYearValid()) {
            clearField('year');
        }
        handleFocusOut();
    });

    // public methods
    this.clear = function () {
        clearField('day');
        clearField('month');
        clearField('year');
    }

    this.hasValidDate = function () {
        return isDayValid() && isMonthValid() && isYearValid();
    };

    this.getDate = function () {
        const day = fieldElem.querySelector('.day').value;
        const month = fieldElem.querySelector('.month').value;
        const year = fieldElem.querySelector('.year').value;
        if (this.hasValidDate()) {
            return new Date(`${ month }/${ day }/${ year }`);
        }

        return null;
    }

    this.setDate = function (date) {
        fieldElem.querySelector('.day').value = String(date.getDate()).padStart(2, '0');
        fieldElem.querySelector('.month').value = String((+date.getMonth() + 1)).padStart(2, '0');
        fieldElem.querySelector('.year').value = String(date.getFullYear()).padStart(4, '0');
    }

    this.isEmpty = function () {
        const day = fieldElem.querySelector('.day').value;
        const month = fieldElem.querySelector('.month').value;
        const year = fieldElem.querySelector('.year').value;

        return day === '' && month === '' && year === '';
    }

    this.elem = function () {
        return fieldElem;
    };

    this.focus = function () {
        dayField.focus();
    };

    this.onInput = function (callback) {
        inputHandler = callback;
    };

    this.onFocusOut = function (callback) {
        focusOutHandler = callback;
    };
}