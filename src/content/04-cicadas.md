---
{
  "slug": "cicadas-primos",
  "order": 4,
  "title": "Cicadas periódicas y números primos: matemática de supervivencia",
  "short": "Cicadas y primos",
  "subtitle": "Por qué un insecto espera 13 o 17 años bajo tierra: la aritmética como arma evolutiva.",
  "zone": "epipelagica",
  "depthM": 80,
  "kicker": "Ecología evolutiva · Matemáticas",
  "summary": "Siete especies de Magicicada emergen a la vez, en cifras de millones, tras ciclos de 13 y 17 años. Los dos son números primos. ¿Casualidad?",
  "photos": [
    {"id": 27243753, "cap": "Una cigarra adulta sobre la corteza. Los adultos viven apenas semanas."},
    {"id": 31870877, "cap": "La exuvia: el «traje» vacío que deja la ninfa tras la última muda."},
    {"id": 36374083, "cap": "Las Magicicada emergen cuando el suelo alcanza unos 18 °C."},
    {"id": 39628872, "cap": "Millones de ninfas trepan a la vez a árboles y postes."},
    {"id": 15259702, "cap": "El coro de los machos puede superar los 90 decibelios."}
  ],
  "ficha": [
    ["Género", "Magicicada (Estados Unidos, este y centro)"],
    ["Especies", "7: tres de 17 años y cuatro de 13 años"],
    ["Ciclo subterráneo", "13 o 17 años, alimentándose de savia de raíces"],
    ["Densidad máxima", "hasta ≈ 1.5 millones por acre (≈ 3.7 millones por hectárea)"],
    ["Disparador", "suelo a ≈ 64 °F (≈ 18 °C) a 20 cm de profundidad"],
    ["Vida adulta", "unas 4–6 semanas"]
  ],
  "timeline": [
    {"y": "1634", "t": "Colonos de Plymouth dejan uno de los primeros registros escritos de una emergencia masiva de cigarras en Norteamérica."},
    {"y": "1898–1907", "t": "Charles Marlatt cataloga las «camadas» (broods) con números romanos."},
    {"y": "1988", "t": "Cox y Carlton proponen que los ciclos largos evitan la hibridación entre especies."},
    {"y": "1997", "t": "Yoshimura vincula el origen de los ciclos largos con las eras glaciales."},
    {"y": "2001", "t": "Goles, Schulz y Markus muestran que los primos emergen en modelos depredador-presa."},
    {"y": "2021", "t": "Emerge la Camada X, una de las más grandes, en el este de Estados Unidos."},
    {"y": "2024", "t": "Coinciden las camadas XIII (17 años) y XIX (13 años), algo que no ocurría desde 1803."}
  ],
  "table": {
    "caption": "¿Cada cuántos años coincide un depredador con la cigarra?",
    "head": ["Ciclo del depredador (años)", "Con cigarra de 12", "Con cigarra de 13", "Con cigarra de 17"],
    "rows": [
      ["2", "12", "26", "34"],
      ["3", "12", "39", "51"],
      ["4", "12", "52", "68"],
      ["5", "60", "65", "85"],
      ["6", "12", "78", "102"],
      ["7", "84", "91", "119"],
      ["8", "24", "104", "136"],
      ["9", "36", "117", "153"]
    ]
  },
  "quote": {
    "text": "Resumen fiel de la investigación de Goles, Schulz y Markus: en simulaciones donde los depredadores tienen ciclos variables, los periodos largos y primos de las presas se imponen porque minimizan los encuentros periódicos.",
    "who": "Goles, Schulz & Markus (2001), Complexity — Prime number selection of cycles in a predator-prey model",
    "url": "https://onlinelibrary.wiley.com/doi/10.1002/cplx.1018"
  },
  "sources": [
    {"t": "Encyclopaedia Britannica — Periodical cicada (Magicicada)", "u": "https://www.britannica.com/animal/periodical-cicada"},
    {"t": "Goles, Schulz & Markus (2001), Complexity — Prime number selection of cycles in a predator-prey model", "u": "https://onlinelibrary.wiley.com/doi/10.1002/cplx.1018"},
    {"t": "Yoshimura (1997), American Naturalist — The evolutionary origins of periodical cicadas during ice ages", "u": "https://www.journals.uchicago.edu/doi/10.1086/286166"},
    {"t": "Cooley Lab, University of Connecticut — Periodical cicadas", "u": "https://cicadas.uconn.edu/"},
    {"t": "U.S. National Park Service — Periodical cicadas", "u": "https://www.nps.gov/subjects/insects/periodical-cicadas.htm"}
  ]
}
---

