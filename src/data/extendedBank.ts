import { CheatVaultPhrase, EmailTemplateItem, GrammarTrapItem, TestGorillaQuestion } from './assessmentBank';

export const EXTRA_CHEAT_VAULT_PHRASES: CheatVaultPhrase[] = [
  {
    id: 'cv-12',
    category: 'Accueil & Prise en charge',
    french: 'Bienvenue chez notre service client privilégié, je suis à votre entière écoute.',
    register: 'B2 Standard',
    whenToUse: 'Salutation chaleureuse pour compte retail / télécom',
    darijaMeaning: 'مرحبا بك فـ مصلحة الزبناء المميزة، أنا رهن الإشارة ديالك.',
  },
  {
    id: 'cv-13',
    category: 'Accueil & Prise en charge',
    french: 'Pourriez-vous me communiquer votre numéro de dossier afin que j’accède immédiatement à votre historique ?',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Identification rapide du dossier client avec conditionnel de politesse',
    darijaMeaning: 'واش تقدر تعطيني رقم الملف باش ندخل فورا للتاريخ ديال الطلبات ديالك؟',
  },
  {
    id: 'cv-14',
    category: 'Accueil & Prise en charge',
    french: 'Soyez assuré(e) que vous êtes au bon endroit : nous allons régulariser cette situation ensemble dès maintenant.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Rassurer un client transféré plusieurs fois entre différents services',
    darijaMeaning: 'كون متأكد بلي راك فالمكان الصحيح، غادي نسويو هاد الوضعية مجموعين دابا نيت.',
  },
  {
    id: 'cv-15',
    category: 'Empathie & Apaisement VIP',
    french: 'Je comprends tout à fait l’impact de ce retard sur votre organisation professionnelle.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Client B2B ou indépendant impacté par une panne ou un retard',
    darijaMeaning: 'كنفهم تماما التأثير ديال هاد التأخير على التنظيم المهني ديالك.',
  },
  {
    id: 'cv-16',
    category: 'Empathie & Apaisement VIP',
    french: 'Il est tout à fait normal que vous attendiez un service irréprochable de notre part.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Reconnaître l’exigence légitime d’un client fidèle',
    darijaMeaning: 'من الطبيعي جدا أنك تنتظر منا خدمة لا غبار عليها.',
  },
  {
    id: 'cv-17',
    category: 'Empathie & Apaisement VIP',
    french: 'Votre satisfaction demeure notre priorité absolue ; c’est pourquoi j’active une procédure d’urgence.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Annoncer une escalade prioritaire rassurante',
    darijaMeaning: 'الرضا ديالك هو الأولوية المطلقة ديالنا، ولهذا غنفعل مسطرة استعجالية.',
  },
  {
    id: 'cv-18',
    category: 'Mise en attente élégante',
    french: 'Je sollicite un court instant de patience afin de valider ce déblocage auprès de notre pôle financier.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Mise en attente pour validation superviseur ou comptabilité',
    darijaMeaning: 'كنطلب منك لحظة قصيرة ديال الصبر باش نصادق على هاد الحل مع القسم المالي.',
  },
  {
    id: 'cv-19',
    category: 'Mise en attente élégante',
    french: 'Ne quittez pas, je reste connecté(e) à votre dossier et reviens vers vous dans moins d’une minute.',
    register: 'B2 Standard',
    whenToUse: 'Mise en attente rapide et rassurante',
    darijaMeaning: 'ما تقطعش، أنا باقي معاك فـ الملف وراجع ليك فـ أقل من دقيقة.',
  },
  {
    id: 'cv-20',
    category: 'Gestion des objections & Refus diplomatique',
    french: 'Toutefois, afin de compenser cette contrainte technique, je suis habilité(e) à vous proposer...',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Pivoter d’une contrainte vers une solution concrète',
    darijaMeaning: 'ومع ذلك، باش نعوضو هاد الإكراه التقني، عندي الصلاحية نقترح عليك...',
  },
  {
    id: 'cv-21',
    category: 'Gestion des objections & Refus diplomatique',
    french: 'Conformément aux dispositions du RGPD, cette vérification préalable vise avant tout à protéger vos avoirs.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Quand un client s’impatiente face aux questions de sécurité RGPD',
    darijaMeaning: 'طبقا لقانون حماية المعطيات، هاد التحقق الهدف ديالو الأول هو يحمي الحساب ديالك.',
  },
  {
    id: 'cv-22',
    category: 'Excuses professionnelles C1',
    french: 'Veuillez accepter nos excuses les plus sincères pour cette anomalie ponctuelle.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Excuse élégante pour un bug informatique ou une erreur de facturation',
    darijaMeaning: 'المرجو تقبل أصدق الاعتذارات ديالنا على هاد الخلل العارض.',
  },
  {
    id: 'cv-23',
    category: 'Excuses professionnelles C1',
    french: 'Nous regrettons vivement la gêne occasionnée et mettons tout en œuvre pour prévenir toute récidive.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Conclusion d’un e-mail de gestion de réclamation',
    darijaMeaning: 'كنأسفو بشدة على الإزعاج وكنبذلو كل المجهود باش ما يتعاودش هاد المشكل.',
  },
  {
    id: 'cv-24',
    category: 'Clôture d’appel & CSAT',
    french: 'Vous recevrez d’ici quelques minutes un récapitulatif écrit de notre échange ainsi qu’une courte enquête de satisfaction.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Préparer positivement le client à donner une note CSAT maximale',
    darijaMeaning: 'غادي يوصلك دابا شوية ملخص مكتوب ديال المكالمة ديالنا مع استبيان قصير ديال الرضا.',
  },
  {
    id: 'cv-25',
    category: 'Ponts anti-blanc (Emergency Fillers)',
    french: 'Permettez-moi de reformuler les deux enjeux essentiels de votre demande afin de n’omettre aucun détail.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Gagner 6 à 8 secondes à l’oral tout en démontrant une écoute active C1',
    darijaMeaning: 'سمح ليا نعاود نصيغ النقطتين الأساسيتين فـ الطلب ديالك باش ما ننسى حتى تفصيل.',
  },
];

