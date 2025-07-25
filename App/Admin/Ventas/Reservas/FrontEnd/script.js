function toggleMenu(btn) {
    document.querySelectorAll('.menu-opciones').forEach(menu => {
      if (menu !== btn.nextElementSibling) menu.style.display = 'none';
    });
  
    const menu = btn.nextElementSibling;
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
  }
  
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.acciones')) {
      document.querySelectorAll('.menu-opciones').forEach(menu => {
        menu.style.display = 'none';
      });
    }
  });
  