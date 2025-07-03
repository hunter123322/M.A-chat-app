// types.js - Not needed in JS, but here's the equivalent documentation
/*
 * ActionItem: {
 *   icon: string,
 *   text: string,
 *   action: () => void,
 *   className?: string,
 *   ariaLabel?: string
 * }
 * 
 * DividerItem: { type: 'divider' }
 * 
 * MenuItem: DividerItem | ActionItem
 */

// menu-config.js
export const DEFAULT_MENU_ITEMS = [
    { icon: 'fa-edit', text: 'Edit', action: () => console.log('Edit clicked'), ariaLabel: 'Edit message' },
    { icon: 'fa-copy', text: 'Copy', action: () => console.log('Copy clicked'), ariaLabel: 'Copy message' },
    { type: 'divider' },
    { icon: 'fa-smile', text: 'React', action: () => console.log('React clicked'), ariaLabel: 'Add reaction' },
    { type: 'divider' },
    {
        icon: 'fa-trash',
        text: 'Delete',
        action: () => console.log('Delete clicked'),
        className: 'danger',
        ariaLabel: 'Delete message'
    },
];

// menu-builder.js
export class MenuBuilder {
    static createMenuContainer() {
        const container = document.createElement('div');
        container.className = 'menu-container';
        return container;
    }

    static createMenuButton() {
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = '⋮';
        button.setAttribute('aria-label', 'Message actions');
        button.setAttribute('aria-haspopup', 'true');
        return button;
    }

    static createPopupMenu(menuItems) {
        const popupMenu = document.createElement('div');
        popupMenu.className = 'popup-menu';
        popupMenu.setAttribute('role', 'menu');

        menuItems.forEach(item => {
            if ('type' in item) {
                popupMenu.appendChild(this.createDivider());
            } else {
                popupMenu.appendChild(this.createMenuItem(item));
            }
        });

        return popupMenu;
    }

    static createDivider() {
        const divider = document.createElement('div');
        divider.className = 'divider';
        divider.setAttribute('role', 'separator');
        return divider;
    }

    static createMenuItem(item) {
        const menuItem = document.createElement('button');
        menuItem.className = `menu-item ${item.className || ''}`;
        menuItem.setAttribute('role', 'menuitem');
        if (item.ariaLabel) {
            menuItem.setAttribute('aria-label', item.ariaLabel);
        }

        const icon = document.createElement('i');
        icon.className = `fas ${item.icon}`;
        menuItem.appendChild(icon);

        const text = document.createElement('span');
        text.textContent = item.text;
        menuItem.appendChild(text);

        menuItem.addEventListener('click', () => {
            item.action();
            this.handleMenuItemClickFeedback(menuItem);
        });

        return menuItem;
    }

    static handleMenuItemClickFeedback(menuItem) {
        menuItem.style.backgroundColor = 'rgba(0,0,0,0.1)';
        setTimeout(() => {
            menuItem.style.backgroundColor = '';
        }, 300);
    }
}

// display-handler.js
export class DisplayHandler {
    constructor(
        text,
        isMine,
        messageId,
        menuItems = DEFAULT_MENU_ITEMS
    ) {
        this.text = text;
        this.isMine = isMine;
        this.messageId = messageId;
        this.menuItems = menuItems;

        this.messageContainer = this.createMessageContainer();
        this.menuContainer = MenuBuilder.createMenuContainer();
        this.menuButton = MenuBuilder.createMenuButton();
        this.popupMenu = MenuBuilder.createPopupMenu(menuItems);

        this.setupEventListeners();
        this.applyPositionStyles();
    }

    displayMessage(contentContainerId = 'content') {
        const contentContainer = document.getElementById(contentContainerId);
        if (contentContainer) {
            contentContainer.appendChild(this.messageContainer);
        } else {
            console.error(`Container with id ${contentContainerId} not found`);
        }
    }

    createMessageContainer() {
        const container = document.createElement("div");
        container.classList.add(this.isMine ? "myText" : "text");
        container.id = this.messageId;

        const messageDiv = document.createElement("div");
        messageDiv.className = "message-content";

        const messageContent = document.createElement("span");
        messageContent.textContent = this.text;

        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(this.menuContainer);
        container.appendChild(messageDiv);

        return container;
    }

    setupEventListeners() {
        this.menuContainer.appendChild(this.menuButton);
        this.menuContainer.appendChild(this.popupMenu);

        this.menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.popupMenu.classList.toggle('show');
            this.menuButton.setAttribute('aria-expanded',
                this.popupMenu.classList.contains('show').toString());
        });

        document.addEventListener('click', this.handleOutsideClick.bind(this));
    }

    handleOutsideClick(e) {
        if (e.target instanceof Node &&
            !this.popupMenu.contains(e.target) &&
            e.target !== this.menuButton
        ) {
            this.popupMenu.classList.remove('show');
            this.menuButton.setAttribute('aria-expanded', 'false');
        }
    }

    applyPositionStyles() {
        if (this.isMine) {
            this.menuContainer.style.right = '0.05rem';
            this.menuContainer.style.top = '0.05rem';
            this.menuContainer.style.left = 'auto';
            this.popupMenu.style.left = '-15rem';
            this.popupMenu.style.top = '-8.5rem';
        } else {
            this.menuContainer.style.left = '0.25rem';
            this.menuContainer.style.right = 'auto';
            this.popupMenu.style.right = '-15rem';
            this.popupMenu.style.top = '-8.5rem';
        }
    }
}