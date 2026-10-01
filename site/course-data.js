export const course = {
  title: 'KG Gewinnverwendung – Lernkurs',
  subtitle: 'Gewinn Schritt für Schritt verteilen, Tabellen sicher ausfüllen und offene Selbstfinanzierung berechnen',
  redThread: {
    company: 'VoltRide Service KG',
    text: 'Die VoltRide Service KG wartet und verkauft E‑Bikes für Firmenflotten. Nora Klein und Emir Yilmaz sind Komplementäre, Lena Vogt und Jonas Wolf sind Kommanditisten. An diesem Beispiel bauen Sie die Gewinnverteilung Schritt für Schritt auf.',
    people: [
      { name: 'Nora Klein', role: 'Komplementärin', capital: 200000 },
      { name: 'Emir Yilmaz', role: 'Komplementär', capital: 120000 },
      { name: 'Lena Vogt', role: 'Kommanditistin', capital: 80000 },
      { name: 'Jonas Wolf', role: 'Kommanditist', capital: 50000, agreed: 70000 }
    ]
  },
  modules: [
    {
      id: 'm1',
      icon: '🧭',
      title: '1. Orientierung: Gewinnverwendung in der KG',
      short: 'Begriffe, Rollen und Berechnungsabfolge',
      lesson: `
        <div class="hero-lesson">
          <div>
            <span class="eyebrow">Startpunkt</span>
            <h2>Vom Jahresgewinn zur fertigen Tabelle</h2>
            <p>Die Gewinnverwendung beantwortet zwei Fragen: <strong>Wie wird der Jahresgewinn auf die Gesellschafter verteilt?</strong> und <strong>was passiert anschließend mit den Gewinnanteilen?</strong></p>
          </div>
          <div class="mini-illustration" aria-hidden="true"><span>€</span><span>→</span><span>👥</span><span>→</span><span>▦</span></div>
        </div>
        <div class="definition-grid">
          <article class="definition"><h3>Komplementär</h3><p>Ein <strong>persönlich haftender Gesellschafter</strong>. In den Übungsfällen erhält er häufig eine Tätigkeitsvergütung und entnimmt diese.</p></article>
          <article class="definition"><h3>Kommanditist</h3><p>Ein <strong>beschränkt haftender Gesellschafter</strong>. Für Gewinnauszahlungen gelten besondere Regeln; in historischen Fällen ist außerdem die damalige Behandlung offener Einlagen zu beachten.</p></article>
          <article class="definition"><h3>Jahresgewinn</h3><p>Wenn Erträge und Aufwendungen gegeben sind: <strong>Jahresgewinn = Gesamterträge − Gesamtaufwendungen</strong>.</p></article>
          <article class="definition"><h3>Gewinnanteil</h3><p>Der einem Gesellschafter zugerechnete Teil des Gewinns. In den Aufgaben gilt häufig: <strong>TV + Zinsen + Restgewinnanteil</strong>.</p></article>
        </div>
        <div class="process-flow" role="img" aria-label="Berechnungsabfolge der Gewinnverteilung">
          <div><b>1</b><span>Anfangskapital</span></div><i>→</i><div><b>2</b><span>Tätigkeitsvergütung</span></div><i>→</i><div><b>3</b><span>Zinsen</span></div><i>→</i><div><b>4</b><span>Restgewinn</span></div><i>→</i><div><b>5</b><span>Gesamtgewinn</span></div><i>→</i><div><b>6</b><span>Entnahmen / Einlagen</span></div><i>→</i><div><b>7</b><span>Endkapital & OSF</span></div>
        </div>
        <div class="red-thread"><div class="thread-icon">🚲</div><div><strong>Roter Faden: VoltRide Service KG</strong><p>Nora 200.000 €, Emir 120.000 €, Lena 80.000 €, Jonas 50.000 € eingezahlt. Jonas hat 70.000 € vereinbart; 20.000 € sind noch offen. Diese Daten werden später Schritt für Schritt ergänzt.</p></div></div>
        <div class="note"><strong>Merksatz:</strong> Arbeiten Sie die Tabelle immer <strong>von links nach rechts</strong>. Berechnen Sie erst eine Spalte vollständig, bilden Sie die Summe und gehen Sie dann zur nächsten Spalte.</div>
      `,
      tasks: [
        {
          id:'t01', afb:1, type:'single', xp:20,
          title:'Rollen in der KG',
          prompt:'Welche Aussage beschreibt einen Komplementär korrekt?',
          options:['Er ist immer von der Geschäftsführung ausgeschlossen.','Er ist persönlich haftender Gesellschafter.','Er muss zwingend eine offene Einlage haben.','Er erhält nie eine Tätigkeitsvergütung.'],
          answer:1,
          explanation:'Der Komplementär ist der persönlich haftende Gesellschafter. In vielen Gewinnverteilungsaufgaben erhält er zusätzlich eine vertraglich vereinbarte Tätigkeitsvergütung.'
        },
        {
          id:'t02', afb:1, type:'single', xp:20,
          title:'Jahresgewinn bestimmen',
          prompt:'Eine KG erzielt 325.000 € Gesamterträge und 248.000 € Gesamtaufwendungen. Wie hoch ist der Jahresgewinn?',
          options:['73.000 €','77.000 €','573.000 €','–77.000 €'],
          answer:1,
          explanation:'325.000 € (Gesamterträge) − 248.000 € (Gesamtaufwendungen) = 77.000 € Jahresgewinn.'
        },
        {
          id:'t03', afb:2, type:'match', xp:35,
          title:'Begriffe zuordnen',
          prompt:'Ordnen Sie jedem Begriff die passende Bedeutung zu.',
          pairs:[
            ['Anfangskapital','Kapitalbestand zu Beginn des Geschäftsjahres'],
            ['Tätigkeitsvergütung','Vergütung für die Tätigkeit eines Gesellschafters laut Vertrag'],
            ['Restgewinn','Gewinn nach Abzug von Tätigkeitsvergütungen und Zinsen'],
            ['Privatentnahme','Entnahme eines Gesellschafters aus dem Gesellschaftsvermögen'],
            ['Endkapital','Kapital nach Gewinn, Entnahmen und Einlagen']
          ],
          explanation:'Diese Begriffe entsprechen gleichzeitig den wichtigsten Spalten der Gewinnverteilungstabelle.'
        },
        {
          id:'t04', afb:2, type:'free', xp:35,
          title:'Warum zuerst den Gesellschaftsvertrag lesen?',
          prompt:'Erklären Sie kurz, warum der Gesellschaftsvertrag vor Beginn der Rechnung geprüft werden muss.',
          placeholder:'Formulieren Sie 2–3 Sätze zur Bedeutung der vertraglichen Regelungen.',
          solution:'Im Gesellschaftsvertrag stehen die für die Rechnung entscheidenden Regeln, z. B. Höhe der Tätigkeitsvergütung, Zinssatz, Verzinsungsbasis, Restgewinnschlüssel und Regelungen zu Entnahmen. Erst damit kann die Tabelle korrekt befüllt werden.',
          hints:['Markieren Sie Angaben zu Vergütung, Verzinsung und Restgewinn.','Überlegen Sie, welche Vertragsregel jeweils zu einer Tabellenspalte gehört.']
        },
        {
          id:'t05', afb:3, type:'multi', xp:50,
          title:'Welche Angaben brauchen Sie?',
          prompt:'Sie sollen eine vollständige Gewinnverteilung berechnen. Welche Angaben sind dafür typischerweise erforderlich? Wählen Sie alle fachlich relevanten Angaben.',
          options:['Anfangskapitalien bzw. eingezahlte Einlagen','Tätigkeitsvergütungen','Regel zur Kapitalverzinsung','Regel zur Restgewinnverteilung','Privatentnahmen und Privateinlagen','Farbe des Firmenlogos','Jahresgewinn bzw. Erträge und Aufwendungen'],
          answers:[0,1,2,3,4,6],
          explanation:'Für die Tabelle benötigen Sie Kapital, Vergütungen, Zinsregel, Restgewinnschlüssel, Entnahmen/Einlagen und den Jahresgewinn. Das Firmenlogo beeinflusst die Gewinnverteilung nicht.'
        }
      ]
    },
    {
      id:'m2', icon:'💼', title:'2. Tätigkeitsvergütung und Privatentnahmen', short:'Monatsbeträge, Zeitanteile und Entnahmen sicher erfassen',
      lesson:`
        <h2>Tätigkeitsvergütung zuerst erfassen</h2>
        <p>In den Aufgaben erhalten die Komplementäre häufig eine <strong>vertraglich vereinbarte Tätigkeitsvergütung</strong>. Sie wird als Gewinnbestandteil vor der Restgewinnverteilung berücksichtigt. Wird sie privat entnommen, muss derselbe Betrag später zusätzlich in der Spalte <strong>Entnahmen</strong> stehen.</p>
        <div class="formula-card"><span>Jahres-TV</span><strong>monatliche Vergütung × berücksichtigte Monate</strong></div>
        <div class="example-box"><h3>Beispiel</h3><p>3.500 € pro Monat für ein volles Jahr: <strong>3.500 € × 12 = 42.000 €</strong>. Beginnt der Gesellschaftsvertrag erst am 01.04., werden bei entsprechender Aufgabenregel nur 9 Monate angesetzt: <strong>3.500 € × 9 = 31.500 €</strong>.</p></div>
        <div class="red-thread"><div class="thread-icon">🚲</div><div><strong>VoltRide</strong><p>Nora erhält 2.500 € monatlich, Emir 2.000 € monatlich. Beide entnehmen die Vergütung vollständig. Bei einem vollen Jahr: Nora 30.000 €, Emir 24.000 €. Diese Beträge stehen sowohl bei <strong>TV</strong> als auch bei <strong>Entnahmen</strong>.</p></div></div>
        <div class="note"><strong>Achtung:</strong> Zusätzliche Privatentnahmen werden nicht bei der Tätigkeitsvergütung eingetragen, sondern nur in der Spalte <strong>Entnahmen</strong>. Eine Privateinlage erhöht später das Endkapital, ist aber kein Gewinn.</div>
      `,
      tasks:[
        {id:'t06',afb:1,type:'numeric',xp:20,title:'Jahresvergütung',prompt:'Eine Komplementärin erhält 2.800 € Tätigkeitsvergütung pro Monat. Berechnen Sie die Tätigkeitsvergütung für 12 Monate.',answer:33600,unit:'€',steps:['2.800 € (monatliche TV) × 12 Monate = 33.600 €']},
        {id:'t07',afb:2,type:'numeric',xp:35,title:'Unterjähriger Beginn',prompt:'Der Gesellschaftsvertrag beginnt am 01.05. Eine monatliche Tätigkeitsvergütung von 3.200 € wird ab Vertragsbeginn berücksichtigt. Wie hoch ist die TV bis 31.12.?',answer:25600,unit:'€',steps:['01.05.–31.12. = 8 Monate','3.200 € (monatliche TV) × 8 Monate = 25.600 €']},
        {id:'t08',afb:2,type:'truefalse',xp:35,title:'Richtig oder falsch: TV und Entnahmen',prompt:'Entscheiden Sie für jede Aussage, ob sie richtig oder falsch ist.',statements:[['Eine entnommene Tätigkeitsvergütung steht in der Spalte TV und zusätzlich in der Spalte Entnahmen.',true],['Eine zusätzliche Privatentnahme erhöht den Gewinnanteil.',false],['Eine Privateinlage erhöht das Endkapital, aber nicht den Gewinnanteil.',true],['Die Tätigkeitsvergütung wird in den vorliegenden Aufgaben vor dem Restgewinn berücksichtigt.',true]],explanation:'TV ist ein Gewinnbestandteil; wird sie ausgezahlt, ist sie zugleich Entnahme. Zusätzliche Privatentnahmen verändern nicht den Gewinnanteil, sondern das Endkapital.'},
        {id:'t09',afb:2,type:'order',xp:35,title:'Eintragen in der richtigen Reihenfolge',prompt:'Bringen Sie die Schritte in eine sinnvolle Reihenfolge.',items:['Zusätzliche Privatentnahmen eintragen','Tätigkeitsvergütung aus dem Vertrag berechnen','Endkapital bestimmen','Gesamtgewinnanteil bestimmen'],answer:['Tätigkeitsvergütung aus dem Vertrag berechnen','Gesamtgewinnanteil bestimmen','Zusätzliche Privatentnahmen eintragen','Endkapital bestimmen'],explanation:'Entnahmen wirken erst nach der Ermittlung des Gewinnanteils auf das Kapitalkonto.'},
        {id:'t10',afb:3,type:'free',xp:50,title:'Auswirkung einer Extraentnahme',prompt:'Ein Komplementär erhält einen Gewinnanteil von 42.000 €. Davon entnimmt er 24.000 € Tätigkeitsvergütung und zusätzlich 6.000 € privat. Erklären Sie die Auswirkung auf Endkapital und offene Selbstfinanzierung.',placeholder:'Nennen Sie Gewinnanteil, Entnahmen und den im Unternehmen verbleibenden Betrag.',solution:'Die Entnahmen betragen insgesamt 30.000 € (= 24.000 € TV + 6.000 € zusätzliche Privatentnahme). Vom Gewinnanteil verbleiben 42.000 € − 30.000 € = 12.000 € im Unternehmen. Das Endkapital steigt durch den Gewinn daher um 12.000 €; dieser Betrag entspricht hier der offenen Selbstfinanzierung.',hints:['Addieren Sie zuerst alle Entnahmen.','Vergleichen Sie anschließend Gewinnanteil und Entnahmen.']}
      ]
    },
    {
      id:'m3', icon:'％', title:'3. Kapitalverzinsung', short:'Zinsbasis erkennen, offene Einlagen und Zeitanteile beachten',
      lesson:`
        <h2>Zinsen: Immer zuerst die Basis klären</h2>
        <p>Eine Kapitalverzinsung wird in aktuellen Fällen nur angesetzt, wenn sie <strong>im Gesellschaftsvertrag vereinbart</strong> ist. In den Übungsfällen steht außerdem, welches Kapital verzinst wird. Häufig ist dies das <strong>eingezahlte Anfangskapital</strong>.</p>
        <div class="formula-card"><span>Zinsen</span><strong>Zinsbasis × Zinssatz × Zeitanteil</strong></div>
        <div class="two-col">
          <div class="definition"><h3>Ausstehende Einlage</h3><p>Der Teil einer vereinbarten Einlage, der noch nicht eingezahlt wurde. Wenn der Vertrag bzw. die Aufgabe dies vorgibt, wird dieser Teil <strong>nicht verzinst</strong>.</p></div>
          <div class="definition"><h3>Rückwärts rechnen</h3><p>Sind Zinsen und Zinssatz gegeben, lässt sich das Kapital ermitteln: <strong>Kapital = Zinsen ÷ Zinssatz</strong>.</p></div>
        </div>
        <div class="example-box"><h3>Beispiel mit offener Einlage</h3><p>Vereinbart: 80.000 €, eingezahlt: 60.000 €, offene Einlage: 20.000 €. Vertrag: 5 % auf das eingezahlte Kapital. Zinsen: <strong>60.000 € × 5 % = 3.000 €</strong>.</p></div>
        <div class="red-thread"><div class="thread-icon">🚲</div><div><strong>VoltRide</strong><p>4 % auf eingezahltes Anfangskapital: Nora 200.000 × 4 % = 8.000 €; Emir 120.000 × 4 % = 4.800 €; Lena 80.000 × 4 % = 3.200 €; Jonas 50.000 × 4 % = 2.000 €. Summe Zinsen = <strong>18.000 €</strong>.</p></div></div>
      `,
      tasks:[
        {id:'t11',afb:1,type:'numeric',xp:20,title:'Einfache Verzinsung',prompt:'Das eingezahlte Anfangskapital beträgt 140.000 €. Laut Vertrag werden 5 % verzinst. Berechnen Sie die Zinsen.',answer:7000,unit:'€',steps:['140.000 € (eingezahltes Anfangskapital) × 5 % = 7.000 €']},
        {id:'t12',afb:2,type:'numeric',xp:35,title:'Offene Einlage berücksichtigen',prompt:'Ein Kommanditist hat 90.000 € vereinbart, davon 72.000 € eingezahlt. Laut Vertrag werden nur eingezahlte Einlagen mit 4 % verzinst. Wie hoch sind die Zinsen?',answer:2880,unit:'€',steps:['Zinsbasis = 72.000 € (tatsächlich eingezahlt)','72.000 € × 4 % = 2.880 €']},
        {id:'t13',afb:2,type:'numeric',xp:35,title:'Kapital aus den Zinsen ableiten',prompt:'Einem Gesellschafter werden bei 4 % Verzinsung 6.400 € Zinsen zugerechnet. Wie hoch ist das verzinste Anfangskapital?',answer:160000,unit:'€',steps:['Kapital = 6.400 € (Zinsen) ÷ 0,04','= 160.000 €']},
        {id:'t14',afb:2,type:'numeric',xp:35,title:'Zeitanteilige Verzinsung',prompt:'Ein Gesellschaftsvertrag beginnt am 01.04. Das eingezahlte Kapital beträgt 120.000 €, Zinssatz 5 % p. a. Berechnen Sie die Zinsen für 9 Monate.',answer:4500,unit:'€',steps:['120.000 € (Kapital) × 5 % = 6.000 € Jahreszins','6.000 € × 9/12 = 4.500 €']},
        {id:'t15',afb:3,type:'free',xp:50,title:'Zinsbasis begründen',prompt:'Eine Kommanditistin hat 100.000 € vereinbart und 85.000 € eingezahlt. Der Vertrag sieht 6 % auf das eingezahlte Anfangskapital vor. Erklären und berechnen Sie die Zinsen.',placeholder:'Nennen Sie zuerst die Zinsbasis und rechnen Sie anschließend.',solution:'Die Zinsbasis beträgt 85.000 €, weil laut Vertrag das eingezahlte Anfangskapital verzinst wird. Die offene Einlage von 15.000 € gehört nicht zur Zinsbasis. Rechnung: 85.000 € × 6 % = 5.100 € Zinsen.',hints:['Unterscheiden Sie vereinbarte und tatsächlich eingezahlte Einlage.']}
      ]
    },
    {
      id:'m4', icon:'➗', title:'4. Restgewinn verteilen', short:'Restgewinn berechnen und Schlüssel korrekt anwenden',
      lesson:`
        <h2>Restgewinn: erst berechnen, dann verteilen</h2>
        <div class="formula-card"><span>Restgewinn</span><strong>Jahresgewinn − Summe TV − Summe Zinsen</strong></div>
        <p>Der Restgewinn wird anschließend genau nach der im Gesellschaftsvertrag genannten Regel verteilt: zum Beispiel <strong>3 : 1 : 1</strong>, nach Quoten oder nach Kapitalverhältnis.</p>
        <div class="example-box"><h3>Verhältnis 3 : 1 : 1</h3><p>Restgewinn 25.000 €. Insgesamt 5 Teile. Ein Teil = 25.000 € ÷ 5 = 5.000 €. Verteilung: <strong>15.000 € | 5.000 € | 5.000 €</strong>.</p></div>
        <div class="example-box"><h3>Nach Kapitalverhältnis</h3><p>Kapital 100.000 € | 60.000 € | 40.000 €, zusammen 200.000 €. Ein Restgewinn von 20.000 € wird zu 50 % | 30 % | 20 % verteilt → <strong>10.000 € | 6.000 € | 4.000 €</strong>.</p></div>
        <div class="red-thread"><div class="thread-icon">🚲</div><div><strong>VoltRide</strong><p>Jahresgewinn 107.000 € − 54.000 € TV − 18.000 € Zinsen = <strong>35.000 € Restgewinn</strong>. Vertrag: 3 : 2 : 1 : 1. 7 Teile → 5.000 € je Teil → 15.000 € | 10.000 € | 5.000 € | 5.000 €.</p></div></div>
        <div class="note"><strong>Kontrollrechnung:</strong> Die Summe aller Restgewinnanteile muss exakt dem Restgewinn entsprechen.</div>
      `,
      tasks:[
        {id:'t16',afb:1,type:'numeric',xp:20,title:'Restgewinn ermitteln',prompt:'Jahresgewinn 94.000 €, Tätigkeitsvergütungen zusammen 36.000 €, Zinsen zusammen 18.000 €. Berechnen Sie den Restgewinn.',answer:40000,unit:'€',steps:['94.000 € (Jahresgewinn) − 36.000 € (TV) − 18.000 € (Zinsen) = 40.000 € Restgewinn']},
        {id:'t17',afb:2,type:'multiNumeric',xp:35,title:'Verteilung 3 : 1 : 1',prompt:'Verteilen Sie 30.000 € Restgewinn im Verhältnis 3 : 1 : 1.',fields:[['Gesellschafter A',18000],['Gesellschafter B',6000],['Gesellschafter C',6000]],steps:['3 + 1 + 1 = 5 Teile','30.000 € ÷ 5 = 6.000 € je Teil','A: 3 × 6.000 = 18.000 €; B/C: je 6.000 €']},
        {id:'t18',afb:2,type:'multiNumeric',xp:35,title:'Verteilung 2 : 2 : 1',prompt:'Verteilen Sie 45.000 € Restgewinn im Verhältnis 2 : 2 : 1.',fields:[['A',18000],['B',18000],['C',9000]],steps:['2 + 2 + 1 = 5 Teile','45.000 € ÷ 5 = 9.000 € je Teil','A/B: je 18.000 €; C: 9.000 €']},
        {id:'t19',afb:2,type:'multiNumeric',xp:35,title:'Verteilung nach Kapital',prompt:'Der Restgewinn von 24.000 € wird nach eingezahltem Anfangskapital verteilt: 120.000 € | 60.000 € | 20.000 €.',fields:[['120.000 € Kapital',14400],['60.000 € Kapital',7200],['20.000 € Kapital',2400]],steps:['Gesamtkapital = 200.000 €','Anteile: 60 % | 30 % | 10 %','24.000 € × 60 % = 14.400 €; × 30 % = 7.200 €; × 10 % = 2.400 €']},
        {id:'t20',afb:3,type:'free',bonus:true,xp:50,title:'Bonus: Fehler im Restgewinn finden',prompt:'Ein Schüler rechnet: Jahresgewinn 75.000 € − TV 24.000 € = 51.000 € Restgewinn. Zinsen von insgesamt 9.000 € trägt er erst nach der Restverteilung ein. Beurteilen und korrigieren Sie den Rechenweg.',placeholder:'Beschreiben Sie den Fehler und berechnen Sie den richtigen Restgewinn.',solution:'Die Zinsen müssen vor der Restgewinnverteilung vom Jahresgewinn abgezogen werden. Richtig: 75.000 € (Jahresgewinn) − 24.000 € (TV) − 9.000 € (Zinsen) = 42.000 € Restgewinn. Erst diese 42.000 € werden nach dem Vertrag verteilt.',hints:['Die Reihenfolge lautet TV → Zinsen → Restgewinn.']}
      ]
    },
    {
      id:'m5', icon:'🛡️', title:'5. Kommanditisten und offene Selbstfinanzierung', short:'Auszahlung, offene Einlagen, historische Fälle und OSF',
      lesson:`
        <h2>Besonderheiten am Ende der Rechnung</h2>
        <div class="two-col">
          <div class="definition"><h3>Gewinnauszahlung</h3><p>Nach Feststellung des Jahresabschlusses kann der Gewinn grundsätzlich ausgezahlt werden. Bei Kommanditisten kann die Auszahlung eingeschränkt sein, wenn <strong>fällige Einlagen offen</strong> sind oder frühere Verluste den Kapitalanteil gemindert haben.</p></div>
          <div class="definition"><h3>Offene Selbstfinanzierung (OSF)</h3><p><strong>Nicht entnommener Gewinn</strong>, der im Unternehmen verbleibt und das Eigenkapital erhöht. In den Tabellen: <strong>OSF = Gewinnanteil − Entnahmen</strong>, soweit der Betrag tatsächlich im Eigenkapital verbleibt.</p></div>
        </div>
        <div class="legal-split">
          <article><span class="badge-now">Aktuelle Fälle</span><h3>Offene Einlage</h3><p>Eine noch offene Einlage wird nicht automatisch mit jedem Gewinnanteil aufgefüllt. Entscheidend sind Fälligkeit, Gesellschaftsvertrag und die Auszahlungsregeln.</p></article>
          <article><span class="badge-history">Historische Fälle bis 2023</span><h3>Altes Kontenmodell</h3><p>In den historischen Übungsfällen wird ein Gewinnanteil eines nicht voll eingezahlten Kommanditisten nach der damaligen Rechtslage zunächst zur Auffüllung der vereinbarten Einlage verwendet.</p></article>
        </div>
        <div class="example-box"><h3>Frühere Verluste</h3><p>Wenn frühere Verluste das Kapital des Kommanditisten verringert haben, müssen spätere Gewinne es zunächst wieder bis zur bereits geleisteten Einlage auffüllen, bevor dieser Teil ausgezahlt werden kann.</p></div>
        <div class="red-thread"><div class="thread-icon">🚲</div><div><strong>VoltRide – Abschluss</strong><p>Nora: Gewinn 53.000 €, Entnahme 30.000 € → OSF 23.000 €. Emir: Gewinn 38.800 €, Entnahmen 29.000 € → OSF 9.800 €. Lena und Jonas erhalten ihre auszahlbaren Gewinnanteile vollständig; dort entsteht in diesem Fall keine OSF. Gesamt-OSF = <strong>32.800 €</strong>.</p></div></div>
        <div class="formula-card"><span>Endkapital</span><strong>Anfangskapital + Gesamtgewinn − Entnahmen + Einlagen</strong></div>
      `,
      tasks:[
        {id:'t21',afb:1,type:'single',xp:20,title:'Gewinnauszahlung bei Kommanditisten',prompt:'Welche Aussage ist für aktuelle Fälle am treffendsten?',options:['Gewinne dürfen immer vollständig entnommen werden.','Eine offene Einlage wird automatisch mit jedem Gewinn verrechnet.','Die Auszahlung kann bei fälligen offenen Einlagen oder wegen früherer Verluste eingeschränkt sein.','Kommanditisten dürfen grundsätzlich nie Gewinn erhalten.'],answer:2,explanation:'Die Auszahlung ist nicht pauschal verboten. Sie kann aber insbesondere bei fälligen offenen Einlagen oder bei einem durch frühere Verluste geminderten Kapitalanteil eingeschränkt sein.'},
        {id:'t22',afb:1,type:'numeric',xp:20,title:'OSF berechnen',prompt:'Gewinnanteil 48.000 €, Privatentnahmen 31.000 €. Wie hoch ist die offene Selbstfinanzierung?',answer:17000,unit:'€',steps:['48.000 € (Gewinnanteil) − 31.000 € (Entnahmen) = 17.000 € OSF']},
        {id:'t23',afb:2,type:'free',xp:35,title:'Frühere Verluste verstehen',prompt:'Ein Kommanditist hat 50.000 € eingezahlt. Frühere Verluste haben seinen Kapitalanteil auf 38.000 € reduziert. Im neuen Jahr erhält er 18.000 € Gewinnanteil. Erklären Sie, welcher Teil höchstens ausgezahlt werden kann.',placeholder:'Berechnen Sie zuerst, wie viel Gewinn zum Wiederauffüllen benötigt wird.',solution:'Zunächst werden 12.000 € benötigt, um den Kapitalanteil von 38.000 € wieder auf die bereits geleisteten 50.000 € zu erhöhen. Vom Gewinnanteil von 18.000 € verbleiben danach 6.000 €. Höchstens dieser darüber hinausgehende Betrag kann nach dieser Regel ausgezahlt werden.',hints:['50.000 € − 38.000 € = ?','Ziehen Sie den Auffüllungsbetrag vom neuen Gewinnanteil ab.']},
        {id:'t24',afb:2,type:'numeric',xp:35,title:'Historischer Fall: offene Einlage',prompt:'Falljahr 2022: Ein Kommanditist hat 70.000 € vereinbart, 50.000 € eingezahlt. Sein Gewinnanteil beträgt 7.500 €. Nach dem damaligen Kontenmodell wird der Gewinn zunächst zur Auffüllung verwendet. Wie hoch ist die noch offene Einlage danach?',answer:12500,unit:'€',steps:['70.000 € (vereinbart) − 50.000 € (eingezahlt) = 20.000 € offene Einlage','20.000 € (offen) − 7.500 € (Gewinnanteil) = 12.500 € weiterhin offen']},
        {id:'t25',afb:3,type:'free',bonus:true,xp:50,title:'Bonus: OSF oder Privateinlage?',prompt:'Ein Komplementär startet mit 100.000 €. Gewinnanteil 30.000 €, Entnahmen 18.000 €, zusätzliche Privateinlage 20.000 €. Ermitteln Sie Endkapital und OSF und erklären Sie, warum beide Größen nicht gleich sind.',placeholder:'Rechnen Sie Endkapital und OSF getrennt.',solution:'Endkapital = 100.000 € + 30.000 € − 18.000 € + 20.000 € = 132.000 €. OSF = 30.000 € − 18.000 € = 12.000 €. Das Endkapital steigt insgesamt um 32.000 €, davon stammen aber 20.000 € aus der Privateinlage und nicht aus einbehaltenem Gewinn. Deshalb beträgt die OSF nur 12.000 €.',hints:['Eine Privateinlage ist kein Gewinn.']}
      ]
    },
    {
      id:'m6', icon:'▦', title:'6. Tabellenlabor', short:'Die komplette Gewinnverteilung von links nach rechts',
      lesson:`
        <h2>Die Tabelle ist Ihr Rechenplan</h2>
        <p>Wenn Sie die Spalten konsequent von links nach rechts bearbeiten, vermeiden Sie die meisten Fehler.</p>
        <div class="table-roadmap">
          <div><b>1</b><span>Anfangskapital</span><small>aus Vertrag, Bilanz oder Rückrechnung</small></div>
          <div><b>2</b><span>TV</span><small>Monatsbetrag × Monate</small></div>
          <div><b>3</b><span>Zinsen</span><small>Zinsbasis × Satz × Zeit</small></div>
          <div><b>4</b><span>Restgewinn</span><small>Gewinn − TV − Zinsen</small></div>
          <div><b>5</b><span>Gesamtgewinn</span><small>TV + Zinsen + Restanteil</small></div>
          <div><b>6</b><span>Entnahmen / Einlagen</span><small>Sachverhalt übertragen</small></div>
          <div><b>7</b><span>Endkapital</span><small>AB + Gewinn − Entnahme + Einlage</small></div>
          <div><b>8</b><span>OSF</span><small>Gewinnanteil − Entnahme</small></div>
        </div>
        <div class="worked-example">
          <h3>Komplettbeispiel VoltRide</h3>
          <ol>
            <li><strong>Anfangskapital:</strong> 200.000 | 120.000 | 80.000 | 50.000 €.</li>
            <li><strong>TV:</strong> 30.000 | 24.000 | 0 | 0 €.</li>
            <li><strong>Zinsen:</strong> 8.000 | 4.800 | 3.200 | 2.000 €.</li>
            <li><strong>Rest:</strong> 107.000 (Gewinn) − 54.000 (TV) − 18.000 (Zinsen) = 35.000 €. Schlüssel 3:2:1:1 → 15.000 | 10.000 | 5.000 | 5.000 €.</li>
            <li><strong>Gesamtgewinn:</strong> 53.000 | 38.800 | 8.200 | 7.000 €.</li>
            <li><strong>Entnahmen:</strong> 30.000 | 29.000 | 8.200 | 7.000 €. Emir hat neben 24.000 € TV zusätzlich 5.000 € entnommen.</li>
            <li><strong>Privateinlage Emir:</strong> 10.000 €.</li>
            <li><strong>Endkapital:</strong> 223.000 | 139.800 | 80.000 | 50.000 €.</li>
            <li><strong>OSF:</strong> 23.000 + 9.800 = 32.800 €.</li>
          </ol>
        </div>
        <div class="note"><strong>Vier Kontrollen:</strong> (1) Summe Gewinnanteile = Jahresgewinn. (2) Summe Restanteile = Restgewinn. (3) Entnahmen nicht vom Jahresgewinn abziehen, sondern erst beim Endkapital. (4) Privateinlagen erhöhen nicht den Gewinn.</div>
      `,
      tasks:[
        {id:'t26',afb:1,type:'order',xp:20,title:'Spaltenfolge',prompt:'Ordnen Sie die Rechenschritte.',items:['Restgewinn','Endkapital','Zinsen','Anfangskapital','Gesamtgewinnanteil','Tätigkeitsvergütung','Entnahmen/Einlagen'],answer:['Anfangskapital','Tätigkeitsvergütung','Zinsen','Restgewinn','Gesamtgewinnanteil','Entnahmen/Einlagen','Endkapital'],explanation:'Diese Reihenfolge entspricht der Tabellenlogik von links nach rechts.'},
        {
          id:'t27',afb:2,type:'table',xp:35,title:'StreetPrint KG – erste komplette Tabelle',
          prompt:'StreetPrint KG: Anna und Ben sind Komplementäre, Cora ist Kommanditistin. Anfangskapital: 100.000 € | 60.000 € | 40.000 €. TV: Anna 2.000 €/Monat, Ben 1.500 €/Monat. Zinsen 5 % auf das Anfangskapital. Jahresgewinn 80.000 €. Rest 2:2:1. Anna/Ben entnehmen nur ihre TV; Cora erhält ihren Gewinn vollständig ausgezahlt. Füllen Sie die Tabelle.',
          columns:[['opening','Anfangskapital'],['tv','TV'],['interest','Zinsen'],['rest','Restgewinn'],['profit','Gesamtgewinn'],['withdrawal','Entnahmen'],['closing','Endkapital']],
          rows:[
            {label:'Anna',values:{opening:100000,tv:24000,interest:5000,rest:11200,profit:40200,withdrawal:24000,closing:116200}},
            {label:'Ben',values:{opening:60000,tv:18000,interest:3000,rest:11200,profit:32200,withdrawal:18000,closing:74200}},
            {label:'Cora',values:{opening:40000,tv:0,interest:2000,rest:5600,profit:7600,withdrawal:7600,closing:40000}},
            {label:'Summe',values:{opening:200000,tv:42000,interest:10000,rest:28000,profit:80000,withdrawal:49600,closing:230400},sum:true}
          ],
          steps:['TV: Anna 2.000 × 12 = 24.000 €; Ben 1.500 × 12 = 18.000 €.','Zinsen: 100.000 × 5 % = 5.000 €; 60.000 × 5 % = 3.000 €; 40.000 × 5 % = 2.000 €.','Rest: 80.000 € (Gewinn) − 42.000 € (TV) − 10.000 € (Zinsen) = 28.000 €. 2:2:1 = 5 Teile → 11.200 | 11.200 | 5.600 €.','Gesamtgewinn = TV + Zinsen + Rest.','Endkapital = Anfangskapital + Gesamtgewinn − Entnahmen.']
        },
        {
          id:'t28',afb:2,type:'multi',xp:35,title:'Fehlerdiagnose in einer Tabelle',
          prompt:'Ein Schüler hat beim Endkapital folgende Schritte gemacht. Welche sind Fehler?',
          options:['Er zieht die Tätigkeitsvergütung bereits vom Jahresgewinn ab und trägt sie später zusätzlich als Entnahme ein.','Er addiert eine Privateinlage zum Endkapital.','Er berechnet den Gesamtgewinnanteil als TV + Zinsen + Restgewinnanteil.','Er zieht eine zusätzliche Privatentnahme vom Endkapital ab.','Er addiert die ausstehende, noch nicht geleistete Einlage automatisch zum Anfangskapital.'],
          answers:[0,4],
          explanation:'TV wird für die Restgewinnberechnung vom Jahresgewinn abgezogen, aber als Gewinnbestandteil wieder dem Gesellschafter zugerechnet. Wird sie entnommen, wirkt sie erst beim Endkapital. Eine noch nicht geleistete Einlage gehört nicht automatisch zum eingezahlten Anfangskapital.'
        },
        {
          id:'t29',afb:3,type:'table',xp:50,title:'StudioPulse KG – Anfangskapital aus Bilanz ableiten',
          prompt:'Bilanzsumme 600.000 €. Fremdkapital: Bank 150.000 €, Lieferanten 50.000 €. Kapital B = 100.000 €, Kapital C = 80.000 €, Kapital A ist unbekannt. A und B sind Komplementäre, C Kommanditistin. TV: A 2.500 €/Monat, B 1.500 €/Monat. 5 % Zinsen. Gewinn 118.000 €. Rest 3:2:1. Entnahmen: A 30.000 €, B 24.000 € (18.000 € TV + 6.000 € extra), C ihren gesamten Gewinnanteil. B leistet zusätzlich 12.000 € Privateinlage. Füllen Sie die Tabelle.',
          columns:[['opening','Anfangskapital'],['tv','TV'],['interest','Zinsen'],['rest','Restgewinn'],['profit','Gesamtgewinn'],['withdrawal','Entnahmen'],['deposit','Einlagen'],['closing','Endkapital']],
          rows:[
            {label:'A',values:{opening:220000,tv:30000,interest:11000,rest:25000,profit:66000,withdrawal:30000,deposit:0,closing:256000}},
            {label:'B',values:{opening:100000,tv:18000,interest:5000,rest:16666.67,profit:39666.67,withdrawal:24000,deposit:12000,closing:127666.67}},
            {label:'C',values:{opening:80000,tv:0,interest:4000,rest:8333.33,profit:12333.33,withdrawal:12333.33,deposit:0,closing:80000}},
            {label:'Summe',values:{opening:400000,tv:48000,interest:20000,rest:50000,profit:118000,withdrawal:66333.33,deposit:12000,closing:463666.67},sum:true}
          ],
          steps:['A-Kapital: 600.000 € (Bilanzsumme) − 150.000 € (Bank) − 50.000 € (Lieferanten) − 100.000 € (Kapital B) − 80.000 € (Kapital C) = 220.000 €.','TV: A 2.500 × 12 = 30.000 €; B 1.500 × 12 = 18.000 €.','Zinsen: 220.000 × 5 % = 11.000 €; 100.000 × 5 % = 5.000 €; 80.000 × 5 % = 4.000 €.','Rest: 118.000 € (Gewinn) − 48.000 € (TV) − 20.000 € (Zinsen) = 50.000 €. 3:2:1 = 6 Teile → 25.000 | 16.666,67 | 8.333,33 €.','Endkapital B: 100.000 + 39.666,67 − 24.000 + 12.000 = 127.666,67 €.']
        },
        {id:'t30',afb:3,type:'free',bonus:true,xp:50,title:'Bonus: Vier Kontrollrechnungen',prompt:'Formulieren Sie vier Kontrollen, mit denen Sie eine vollständig ausgefüllte Gewinnverteilungstabelle auf typische Fehler prüfen können.',placeholder:'Nennen Sie vier kurze Prüfschritte.',solution:'Mögliche Kontrollen: 1. Summe aller Gesamtgewinnanteile = Jahresgewinn. 2. Summe aller Restgewinnanteile = berechneter Restgewinn. 3. Gesamtgewinnanteil je Person = TV + Zinsen + Restanteil. 4. Endkapital je Person = Anfangskapital + Gesamtgewinn − Entnahmen + Einlagen. Zusätzlich kann geprüft werden, ob ausstehende Einlagen nicht unzulässig verzinst wurden und ob Zeitanteile korrekt sind.',hints:['Prüfen Sie Summen und Formeln spaltenweise.']}
      ]
    },
    {
      id:'m7', icon:'🏁', title:'7. Prüfungswerkstatt: komplette Gewinnverwendungen', short:'Mehrere komplexe Fälle wie in einer Klassenarbeit',
      lesson:`
        <h2>Jetzt rechnen Sie vollständige Fälle</h2>
        <p>Lesen Sie jeden Sachverhalt zuerst vollständig. Markieren Sie dann <strong>Kapital, TV, Zinssatz/Zinsbasis, Restgewinnschlüssel, Entnahmen, Einlagen und Jahresgewinn</strong>. Erst danach beginnt die Tabellenrechnung.</p>
        <div class="checklist"><label>□ Jahresgewinn bestimmt</label><label>□ Anfangskapitalien geklärt</label><label>□ TV und Zeitraum geklärt</label><label>□ Zinsbasis geklärt</label><label>□ Restschlüssel notiert</label><label>□ Entnahmen/Einlagen markiert</label><label>□ Rechtslage bei historischem Fall beachtet</label></div>
        <div class="note"><strong>Arbeitsstrategie:</strong> Wenn eine Zahl nicht direkt gegeben ist, prüfen Sie, ob sie aus der Bilanz, aus einem Zinsbetrag oder aus der Gesamtsumme rückwärts berechnet werden kann.</div>
      `,
      tasks:[
        {id:'t31',afb:1,type:'multi',xp:20,title:'Schnellcheck vor der Rechnung',prompt:'Welche Formeln gehören zur Gewinnverteilung?',options:['Jahresgewinn = Erträge − Aufwendungen','Restgewinn = Jahresgewinn − TV − Zinsen','Gesamtgewinnanteil = TV + Zinsen + Restanteil','Endkapital = Anfangskapital + Gewinn − Entnahmen + Einlagen','OSF = Gewinnanteil − Entnahmen','Endkapital = Anfangskapital − Gewinn + Entnahmen'],answers:[0,1,2,3,4],explanation:'Diese fünf Formeln bilden den Kern der Tabellenrechnung.'},
        {
          id:'t32',afb:2,type:'table',xp:35,title:'Fall A: MediaCraft KG',
          prompt:'MediaCraft KG: Komplementäre Ada 100.000 € und Ben 60.000 €, Kommanditistin Ceyda 40.000 €. TV: Ada 2.000 €/Monat, Ben 1.500 €/Monat. 5 % Zinsen auf Anfangskapital. Jahresgewinn 80.000 €. Rest 2:2:1. Ada/Ben entnehmen nur TV, Ceyda den gesamten Gewinn. Füllen Sie die Tabelle.',
          columns:[['opening','Anfangskapital'],['tv','TV'],['interest','Zinsen'],['rest','Restgewinn'],['profit','Gesamtgewinn'],['withdrawal','Entnahmen'],['closing','Endkapital']],
          rows:[
            {label:'Ada',values:{opening:100000,tv:24000,interest:5000,rest:11200,profit:40200,withdrawal:24000,closing:116200}},
            {label:'Ben',values:{opening:60000,tv:18000,interest:3000,rest:11200,profit:32200,withdrawal:18000,closing:74200}},
            {label:'Ceyda',values:{opening:40000,tv:0,interest:2000,rest:5600,profit:7600,withdrawal:7600,closing:40000}},
            {label:'Summe',values:{opening:200000,tv:42000,interest:10000,rest:28000,profit:80000,withdrawal:49600,closing:230400},sum:true}
          ],
          steps:['TV: 2.000 × 12 = 24.000 €; 1.500 × 12 = 18.000 €.','Zinsen: 100.000 × 5 % = 5.000 €; 60.000 × 5 % = 3.000 €; 40.000 × 5 % = 2.000 €.','Rest: 80.000 (Gewinn) − 42.000 (TV) − 10.000 (Zinsen) = 28.000 €. 2:2:1 → 11.200 | 11.200 | 5.600 €.','Endkapital: AB + Gewinn − Entnahmen.']
        },
        {
          id:'t33',afb:2,type:'table',xp:35,title:'Fall B: MobileRepair KG – unterjähriger Beginn',
          prompt:'Gesellschaftsvertrag ab 01.04. Anfangskapital: Mira 150.000 €, Noah 90.000 €, Olivia 60.000 €. Mira/Noah sind Komplementäre. TV monatlich 3.000 € und 2.000 €. Zinsen 4 % p. a., beides zeitanteilig für 9 Monate. Jahresgewinn 81.000 €. Rest 2:2:1. Mira/Noah entnehmen ihre TV, Olivia ihren gesamten Gewinn. Füllen Sie die Tabelle.',
          columns:[['opening','Anfangskapital'],['tv','TV'],['interest','Zinsen'],['rest','Restgewinn'],['profit','Gesamtgewinn'],['withdrawal','Entnahmen'],['closing','Endkapital']],
          rows:[
            {label:'Mira',values:{opening:150000,tv:27000,interest:4500,rest:10800,profit:42300,withdrawal:27000,closing:165300}},
            {label:'Noah',values:{opening:90000,tv:18000,interest:2700,rest:10800,profit:31500,withdrawal:18000,closing:103500}},
            {label:'Olivia',values:{opening:60000,tv:0,interest:1800,rest:5400,profit:7200,withdrawal:7200,closing:60000}},
            {label:'Summe',values:{opening:300000,tv:45000,interest:9000,rest:27000,profit:81000,withdrawal:52200,closing:328800},sum:true}
          ],
          steps:['01.04.–31.12. = 9 Monate.','TV: 3.000 × 9 = 27.000 €; 2.000 × 9 = 18.000 €.','Zinsen: 150.000 × 4 % × 9/12 = 4.500 €; 90.000 × 4 % × 9/12 = 2.700 €; 60.000 × 4 % × 9/12 = 1.800 €.','Rest: 81.000 (Gewinn) − 45.000 (TV) − 9.000 (Zinsen) = 27.000 €. 2:2:1 → 10.800 | 10.800 | 5.400 €.']
        },
        {
          id:'t34',afb:2,type:'table',xp:35,title:'Fall C: CraftLab KG – historischer Fall 2022',
          prompt:'Falljahr 2022 (HGB a. F.). Komplementär Alex 130.000 €, Kommanditist Bea 80.000 €, Kommanditist Cem: 70.000 € vereinbart, 50.000 € eingezahlt. TV Alex 2.000 €/Monat. Zinsen 5 % auf eingezahltes Anfangskapital. Gewinn 62.000 €. Rest 3:1:1. Alex entnimmt TV; Bea erhält ihren Gewinn ausgezahlt. Cems Gewinn wird nach dem damaligen Kontenmodell zunächst zur Auffüllung seiner Einlage verwendet. Füllen Sie die Tabelle.',
          columns:[['opening','Anfangskapital'],['tv','TV'],['interest','Zinsen'],['rest','Restgewinn'],['profit','Gesamtgewinn'],['withdrawal','Entnahmen'],['closing','Endkapital']],
          rows:[
            {label:'Alex',values:{opening:130000,tv:24000,interest:6500,rest:15000,profit:45500,withdrawal:24000,closing:151500}},
            {label:'Bea',values:{opening:80000,tv:0,interest:4000,rest:5000,profit:9000,withdrawal:9000,closing:80000}},
            {label:'Cem',values:{opening:50000,tv:0,interest:2500,rest:5000,profit:7500,withdrawal:0,closing:57500}},
            {label:'Summe',values:{opening:260000,tv:24000,interest:13000,rest:25000,profit:62000,withdrawal:33000,closing:289000},sum:true}
          ],
          steps:['Cem: Zinsbasis 50.000 € eingezahlt, nicht 70.000 € vereinbart.','Zinsen: 130.000 × 5 % = 6.500 €; 80.000 × 5 % = 4.000 €; 50.000 × 5 % = 2.500 €.','Rest: 62.000 (Gewinn) − 24.000 (TV) − 13.000 (Zinsen) = 25.000 €. 3:1:1 → 15.000 | 5.000 | 5.000 €.','Cem: 20.000 € offene Einlage − 7.500 € Gewinnanteil = 12.500 € weiterhin offen; im Tabellenkapital steigt sein Kapital von 50.000 auf 57.500 €.']
        },
        {
          id:'t35',afb:3,type:'table',xp:50,title:'Fall D: StudioPulse KG – Bilanz, Einlage und Extraentnahme',
          prompt:'Bilanzsumme 600.000 €, Bankverbindlichkeiten 150.000 €, Verbindlichkeiten aus LuL 50.000 €. Kapital B 100.000 €, Kapital C 80.000 €, Kapital A unbekannt. A/B Komplementäre, C Kommanditistin. TV A 2.500 €/Monat, B 1.500 €/Monat. 5 % Zinsen. Gewinn 118.000 €. Rest 3:2:1. A entnimmt 30.000 €, B 24.000 € und leistet 12.000 € Privateinlage, C erhält ihren Gewinn ausgezahlt. Füllen Sie die Tabelle.',
          columns:[['opening','Anfangskapital'],['tv','TV'],['interest','Zinsen'],['rest','Restgewinn'],['profit','Gesamtgewinn'],['withdrawal','Entnahmen'],['deposit','Einlagen'],['closing','Endkapital']],
          rows:[
            {label:'A',values:{opening:220000,tv:30000,interest:11000,rest:25000,profit:66000,withdrawal:30000,deposit:0,closing:256000}},
            {label:'B',values:{opening:100000,tv:18000,interest:5000,rest:16666.67,profit:39666.67,withdrawal:24000,deposit:12000,closing:127666.67}},
            {label:'C',values:{opening:80000,tv:0,interest:4000,rest:8333.33,profit:12333.33,withdrawal:12333.33,deposit:0,closing:80000}},
            {label:'Summe',values:{opening:400000,tv:48000,interest:20000,rest:50000,profit:118000,withdrawal:66333.33,deposit:12000,closing:463666.67},sum:true}
          ],
          steps:['A-Kapital = 600.000 (Bilanzsumme) − 150.000 (Bank) − 50.000 (LuL) − 100.000 (B) − 80.000 (C) = 220.000 €.','TV = 30.000 | 18.000 | 0 €.','Zinsen = 11.000 | 5.000 | 4.000 €.','Rest = 118.000 − 48.000 − 20.000 = 50.000 €; 3:2:1 → 25.000 | 16.666,67 | 8.333,33 €.','B-Endkapital = 100.000 + 39.666,67 − 24.000 + 12.000 = 127.666,67 €.']
        },
        {
          id:'t36',afb:3,type:'table',bonus:true,xp:50,title:'Bonus-Finale: NextGen Events KG',
          prompt:'Gesamterträge 430.000 €, Gesamtaufwendungen 325.600 €. Komplementäre Finn und Gia erhalten je 4.800 € Zinsen; Zinssatz 4 %, daraus ist ihr Anfangskapital zu bestimmen. Kommanditistin Hana: 70.000 € eingezahlt. Kommanditist Ivo: 70.000 € vereinbart, 50.000 € eingezahlt; die restliche Einlage ist noch nicht fällig. TV Finn 2.500 €/Monat, Gia 2.000 €/Monat. Restgewinn nach eingezahltem Anfangskapital. Finn entnimmt nur TV; Gia TV + 4.000 € extra und leistet 10.000 € Privateinlage; Hana und Ivo erhalten ihre Gewinnanteile ausgezahlt. Füllen Sie die Tabelle.',
          columns:[['opening','Anfangskapital'],['tv','TV'],['interest','Zinsen'],['rest','Restgewinn'],['profit','Gesamtgewinn'],['withdrawal','Entnahmen'],['deposit','Einlagen'],['closing','Endkapital']],
          rows:[
            {label:'Finn',values:{opening:120000,tv:30000,interest:4800,rest:12000,profit:46800,withdrawal:30000,deposit:0,closing:136800}},
            {label:'Gia',values:{opening:120000,tv:24000,interest:4800,rest:12000,profit:40800,withdrawal:28000,deposit:10000,closing:142800}},
            {label:'Hana',values:{opening:70000,tv:0,interest:2800,rest:7000,profit:9800,withdrawal:9800,deposit:0,closing:70000}},
            {label:'Ivo',values:{opening:50000,tv:0,interest:2000,rest:5000,profit:7000,withdrawal:7000,deposit:0,closing:50000}},
            {label:'Summe',values:{opening:360000,tv:54000,interest:14400,rest:36000,profit:104400,withdrawal:74800,deposit:10000,closing:399600},sum:true}
          ],
          steps:['Jahresgewinn: 430.000 € (Erträge) − 325.600 € (Aufwendungen) = 104.400 €.','Finn/Gia Anfangskapital: 4.800 € (Zinsen) ÷ 4 % = 120.000 € jeweils.','TV: Finn 2.500 × 12 = 30.000 €; Gia 2.000 × 12 = 24.000 €.','Zinsen: Finn 4.800; Gia 4.800; Hana 70.000 × 4 % = 2.800; Ivo 50.000 × 4 % = 2.000 € → Summe 14.400 €.','Rest: 104.400 − 54.000 − 14.400 = 36.000 €. Kapitalverhältnis 120:120:70:50 = 12:12:7:5 → 12.000 | 12.000 | 7.000 | 5.000 €.','Gia Endkapital = 120.000 + 40.800 − 28.000 + 10.000 = 142.800 €. Ivos noch nicht fällige offene Einlage wird im aktuellen Fall nicht automatisch mit seinem Gewinn verrechnet.']
        }
      ]
    }
  ]
};