export const EXTRA_EMAIL_TEMPLATES: EmailTemplateItem[] = [
  {
    id: 'tpl-5',
    title: 'Modèle 5 : Gestions d’un client VIP menaçant de résilier (Rétention C1)',
    category: 'Réclamation',
    subject: 'Prise en charge prioritaire de votre contrat #[NUMÉRO] — Offre de fidélité',
    body: `Bonjour [Madame/Monsieur Nom],

Votre message a retenu toute notre attention et nous mesurons pleinement votre déception suite aux récents désagréments rencontrés sur votre ligne #[NUMÉRO].

Attachés à la relation de confiance que nous entretenons avec vous depuis [ANNÉE], nous avons immédiatement procédé à la révision complète de votre dossier. En complément de la résolution technique définitive validée ce matin, j'ai le plaisir de vous accorder une remise fidélité de 25 % sur vos trois prochaines mensualités.

Espérant que cette attention saura vous témoigner notre considération, nous vous prions d'agréer, [Madame/Monsieur], nos salutations distinguées.`,
    darijaNote: 'موديل خطير فـ Rétention / Fidélisation باش تقنع كليان باغي يفسخ العقد يبقى مع الشركة.',
  },
  {
    id: 'tpl-6',
    title: 'Modèle 6 : Demande de pièces justificatives complémentaires (Dossier incomplet)',
    category: 'Remboursement',
    subject: 'Finalisation de votre remboursement #[NUMÉRO] — Pièce justificative requise',
    body: `Bonjour [Madame/Monsieur Nom],

Nous faisons suite à votre demande d'indemnisation enregistrée sous la référence #[NUMÉRO] et vous confirmons que votre dossier est pré-validé par notre service financier.

Afin de nous permettre d'ordonner le virement bancaire sous 24 heures ouvrées, pourriez-vous avoir l'amabilité de nous transmettre en retour de ce courriel votre relevé d'identité bancaire (IBAN) ainsi qu'une copie de la facture acquittée ?

Dès réception de ces éléments, le règlement sera déclenché en priorité.

Nous vous prions d'agréer, [Madame/Monsieur], l'expression de nos salutations distinguées.`,
    darijaNote: 'كتستعملو ملي يكون خاص شي وثيقة (IBAN / Facture) باش تكمل ليه الخلاص ديالو.',
  },
];

