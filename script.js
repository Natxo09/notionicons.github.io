document.addEventListener('DOMContentLoaded', function () {
    const switchElement = document.querySelector('#switch');
    const bodyElement = document.body;
    const notionIcon = document.getElementById('notion-icon');
    const iconsContainer = document.getElementById('icons-container');
    const searchInput = document.getElementById('search-input');

    function loadIcons(theme) {
        fetch(theme === 'dark' ? 'icons-dark.json' : 'icons-light.json')
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

    function copyToClipboard(iconUrl, iconName, button) {
        navigator.clipboard.writeText(iconUrl).then(() => {
            // Cambia el texto y el estilo del botón
            button.textContent = 'Copied';
            button.style.color = 'white';

            setTimeout(() => {
                // Revierte el texto y el estilo del botón después de 2 segundos
                button.textContent = 'Copy';
                button.style.backgroundColor = ''; // Elimina el fondo verde personalizado
                button.style.color = ''; // Restaura el color del texto original
            }, 2000); // 2000 milisegundos (2 segundos)
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

        // Filtra los iconos por nombre
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

        // Verifica si no hay texto de búsqueda y restablece la disposición de los iconos
        if (searchText === '') {
            resetIconLayout();
        }
    }

    switchElement.addEventListener('change', function () {
        if (bodyElement.classList.toggle('dark-mode')) {
            notionIcon.src = 'https://img.icons8.com/ios-filled/250/FFFFFF/notion.png'; // Icono para modo oscuro
            loadIcons('dark');
        } else {
            notionIcon.src = 'https://img.icons8.com/ios-filled/250/000000/notion.png'; // Icono para modo claro
            loadIcons('light');
        }
    });

    loadIcons('light'); // Carga inicial de iconos para el tema claro

    // Agrega un listener para la barra de búsqueda
    searchInput.addEventListener('input', filterIcons);
});
