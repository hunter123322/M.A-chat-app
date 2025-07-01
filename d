[33mcommit f7a1a6302749312c183a5919eeed3bb80cebd6d7[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mhandling-offline-send-message[m[33m, [m[1;31morigin/handling-offline-send-message[m[33m)[m
Author: aldrin <belardoaldrin93@gmail.com>
Date:   Mon Jun 30 19:56:48 2025 +0800

    Adding message option

[1mdiff --git a/a.html b/a.html[m
[1mindex a4b987e..f6dfc2b 100644[m
[1m--- a/a.html[m
[1m+++ b/a.html[m
[36m@@ -1,211 +1,205 @@[m
 <!DOCTYPE html>[m
 <html lang="en">[m
 <head>[m
[31m-  <meta charset="UTF-8">[m
[31m-  <meta name="viewport" content="width=device-width, initial-scale=1.0">[m
[31m-  <title>Simple Landing Page</title>[m
[31m-[m
[31m-  <!-- Link to Google Fonts for styling -->[m
[31m-  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">[m
[31m-[m
[31m-  <!-- Link to jQuery -->[m
[31m-  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>[m
[31m-[m
[31m-  <style>[m
[31m-    /* Basic reset */[m
[31m-    * {[m
[31m-      margin: 0;[m
[31m-      padding: 0;[m
[31m-      box-sizing: border-box;[m
[31m-    }[m
[31m-    [m
[31m-    body {[m
[31m-      font-family: 'Roboto', sans-serif;[m
[31m-      line-height: 1.6;[m
[31m-      background-color: #f4f4f4;[m
[31m-    }[m
[31m-[m
[31m-    /* Header Styles */[m
[31m-    header {[m
[31m-      background: #333;[m
[31m-      color: white;[m
[31m-      padding: 20px 0;[m
[31m-      text-align: center;[m
[31m-    }[m
[31m-[m
[31m-    header h1 {[m
[31m-      font-size: 2.5rem;[m
[31m-    }[m
[31m-[m
[31m-    /* Hero Section */[m
[31m-    .hero {[m
[31m-      background: url('https://via.placeholder.com/1200x600') no-repeat center center/cover;[m
[31m-      color: white;[m
[31m-      height: 100vh;[m
[31m-      display: flex;[m
[31m-      justify-content: center;[m
[31m-      align-items: center;[m
[31m-      text-align: center;[m
[31m-    }[m
[31m-[m
[31m-    .hero h2 {[m
[31m-      font-size: 3rem;[m
[31m-      margin-bottom: 20px;[m
[31m-    }[m
[31m-[m
[31m-    .cta-button {[m
[31m-      background-color: #ff5733;[m
[31m-      color: white;[m
[31m-      padding: 15px 30px;[m
[31m-      text-decoration: none;[m
[31m-      font-size: 1.2rem;[m
[31m-      border-radius: 5px;[m
[31m-      transition: background-color 0.3s;[m
[31m-    }[m
[31m-[m
[31m-    .cta-button:hover {[m
[31m-      background-color: #c7451c;[m
[31m-    }[m
[31m-[m
[31m-    /* Features Section */[m
[31m-    .features {[m
[31m-      display: flex;[m
[31m-      justify-content: center;[m
[31m-      gap: 30px;[m
[31m-      padding: 50px 0;[m
[31m-    }[m
[31m-[m
[31m-    .feature-box {[m
[31m-      background: white;[m
[31m-      border: 1px solid #ddd;[m
[31m-      padding: 20px;[m
[31m-      width: 300px;[m
[31m-      text-align: center;[m
[31m-      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);[m
[31m-    }[m
[31m-[m
[31m-    .feature-box h3 {[m
[31m-      margin-bottom: 20px;[m
[31m-    }[m
[31m-[m
[31m-    .feature-box p {[m
[31m-      font-size: 1rem;[m
[31m-    }[m
[31m-[m
[31m-    /* Footer */[m
[31m-    footer {[m
[31m-      background: #333;[m
[31m-      color: white;[m
[31m-      text-align: center;[m
[31m-      padding: 20px;[m
[31m-    }[m
[31m-[m
[31m-    footer p {[m
[31m-      font-size: 1rem;[m
[31m-    }[m
[31m-[m
[31m-    /* Form Section */[m
[31m-    .form-container {[m
[31m-      padding: 50px;[m
[31m-      background-color: #fff;[m
[31m-      max-width: 600px;[m
[31m-      margin: 0 auto;[m
[31m-      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);[m
[31m-      border-radius: 8px;[m
[31m-    }[m
[31m-[m
[31m-    .form-container input, .form-container button {[m
[31m-      width: 100%;[m
[31m-      padding: 10px;[m
[31m-      margin: 10px 0;[m
[31m-      border-radius: 5px;[m
[31m-      border: 1px solid #ddd;[m
[31m-    }[m
[31m-[m
[31m-    .form-container button {[m
[31m-      background-color: #ff5733;[m
[31m-      color: white;[m
[31m-      font-size: 1.1rem;[m
[31m-      cursor: pointer;[m
[31m-    }[m
[32m+[m[32m    <meta charset="UTF-8">[m
[32m+[m[32m    <meta name="viewport" content="width=device-width, initial-scale=1.0">[m
[32m+[m[32m    <title>Dynamic Popup Menu</title>[m
[32m+[m[32m    <style>[m
[32m+[m[32m        :root {[m
[32m+[m[32m          --primary-dark: rgb(102, 101, 101);[m
[32m+[m[32m          --secondary-dark: rgb(85, 85, 85);[m
[32m+[m[32m          --contact-bg: rgb(112, 79, 79);[m
[32m+[m[32m          --message-bg: rgb(144, 144, 144);[m
[32m+[m[32m          --my-message-bg: rgb(216, 216, 216);[m
[32m+[m[32m          --hover-light: rgba(255, 255, 255, 0.1);[m
[32m+[m[32m          --transition-speed: 0.3s;[m
[32m+[m[32m        }[m
 [m
[31m-    .form-container button:hover {[m
[31m-      background-color: #c7451c;[m
[31m-    }[m
[31m-  </style>[m
[32m+[m[32m        body {[m
[32m+[m[32m          background-color: white;[m
[32m+[m[32m          font-family: "Segoe UI", Arial, sans-serif;[m
[32m+[m[32m          display: flex;[m
[32m+[m[32m          min-height: 100vh;[m
[32m+[m[32m          line-height: 1.5;[m
[32m+[m[32m          margin: 0;[m
[32m+[m[32m          justify-content: center;[m
[32m+[m[32m          align-items: center;[m
[32m+[m[32m        }[m
[32m+[m[32m    </style>[m
[32m+[m[32m    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">[m
 </head>[m
 <body>[m
[31m-[m
[31m-  <!-- Header Section -->[m
[31m-  <header>[m
[31m-    <h1>Welcome to Our Service</h1>[m
[31m-  </header>[m
[31m-[m
[31m-  <!-- Hero Section -->[m
[31m-  <div class="hero">[m
[31m-    <div>[m
[31m-      <h2>Transform Your Business</h2>[m
[31m-      <p>Get started with the best tools for your growth!</p>[m
[31m-      <a href="#form" class="cta-button">Get Started</a>[m
[31m-    </div>[m
[31m-  </div>[m
[31m-[m
[31m-  <!-- Features Section -->[m
[31m-  <div class="features">[m
[31m-    <div class="feature-box">[m
[31m-      <h3>Feature 1</h3>[m
[31m-      <p>Explanation of the first feature of the service.</p>[m
[31m-    </div>[m
[31m-    <div class="feature-box">[m
[31m-      <h3>Feature 2</h3>[m
[31m-      <p>Explanation of the second feature of the service.</p>[m
[31m-    </div>[m
[31m-    <div class="feature-box">[m
[31m-      <h3>Feature 3</h3>[m
[31m-      <p>Explanation of the third feature of the service.</p>[m
[31m-    </div>[m
[31m-  </div>[m
[31m-[m
[31m-  <!-- Form Section -->[m
[31m-  <div id="form" class="form-container">[m
[31m-    <h3>Sign Up Now</h3>[m
[31m-    <form id="signup-form">[m
[31m-      <input type="text" id="name" placeholder="Your Name" required>[m
[31m-      <input type="email" id="email" placeholder="Your Email" required>[m
[31m-      <button type="submit">Sign Up</button>[m
[31m-    </form>[m
[31m-  </div>[m
[31m-[m
[31m-  <!-- Footer Section -->[m
[31m-  <footer>[m
[31m-    <p>&copy; 2024 Our Service. All rights reserved.</p>[m
[31m-  </footer>[m
[31m-[m
[31m-  <!-- jQuery Script -->[m
[31m-  <script>[m
[31m-    // jQuery for smooth scrolling when clicking the "Get Started" button[m
[31m-    $(document).ready(function() {[m
[31m-      $('a.cta-button').on('click', function(event) {[m
[31m-        event.preventDefault();[m
[31m-        $('html, body').animate({[m
[31m-          scrollTop: $('#form').offset().top[m
[31m-        }, 1000);[m
[31m-      });[m
[31m-[m
[31m-      // jQuery for form validation[m
[31m-      $('#signup-form').on('submit', function(event) {[m
[31m-        event.preventDefault();[m
[31m-        let name = $('#name').val();[m
[31m-        let email = $('#email').val();[m
[31m-[m
[31m-        if (name === "" || email === "") {[m
[31m-          alert("Please fill out all fields.");[m
[31m-        } else {[m
[31m-          alert("Thank you for signing up, " + name + "!");[m
[31m-        }[m
[31m-      });[m
[31m-    });[m
[31m-  </script>[m
[31m-[m
[32m+[m[32m    <script>[m
[32m+[m[32m        // Create style element dynamically[m
[32m+[m[32m        const style = document.createElement('style');[m
[32m+[m[32m        style.textContent = `[m
[32m+[m[32m            .menu-container {[m
[32m+[m[32m                position: relative;[m
[32m+[m[32m                width: 300px;[m
[32m+[m[32m                background: var(--my-message-bg);[m
[32m+[m[32m                padding: 20px;[m
[32m+[m[32m                border-radius: 12px;[m
[32m+[m[32m                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .menu-button {[m
[32m+[m[32m                background: none;[m
[32m+[m[32m                border: none;[m
[32m+[m[32m                font-size: 26px;[m
[32m+[m[32m                cursor: pointer;[m
[32m+[m[32m                padding: 6px 12px;[m
[32m+[m[32m                border-radius: 6px;[m
[32m+[m[32m                color: var(--primary-dark);[m
[32m+[m[32m                transition: all var(--transition-speed) ease;[m
[32m+[m[32m                margin-left: auto;[m
[32m+[m[32m                display: block;[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .menu-button:hover {[m
[32m+[m[32m                background-color: var(--hover-light);[m
[32m+[m[32m                transform: scale(1.1);[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .popup-menu {[m
[32m+[m[32m                position: absolute;[m
[32m+[m[32m                top: calc(100% + 8px);[m
[32m+[m[32m                right: 0;[m
[32m+[m[32m                background: white;[m
[32m+[m[32m                border-radius: 8px;[m
[32m+[m[32m                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);[m
[32m+[m[32m                padding: 6px 0;[m
[32m+[m[32m                width: 160px;[m
[32m+[m[32m                z-index: 100;[m
[32m+[m[32m                opacity: 0;[m
[32m+[m[32m                transform: translateY(-10px);[m
[32m+[m[32m                visibility: hidden;[m
[32m+[m[32m                flex-direction: column;[m
[32m+[m[32m                border: 1px solid var(--message-bg);[m
[32m+[m[32m                transition: all var(--transition-speed) ease;[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .popup-menu.show {[m
[32m+[m[32m                opacity: 1;[m
[32m+[m[32m                transform: translateY(0);[m
[32m+[m[32m                visibility: visible;[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .menu-item {[m
[32m+[m[32m                padding: 10px 16px;[m
[32m+[m[32m                cursor: pointer;[m
[32m+[m[32m                display: flex;[m
[32m+[m[32m                align-items: center;[m
[32m+[m[32m                gap: 12px;[m
[32m+[m[32m                color: var(--primary-dark);[m
[32m+[m[32m                transition: all var(--transition-speed) ease;[m
[32m+[m[32m                font-size: 15px;[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .menu-item:hover {[m
[32m+[m[32m                background-color: var(--my-message-bg);[m
[32m+[m[32m                padding-left: 20px;[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .menu-item i {[m
[32m+[m[32m                font-size: 16px;[m
[32m+[m[32m                color: var(--secondary-dark);[m
[32m+[m[32m                width: 20px;[m
[32m+[m[32m                text-align: center;[m
[32m+[m[32m                transition: transform var(--transition-speed) ease;[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .menu-item:hover i {[m
[32m+[m[32m                transform: scale(1.15);[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .divider {[m
[32m+[m[32m                height: 1px;[m
[32m+[m[32m                background-color: var(--message-bg);[m
[32m+[m[32m                margin: 4px 0;[m
[32m+[m[32m                opacity: 0.3;[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .danger {[m
[32m+[m[32m                color: #e74c3c !important;[m
[32m+[m[32m            }[m
[32m+[m[41m            [m
[32m+[m[32m            .danger i {[m
[32m+[m[32m                color: #e74c3c !important;[m
[32m+[m[32m            }[m
[32m+[m[32m        `;[m
[32m+[m[32m        document.head.appendChild(style);[m
[32m+[m
[32m+[m[32m        // Menu configuration[m
[32m+[m[32m        const menuItems = [[m
[32m+[m[32m            { icon: 'fa-edit', text: 'Edit', action: () => console.log('Edit clicked') },[m
[32m+[m[32m            { icon: 'fa-copy', text: 'Copy', action: () => console.log('Copy clicked') },[m
[32m+[m[32m            { type: 'divider' },[m
[32m+[m[32m            { icon: 'fa-smile', text: 'React', action: () => console.log('React clicked') },[m
[32m+[m[32m            { type: 'divider' },[m
[32m+[m[32m            { icon: 'fa-trash', text: 'Delete', action: () => console.log('Delete clicked'), class: 'danger' }[m
[32m+[m[32m        ];[m
[32m+[m
[32m+[m[32m        // Create container[m
[32m+[m[32m        const container = document.createElement('div');[m
[32m+[m[32m        container.className = 'menu-container';[m
[32m+[m[32m        document.body.appendChild(container);[m
[32m+[m
[32m+[m[32m        // Create menu button[m
[32m+[m[32m        const menuButton = document.createElement('button');[m
[32m+[m[32m        menuButton.className = 'menu-button';[m
[32m+[m[32m        menuButton.textContent = '⋮';[m
[32m+[m[32m        container.appendChild(menuButton);[m
[32m+[m
[32m+[m[32m        // Create popup menu[m
[32m+[m[32m        const popupMenu = document.createElement('div');[m
[32m+[m[32m        popupMenu.className = 'popup-menu';[m
[32m+[m[32m        container.appendChild(popupMenu);[m
[32m+[m
[32m+[m[32m        // Create menu items[m
[32m+[m[32m        menuItems.forEach(item => {[m
[32m+[m[32m            if (item.type === 'divider') {[m
[32m+[m[32m                const divider = document.createElement('div');[m
[32m+[m[32m                divider.className = 'divider';[m
[32m+[m[32m                popupMenu.appendChild(divider);[m
[32m+[m[32m            } else {[m
[32m+[m[32m                const menuItem = document.createElement('div');[m
[32m+[m[32m                menuItem.className = `menu-item ${item.class || ''}`;[m
[32m+[m[41m                [m
[32m+[m[32m                const icon = document.createElement('i');[m
[32m+[m[32m                icon.className = `fas ${item.icon}`;[m
[32m+[m[32m                menuItem.appendChild(icon);[m
[32m+[m[41m                [m
[32m+[m[32m                const text = document.createElement('span');[m
[32m+[m[32m                text.textContent = item.text;[m
[32m+[m[32m                menuItem.appendChild(text);[m
[32m+[m[41m                [m
[32m+[m[32m                menuItem.addEventListener('click', () => {[m
[32m+[m[32m                    item.action();[m
[32m+[m[32m                    popupMenu.classList.remove('show');[m
[32m+[m[41m                    [m
[32m+[m[32m                    // Visual feedback[m
[32m+[m[32m                    menuItem.style.backgroundColor = 'rgba(0,0,0,0.1)';[m
[32m+[m[32m                    setTimeout(() => {[m
[32m+[m[32m                        menuItem.style.backgroundColor = '';[m
[32m+[m[32m                    }, 300);[m
[32m+[m[32m                });[m
[32m+[m[41m                [m
[32m+[m[32m                popupMenu.appendChild(menuItem);[m
[32m+[m[32m            }[m
[32m+[m[32m        });[m
[32m+[m
[32m+[m[32m        // Toggle menu visibility[m
[32m+[m[32m        menuButton.addEventListener('click', (e) => {[m
[32m+[m[32m            e.stopPropagation();[m
[32m+[m[32m            popupMenu.classList.toggle('show');[m
[32m+[m[32m        });[m
[32m+[m
[32m+[m[32m        // Close menu when clicking outside[m
[32m+[m[32m        document.addEventListener('click', (e) => {[m
[32m+[m[32m            if (!popupMenu.contains(e.target) && e.target !== menuButton) {[m
[32m+[m[32m                popupMenu.classList.remove('show');[m
[32m+[m[32m            }[m
[32m+[m[32m        });[m
[32m+[m[32m    </script>[m
 </body>[m
[31m-</html>[m
[32m+[m[32m</html>[m
\ No newline at end of file[m
[1mdiff --git a/public/css/messageList.css b/public/css/messageList.css[m
[1mindex 07cd9dd..9ef7782 100644[m
[1m--- a/public/css/messageList.css[m
[1m+++ b/public/css/messageList.css[m
[36m@@ -170,32 +170,7 @@[m [mbody {[m
   gap: 0.75rem;[m
 }[m
 [m
[31m-.text {[m
[31m-  background-color: var(--message-bg);[m
[31m-  padding: 0.75rem 1rem;[m
[31m-  border-radius: 10px;[m
[31m-  max-width: 75%;[m
[31m-  word-wrap: break-word;[m
[31m-  align-self: flex-start;[m
[31m-  transition: all var(--transition-speed) ease;[m
[31m-}[m
[31m-[m
[31m-.text:hover {[m
[31m-  background-color: color-mix(in srgb, var(--message-bg), black 10%);[m
[31m-}[m
 [m
[31m-.myText {[m
[31m-  background-color: var(--my-message-bg);[m
[31m-  align-self: flex-end;[m
[31m-  border-radius: 10px;[m
[31m-  padding: 0.75rem 1rem;[m
[31m-  word-wrap: break-word;[m
[31m-  transition: all var(--transition-speed) ease;[m
[31m-}[m
[31m-[m
[31m-.myText:hover {[m
[31m-  background-color: color-mix(in srgb, var(--my-message-bg), black 5%);[m
[31m-}[m
 [m
 /* Input Area */[m
 #input {[m
[36m@@ -304,3 +279,136 @@[m [mbody {[m
 #logoutButton:hover {[m
   background-color: var(--hover-light);[m
 }[m
[32m+[m
[32m+[m
[32m+[m
[32m+[m
[32m+[m[32m/* asdasdsad */[m
[32m+[m[32m/* Message bubbles */[m
[32m+[m[32m.text, .myText {[m
[32m+[m[32m  position: relative; /* Needed for absolute menu positioning */[m
[32m+[m[32m  padding: 0.75rem 1rem;[m
[32m+[m[32m  border-radius: 10px;[m
[32m+[m[32m  max-width: 75%;[m
[32m+[m[32m  word-wrap: break-word;[m
[32m+[m[32m  transition: all var(--transition-speed) ease;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.text {[m
[32m+[m[32m  background-color: var(--message-bg);[m
[32m+[m[32m  align-self: flex-start;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.text:hover {[m
[32m+[m[32m  background-color: color-mix(in srgb, var(--message-bg), black 10%);[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.myText {[m
[32m+[m[32m  background-color: var(--my-message-bg);[m
[32m+[m[32m  align-self: flex-end;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.myText:hover {[m
[32m+[m[32m  background-color: color-mix(in srgb, var(--my-message-bg), black 5%);[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m/* Menu container */[m
[32m+[m[32m.menu-container {[m
[32m+[m[32m  position: absolute;[m
[32m+[m[32m  top: 0.25rem;[m
[32m+[m[32m  right: 0.25rem;[m
[32m+[m[32m  background: none;[m
[32m+[m[32m  z-index: 10;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m/* Menu button */[m
[32m+[m[32m.menu-button {[m
[32m+[m[32m  background: none;[m
[32m+[m[32m  border: none;[m
[32m+[m[32m  font-size: 1.25rem;[m
[32m+[m[32m  cursor: pointer;[m
[32m+[m[32m  color: var(--primary-dark);[m
[32m+[m[32m  transition: all var(--transition-speed) ease;[m
[32m+[m[32m  display: flex;[m
[32m+[m[32m  align-items: center;[m
[32m+[m[32m  padding: 0.25rem;[m
[32m+[m[32m  border-radius: 4px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.menu-button:hover {[m
[32m+[m[32m  background-color: var(--hover-light);[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32