export const EXTRA_GRAMMAR_TRAPS: GrammarTrapItem[] = [
  {
    id: 'gt-6',
    title: 'Avoir l’air + Adjectif (Accord avec le sujet ou avec "air")',
    trapWrong: 'Cette cliente a l’air très mécontent de notre service.',
    goldCorrect: 'Cette cliente a l’air très mécontente de notre service.',
    ruleExplanation: 'Lorsque « avoir l’air » signifie « sembler / paraître », l’adjectif s’accorde avec le sujet (« Cette cliente » -> mécontente).',
    darijaMnemonic: 'Avoir l’air بمعنى "كيبان" كيتبع الفاعل: Elle a l’air contente.',
  },
  {
    id: 'gt-7',
    title: 'Se souvenir de vs Se rappeler quelque chose',
    trapWrong: 'Je me rappelle de votre appel d’hier.',
    goldCorrect: 'Je me souviens de votre appel d’hier. / Je me rappelle votre appel d’hier.',
    ruleExplanation: '« Se rappeler » est transitif direct (sans « de » devant un nom), tandis que « se souvenir » se construit avec « de ».',
    darijaMnemonic: 'Je me souviens DE... ولكن Je me rappelle + الإسم نيشان بلا DE!',
  },
  {
    id: 'gt-8',
    title: 'Davantage vs D’avantage(s)',
    trapWrong: 'Nous vous donnerons d’avantage d’informations demain.',
    goldCorrect: 'Nous vous communiquerons davantage d’informations dès demain.',
    ruleExplanation: 'Au sens de « plus », « davantage » s’écrit en un seul mot sans apostrophe.',
    darijaMnemonic: 'Davantage بمعنى "أكثر" كتكتب كلمة وحدة مجموعه بلا أبوستروف!',
  },
  {
    id: 'gt-9',
    title: 'Quel que soit / Quelle que soit vs Quelque',
    trapWrong: 'Quelque soit votre demande, nous y répondrons.',
    goldCorrect: 'Quelle que soit votre demande (ou Quels que soient vos besoins), nous y répondrons.',
    ruleExplanation: 'Devant le verbe être au subjonctif (« soit / soient »), « quel que » s’écrit en deux mots et s’accorde avec le sujet qui suit.',
    darijaMnemonic: 'قدام "soit/soient"، ديما فرقها على جوج كلمات وطابقها: Quel que soit le problème / Quelle que soit la question.',
  },
  {
    id: 'gt-10',
    title: 'Suite à vs En réponse à / Faisant suite à',
    trapWrong: 'Suite à votre e-mail, je vous informe...',
    goldCorrect: 'Faisant suite à votre courriel (ou En réponse à votre message), je vous informe...',
    ruleExplanation: 'Selon l’Académie française, « Suite à » est une ellipse familière ; préférez « Faisant suite à » ou « En réponse à ».',
    darijaMnemonic: 'بلاصة "Suite à votre mail" قول "Faisant suite à votre courriel" باش تبان C1 حقيقي.',
  },
];