export const shopItems = [
  {id:'theme-night',kind:'theme',name:'Nachtmodus Pro',cost:120,value:'night',icon:'🌙',description:'Dunkler Hintergrund mit klaren Kontrasten.'},
  {id:'theme-forest',kind:'theme',name:'Waldgrün',cost:160,value:'forest',icon:'🌲',description:'Ruhiges grünes Farbschema.'},
  {id:'theme-sunset',kind:'theme',name:'Sunset',cost:180,value:'sunset',icon:'🌅',description:'Warmer Verlauf für Ihre Kursoberfläche.'},
  {id:'theme-ocean',kind:'theme',name:'Ocean',cost:200,value:'ocean',icon:'🌊',description:'Kühles blau-türkises Farbschema.'},
  {id:'acc-cap',kind:'accessory',name:'Cap',cost:90,value:'🧢',icon:'🧢',description:'Ein neues Accessoire für Ihren Avatar.'},
  {id:'acc-headphones',kind:'accessory',name:'Kopfhörer',cost:130,value:'🎧',icon:'🎧',description:'Für konzentrierte Rechenmissionen.'},
  {id:'acc-glasses',kind:'accessory',name:'Rechenbrille',cost:150,value:'🤓',icon:'🤓',description:'Ein Accessoire für Tabellenprofis.'},
  {id:'pet-cat',kind:'pet',name:'Kurskatze',cost:140,value:'🐈',icon:'🐈',description:'Begleitet Sie auf Ihrer Lernroute.'},
  {id:'pet-robot',kind:'pet',name:'Rechenbot',cost:200,value:'🤖',icon:'🤖',description:'Ihr digitaler Tabellenbegleiter.'},
  {id:'pet-owl',kind:'pet',name:'Bilanz-Eule',cost:240,value:'🦉',icon:'🦉',description:'Für besonders ausdauernde Rechner.'}
];

export const allTasks = course.modules.flatMap(m => m.tasks.map(t => ({...t,moduleId:m.id,moduleTitle:m.title})));
