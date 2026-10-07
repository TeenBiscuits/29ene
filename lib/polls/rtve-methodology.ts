import type { Locale } from '@/lib/locales';

type RtveMethodologyCopy = {
  trigger: string;
  articleLink: string;
  aboutTitle: string;
  about: string;
  surveysTitle: string;
  surveys: string;
  weightingTitle: string;
  weighting: string;
  seatsTitle: string;
  seats: string;
  housesTitle: string;
  houses: string;
};

export const rtveMethodologyCopy = {
  es: {
    trigger: 'DatosRTVE · Promedio RTVE',
    articleLink: 'Artículo de RTVE del que proceden estas gráficas',
    aboutTitle: 'Sobre esta información',
    about: 'El Promedio RTVE es una media ponderada y diaria de las encuestas de intención de voto publicadas desde las elecciones generales de julio de 2023. Cada día combina las encuestas de los últimos 30 días, da más peso a las más recientes y a las que entrevistan a más personas, y hace que cada casa encuestadora cuente una sola vez. No es una predicción del resultado de unas elecciones, sino un resumen de lo que dicen las encuestas en cada momento.',
    surveysTitle: 'Qué encuestas entran',
    surveys: 'Los datos proceden del listado de encuestas que recoge Wikipedia. Cada encuesta se sitúa en el punto medio de su trabajo de campo y se usa la estimación de voto tal como la publica la casa. Se descartan las que no indican el tamaño de su muestra, las que presentan sumas de voto incoherentes y las reestimaciones que otras empresas hacen con los datos del CIS, porque repetirían el mismo trabajo de campo. Cada partido se promedia solo con las casas que publican su dato.',
    weightingTitle: 'Cómo se ponderan',
    weighting: 'Una encuesta pierde la mitad de su peso a los 12 días de su fecha, conserva el 14% a los 20 y deja de contar a los 30. El tamaño de la muestra también influye, pero de forma amortiguada: el peso crece con su raíz cuadrada y se limita a 1.200 entrevistas, para que una encuesta muy grande no domine el resultado. Si una casa tiene varias encuestas en esos 30 días, se combinan en un único valor, de modo que una empresa que publica a diario no pese más que las demás.',
    seatsTitle: 'Escaños y límites',
    seats: 'Los escaños son la media de los que publican las propias encuestadoras, con los mismos pesos, ajustada a los 350 del Congreso. No es una proyección propia de RTVE a partir del voto. El promedio suaviza el ruido de cada encuesta, pero no corrige las diferencias de método ni los posibles sesgos de cada casa, y en las semanas con pocas encuestas la curva puede ser menos estable.',
    housesTitle: 'Casas encuestadoras que aparecen en el promedio',
    houses: '40dB, Ateneo del Dato, Celeste-Tel, CIS, Cluster17, Data10, Demoscopia y Servicios DYM, EM-Analytics, GAD3, GESOP, Hamalgama Métrica, InvyMark, Ipsos, More in Common, NC Report, ODEC, Opina 360, Sigma Dos, Simple Lógica, SocioMétrica, Sondaxe, Sumar, Target Point y Winston.',
  },
  gl: {
    trigger: 'DatosRTVE · Media RTVE',
    articleLink: 'Artigo de RTVE do que proceden estas gráficas',
    aboutTitle: 'Sobre esta información',
    about: 'A Media RTVE é unha media ponderada e diaria das enquisas de intención de voto publicadas desde as eleccións xerais de xullo de 2023. Cada día combina as enquisas dos últimos 30 días, dá máis peso ás máis recentes e ás que entrevistan máis persoas, e fai que cada casa enquisadora conte unha soa vez. Non é unha predición do resultado dunhas eleccións, senón un resumo do que din as enquisas en cada momento.',
    surveysTitle: 'Que enquisas se inclúen',
    surveys: 'Os datos proceden da listaxe de enquisas que recolle Wikipedia. Cada enquisa sitúase no punto medio do seu traballo de campo e úsase a estimación de voto tal como a publica a casa. Descártanse as que non indican o tamaño da mostra, as que presentan sumas de voto incoherentes e as reestimacións que outras empresas fan cos datos do CIS, porque repetirían o mesmo traballo de campo. Cada partido faise a media só coas casas que publican o seu dato.',
    weightingTitle: 'Como se ponderan',
    weighting: 'Unha enquisa perde a metade do seu peso aos 12 días da súa data, conserva o 14% aos 20 e deixa de contar aos 30. O tamaño da mostra tamén inflúe, pero de forma amortecida: o peso medra coa súa raíz cadrada e limítase a 1.200 entrevistas, para que unha enquisa moi grande non domine o resultado. Se unha casa ten varias enquisas neses 30 días, combínanse nun único valor, de modo que unha empresa que publica a diario non pese máis ca as demais.',
    seatsTitle: 'Escanos e límites',
    seats: 'Os escanos son a media dos que publican as propias enquisadoras, cos mesmos pesos, axustada aos 350 do Congreso. Non é unha proxección propia de RTVE a partir do voto. A media suaviza o ruído de cada enquisa, pero non corrixe as diferenzas de método nin os posibles nesgos de cada casa, e nas semanas con poucas enquisas a curva pode ser menos estable.',
    housesTitle: 'Casas enquisadoras que aparecen na media',
    houses: '40dB, Ateneo del Dato, Celeste-Tel, CIS, Cluster17, Data10, Demoscopia y Servicios DYM, EM-Analytics, GAD3, GESOP, Hamalgama Métrica, InvyMark, Ipsos, More in Common, NC Report, ODEC, Opina 360, Sigma Dos, Simple Lógica, SocioMétrica, Sondaxe, Sumar, Target Point y Winston.',
  },
  ca: {
    trigger: 'DatosRTVE · Mitjana RTVE',
    articleLink: 'Article de RTVE d’on provenen aquests gràfics',
    aboutTitle: 'Sobre aquesta informació',
    about: 'La Mitjana RTVE és una mitjana ponderada i diària de les enquestes d’intenció de vot publicades des de les eleccions generals del juliol del 2023. Cada dia combina les enquestes dels darrers 30 dies, dona més pes a les més recents i a les que entrevisten més persones, i fa que cada casa enquestadora compti una sola vegada. No és una predicció del resultat d’unes eleccions, sinó un resum del que diuen les enquestes en cada moment.',
    surveysTitle: 'Quines enquestes s’hi inclouen',
    surveys: 'Les dades provenen del llistat d’enquestes que recull la Viquipèdia. Cada enquesta se situa al punt mitjà del seu treball de camp i s’utilitza l’estimació de vot tal com la publica la casa. Es descarten les que no indiquen la mida de la mostra, les que presenten sumes de vot incoherents i les reestimacions que altres empreses fan amb les dades del CIS, perquè repetirien el mateix treball de camp. Cada partit es calcula només amb les cases que publiquen la seva dada.',
    weightingTitle: 'Com es ponderen',
    weighting: 'Una enquesta perd la meitat del seu pes al cap de 12 dies de la data, conserva el 14% al cap de 20 i deixa de comptar al cap de 30. La mida de la mostra també hi influeix, però de manera esmorteïda: el pes creix amb la seva arrel quadrada i es limita a 1.200 entrevistes, perquè una enquesta molt gran no domini el resultat. Si una casa té diverses enquestes en aquests 30 dies, es combinen en un únic valor, de manera que una empresa que publica cada dia no pesi més que les altres.',
    seatsTitle: 'Escons i límits',
    seats: 'Els escons són la mitjana dels que publiquen les mateixes enquestadores, amb els mateixos pesos, ajustada als 350 del Congrés. No és una projecció pròpia de RTVE a partir del vot. La mitjana suavitza el soroll de cada enquesta, però no corregeix les diferències de mètode ni els possibles biaixos de cada casa, i durant les setmanes amb poques enquestes la corba pot ser menys estable.',
    housesTitle: 'Cases enquestadores que apareixen a la mitjana',
    houses: '40dB, Ateneo del Dato, Celeste-Tel, CIS, Cluster17, Data10, Demoscopia y Servicios DYM, EM-Analytics, GAD3, GESOP, Hamalgama Métrica, InvyMark, Ipsos, More in Common, NC Report, ODEC, Opina 360, Sigma Dos, Simple Lógica, SocioMétrica, Sondaxe, Sumar, Target Point y Winston.',
  },
  eu: {
    trigger: 'DatosRTVE · RTVEren batezbestekoa',
    articleLink: 'Grafiko hauen jatorria den RTVEren artikulua',
    aboutTitle: 'Informazio honi buruz',
    about: 'RTVEren batezbestekoa 2023ko uztaileko hauteskunde orokorretatik argitaratutako boto-asmoaren inkesten eguneko batezbesteko haztatua da. Egunero azken 30 egunetako inkestak konbinatzen ditu, berrienei eta pertsona gehiago elkarrizketatzen dituztenei pisu handiagoa ematen die, eta inkesta-etxe bakoitza behin bakarrik zenbatzen du. Ez da hauteskundeen emaitzaren iragarpena, une bakoitzean inkestek diotenaren laburpena baizik.',
    surveysTitle: 'Zer inkesta sartzen diren',
    surveys: 'Datuak Wikipediak jasotzen duen inkesten zerrendatik datoz. Inkesta bakoitza landa-lanaren erdi-puntuan kokatzen da, eta inkesta-etxeak argitaratutako boto-estimazioa erabiltzen da. Laginaren tamaina adierazten ez dutenak, botoen batura bateraezinak dituztenak eta beste enpresa batzuek CISen datuekin egiten dituzten berrestimazioak baztertzen dira, landa-lan bera errepikatuko luketelako. Alderdi bakoitzaren batezbestekoa bere datua argitaratzen duten inkesta-etxeekin soilik kalkulatzen da.',
    weightingTitle: 'Nola haztatzen diren',
    weighting: 'Inkesta batek pisuaren erdia galtzen du datatik 12 egunera, %14ri eusten dio 20 egunera eta 30 egunera zenbaketatik kanpo geratzen da. Laginaren tamainak ere eragina du, baina arinduta: pisua laginaren erro karratuarekin handitzen da eta 1.200 elkarrizketetara mugatzen da, inkesta oso handi batek emaitza mendera ez dezan. Inkesta-etxe batek 30 egun horietan inkesta bat baino gehiago baditu, balio bakar batean konbinatzen dira, egunero argitaratzen duen enpresa batek besteek baino pisu handiagoa izan ez dezan.',
    seatsTitle: 'Eserlekuak eta mugak',
    seats: 'Eserlekuak inkesta-etxeek argitaratutako eserleku-kopuruen batezbestekoa dira, pisu berak erabilita eta Kongresuko 350 eserlekuetara doituta. Ez da RTVEk botoetatik abiatuta egiten duen berezko proiekzioa. Batezbestekoak inkesta bakoitzaren zarata leuntzen du, baina ez ditu metodoen arteko aldeak edo inkesta-etxe bakoitzaren balizko joerak zuzentzen; inkesta gutxi dagoen asteetan kurba ezegonkorragoa izan daiteke.',
    housesTitle: 'Batezbestekoan agertzen diren inkesta-etxeak',
    houses: '40dB, Ateneo del Dato, Celeste-Tel, CIS, Cluster17, Data10, Demoscopia y Servicios DYM, EM-Analytics, GAD3, GESOP, Hamalgama Métrica, InvyMark, Ipsos, More in Common, NC Report, ODEC, Opina 360, Sigma Dos, Simple Lógica, SocioMétrica, Sondaxe, Sumar, Target Point y Winston.',
  },
} satisfies Record<Locale, RtveMethodologyCopy>;
