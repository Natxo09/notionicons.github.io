document.addEventListener('DOMContentLoaded', function () {
    const switchElement = document.querySelector('#switch');
    const iconSwitchElement = document.querySelector('#icon-switch');
    const normalText = document.getElementById('normal-text');
    const fillText = document.getElementById('fill-text');
    const bodyElement = document.body;
    const notionIcon = document.getElementById('notion-icon');
    const iconsContainer = document.getElementById('icons-container');
    const searchInput = document.getElementById('search-input');

    function loadIcons(theme, iconType) {
        let jsonFile;
        if (theme === 'dark') {
            jsonFile = iconType === 'fill' ? 'icons-dark-fill.json' : 'icons-dark.json';
        } else {
            jsonFile = iconType === 'fill' ? 'icons-light-fill.json' : 'icons-light.json';
        }

        fetch(jsonFile)
            .then(response => response.json())
            .then(icons => {
                iconsContainer.innerHTML = '';
                icons.forEach(icon => {
                    const iconElement = document.createElement('div');
                    iconElement.className = 'icon';

                    const img = document.createElement('img');
                    img.src = icon.url;
                    img.alt = icon.name;
                    img.addEventListener('click', () => copyToClipboard(icon.url, icon.name, img));

                    const name = document.createElement('div');
                    name.className = 'icon-name';
                    name.textContent = icon.name;

                    const copyButton = document.createElement('button');
                    copyButton.className = 'btn btn-primary btn-sm';
                    copyButton.textContent = 'Copy';
                    copyButton.addEventListener('click', () => copyToClipboard(icon.url, icon.name, copyButton));

                    iconElement.appendChild(img);
                    iconElement.appendChild(name);
                    iconElement.appendChild(copyButton);

                    iconsContainer.appendChild(iconElement);
                });
            });
    }
    function clearSearchBar() {
        searchInput.value = ''; // Limpia la barra de búsqueda
        resetIconLayout(); // Restablece la disposición de los iconos si es necesario
    }
    function copyToClipboard(iconUrl, iconName, button) {
        navigator.clipboard.writeText(iconUrl).then(() => {
            button.textContent = 'Copied';
            button.style.color = 'white';

            setTimeout(() => {
                button.textContent = 'Copy';
                button.style.backgroundColor = '';
                button.style.color = '';
            }, 2000);
        }).catch((error) => {
            console.error('Error al copiar al portapapeles:', error);
        });
    }

    function resetIconLayout() {
        const iconElements = iconsContainer.getElementsByClassName('icon');
        Array.from(iconElements).forEach(iconElement => {
            iconElement.style.display = 'inline-block';
        });
    }

    function filterIcons() {
        const searchText = searchInput.value.toLowerCase();

        const iconElements = iconsContainer.getElementsByClassName('icon');
        Array.from(iconElements).forEach(iconElement => {
            const nameElement = iconElement.querySelector('.icon-name');
            const iconName = nameElement.textContent.toLowerCase();

            if (iconName.includes(searchText)) {
                iconElement.style.display = 'inline-block';
            } else {
                iconElement.style.display = 'none';
            }
        });

        if (searchText === '') {
            resetIconLayout();
        }
    }

    function updateTextStyles() {
        if (iconSwitchElement.checked) {
            fillText.classList.add('active');
            normalText.classList.remove('active');
        } else {
            normalText.classList.add('active');
            fillText.classList.remove('active');
        }
    }

    switchElement.addEventListener('change', function () {
        const theme = bodyElement.classList.toggle('dark-mode') ? 'dark' : 'light';
        const iconType = iconSwitchElement.checked ? 'fill' : 'normal';
        loadIcons(theme, iconType);
        notionIcon.src = theme === 'dark' ? 'https://img.icons8.com/ios-filled/250/FFFFFF/notion.png' : 'https://img.icons8.com/ios-filled/250/000000/notion.png';
        updateTextStyles();
        clearSearchBar(); // Limpia la barra de búsqueda
    });

    iconSwitchElement.addEventListener('change', function () {
        const theme = bodyElement.classList.contains('dark-mode') ? 'dark' : 'light';
        const iconType = iconSwitchElement.checked ? 'fill' : 'normal';
        loadIcons(theme, iconType);
        updateTextStyles();
        clearSearchBar(); // Limpia la barra de búsqueda
    });

    // Inicialización inicial
    loadIcons('light', 'normal');
    updateTextStyles();

    // Agregar listener para la barra de búsqueda
    searchInput.addEventListener('input', filterIcons);
});
