/* Estud-IA — lógica compartida por index.html, capa.html y curso.html.
   Script clásico (sin módulos) para que también funcione desde file://. */

(function (global) {
  'use strict';

  /* Nombre visible de cada línea de formación. Las claves son los valores
     del campo "categoria" en cursos.json. Si aparece una categoría nueva
     que no esté aquí, se muestra igual usando la clave como etiqueta. */
  var LINEAS = {
    programacion:   'Programación',
    datos:          'Datos',
    nube:           'Nube',
    ciberseguridad: 'Ciberseguridad',
    ia:             'Inteligencia Artificial',
    marketing:      'Marketing'
  };

  var NIVELES = {
    basico:     'Básico',
    intermedio: 'Intermedio',
    avanzado:   'Avanzado'
  };

  /* Lo editorial de cada capa: el nombre oficial y de qué se trata.
     Las cifras (cursos, horas, modalidad) NO van aquí — salen del bloque
     "capas" de cursos.json, que el conversor deriva del propio Excel. */
  var CAPAS = {
    1: {
      nombre: 'Introducción digital',
      lema: 'El punto de entrada. Sin requisitos previos.',
      detalle: 'Dieciocho cursos de nivelación, uno por cada línea de ' +
               'formación en tres enfoques. Están pensados para quien ' +
               'nunca ha programado ni trabajado con datos.'
    },
    2: {
      nombre: 'Bootcamps de especialización',
      lema: 'Formación técnica por niveles, con inglés técnico incluido.',
      detalle: 'Dieciocho bootcamps híbridos en tres niveles —básico, ' +
               'intermedio y avanzado— que llevan al participante hasta un ' +
               'perfil junior empleable. Requieren el certificado de Capa 1 ' +
               'o conocimientos equivalentes.'
    }
  };

  /* ---- Carga de datos -------------------------------------------------
     Primero fetch('cursos.json'), que es lo que corre en Vercel. Si falla
     —el caso típico es abrir el HTML con file://, donde el navegador
     bloquea fetch por CORS— se cae al espejo cursos.js, que define
     window.__CURSOS__ con exactamente el mismo contenido.
  ------------------------------------------------------------------- */
  function cargarCursos() {
    return fetch('cursos.json')
      .then(function (r) {
        if (!r.ok) { throw new Error('HTTP ' + r.status); }
        return r.json();
      })
      .catch(function () { return cargarEspejo(); });
  }

  function cargarEspejo() {
    return new Promise(function (resolver, rechazar) {
      if (global.__CURSOS__) { return resolver(global.__CURSOS__); }
      var s = document.createElement('script');
      s.src = 'cursos.js';
      s.onload = function () {
        if (global.__CURSOS__) { resolver(global.__CURSOS__); }
        else { rechazar(new Error('cursos.js no definió los datos.')); }
      };
      s.onerror = function () {
        rechazar(new Error('No se encontró cursos.json ni cursos.js junto a esta página.'));
      };
      document.head.appendChild(s);
    });
  }

  /* ---- Utilidades ---- */

  // Todo texto que venga del JSON pasa por aquí antes de entrar al DOM.
  function esc(t) {
    return String(t == null ? '' : t)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function nombreLinea(cat) { return LINEAS[cat] || cat; }

  function nombreNivel(niv) { return niv ? (NIVELES[niv] || niv) : null; }

  function plural(n, uno, varios) {
    return n + ' ' + (n === 1 ? uno : varios);
  }

  // Orden estable: por línea (según LINEAS) y luego por posición.
  function ordenar(cursos) {
    var peso = Object.keys(LINEAS);
    return cursos.slice().sort(function (a, b) {
      var pa = peso.indexOf(a.categoria), pb = peso.indexOf(b.categoria);
      if (pa === -1) { pa = 99; }
      if (pb === -1) { pb = 99; }
      return pa - pb || (a.orden || 0) - (b.orden || 0);
    });
  }

  function datosCapa(doc, numero) {
    var lista = (doc && doc.capas) || [];
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].numero === numero) { return lista[i]; }
    }
    return null;
  }

  /* ---- Iconos ---- */

  var ICONOS = {
    reloj: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/>' +
           '<path d="M12 7.5v5l3.2 2" stroke-linecap="round"/></svg>',
    modulos: '<svg viewBox="0 0 24 24" aria-hidden="true">' +
             '<rect x="3.5" y="4.5" width="17" height="5" rx="1.5"/>' +
             '<rect x="3.5" y="14.5" width="17" height="5" rx="1.5"/></svg>',
    modalidad: '<svg viewBox="0 0 24 24" aria-hidden="true">' +
               '<rect x="2.8" y="4.5" width="18.4" height="12" rx="1.8"/>' +
               '<path d="M8.5 19.5h7" stroke-linecap="round"/></svg>',
    atras: '<svg viewBox="0 0 24 24" aria-hidden="true">' +
           '<path d="M14 6l-6 6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    flecha: '<svg class="flecha" viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M6 10l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  global.EstudIA = {
    LINEAS: LINEAS,
    NIVELES: NIVELES,
    CAPAS: CAPAS,
    ICONOS: ICONOS,
    cargarCursos: cargarCursos,
    esc: esc,
    nombreLinea: nombreLinea,
    nombreNivel: nombreNivel,
    plural: plural,
    ordenar: ordenar,
    datosCapa: datosCapa
  };

})(window);
