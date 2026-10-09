/**
 * WAOU! - BASE DE DATOS DE DEPARTAMENTOS Y MUNICIPIOS DE COLOMBIA
 * Selector dinámico con autocompletado y exclusión mutua de opciones de compra
 */

const COLOMBIA_LOCATIONS = {
  "Amazonas": [
    "Leticia", "Puerto Nariño", "El Encanto", "La Chorrera", "La Pedrera", "Mirití-Paraná", "Puerto Santander", "Tarapacá"
  ],
  "Antioquia": [
    "Medellín", "Abejorral", "Abriaquí", "Alejandría", "Amagá", "Amalfi", "Andes", "Angelópolis", "Angostura", "Anorí", 
    "Anzá", "Apartadó", "Arboletes", "Argelia", "Armenia Mantequilla", "Barbosa", "Bello", "Belmira", "Betania", "Betulia", 
    "Briceño", "Buriticá", "Cáceres", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracolí", "Caramanta", "Carepa", 
    "Carolina del Príncipe", "Caucasia", "Chigorodó", "Cisneros", "Ciudad Bolívar", "Cocorná", "Concepción", "Concordia", 
    "Copacabana", "Dabeiba", "Donmatías", "Ebéjico", "El Bagre", "El Carmen de Viboral", "El Peñol", "El Retiro", 
    "El Santuario", "Entrerríos", "Envigado", "Fredonia", "Frontino", "Giraldo", "Girardota", "Gómez Plata", "Granada", 
    "Guadalupe", "Guarne", "Guatapé", "Heliconia", "Hispania", "Itagüí", "Ituango", "Jardín", "Jericó", "La Ceja", 
    "La Estrella", "La Pintada", "La Unión", "Liborina", "Maceo", "Marinilla", "Montebello", "Murindó", "Mutatá", 
    "Nariño", "Nechí", "Necoclí", "Olaya", "Peque", "Pueblorrico", "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", 
    "Remedios", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar", "San Andrés de Cuerquia", "San Carlos", "San Francisco", 
    "San Jerónimo", "San José de la Montaña", "San Juan de Urabá", "San Luis", "San Pedro de los Milagros", "San Pedro de Urabá", 
    "San Rafael", "San Roque", "San Vicente Ferrer", "Santa Bárbara", "Santa Fe de Antioquia", "Santa Rosa de Osos", 
    "Santo Domingo", "Segovia", "Sonsón", "Sopetrán", "Támesis", "Tarazá", "Tarso", "Titiribí", "Toledo", "Turbo", 
    "Uramita", "Urrao", "Valdivia", "Valparaíso", "Vegachí", "Venecia", "Vigía del Fuerte", "Yalí", "Yarumal", "Yolombó", 
    "Yondó", "Zaragoza"
  ],
  "Arauca": [
    "Arauca", "Arauquita", "Cravo Norte", "Fortul", "Puerto Rondón", "Saravena", "Tame"
  ],
  "Atlántico": [
    "Barranquilla", "Baranoa", "Campo de la Cruz", "Candelaria", "Galapa", "Juan de Acosta", "Luruaco", "Malambo", 
    "Manatí", "Palmar de Varela", "Piojó", "Polonuevo", "Ponedera", "Puerto Colombia", "Repelón", "Sabanagrande", 
    "Sabanalarga", "Santa Lucía", "Santo Tomás", "Soledad", "Suan", "Tubará", "Usiacurí"
  ],
  "Bogotá D.C.": [
    "Bogotá D.C."
  ],
  "Bolívar": [
    "Cartagena", "Achí", "Altos del Rosario", "Arenal", "Arjona", "Arroyohondo", "Barranco de Loba", "Calamar", 
    "Cantagallo", "Cicuco", "Clemencia", "Córdoba", "El Carmen de Bolívar", "El Guamo", "El Peñón", "Hatillo de Loba", 
    "Magangué", "Mahates", "Margarita", "María La Baja", "Montecristo", "Mompox", "Morales", "Norosí", "Pinillos", 
    "Regidor", "Río Viejo", "San Cristóbal", "San Estanislao", "San Fernando", "San Jacinto", "San Jacinto del Cauca", 
    "San Juan Nepomuceno", "San Martín de Loba", "San Pablo", "Santa Catalina", "Santa Rosa", "Santa Rosa del Sur", 
    "Simití", "Soplaviento", "Talaigua Nuevo", "Tiquisio", "Turbaco", "Turbaná", "Villanueva", "Zambrano"
  ],
  "Boyacá": [
    "Tunja", "Almeida", "Aquitania", "Arcabuco", "Belén", "Berbeo", "Betéitiva", "Boavita", "Boyacá", "Briceño", 
    "Buenavista", "Busbanzá", "Caldas", "Campohermoso", "Cerinza", "Chinavita", "Chiquinquirá", "Chiscas", "Chita", 
    "Chitaraque", "Chivatá", "Chivor", "Ciénega", "Cómbita", "Coper", "Corrales", "Covirachía", "Cubará", "Cucaita", 
    "Cuítiva", "Duitama", "El Cocuy", "El Espino", "Firavitoba", "Floresta", "Gachantivá", "Gámeza", "Garagoa", 
    "Guacamayas", "Guateque", "Guayatá", "Güicán", "Iza", "Jenesano", "Jericó", "La Capilla", "La Uvita", "La Victoria", 
    "Labranzagrande", "Macanal", "Maripí", "Miraflores", "Mongua", "Monguí", "Moniquirá", "Motavita", "Muzo", "Nobsa", 
    "Nuevo Colón", "Oicatá", "Otanche", "Pachavita", "Páez", "Paipa", "Pajarito", "Panqueba", "Pauna", "Paya", 
    "Paz de Río", "Pesca", "Pisba", "Puerto Boyacá", "Quípama", "Ramiriquí", "Ráquira", "Saboyá", "Sáchica", "Samacá", 
    "San Eduardo", "San José de Pare", "San Luis de Gaceno", "San Mateo", "San Miguel de Sema", "San Pablo de Borbur", 
    "Santa María", "Santa Rosa de Viterbo", "Santa Sofía", "Santana", "Sativanorte", "Sativasur", "Siachoque", "Soatá", 
    "Socha", "Socotá", "Sogamoso", "Somondoco", "Sora", "Soracá", "Sotaquirá", "Susacón", "Sutamarchán", "Sutatenza", 
    "Tasco", "Tenza", "Tibaná", "Tibasosa", "Tinjacá", "Tipacoque", "Toca", "Togüí", "Tópaga", "Tota", "Tununguá", 
    "Turmequé", "Tuta", "Tutazá", "Úmbita", "Ventaquemada", "Villa de Leyva", "Viracachá", "Zetaquira"
  ],
  "Caldas": [
    "Manizales", "Aguadas", "Anserma", "Aranzazu", "Belalcázar", "Chinchiná", "Filadelfia", "La Dorada", "La Merced", 
    "Manzanares", "Marmato", "Marquetalia", "Marulanda", "Neira", "Norcasia", "Pácora", "Palestina", "Pensilvania", 
    "Riosucio", "Risaralda", "Salamina", "Samaná", "San José", "Supía", "Victoria", "Villamaría", "Viterbo"
  ],
  "Caquetá": [
    "Florencia", "Albania", "Belén de los Andaquíes", "Cartagena del Chairá", "Curillo", "El Doncello", "El Paujil", 
    "La Montañita", "Milán", "Morelia", "Puerto Rico", "San José del Fragua", "San Vicente del Caguán", "Solano", 
    "Solita", "Valparaíso"
  ],
  "Casanare": [
    "Yopal", "Aguazul", "Chámeza", "Hato Corozal", "La Salina", "Maní", "Monterrey", "Nunchía", "Orocué", "Paz de Ariporo", 
    "Pore", "Recetor", "Sabanalarga", "Sácama", "San Luis de Palenque", "Támara", "Tauramena", "Trinidad", "Villanueva"
  ],
  "Cauca": [
    "Popayán", "Almaguer", "Argelia", "Balboa", "Bolívar", "Buenos Aires", "Cajibío", "Caldono", "Caloto", "Corinto", 
    "El Tambo", "Florencia", "Guachené", "Guapí", "Inzá", "Jambaló", "La Sierra", "La Vega", "López de Micay", 
    "Mercaderes", "Miranda", "Morales", "Padilla", "Páez (Belalcázar)", "Patía (El Bordo)", "Piamonte", "Piendamó", 
    "Puerto Tejada", "Puracé", "Rosas", "San Sebastián", "Santander de Quilichao", "Santa Rosa", "Silvia", "Sotará", 
    "Suárez", "Sucre", "Timbío", "Timbiquí", "Toribío", "Totoró", "Villa Rica"
  ],
  "Cesar": [
    "Valledupar", "Aguachica", "Agustín Codazzi", "Astrea", "Becerril", "Bosconia", "Chimichagua", "Chiriguaná", 
    "Curumaní", "El Copey", "El Paso", "Gamarra", "González", "La Gloria", "La Jagua de Ibirico", "La Paz", "Manaure", 
    "Pailitas", "Pelaya", "Pueblo Bello", "Río de Oro", "San Alberto", "San Diego", "San Martín", "Tamalameque"
  ],
  "Chocó": [
    "Quibdó", "Acandí", "Alto Baudó", "Atrato", "Bagadó", "Bahía Solano", "Bajo Baudó", "Bojayá", "Cértegui", "Condoto", 
    "El Cantón de San Pablo", "El Carmen de Atrato", "El Carmen del Darién", "Istmina", "Juradó", "Litoral del San Juan", 
    "Lloró", "Medio Atrato", "Medio Baudó", "Medio San Juan", "Nóvita", "Nuquí", "Río Iró", "Río Quito", "Riosucio", 
    "San José del Palmar", "Sipí", "Tadó", "Unguía", "Unión Panamericana"
  ],
  "Córdoba": [
    "Montería", "Ayapel", "Buenavista", "Canalete", "Cereté", "Chimá", "Chinú", "Ciénaga de Oro", "Cotorra", 
    "La Apartada", "Lorica", "Los Córdobas", "Momil", "Montelíbano", "Moñitos", "Planeta Rica", "Pueblo Nuevo", 
    "Puerto Escondido", "Puerto Libertador", "Purísima", "Sahagún", "San Andrés de Sotavento", "San Antero", 
    "San Bernardo del Viento", "San Carlos", "San José de Uré", "San Pelayo", "Tierralta", "Tuchín", "Valencia"
  ],
  "Cundinamarca": [
    "Agua de Dios", "Albán", "Anapoima", "Anolaima", "Apulo", "Arbeláez", "Beltrán", "Bituima", "Bojacá", "Cabrera", 
    "Cachipay", "Cajicá", "Caparrapí", "Cáqueza", "Carmen de Carupa", "Chaguaní", "Chía", "Chipaque", "Choachí", 
    "Chocontá", "Cogua", "Cota", "Cucunubá", "El Colegio", "El Peñón", "El Rosal", "Facatativá", "Fómeque", "Fosca", 
    "Funza", "Fúquene", "Fusagasugá", "Gachalá", "Gachancipá", "Gachetá", "Gama", "Girardot", "Granada", "Guachetá", 
    "Guaduas", "Guasca", "Guataquí", "Guatavita", "Guayabal de Síquima", "Guayabetal", "Gutiérrez", "Jerusalén", 
    "Junín", "La Calera", "La Mesa", "La Palma", "La Peña", "La Vega", "Lenguazaque", "Machetá", "Madrid", "Manta", 
    "Medina", "Mosquera", "Nariño", "Nemocón", "Nilo", "Nimaima", "Nocaima", "Pacho", "Paime", "Pandi", "Paratebueno", 
    "Pasca", "Puerto Salgar", "Pulí", "Quebradanegra", "Quetame", "Quipile", "Ricaurte", "San Antonio del Tequendama", 
    "San Bernardo", "San Cayetano", "San Francisco", "San Juan de Rioseco", "Sasaima", "Sesquilé", "Sibaté", "Silvania", 
    "Simijaca", "Soacha", "Sopó", "Subachoque", "Suesca", "Supatá", "Susa", "Sutatausa", "Tabio", "Tausa", "Tena", 
    "Tenjo", "Tibacuy", "Tibirita", "Tocaima", "Tocancipá", "Topaipí", "Ubalá", "Ubaque", "Ubaté", "Une", "Útica", 
    "Venecia", "Vergara", "Vianí", "Villagómez", "Villapinzón", "Villeta", "Viotá", "Yacopí", "Zipacón", "Zipaquirá"
  ],
  "Guainía": [
    "Inírida", "Barranco Minas", "Mapiripana", "San Felipe", "Puerto Colombia", "La Guadalupe", "Cacahual", "Pana Pana", "Morichal"
  ],
  "Guaviare": [
    "San José del Guaviare", "Calamar", "El Retorno", "Miraflores"
  ],
  "Huila": [
    "Neiva", "Acevedo", "Agrado", "Aipe", "Algeciras", "Altamira", "Baraya", "Campoalegre", "Colombia", "Elías", 
    "Garzón", "Gigante", "Guadalupe", "Hobo", "Íquira", "Isnos", "La Argentina", "La Plata", "Nátaga", "Oporapa", 
    "Paicol", "Palermo", "Palestina", "Pital", "Pitalito", "Rivera", "Saladoblanco", "San Agustín", "Santa María", 
    "Suaza", "Tarqui", "Tello", "Teruel", "Tesalia", "Timaná", "Villavieja", "Yaguará"
  ],
  "La Guajira": [
    "Riohacha", "Albania", "Barrancas", "Dibulla", "Distracción", "El Molino", "Fonseca", "Hatonuevo", "La Jagua del Pilar", 
    "Maicao", "Manaure", "San Juan del Cesar", "Uribia", "Urumita", "Villanueva"
  ],
  "Magdalena": [
    "Santa Marta", "Algarrobo", "Aracataca", "Ariguaní (El Difícil)", "Cerro de San Antonio", "Chibolo", "Ciénaga", 
    "Concordia", "El Banco", "El Piñón", "El Retén", "Fundación", "Guamal", "Nueva Granada", "Pedraza", "Pijiño del Carmen", 
    "Pivijay", "Plato", "Puebloviejo", "Remolino", "Sabanas de San Ángel", "Salamina", "San Sebastián de Buenavista", 
    "San Zenón", "Santa Ana", "Santa Bárbara de Pinto", "Sitionuevo", "Tenerife", "Zapayán", "Zona Bananera"
  ],
  "Meta": [
    "Villavicencio", "Acacías", "Barranca de Upía", "Cabuyaro", "Castilla la Nueva", "Cubarral", "Cumaral", "El Calvario", 
    "El Castillo", "El Dorado", "Fuente de Oro", "Granada", "Guamal", "La Macarena", "Lejanías", "Mapiripán", "Mesetas", 
    "Puerto Concordia", "Puerto Gaitán", "Puerto Lleras", "Puerto López", "Puerto Rico", "Restrepo", "San Carlos de Guaroa", 
    "San Juan de Arama", "San Juanito", "San Martín", "Uribe", "Vista Hermosa"
  ],
  "Nariño": [
    "Pasto", "Albán (San José)", "Aldana", "Ancuyá", "Arboleda (Berruecos)", "Barbacoas", "Belén", "Buesaco", "Chachagüí", 
    "Colón (Génova)", "Consacá", "Contadero", "Córdoba", "Cuaspud (Carlosama)", "Cumbal", "Cumbitara", "El Charco", 
    "El Peñol", "El Rosario", "El Tablón de Gómez", "El Tambo", "Francisco Pizarro", "Funes", "Guachucal", "Guaitarilla", 
    "Gualmatán", "Iles", "Imúes", "Ipiales", "La Cruz", "La Florida", "La Llanada", "La Tola", "La Unión", "Leiva", 
    "Linares", "Los Andes (Sotomayor)", "Magüí (Payán)", "Mallama (Piedrancha)", "Mosquera", "Nariño", "Olaya Herrera", 
    "Ospina", "Policarpa", "Potosí", "Providencia", "Puerres", "Pupiales", "Ricaurte", "Roberto Payán", "Samaniego", 
    "San Bernardo", "San Lorenzo", "San Pablo", "San Pedro de Cartago", "Sandoná", "Santa Bárbara (Iscuandé)", 
    "Santacruz (Guachavés)", "Sapuyes", "Taminango", "Tangua", "Tumaco", "Túquerres", "Yacuanquer"
  ],
  "Norte de Santander": [
    "Cúcuta", "Ábrego", "Arboledas", "Bochalema", "Bucarasica", "Cáchira", "Cácota", "Chinácota", "Chitagá", "Convención", 
    "Cucutilla", "Durania", "El Carmen", "El Tarra", "El Zulia", "Gramalote", "Hacarí", "Herrán", "La Esperanza", 
    "La Playa", "Labateca", "Los Patios", "Lourdes", "Mutiscua", "Ocaña", "Pamplona", "Pamplonita", "Puerto Santander", 
    "Ragonvalia", "Salazar", "San Calixto", "San Cayetano", "Santiago", "Sardinata", "Silos", "Teorama", "Tibú", 
    "Toledo", "Villa Caro", "Villa del Rosario"
  ],
  "Putumayo": [
    "Mocoa", "Colón", "Orito", "Puerto Asís", "Puerto Caicedo", "Puerto Guzmán", "Puerto Leguízamo", "San Francisco", 
    "San Miguel (La Dorada)", "Santiago", "Sibundoy", "Valle del Guamuez (La Hormiga)", "Villagarzón"
  ],
  "Quindío": [
    "Armenia", "Buenavista", "Calarcá", "Circasia", "Córdoba", "Filandia", "Génova", "La Tebaida", "Montenegro", 
    "Pijao", "Quimbaya", "Salento"
  ],
  "Risaralda": [
    "Pereira", "Apía", "Balboa", "Belén de Umbría", "Dosquebradas", "Guática", "La Celia", "La Virginia", "Marsella", 
    "Mistrató", "Pueblo Rico", "Quinchía", "Santa Rosa de Cabal", "Santuario"
  ],
  "San Andrés y Providencia": [
    "San Andrés", "Providencia"
  ],
  "Santander": [
    "Bucaramanga", "Aguada", "Albania", "Aratoca", "Barbosa", "Barichara", "Barrancabermeja", "Betulia", "Bolívar", 
    "Cabrera", "California", "Capitanejo", "Carcasí", "Cepitá", "Cerrito", "Charalá", "Charta", "Chima", "Chipatá", 
    "Cimitarra", "Concepción", "Confines", "Contratación", "Coromoro", "Curití", "El Carmen de Chucurí", "El Guacamayo", 
    "El Peñón", "El Playón", "Encino", "Enciso", "Florián", "Floridablanca", "Galán", "Gámbita", "Girón", "Guaca", 
    "Guadalupe", "Guapotá", "Guavatá", "Güepsa", "Hato", "Jesús María", "Jordán", "La Belleza", "La Paz", "Landázuri", 
    "Lebrija", "Los Santos", "Macaravita", "Málaga", "Matanza", "Mogotes", "Molagavita", "Ocamonte", "Oiba", "Onzaga", 
    "Palmar", "Palmas del Socorro", "Páramo", "Piedecuesta", "Pinchote", "Puente Nacional", "Puerto Parra", "Puerto Wilches", 
    "Rionegro", "Sabana de Torres", "San Andrés", "San Benito", "San Gil", "San Joaquín", "San José de Miranda", 
    "San Miguel", "San Vicente de Chucurí", "Santa Bárbara", "Santa Helena del Opón", "Simacota", "Socorro", "Suaita", 
    "Sucre", "Suratá", "Tona", "Valle de San José", "Vélez", "Vetas", "Villanueva", "Zapatoca"
  ],
  "Sucre": [
    "Sincelejo", "Buenavista", "Caimito", "Chalán", "Colosó", "Corozal", "Coveñas", "El Roble", "Galeras", "Guaranda", 
    "La Unión", "Los Palmitos", "Majagual", "Morroa", "Ovejas", "Palmito", "Sampués", "San Benito Abad", "San Juan de Betulia", 
    "San Marcos", "San Onofre", "San Pedro", "Sincé", "Sucre", "Tolú", "Toluviejo"
  ],
  "Tolima": [
    "Ibagué", "Alpujarra", "Alvarado", "Ambalema", "Anzoátegui", "Armero Guayabal", "Ataco", "Cajamarca", "Carmen de Apicalá", 
    "Casabianca", "Chaparral", "Coello", "Coyaima", "Cunday", "Dolores", "Espinal", "Falan", "Flandes", "Fresno", 
    "Guamo", "Herveo", "Honda", "Icononzo", "Lérida", "Líbano", "Mariquita", "Melgar", "Murillo", "Natagaima", 
    "Ortega", "Palocabildo", "Piedras", "Planadas", "Prado", "Purificación", "Rioblanco", "Roncesvalles", "Rovira", 
    "Saldaña", "San Antonio", "San Luis", "Santa Isabel", "Suárez", "Valle de San Juan", "Venadillo", "Villahermosa", "Villarrica"
  ],
  "Valle del Cauca": [
    "Cali", "Alcalá", "Andalucía", "Ansermanuevo", "Argelia", "Bolívar", "Buenaventura", "Buga (Guadalajara de Buga)", 
    "Bugalagrande", "Caicedonia", "Calima (El Darién)", "Candelaria", "Cartago", "Dagua", "El Águila", "El Cairo", 
    "El Cerrito", "El Dovio", "Florida", "Ginebra", "Guacarí", "Jamundí", "La Cumbre", "La Unión", "La Victoria", 
    "Obando", "Palmira", "Pradera", "Restrepo", "Riofrío", "Roldanillo", "San Pedro", "Sevilla", "Toro", "Trujillo", 
    "Tuluá", "Ulloa", "Versalles", "Vijes", "Yotoco", "Yumbo", "Zarzal"
  ],
  "Vaupés": [
    "Mitú", "Carurú", "Pacoa", "Taraira", "Papunahua", "Yavaraté"
  ],
  "Vichada": [
    "Puerto Carreño", "Cumaribo", "La Primavera", "Santa Rosalía"
  ]
};

