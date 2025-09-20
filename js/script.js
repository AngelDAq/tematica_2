// Menú hamburguesa funcionalidad
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}));

// Efecto parallax para la sección hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElement = document.querySelector('.hero');
    const rate = scrolled * 0.5;
    
    parallaxElement.style.backgroundPosition = `center ${-rate}px`;
});

// Smooth scroll para enlaces de anclaje
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Ajuste para el menú fijo
                behavior: 'smooth'
            });
        }
    });
});

// Manejo de imágenes faltantes
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.onerror = function() {
            // Si una imagen no se carga, mostrar una imagen alternativa o placeholder
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
            this.alt = 'Imagen no disponible';
        };
    });
    
    console.log('Página cargada correctamente');
});





// Validación de formulario simple juego interactivo

 

function normalizeText(str) {
  if (!str) return '';
  return str
    .normalize('NFD')                  // separa acentos
    .replace(/[\u0300-\u036f]/g, '')   // quita diacríticos
    .toLowerCase()
    .trim();
}

/* ---------- IMAGEN PLACEHOLDER si falla la carga ---------- */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('img').forEach(img => {
    img.onerror = function() {
      this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2UgTm8gQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==';
      this.alt = 'Imagen no disponible';
    };
  });
});

/* ---------- Evaluar UNA carta (botón en la carta) ---------- */
function evaluarCard(btn) {
  const card = btn.closest('.card');
  const inputEl = card.querySelector('.respuesta');
  const user = normalizeText(inputEl.value);
  // acepta varias respuestas separadas por '|'
  const answersRaw = card.dataset.answers || card.dataset.field || '';
  const answersArr = answersRaw.split('|').map(a => normalizeText(a));

  if (answersArr.includes(user) && user !== '') {
    // correcto: mostrar modal con imagen + principio + descripcion
    const titulo = '¡Correcto!';
    const principio = card.dataset.principio || '';
    const desc = card.dataset.desc || '';
    const imgSrc = card.querySelector('img') ? card.querySelector('img').src : '';
    const bodyHtml = `
      ${ imgSrc ? `<img src="${imgSrc}" alt="" />` : '' }
      <p><strong>Principio aplicado:</strong> ${principio}</p>
      <p>${desc}</p>
    `;
    marcarInput(inputEl, true);
    mostrarModal(titulo, bodyHtml);
  } else {
    marcarInput(inputEl, false);
    mostrarModal('Inténtalo de nuevo', '<p>Respuesta incorrecta. Revisa y vuelve a intentarlo.</p>');
  }
}

/* pinta el borde del input */
function marcarInput(inputEl, correcto) {
  inputEl.classList.remove('correct', 'wrong');
  if (correcto) inputEl.classList.add('correct');
  else inputEl.classList.add('wrong');
}

/* ---------- Evaluar TODAS las cartas (botón global) ---------- */
function evaluarRespuestas() {
  const cards = Array.from(document.querySelectorAll('.card'));
  const fallos = [];
  const aciertos = [];

  cards.forEach((card, index) => {
    const inputEl = card.querySelector('.respuesta');
    const user = normalizeText(inputEl.value);
    const answersArr = (card.dataset.answers || card.dataset.field || '').split('|').map(a => normalizeText(a));

    if (answersArr.includes(user) && user !== '') {
      aciertos.push(index + 1);
      marcarInput(inputEl, true);
    } else {
      fallos.push(index + 1);
      marcarInput(inputEl, false);
    }
  });

  if (fallos.length === 0) {
    // todas correctas -> mostrar principios resumidos
    const detalles = cards.map(card => `<li><strong>${card.dataset.field}</strong>: ${card.dataset.principio}</li>`).join('');
    mostrarModal('🎉 ¡Felicidades! Todas son correctas', `<p>Has acertado todas las cartas. Principios aplicados:</p><ul>${detalles}</ul>`);
  } else {
    mostrarModal('Inténtalo de nuevo', `<p>Fallaste en las cartas: ${fallos.join(', ')}</p>`);
  }
}

/* ---------- Modal ---------- */
function mostrarModal(titulo, htmlContenido) {
  const m = document.getElementById('modal');
  document.getElementById('modal-title').textContent = titulo;
  document.getElementById('modal-body').innerHTML = htmlContenido;
  m.classList.add('open');
  // foco para accesibilidad
  setTimeout(() => document.querySelector('.modal-content').focus(), 150);
}

function cerrarModal() {
  const m = document.getElementById('modal');
  m.classList.remove('open');
}

/* Cerrar si se presiona ESC */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarModal();
});








/* parte principal */
