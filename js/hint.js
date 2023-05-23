function showHint(opts) {
    const hint = document.createElement('span');
    hint.classList.add('hint__text');
    if (opts.center) {
        hint.classList.add('hint__text--center');
    }
    hint.textContent = opts.message;
    hint.style.display = 'block';

    opts.container.appendChild(hint);
    setTimeout(() => opts.container.removeChild(hint), opts.delay || 1000);
}