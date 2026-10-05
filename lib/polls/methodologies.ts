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
  'gad3-2026-09': {
    es: '1.010 entrevistas: 514 telefónicas (CATI) y 496 online (CAWI). Ámbito nacional, población mayor de 18 años con derecho a voto. Cuotas por sexo, edad y ámbito geográfico según el censo electoral del INE. Cuestionario propuesto por ABC. Trabajo de campo del 1 al 3 de septiembre de 2026. Error publicado: ±3,2 puntos al 95,5 % de confianza, bajo supuesto de muestreo aleatorio simple y P=Q=0,5.',
    gl: '1.010 entrevistas: 514 telefónicas (CATI) e 496 online (CAWI). Ámbito nacional, poboación maior de 18 anos con dereito a voto. Cotas por sexo, idade e ámbito xeográfico segundo o censo electoral do INE. Cuestionario proposto por ABC. Traballo de campo do 1 ao 3 de setembro de 2026. Erro publicado: ±3,2 puntos ao 95,5 % de confianza, baixo suposto de mostraxe aleatoria simple e P=Q=0,5.',
    ca: '1.010 entrevistes: 514 telefòniques (CATI) i 496 online (CAWI). Àmbit nacional, població major de 18 anys amb dret a vot. Quotes per sexe, edat i àmbit geogràfic segons el cens electoral de l’INE. Qüestionari proposat per ABC. Treball de camp de l’1 al 3 de setembre de 2026. Error publicat: ±3,2 punts al 95,5 % de confiança, sota el supòsit de mostreig aleatori simple i P=Q=0,5.',
    eu: '1.010 elkarrizketa: 514 telefonoz (CATI) eta 496 online (CAWI). Espainia osoa, boto eskubidea duten 18 urtetik gorakoak. Sexuaren, adinaren eta eremu geografikoaren araberako kuotak INEren hautesle erroldaren arabera. ABCk proposatutako galdetegia. Landa lana: 2026ko irailaren 1etik 3ra. Argitaratutako errorea: ±3,2 puntu, % 95,5eko konfiantzarekin, ausazko laginketa sinplea eta P=Q=0,5 suposatuta.',
  },
  '40db-2026-10': Object.fromEntries(
    Object.entries(pollCopy).map(([locale, copy]) => [locale, copy.technical]),
  ),
};