## El despertar de millones

Una tarde de mayo, cuando el suelo del bosque alcanza los 18 °C a veinte centímetros de profundidad, algo se mueve bajo la hojarasca. Primero son unos pocos agujeros del tamaño de un dedo. Después, miles. Al anochecer, el suelo de un jardín del este de Estados Unidos puede contener hasta un millón y medio de ninfas por acre, trepando por troncos, vallas y farolas. Se quedan inmóviles, se agrietan por el dorso y de cada una emerge un insecto de ojos rojos y alas húmedas.

Han esperado 13 o 17 años. Durante todo ese tiempo, en la oscuridad del subsuelo, se alimentaron con la savia que circula por las raíces de los árboles. Ahora tienen unas cuatro a seis semanas para cantar, aparearse y morir. Son las **cigarras periódicas** del género *Magicicada*, y su calendario es uno de los fenómenos más extraños de la biología.

## Dos números primos

Existen siete especies de *Magicicada*: tres tienen ciclo de 17 años (*M. septendecim*, *M. cassini* y *M. septendecula*) y cuatro de 13 años (*M. tredecim*, *M. neotredecim*, *M. tredecassini* y *M. tredecula*). Dentro de cada especie, la población no emerge al azar, sino en grupos sincronizados llamados **camadas**, cada una asociada a una región y a un año concreto. El sistema clásico de numeración romana, creado por Charles Marlatt a finales del siglo XIX, identifica 30 camadas, de las cuales sobreviven unas quince.

Y los números 13 y 17 son primos: solo se dividen por 1 y por sí mismos. Esa coincidencia fascinó a los matemáticos. La hipótesis es que un ciclo primo hace que los depredadores y los competidores lo tengan muy difícil para sincronizarse con la cigarra.

{{img:1|float}}

## La aritmética del encuentro

Imagina un depredador con un ciclo de población de 2, 3, 4, 5 o hasta 9 años. Si la cigarra tuviera un ciclo de 12, coincidiría con todos esos depredadores cada 12 años (para ciclos 2, 3, 4 y 6), porque 12 tiene muchos divisores. Con un ciclo de 17, el mínimo común múltiplo con cualquier ciclo de 2 a 16 años es siempre un producto grande: 34, 51, 68…

{{table}}

La tabla muestra el efecto. Con un ciclo de 12, cuatro de los ocho depredadores de ejemplo coinciden cada 12 años. Con 13 o 17, el primer reencuentro regular se retrasa décadas. Cuanto menos frecuentes sean los reencuentros, menos puede un depredador especializarse en comerse a las cigarras, y cuanto más raros, menos amenazan.

## Saciar al depredador

La segunda mitad de la estrategia es la **saciedad del depredador**. Si solo emergieran unas pocas cigarras, aves, ardillas, mapaches y peces se las comerían todas. Pero con densidades de hasta 1.5 millones por acre, por más que coman, la mayoría sobrevive. Un pájaro hartó de cigarras no puede comer más. Es una estrategia de supervivencia por abundancia: lo que importa no es que cada individuo escape, sino que alguno lo haga.

