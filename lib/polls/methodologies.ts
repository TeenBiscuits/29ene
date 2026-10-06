import { pollCopy } from './copy';
import type { Locale } from '../locales';

// Each survey has its own methodology. Add a new entry when adding its source.
export const pollMethodologies: Record<string, Partial<Record<Locale, string>>> = {
  'sigma-dos-2026-10': {
    es: '2.116 entrevistas a personas de 18 y más años residentes en España con derecho a voto. Metodología mixta telefónica (CATI) y online (CAWI), mediante el panel Sigma Dos by Trust Survey. Selección aleatoria de hogar y cuotas de sexo y edad en CATI; asignación proporcional por sexo y edad en el panel. Distribución proporcional por comunidad autónoma. Trabajo de campo del 22 de septiembre al 1 de octubre de 2026. Margen publicado: ±2,2 puntos al 95,5 % de confianza para variables con dos categorías igualmente distribuidas.',
    gl: '2.116 entrevistas a persoas de 18 e máis anos residentes en España con dereito a voto. Metodoloxía mixta telefónica (CATI) e online (CAWI), mediante o panel Sigma Dos by Trust Survey. Selección aleatoria de fogar e cotas de sexo e idade en CATI; asignación proporcional por sexo e idade no panel. Distribución proporcional por comunidade autónoma. Traballo de campo do 22 de setembro ao 1 de outubro de 2026. Marxe publicada: ±2,2 puntos ao 95,5 % de confianza para variables con dúas categorías igualmente distribuídas.',
    ca: '2.116 entrevistes a persones de 18 anys o més residents a Espanya amb dret a vot. Metodologia mixta telefònica (CATI) i online (CAWI), mitjançant el panel Sigma Dos by Trust Survey. Selecció aleatòria de llar i quotes de sexe i edat en CATI; assignació proporcional per sexe i edat al panel. Distribució proporcional per comunitat autònoma. Treball de camp del 22 de setembre a l’1 d’octubre de 2026. Marge publicat: ±2,2 punts al 95,5 % de confiança per a variables amb dues categories igualment distribuïdes.',
    eu: '2.116 elkarrizketa, Espainian bizi diren eta boto eskubidea duten 18 urtetik gorakoei. Metodologia mistoa: telefonoa (CATI) eta online (CAWI), Sigma Dos by Trust Survey panelaren bidez. Etxeen ausazko hautaketa eta sexu eta adin kuotak CATIn; sexuaren eta adinaren araberako banaketa proportzionala panelean. Erkidego autonomoaren araberako banaketa proportzionala. Landa lana: 2026ko irailaren 22tik urriaren 1era. Argitaratutako marjina: ±2,2 puntu, % 95,5eko konfiantzarekin, berdin banatutako bi kategoriako aldagaientzat.',
  },
  '40db-2026-10': Object.fromEntries(
    Object.entries(pollCopy).map(([locale, copy]) => [locale, copy.technical]),
  ),
};