export const WEAKNESS_DESTROYER_DRILLS: TestGorillaQuestion[] = [
  {
    id: 'wd-1',
    category: 'Grammaire B2/C1',
    question:
      '[Micro-Drill Ciblé] Choisissez la formulation sans aucune faute de syntaxe :',
    options: [
      'Malgré que votre colis soit en retard, nous allons pallier à ce problème.',
      'Bien que votre colis accuse un retard, nous allons pallier ce contretemps.',
      'Bien que votre colis a du retard, nous allons pallier ce contretemps.',
      'Malgré votre colis soit en retard, nous pallions à cela.',
    ],
    correctIndex: 1,
    timeLimitSeconds: 30,
    explanationFr: 'Double règle d’or : « Bien que + subjonctif » (« accuse ») et « pallier + COD direct » (sans « à »).',
    explanationDarija: 'جمعنا جوج قواعد ذهبيين فـ سؤال واحد: Bien que + subjonctif و Pallier بلا à!',
    grammarRuleTag: 'Subjonctif & Conjonctions (bien que vs malgré)',
  },
  {
    id: 'wd-2',
    category: 'Registre & Politesse',
    question:
      '[Micro-Drill Ciblé] Quelle phrase respecte le conditionnel de politesse et l’orthographe de « quel que soit » ?',
    options: [
      'Je voudrais savoir quelque soit le motif quand je serai remboursé.',
      'Je souhaiterais connaître le délai de traitement, quelle que soit la complexité du dossier.',
      'Je veux connaître le délai, quel que soit la complexité du dossier.',
      'Pourrez-vous me dire quelque soit la date ?',
    ],
    correctIndex: 1,
    timeLimitSeconds: 30,
    explanationFr: '« Je souhaiterais » (conditionnel de politesse) + « quelle que soit la complexité » (accord féminin singulier en deux mots).',
    explanationDarija: 'Je souhaiterais + Quelle que soit la complexité (مؤنث ومفرقة على جوج كلمات).',
    grammarRuleTag: 'Conditionnel de politesse (je souhaiterais, pourriez-vous)',
  },
  {
    id: 'wd-3',
    category: 'Grammaire B2/C1',
    question:
      '[Micro-Drill Ciblé] Accordez correctement le participe passé et « ci-joint » :',
    options: [
      'Les attestations que je vous ai envoyé sont ci-joint.',
      'Les attestations que je vous ai envoyées figurent ci-joint.',
      'Les attestations que je vous ai envoyés sont ci-jointes.',
      'Les attestations que je vous ai envoyé vous trouverez ci-jointes.',
    ],
    correctIndex: 1,
    timeLimitSeconds: 35,
    explanationFr: '« envoyées » s’accorde avec le COD antéposé « Les attestations », et « ci-joint » placé après un verbe sans nom qui suit a une valeur adverbiale invariable (« figurent ci-joint »).',
    explanationDarija: 'Les attestations (مؤنث جمع قبل avoir) -> envoyées.',
    grammarRuleTag: 'Accord du participe passé avec avoir (COD antéposé)',
  },
  {
    id: 'wd-4',
    category: 'Registre & Politesse',
    question:
      '[Micro-Drill Ciblé] Comment transformer « Du coup je m’excuse pour le souci » en français C1 irréprochable ?',
    options: [
      'Par conséquent, je m’excuse grandement pour ce souci.',
      'Par conséquent, nous vous prions de bien vouloir nous excuser pour ce désagrément.',
      'Du coup, veuillez nous excuser pour le problème.',
      'En fait, nous nous excusons pour ce contretemps.',
    ],
    correctIndex: 1,
    timeLimitSeconds: 30,
    explanationFr: 'Remplacement de « du coup » par « Par conséquent » et de « je m’excuse » par « nous vous prions de bien vouloir nous excuser ».',
    explanationDarija: 'حيد "du coup" و "je m’excuse" وعوضهم بـ "Par conséquent, nous vous prions de bien vouloir nous excuser".',
    grammarRuleTag: 'Connecteurs logiques B2/C1 (toutefois, par conséquent, afin de)',
  },
  {
    id: 'wd-5',
    category: 'Grammaire B2/C1',
    question:
      '[Micro-Drill Ciblé] Quelle phrase emploie correctement « après que » et « davantage » ?',
    options: [
      'Après que le client ait appelé, nous lui avons donné d’avantage de détails.',
      'Après que le client a appelé, nous lui avons communiqué davantage de précisions.',
      'Après que le client ait appelé, nous lui avons communiqué davantage de précisions.',
      'Après que le client a appelé, nous lui avons donné d’avantages de détails.',
    ],
    correctIndex: 1,
    timeLimitSeconds: 30,
    explanationFr: '« Après que » + indicatif (« a appelé ») et « davantage » en un seul mot sans « s » final.',
    explanationDarija: 'Après que + Indicatif (a appelé) و davantage مجموعه بلا أبوستروف وبلا s.',
    grammarRuleTag: 'Après que + Indicatif vs Avant que + Subjonctif',
  },
];
