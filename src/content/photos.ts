// Registro de fotografías reales (Pexels, licencia libre con atribución recomendada).
// Todas las URLs se componen a partir del id; los créditos se muestran bajo cada imagen.
// Son imágenes ILUSTRATIVAS del tema (no documentos oficiales de los objetos descritos).

export interface Photo {
  id: number;
  ext: "jpeg" | "png";
  by: string; // nombre del fotógrafo
  byUrl: string; // perfil del fotógrafo en Pexels
  alt: string; // texto alternativo en español
}

const P = (id: number, ext: "jpeg" | "png", by: string, byUrl: string, alt: string): Photo => ({
  id,
  ext,
  by,
  byUrl,
  alt,
});

export const PHOTOS: Record<number, Photo> = {
  // — Bioluminiscencia
  7868426: P(7868426, "jpeg", "Sergiu Iacob", "https://www.pexels.com/@sergiu-iacob-10475786", "Medusa translúcida y luminosa flotando sobre fondo oscuro"),
  11492503: P(11492503, "png", "John Mauren", "https://www.pexels.com/@john-mauren-149064225", "Primer plano de una medusa brillante con tentáculos de colores"),
  11536248: P(11536248, "jpeg", "wasa wasa", "https://www.pexels.com/@wasa-wasa-1327711", "Medusa iluminada en púrpura sobre un fondo azul profundo"),
  37088235: P(37088235, "jpeg", "Philipp Kappler", "https://www.pexels.com/@philipp-kappler-2159052501", "Medusa luminiscente con tentáculos elegantes en agua azul"),
  4710408: P(4710408, "jpeg", "Lars Mai", "https://www.pexels.com/@larsmai", "Medusa azul iluminada en un entorno submarino oscuro"),
  // — Anticitera
  3785932: P(3785932, "jpeg", "Miguel Á. Padriñán", "https://www.pexels.com/@padrinan", "Engranajes dorados sobre fondo negro"),
  3785934: P(3785934, "jpeg", "Miguel Á. Padriñán", "https://www.pexels.com/@padrinan", "Detalle de engranajes metálicos sobre superficie oscura"),
  10583683: P(10583683, "jpeg", "SimplyArt4794", "https://www.pexels.com/@simplyart4794-53798833", "Mecanismo de reloj con engranajes a la vista"),
  3785929: P(3785929, "jpeg", "Miguel Á. Padriñán", "https://www.pexels.com/@padrinan", "Composición artística de ruedas dentadas doradas"),
  17875663: P(17875663, "jpeg", "沖縄ダイビングスクール ワールドダイビング", "https://www.pexels.com/@669211903", "Un naufragio hundido bajo el mar"),
  17795203: P(17795203, "jpeg", "沖縄ダイビングスクール ワールドダイビング", "https://www.pexels.com/@669211903", "Restos de un barco hundido sobre el lecho marino"),
  // — Voynich
  39321045: P(39321045, "jpeg", "Drago Rapovac", "https://www.pexels.com/@drago-rapovac-167144988", "Manuscrito antiguo con escritura elaborada y color"),
  29342494: P(29342494, "jpeg", "mohamed abdelghaffar", "https://www.pexels.com/@moh-adbelghaffar", "Manuscrito iluminado antiguo en primer plano"),
  4102579: P(4102579, "jpeg", "Ann H", "https://www.pexels.com/@ann-h-45017", "Libro abierto con texto antiguo e iniciales decoradas"),
  18491910: P(18491910, "jpeg", "Adam Noor", "https://www.pexels.com/@adam-noor-3249667", "Páginas antiguas con caligrafía manuscrita"),
  29342503: P(29342503, "jpeg", "mohamed abdelghaffar", "https://www.pexels.com/@moh-adbelghaffar", "Caligrafía antigua con elementos decorativos"),
  // — Cicadas
  27243753: P(27243753, "jpeg", "Suki Lee", "https://www.pexels.com/@suki-lee-110686949", "Cigarra posada sobre la corteza de un árbol"),
  31870877: P(31870877, "jpeg", "Fatih KÖRKÜ", "https://www.pexels.com/@fthkrk", "Exuvia de cigarra sobre corteza en un bosque"),
  36374083: P(36374083, "jpeg", "Mark Heyne", "https://www.pexels.com/@mark-heyne-2159671371", "Cigarra sobre la corteza de un árbol"),
  39628872: P(39628872, "jpeg", "Rafael Rodrigues", "https://www.pexels.com/@rrodriguesim", "Exoesqueleto de cigarra adherido a un tronco"),
  15259702: P(15259702, "jpeg", "Fatih KÖRKÜ", "https://www.pexels.com/@fthkrk", "Macro de una cigarra en una rama"),
  // — Voyager
  14318594: P(14318594, "jpeg", "Arturo A", "https://www.pexels.com/@arturoaez225", "Disco de vinilo clásico en primer plano"),
  3391926: P(3391926, "jpeg", "Miguel Á. Padriñán", "https://www.pexels.com/@padrinan", "Surcos de un disco de vinilo en blanco y negro"),
  5764288: P(5764288, "jpeg", "Miguel Á. Padriñán", "https://www.pexels.com/@padrinan", "Disco de vinilo girando en un tocadiscos"),
  11858855: P(11858855, "jpeg", "Koma Tang", "https://www.pexels.com/@koma-tang-10472205", "La Vía Láctea sobre un cielo nocturno estrellado"),
  26627949: P(26627949, "jpeg", "Francesco Ungaro", "https://www.pexels.com/@francesco-ungaro", "La galaxia Vía Láctea en una noche despejada"),
  // — Micelio
  28846649: P(28846649, "jpeg", "Vladimir Srajber", "https://www.pexels.com/@vladimirsrajber", "Racimo de hongos silvestres sobre un tocón"),
  35986879: P(35986879, "jpeg", "SweeMing YOUNG", "https://www.pexels.com/@sweeming-young-418924930", "Hongo blanco sobre madera en descomposición"),
  28964665: P(28964665, "jpeg", "Wijs (Wise)", "https://www.pexels.com/@wijs-wise-136435282", "Hongos creciendo en el suelo de un bosque con luz moteada"),
  34465881: P(34465881, "jpeg", "Vladimir Srajber", "https://www.pexels.com/@vladimirsrajber", "Variedad de hongos entre musgo y hojarasca"),
  33307083: P(33307083, "jpeg", "Сергей ЮССтудия", "https://www.pexels.com/@1317355004", "Hongos delicados en un bosque frondoso"),
  // — Auroras
  28237726: P(28237726, "jpeg", "Oliver Schröder", "https://www.pexels.com/@olivers", "Aurora boreal sobre Karasjok, Noruega"),
  28920480: P(28920480, "jpeg", "Aedrian Salazar", "https://www.pexels.com/@aedrian", "Aurora vibrante en un cielo oscuro"),
  13538473: P(13538473, "jpeg", "Sydney Haws", "https://www.pexels.com/@sydney-haws-121966037", "Aurora boreal danzando en un cielo despejado"),
  29687508: P(29687508, "jpeg", "Raul Ling", "https://www.pexels.com/@raulling", "Aurora con tonos verdes, púrpuras y azules sobre Noruega"),
  18945828: P(18945828, "jpeg", "Nico Herrmann", "https://www.pexels.com/@nevermindnico", "Aurora boreal verde en la noche"),
  // — Marianas
  33666774: P(33666774, "jpeg", "Kristen Nagy", "https://www.pexels.com/@kristen-nagy-1445516915", "Medusa flotando en aguas profundas de azul intenso"),
  932638: P(932638, "jpeg", "Blaque X", "https://www.pexels.com/@blaque-x-264516", "Rayos de luz penetrando en el mar profundo"),
  15591206: P(15591206, "jpeg", "Emiliano Arano", "https://www.pexels.com/@earano", "Burbujas de aire ascendiendo hacia la superficie de noche"),
  4812195: P(4812195, "jpeg", "Riccardo Marchegiani", "https://www.pexels.com/@riccardo-marchegiani-3190616", "Un pulpo flotando en el océano oscuro"),
  8837882: P(8837882, "jpeg", "Los Muertos Crew", "https://www.pexels.com/@cristian-rojas", "Peces nadando en un entorno marino oscuro"),
};

/** URL de imagen optimizada (Pexels CDN, redimensionada y comprimida). */
export function photoUrl(p: Photo, w = 1200, h = 750): string {
  return `https://images.pexels.com/photos/${p.id}/pexels-photo-${p.id}.${p.ext}?auto=compress&cs=tinysrgb&fit=crop&h=${h}&w=${w}`;
}

/** Página original de la foto en Pexels (para el crédito). */
export function photoPage(p: Photo): string {
  return `https://www.pexels.com/photo/${p.id}/`;
}