/**
 * Normaliza un texto para búsqueda (minúsculas y sin tildes)
 */
function normalizeLocationString(str) {
  if (!str) return "";
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

/**
 * Inicializa los datalists y eventos para el selector de Departamento y Ciudad/Municipio
 */
function initColombiaLocationSelectors() {
  const deptInput = document.getElementById("shipDepartment");
  const cityInput = document.getElementById("shipCity");
  const deptDatalist = document.getElementById("departmentsList");
  const cityDatalist = document.getElementById("citiesList");

  if (!deptInput || !cityInput || !deptDatalist || !cityDatalist) return;

  // Cargar lista de departamentos ordenada alfabéticamente
  const departments = Object.keys(COLOMBIA_LOCATIONS).sort((a, b) => a.localeCompare(b, "es"));
  deptDatalist.innerHTML = departments.map(d => `<option value="${d}"></option>`).join("");

  function updateCitiesForDepartment() {
    const rawVal = deptInput.value.trim();
    if (!rawVal) {
      cityDatalist.innerHTML = "";
      return;
    }

    const normVal = normalizeLocationString(rawVal);
    const matchedDept = Object.keys(COLOMBIA_LOCATIONS).find(key => 
      normalizeLocationString(key) === normVal
    );

    if (matchedDept && COLOMBIA_LOCATIONS[matchedDept]) {
      const cities = COLOMBIA_LOCATIONS[matchedDept];
      cityDatalist.innerHTML = cities.map(c => `<option value="${c}"></option>`).join("");
      
      // Si la ciudad actual no pertenece al nuevo departamento, avisar sutilmente
      if (cityInput.value) {
        const normCity = normalizeLocationString(cityInput.value);
        const cityBelongs = cities.some(c => normalizeLocationString(c) === normCity);
        if (!cityBelongs) {
          cityInput.value = "";
        }
      }
    } else {
      cityDatalist.innerHTML = "";
    }
  }

  deptInput.addEventListener("input", updateCitiesForDepartment);
  deptInput.addEventListener("change", updateCitiesForDepartment);
}

/**
 * Control de opciones de pedido: '¿Es un regalo?' y 'Pago en casa'
 * Garantiza que sean excluyentes (no se pueden seleccionar ambas a la vez)
 */
function initCheckoutOptionsMutualExclusion() {
  const isGiftInput = document.getElementById("shipIsGift");
  const payOnDeliveryInput = document.getElementById("shipPayOnDelivery");

  if (isGiftInput && payOnDeliveryInput) {
    isGiftInput.addEventListener("change", () => {
      if (isGiftInput.checked) {
        payOnDeliveryInput.checked = false;
        payOnDeliveryInput.closest(".checkout-option-card")?.classList.remove("selected");
      }
      isGiftInput.closest(".checkout-option-card")?.classList.toggle("selected", isGiftInput.checked);
    });

    payOnDeliveryInput.addEventListener("change", () => {
      if (payOnDeliveryInput.checked) {
        isGiftInput.checked = false;
        isGiftInput.closest(".checkout-option-card")?.classList.remove("selected");
      }
      payOnDeliveryInput.closest(".checkout-option-card")?.classList.toggle("selected", payOnDeliveryInput.checked);
    });
  }
}

// Auto-inicialización al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  initColombiaLocationSelectors();
  initCheckoutOptionsMutualExclusion();
});