Esa abundancia tiene un coste: las cigarras de camada tienen que emerger en el mismo año y esperar el momento. Las que emergen demasiado pronto o demasiado tarde, antes o después del grupo, son devoradas casi seguro. Por eso, la selección natural ha afinado la sincronización con una precisión asombrosa. Los modelos sugieren que un reloj interno les permite «contar» inviernos a través de los cambios estacionales en la savia de las raíces.

{{quote}}

## ¿Primos por necesidad o por accidente?

Aquí conviene ser honesto: la explicación por números primos es una hipótesis, no una certeza. Los modelos de Goles, Schulz y Markus mostraron que los primos surgen de forma natural en simulaciones donde la cigarra evoluciona frente a depredadores de ciclos variables. Pero otros investigadores ponen en duda que existan depredadores con ciclos tan regulares en la naturaleza.

Otra explicación importante es la de la **hibridación**. Si una cigarra de 13 años y otra de 17 años emergieran juntas con frecuencia, podrían cruzarse y dar lugar a híbridos con ciclos intermedios (de 14, 15 o 16 años) que llegarían fuera de sincronía con sus grupos y serían devorados. Con 13 y 17, los ciclos coinciden solo cada 221 años. Yoshimura sugirió en 1997 que los ciclos largos surgieron durante las glaciaciones, cuando los inviernos fríos retrasaron el desarrollo y los primos protegieron contra el cruce.

Probablemente ambas ideas son verdaderas en parte, y la selección fue el resultado de varias presiones al mismo tiempo. La naturaleza no elige una sola razón, y los números primos pudieron ser el punto de equilibrio entre ellas.

{{img:2}}

## Un coro de más de 90 decibelios

Cuando los machos emergen, cantan en grupo. El sonido, producido por membranas llamadas timbales, puede superar los 90 decibelios cerca del suelo, lo bastante intenso como para molestar a quienes viven bajo un árbol cubierto. Las hembras responden con chasquidos de alas; después ponen cientos de huevos, unos 400 a 600, en ranuras que cortan en ramas jóvenes.

Seis a diez semanas más tarde, los huevos eclosionan, las diminutas ninfas caen al suelo y excavan para encontrar raíces. Empieza una cuenta atrás que durará 13 o 17 años. Los adultos ya habrán muerto, y los restos de millones de cuerpos fertilizarán el suelo del bosque, una lluvia de nitrógeno que beneficiará a árboles y arroyos durante años.

## Cuando 2024 cruzó dos calendarios

En 2024, por primera vez desde 1803, coincidieron en emergencia dos camadas grandes: la XIII (17 años) y la XIX (13 años). Habitaban en zonas que solapaban en el Medio Oeste y el sureste de Estados Unidos. Los investigadores observaron con atención si se producía hibridación entre ellas; la próxima coincidencia está prevista para 2245. Es un recordatorio de que la matemática del suelo también tiene su propio calendario de eclipses.

{{timeline}}

:::bio Bioluminiscencia del dato
Un hongo parásito, *Massospora cicadina*, infecta a las cigarras adultas y reemplaza la parte trasera de su abdomen por una masa de esporas blanca. Los insectos zombificados siguen volando y apareándose, y contagian a otros. En 2019, un equipo identificó en esos hongos compuestos psicoactivos, como cathinona y psilocibina. La cigarra que parece ganar la lotería del tiempo sigue siendo, aun así, vulnerable a otro tipo de reloj.
:::

## Lo que enseña una cigarra

Hay una moraleja matemática y otra ecológica. La primera: los números primos no son un juego de aula, sino una herramienta que un insecto «descubrió» sin aritmética. La segunda: la vida adopta estrategias de largo plazo que no vemos porque los humanos medimos el tiempo en años y ellas lo miden en décadas.

También nos recuerda lo poco que sabemos de lo que ocurre bajo nuestros pies. Durante 17 años, bajo el césped de un jardín suburbano, hubo millones de seres esperando. Nadie los vio. Y un día, todos a la vez, salieron a la luz.

{{img:3}}
