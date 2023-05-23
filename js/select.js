function Select(opts) {
    function getTemplate(values = []) {
        return `
                <div class="my-select__backdrop" data-type="backdrop"></div>
                <div class="my-select__selected flex">
                    <div class="my-select__value" data-type="value"></div>
                    <span class="icon icon icon-arrow-down" data-type="value"></span>        
                </div>
                <ul class="my-select__dropdown" data-type="dropdown">
                    ${ values.map((val, index) => `<li class="my-select__option" data-type="item" data-index="${index}">${ val }</li>`).join('') }
                </ul>
        `;
    }

    const $select = document.createElement('div');
    $select.classList.add('my-select');
    $select.innerHTML = getTemplate(opts.values);
    $select.setAttribute('aria-expanded', 'false');
    const items = $select.querySelectorAll('li');
    const $value = $select.querySelector('.my-select__value');

    opts.container.classList.add('my-select__container');
    opts.container.appendChild($select);

    let selectedIndex = 0;

    const toggle = () => {
        const expanded = $select.getAttribute('aria-expanded');
        expanded === 'true' ? this.close() : this.open();
    }

    const handleClick = e => {
        const type = e.target.dataset.type;
        switch (type) {
            case 'value':
                toggle();
                break
            case 'item':
                this.selectByIndex(+e.target.dataset.index);
                this.close();
                break
            case 'backdrop':
                this.close();
                break
        }
    }

    $select.addEventListener('click', handleClick);

    this.selectByIndex = function (index, callOnSelect = true) {
        selectedIndex = index;
        for (const item of items) {
            item.removeAttribute('aria-selected');
        }
        const selectedItem = items[selectedIndex];
        selectedItem.setAttribute('aria-selected', 'true');
        $value.textContent = selectedItem.textContent;

        if (opts.onSelect && callOnSelect) {
            opts.onSelect(selectedItem.textContent, selectedIndex);
        }
    };
    this.selectByIndex(selectedIndex);

    this.selectByValue = function (value, callOnSelect) {
        this.selectByIndex(opts.values.indexOf(value), callOnSelect);
    };

    this.getSelectedIndex = function () {
        return selectedIndex;
    };

    this.getSelectedValue = function () {
        return opts.values[selectedIndex];
    };

    this.setOnSelect = function (callback) {
        opts.onSelect = callback;
    };

    this.destroy = function () {
        $select.removeEventListener('click', handleClick);
        opts.container.classList.remove('my-select__container');
        opts.container.removeChild($select);
    };

    this.open = function () {
        $select.setAttribute('aria-expanded', 'true');
    };

    this.close = function () {
        $select.setAttribute('aria-expanded', 'false');
    };
}

// const elem = document.querySelector('.select-test');
// const s = new Select({
//     container: elem,
//     values: ['one', 'two', 'three'],
//     onSelect(value, index) {
//         console.log(value, index);
//     },
// });