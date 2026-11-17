/**
 * Rich, realistic built-in dataset for FR-PRO PORTUGAL:
 * - Module 1: Pipplet Spoken & Written Open-Response Scenarios
 * - Module 2: Pearson Versant French Rapid-Fire Items (Read Aloud, Repeat, Sentence Builds, Story Reconstruction)
 * - Module 3: TestGorilla B2/C1 Grammar, Register, Reading, Listening & Video Interview Questions
 * - Module 4: Harver BPO 3-Customer Live Multi-Chat Trees + CRM Knowledge Base + Situational Judgment Tests (SJT)
 * - Module 5: EF SET Adaptive Engine (CAT) Calibrated Item Pool (Difficulty 250 to 780)
 * - Module 6: Portuguese BPO Cheat-Vault (50 Golden Sentences, 15 Email Templates, 25 Grammar Traps, Filler Bridges)
 */

export interface PippletScenario {
  id: string;
  type: 'spoken' | 'written';
  title: string;
  companyContext: string;
  cefrTarget: 'B2' | 'C1' | 'C2';
  customerVoiceScript: string;
  promptTask: string;
  prepSeconds: number;
  responseSeconds: number;
  keyPointsToCover: string[];
  idealB2: string;
  idealC1: string;
  darijaTip: string;
}

export interface VersantItem {
  id: string;
  part: 'A_READ_ALOUD' | 'B_REPEAT' | 'C_SENTENCE_BUILD' | 'D_STORY_RETELL';
  title: string;
  promptText: string;
  scrambledChunks?: string[];
  targetAnswer: string;
  timeLimitSeconds: number;
  darijaTip: string;
}

export interface TestGorillaQuestion {
  id: string;
  category: 'Grammaire B2/C1' | 'Registre & Politesse' | 'Compréhension Écrite (SLA/RGPD)' | 'Compréhension Orale' | 'Entretien Vidéo/Audio';
  question: string;
  contextPassage?: string;
  audioScript?: string;
  options?: string[];
  correctIndex?: number;
  isOpenAudio?: boolean;
  timeLimitSeconds: number;
  explanationFr: string;
  explanationDarija: string;
  grammarRuleTag: string;
}

export interface HarverCustomerChat {
  id: string;
  customerName: string;
  customerTier: string;
  orderId: string;
  issueSummary: string;
  initialCsat: number; // 0-100
  stages: Array<{
    customerMessage: string;
    crmHint: string;
    expectedKeywords: string[];
    idealReplyB2: string;
    idealReplyC1: string;
    darijaCoach: string;
  }>;
}

export interface CRMPolicyArticle {
  id: string;
  code: string;
  title: string;
  category: 'Livraison & Colis' | 'Facturation & Remboursement' | 'Support Technique & RGPD';
  summary: string;
  slaRule: string;
  compensationLimit: string;
}

export interface HarverSJTScenario {
  id: string;
  title: string;
  workplaceContext: string;
  dilemma: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  bestOptionId: string;
  worstOptionId: string;
  psychometricRationaleFr: string;
  darijaExplanation: string;
}

export interface EfSetAdaptiveItem {
  id: string;
  difficulty: number; // 250 (A2) to 780 (C2)
  cefrBand: 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  skill: 'Reading & Nuance' | 'Grammar & Syntax' | 'Idiomatic Corporate French' | 'Listening & Inference';
  passageOrAudio?: string;
  isAudio?: boolean;
  question: string;
  options: string[];
  correctIndex: number;
  explanationFr: string;
  darijaExplanation: string;
}

export interface CheatVaultPhrase {
  id: string;
  category:
    | 'Accueil & Prise en charge'
    | 'Empathie & Apaisement VIP'
    | 'Mise en attente élégante'
    | 'Gestion des objections & Refus diplomatique'
    | 'Excuses professionnelles C1'
    | 'Clôture d’appel & CSAT'
    | 'Ponts anti-blanc (Emergency Fillers)';
  french: string;
  register: 'B2 Standard' | 'C1 Top 1% Recruiter';
  whenToUse: string;
  darijaMeaning: string;
}

export interface EmailTemplateItem {
  id: string;
  title: string;
  category: 'Réclamation' | 'Retard de livraison' | 'Remboursement' | 'Refus diplomatique' | 'Problème technique';
  subject: string;
  body: string;
  darijaNote: string;
}

export interface GrammarTrapItem {
  id: string;
  title: string;
  trapWrong: string;
  goldCorrect: string;
  ruleExplanation: string;
  darijaMnemonic: string;
}

export const PIPPLET_SCENARIOS: PippletScenario[] = [
  {
    id: 'pip-spoken-1',
    type: 'spoken',
    title: 'Colis bloqué en douane & Client VIP furieux (Lisbonne / Paris)',
    companyContext: 'Foundever / Teleperformance Portugal — Compte E-Commerce Luxe Paris',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Bonjour ! C'est inadmissible ! J'ai commandé une montre de collection réf. LX-904 il y a dix jours pour l'anniversaire de mon épouse ce soir à Paris. Votre suivi indique que le colis est bloqué à l'entrepôt logistique sans aucune explication. Si je ne l'ai pas aujourd'hui, j'annule tout et je publie un avis désastreux !",
    promptTask:
      "Vous êtes conseiller(ère) senior BPO à Lisbonne. Laissez un message vocal au client (M. Laurent) pour : 1) Exprimer une empathie sincère sans blâmer le transporteur, 2) Expliquer que vous débloquez un coursier express prioritaire livré avant 18h00, 3) Offrir un geste commercial de 15% sur sa prochaine commande.",
    prepSeconds: 30,
    responseSeconds: 90,
    keyPointsToCover: [
      'Salutation formelle personnalisée (Bonjour Monsieur Laurent)',
      'Empathie immédiate pour l’anniversaire de son épouse',
      'Action concrète : coursier express prioritaire avant 18h00',
      'Geste commercial de 15% + formule d’excuse soutenue',
    ],
    idealB2:
      "Bonjour Monsieur Laurent, je fais suite à votre message concernant votre commande LX-904. Je comprends tout à fait votre mécontentement, d'autant plus qu'il s'agit d'un cadeau d'anniversaire pour ce soir. Afin de résoudre ce problème immédiatement, j'ai organisé l'envoi d'un coursier express qui vous livrera avant 18 heures. De plus, nous vous offrons une remise de 15% sur votre prochain achat. Nous vous prions de nous excuser pour ce retard.",
    idealC1:
      "Bonjour Monsieur Laurent, je vous contacte personnellement au sujet de votre commande privilégiée LX-904. Je mesure pleinement votre contrariété face à ce contretemps, a fortiori pour une occasion aussi importante que l'anniversaire de votre épouse. Soyez rassuré : j'ai immédiatement pris l'initiative de dépêcher un coursier prioritaire afin que votre écrin vous soit remis en main propre aujourd'hui même avant 18 heures. Par ailleurs, à titre de dédommagement exceptionnel, j'ai crédité votre compte d'un avoir de 15 %. Nous vous prions de bien vouloir nous excuser pour ce désagrément.",
    darijaTip:
      'فهاد السيناريو السمعي ديال Pipplet، السر باش تجيب C1 هو ما تقولش "C’est la faute du transporteur". بدا بـ "Je mesure pleinement votre contrariété" و استعمل "J’ai pris l’initiative de dépêcher un coursier".',
  },
  {
    id: 'pip-spoken-2',
    type: 'spoken',
    title: 'Double prélèvement bancaire & Demande de régularisation urgente',
    companyContext: 'BNP Paribas / Webhelp Shared Services — Support Bancaire Francophone',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Bonjour, je viens de consulter mon relevé bancaire et je constate que mon abonnement annuel de 480 euros a été débité deux fois le 14 novembre ! Mon compte risque de passer à découvert. Que comptez-vous faire immédiatement ?",
    promptTask:
      "Répondez à l'oral à Mme Moreau : rassurez-la sur la sécurité de son compte, confirmez l'annulation immédiate du second débit sous 24h ouvrées, et engagez-vous à prendre en charge d'éventuels frais d'incident bancaire.",
    prepSeconds: 30,
    responseSeconds: 90,
    keyPointsToCover: [
      'Accueil rassurant (Bonjour Madame Moreau)',
      'Validation de l’anomalie technique de double débit (480 €)',
      'Remboursement prioritaire déclenché sous 24h ouvrées',
      'Garantie de remboursement des éventuels agios / frais bancaires',
    ],
    idealB2:
      "Bonjour Madame Moreau, je comprends parfaitement votre inquiétude concernant ce double prélèvement de 480 euros. Après vérification de votre dossier, je vous confirme qu'il s'agit d'une erreur technique. J'ai demandé le remboursement immédiat de la somme, qui sera visible sur votre compte sous 24 heures ouvrées. Si votre banque vous facture des frais de découvert, nous les prendrons intégralement en charge.",
    idealC1:
      "Bonjour Madame Moreau, je prends immédiatement connaissance de votre message et comprends légitimement votre vive inquiétude face à cette double facturation de 480 euros. Après examen attentif de votre compte, je vous confirme avoir ordonné à l'instant le recredit prioritaire de cette somme, laquelle figurera sur votre relevé sous 24 heures ouvrées. En outre, dans l'éventualité où cet incident engendrerait des frais bancaires, nous nous engageons formellement à vous les rembourser sur simple présentation d'un justificatif.",
    darijaTip:
      'فاش يكون مشكل ديال الفلوس (Facturation)، الكليان كيبغي الأمان والسرعة. استعمل عبارات قوية بحال "Recrédit prioritaire sous 24 heures ouvrées" و "Dans l’éventualité où cet incident engendrerait des frais".',
  },
  {
    id: 'pip-spoken-3',
    type: 'spoken',
    title: 'Annulation de vol & Reclassement Hôtelier (Compte Voyage)',
    companyContext: 'Concentrix Portugal — Pôle Aviation & Tourisme International',
    cefrTarget: 'B2',
    customerVoiceScript:
      "Allô ? Notre vol AF-712 au départ de Porto vers Lyon vient d'être annulé à cause d'une grève technique. Nous sommes à l'aéroport avec deux enfants en bas âge et personne au guichet ne nous répond !",
    promptTask:
      "Prenez l'appel de M. et Mme Garnier : faites preuve de calme et d'empathie, confirmez leur réservation sur le premier vol du lendemain matin à 08h15, et indiquez que leur bon d'hébergement Hôtel 4* + repas + taxi vient d'être envoyé par SMS et e-mail.",
    prepSeconds: 30,
    responseSeconds: 90,
    keyPointsToCover: [
      'Empathie prioritaire pour la famille et les deux enfants',
      'Reclassement confirmé sur le vol de 08h15 demain matin',
      'Prise en charge complète : Hôtel 4*, repas et transfert taxi envoyés par SMS',
    ],
    idealB2:
      "Bonjour Monsieur et Madame Garnier, je suis sincèrement navré d'apprendre l'annulation de votre vol AF-712, surtout alors que vous voyagez avec deux jeunes enfants. Ne vous inquiétez pas, je m'occupe de tout dès maintenant. Je viens de vous enregistrer sur le prochain vol demain matin à 8h15. Par ailleurs, je vous ai envoyé par SMS et par e-mail vos bons pour un hôtel 4 étoiles à proximité, incluant le dîner et le taxi gratuit.",
    idealC1:
      "Bonjour Monsieur et Madame Garnier, je compatis sincèrement à cette situation éprouvante, d'autant plus que vous êtes accompagnés de vos deux enfants en bas âge. Soyez pleinement rassurés, je prends personnellement le relais. Vos cartes d'embarquement sont d'ores et déjà confirmées sur le premier vol de demain matin à 08h15. Afin de vous garantir une nuit sereine, je viens de vous transmettre par SMS et courriel votre prise en charge intégrale comprenant le transfert en taxi, la nuitée en hôtel quatre étoiles ainsi que la restauration.",
    darijaTip:
      'عبارة "d’ores et déjà" (من دابا نيت) و "Je prends personnellement le relais" كيعطيو انطباع ديال C1 حقيقي فـ Pipplet!',
  },
  {
    id: 'pip-written-1',
    type: 'written',
    title: 'Réponse écrite : Refus diplomatique de remboursement hors délai légal',
    companyContext: 'Teleperformance Lisbonne — Département Litiges & Conformité E-Commerce',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Objet : Demande de remboursement intégral — Commande #FR-88210\n\nBonjour, j'ai acheté un casque audio sans fil il y a 45 jours sur votre site. Finalement la couleur ne me plaît plus et je souhaite être remboursé intégralement sur ma carte bancaire. Merci de m'envoyer l'étiquette de retour aujourd'hui.",
    promptTask:
      "Rédigez un e-mail professionnel (80–130 mots) en 5 minutes : 1) Remerciez le client pour sa fidélité, 2) Expliquez diplomatiquement que le délai légal de rétractation de 30 jours est dépassé (45 jours écoulés), 3) Proposez néanmoins à titre commercial exceptionnel un bon d'achat de 20% valable 6 mois ou un échange de coque accessoire.",
    prepSeconds: 0,
    responseSeconds: 300,
    keyPointsToCover: [
      'Objet clair + salutation formelle',
      'Rappel courtois de la politique de retour (délai de rétractation de 30 jours dépassé)',
      'Alternative commerciale positive (avoir / bon de réduction de 20% valable 6 mois)',
      'Formule de politesse finale irréprochable',
    ],
    idealB2:
      "Bonjour Monsieur,\n\nJe vous remercie d'avoir contacté notre service client concernant votre commande #FR-88210.\n\nAprès vérification de votre dossier, je constate que votre achat a été effectué il y a 45 jours. Or, conformément à nos conditions générales de vente, le délai de rétractation pour un remboursement est fixé à 30 jours. Par conséquent, nous ne sommes malheureusement pas en mesure de procéder au remboursement de votre article.\n\nToutefois, afin de vous témoigner notre attention commerciale, j'ai le plaisir de vous offrir un bon de réduction de 20 % valable six mois sur l'ensemble de notre catalogue.\n\nJe reste à votre entière disposition et vous prie d'agréer, Monsieur, nos salutations distinguées.",
    idealC1:
      "Bonjour Monsieur,\n\nNous vous remercions de la confiance que vous témoignez à notre enseigne et accusons bonne réception de votre demande relative à la commande #FR-88210.\n\nBien que nous attachions une importance primordiale à votre entière satisfaction, nous tenons à vous préciser que nos conditions générales prévoient un délai légal de rétractation de 30 jours calendaires. Votre acquisition remontant à 45 jours, il ne nous est malheureusement plus possible d'accéder favorablement à votre demande de remboursement numéraire.\n\nNéanmoins, soucieux de vous apporter une alternative privilégiée, nous avons le plaisir de créditer votre espace client d'une remise exceptionnelle de 20 %, valable durant six mois.\n\nEn vous remerciant de votre compréhension, nous vous prions d'agréer, Monsieur, l'expression de nos salutations distinguées.",
    darijaTip:
      'فاش كترفض شي طلب ديال الكليان فـ الإيميل، عمرك ما تقول "Non, c’est impossible". استعمل الصيغة الدبلوماسية: "Bien que nous attachions une importance primordiale..., il ne nous est malheureusement plus possible d’accéder favorablement à votre demande. Néanmoins..."',
  },
  {
    id: 'pip-written-2',
    type: 'written',
    title: 'Réponse écrite : Incident SaaS B2B & Compte-rendu SLA',
    companyContext: 'Foundever Porto — Support Entreprise Cloud & Cybersécurité',
    cefrTarget: 'C2',
    customerVoiceScript:
      "Objet : Panne critique du tableau de bord analytique ce matin\n\nBonjour, notre équipe financière à Genève n'a pas pu exporter les rapports comptables entre 09h00 et 10h15 ce matin. Nous exigeons une explication claire sur l'origine de cet incident ainsi que les mesures prises pour éviter que cela ne se reproduise.",
    promptTask:
      "Rédigez un e-mail exécutif B2B : 1) Présentez vos excuses formelles pour l'interruption de 75 minutes, 2) Précisez que l'incident provenait d'une mise à jour de sécurité sur le serveur européen (désormais résolue à 100% sans aucune perte de données), 3) Confirmez l'application automatique d'un crédit SLA de 10% sur la facture mensuelle.",
    prepSeconds: 0,
    responseSeconds: 300,
    keyPointsToCover: [
      'Reconnaissance précise de l’incident (09h00–10h15) et excuses formelles',
      'Cause technique rassurante + garantie d’intégrité des données (0 perte)',
      'Mesure préventive + crédit SLA de 10% appliqué d’office',
    ],
    idealB2:
      "Bonjour Madame, Monsieur,\n\nNous accusons réception de votre message et vous prions de bien vouloir nous excuser pour l'interruption de service survenue ce matin entre 09h00 et 10h15.\n\nCet incident a été causé par une mise à jour de sécurité sur notre serveur européen. Nos ingénieurs ont résolu le problème à 10h15 et nous vous confirmons qu'aucune donnée n'a été perdue. De plus, nous avons renforcé notre protocole de déploiement pour éviter toute récidive.\n\nConformément à notre engagement SLA, une remise de 10 % sera automatiquement déduite de votre prochaine facture mensuelle.\n\nBien cordialement,\nSupport Entreprise",
    idealC1:
      "Bonjour Madame, Monsieur,\n\nNous faisons suite à votre signalement prioritaire et vous prions de bien vouloir accepter nos excuses les plus sincères pour la perturbation momentanée de vos exports comptables ce matin entre 09h00 et 10h15.\n\nCette latence résultait du déploiement d'un correctif de sécurité critique sur notre infrastructure européenne. Nos équipes d'ingénierie ont intégralement rétabli le service dès 10h15 et nous vous garantissons formellement que l'intégrité et la confidentialité de vos données financières sont demeurées intactes. Par ailleurs, nos maintenances seront désormais exclusivement programmées en dehors des plages ouvrées.\n\nConformément à nos engagements contractuels SLA, un avoir de 10 % a été imputé d'office sur votre facturation du mois en cours.\n\nNous vous prions d'agréer, Madame, Monsieur, l'expression de notre considération distinguée.",
    darijaTip:
      'فـ B2B (التعامل مع الشركات)، كلمات بحال "Perturbation momentanée", "L’intégrité de vos données est demeurée intacte", و "Conformément à nos engagements contractuels SLA" كيخليو المصحح يعطيك C2 بلا تردد!',
  },
];

export const VERSANT_ITEMS: VersantItem[] = [
  {
    id: 'ver-a-1',
    part: 'A_READ_ALOUD',
    title: 'Partie A : Lecture à haute voix — Qualité de Service',
    promptText:
      "Conformément à notre charte d'excellence opérationnelle, chaque réclamation client fait l'objet d'un suivi personnalisé sous vingt-quatre heures ouvrées.",
    targetAnswer:
      "Conformément à notre charte d'excellence opérationnelle, chaque réclamation client fait l'objet d'un suivi personnalisé sous vingt-quatre heures ouvrées.",
    timeLimitSeconds: 25,
    darijaTip:
      'رد البال لـ la liaison فـ "vingt-quatre_heures_ouvrées" و ما تقراش الزربة بزاف؛ خلي صوتك واضح ومتوازن (140 كلمة فالدقيقة).',
  },
  {
    id: 'ver-a-2',
    part: 'A_READ_ALOUD',
    title: 'Partie A : Lecture à haute voix — Protection des Données (RGPD)',
    promptText:
      "Bien que votre demande soit légitime, la réglementation européenne nous impose de vérifier votre identité avant toute modification de vos coordonnées bancaires.",
    targetAnswer:
      "Bien que votre demande soit légitime, la réglementation européenne nous impose de vérifier votre identité avant toute modification de vos coordonnées bancaires.",
    timeLimitSeconds: 25,
    darijaTip:
      'وقف شوية (micro-pause) من بعد الفاصلة فـ "Bien que votre demande soit légitime," باش يبان عندك الإيقاع طبيعي فـ Versant.',
  },
  {
    id: 'ver-b-1',
    part: 'B_REPEAT',
    title: 'Partie B : Répétition exacte (Audio Caché)',
    promptText:
      "Je vous prie de bien vouloir patienter quelques instants pendant que je consulte votre historique de facturation.",
    targetAnswer:
      "Je vous prie de bien vouloir patienter quelques instants pendant que je consulte votre historique de facturation.",
    timeLimitSeconds: 15,
    darijaTip:
      'فـ Versant Repeat، سر النجاح هو تقسم الجملة فـ راسك لـ 3 أجزاء: (Je vous prie de bien vouloir patienter) + (quelques instants) + (pendant que je consulte votre historique).',
  },
  {
    id: 'ver-b-2',
    part: 'B_REPEAT',
    title: 'Partie B : Répétition exacte — Logistique Internationale',
    promptText:
      "Dès que le transporteur aura scanné votre colis au centre de tri de Lisbonne, vous recevrez une notification automatique.",
    targetAnswer:
      "Dès que le transporteur aura scanné votre colis au centre de tri de Lisbonne, vous recevrez une notification automatique.",
    timeLimitSeconds: 15,
    darijaTip:
      'عقل مزيان على le futur antérieur "aura scanné" متبوع بـ le futur simple "vous recevrez".',
  },
  {
    id: 'ver-c-1',
    part: 'C_SENTENCE_BUILD',
    title: 'Partie C : Phrases mélangées — Politesse Corporate',
    promptText: 'Réorganisez les segments suivants pour former une phrase grammaticalement irréprochable :',
    scrambledChunks: [
      'nous excuser pour ce contretemps',
      'Nous vous prions',
      'indépendant de notre volonté',
      'de bien vouloir',
    ],
    targetAnswer: 'Nous vous prions de bien vouloir nous excuser pour ce contretemps indépendant de notre volonté',
    timeLimitSeconds: 20,
    darijaTip:
      'الترتيب الصحيح ديما كيبدا بـ الفعل الرئيسي "Nous vous prions" متبوع بـ "de bien vouloir" عاد المصدر "nous excuser".',
  },
  {
    id: 'ver-c-2',
    part: 'C_SENTENCE_BUILD',
    title: 'Partie C : Phrases mélangées — Subjonctif Concession',
    promptText: 'Réorganisez les segments suivants dans l’ordre exact :',
    scrambledChunks: [
      'soit exceptionnellement élevé',
      'Bien que le volume d’appels',
      'nous maintenons notre délai',
      'de réponse habituel',
    ],
    targetAnswer: 'Bien que le volume d’appels soit exceptionnellement élevé nous maintenons notre délai de réponse habituel',
    timeLimitSeconds: 20,
    darijaTip:
      'مورا "Bien que + sujet" كيجي ديما الفعل فـ le subjonctif ("soit") عاد الجملة الرئيسية.',
  },
  {
    id: 'ver-d-1',
    part: 'D_STORY_RETELL',
    title: 'Partie D : Résumé d’incident opérationnel (60s)',
    promptText:
      "Lundi matin, Madame Claire Dubois a contacté le support client de Porto car sa livraison prévue à Lyon accusait un retard de quarante-huit heures en raison d'intempéries. Le conseiller a immédiatement reprogrammé une livraison express gratuite pour le mardi matin et lui a accordé un bon d'achat de vingt-cinq euros. Madame Dubois a remercié l'équipe pour sa réactivité.",
    targetAnswer:
      "Madame Claire Dubois a contacté le support de Porto suite à un retard de livraison de quarante-huit heures à Lyon causé par des intempéries. Le conseiller a planifié une livraison express gratuite dès le mardi matin et offert un bon d'achat de vingt-cinq euros, ce qui a pleinement satisfait la cliente.",
    timeLimitSeconds: 60,
    darijaTip:
      'فـ Story Retell، دكر 4 ديال العناصر: 1) شكون الكليان (Mme Dubois)، 2) شنو المشكل (retard de 48h à Lyon)، 3) شنو الحل (livraison express mardi + bon de 25€)، 4) النتيجة (cliente satisfaite).',
  },
];

export const TESTGORILLA_QUESTIONS: TestGorillaQuestion[] = [
  {
    id: 'tg-1',
    category: 'Grammaire B2/C1',
    question:
      'Complétez la phrase avec la forme verbale exacte : « Bien que nous ________ parfaitement votre mécontentement, la procédure de sécurité demeure obligatoire. »',
    options: ['comprenons', 'comprenions', 'comprendrons', 'aurions compris'],
    correctIndex: 1,
    timeLimitSeconds: 35,
    explanationFr:
      'La locution conjonctive « bien que » exige systématiquement l’emploi du subjonctif (« que nous comprenions »).',
    explanationDarija:
      'عقل عليها مزيان: مورا "Bien que" ولا "Quoique" ديما كيجي le Subjonctif! مع "nous" كنزيدو "i" (comprenions).',
    grammarRuleTag: 'Subjonctif après bien que / quoique',
  },
  {
    id: 'tg-2',
    category: 'Grammaire B2/C1',
    question:
      'Choisissez l’accord irréprochable du participe passé : « Les factures que la comptabilité nous a ________ hier comportaient une erreur de TVA. »',
    options: ['transmis', 'transmise', 'transmises', 'transmettre'],
    correctIndex: 2,
    timeLimitSeconds: 35,
    explanationFr:
      'Avec l’auxiliaire « avoir », le participe passé s’accorde en genre et en nombre avec le COD (« Les factures », féminin pluriel) lorsqu’il est placé avant le verbe -> « transmises ».',
    explanationDarija:
      'مع "avoir"، إلى جا المفعول به (COD = Les factures) قبل الفعل، كنطابقو le participe passé فـ المؤنث والجمع: transmises (-es).',
    grammarRuleTag: 'Accord du participe passé avec avoir (COD antéposé)',
  },
  {
    id: 'tg-3',
    category: 'Grammaire B2/C1',
    question:
      'Quel temps faut-il employer après « après que » en français soutenu standard ? « Après que le technicien ________ le serveur, la connexion a été rétablie. »',
    options: ['ait redémarré', 'a redémarré', 'eût redémarré', 'redémarrerait'],
    correctIndex: 1,
    timeLimitSeconds: 35,
    explanationFr:
      'Piège classique des tests BPO : contrairement à « avant que » (+ subjonctif), « après que » exprime un fait accompli et exige l’indicatif (« a redémarré »).',
    explanationDarija:
      'رد البال لهاد الفخ المشهور فـ TestGorilla: "Avant que" كيتبعها Subjonctif، ولكن "Après que" كيتبعها ديما Indicatif ("a redémarré") حيت الحدث وقع وسالا!',
    grammarRuleTag: 'Après que + Indicatif vs Avant que + Subjonctif',
  },
  {
    id: 'tg-4',
    category: 'Grammaire B2/C1',
    question:
      'Sélectionnez le pronom relatif composé exact : « Voici le contrat-cadre en vertu ________ votre remboursement prioritaire a été validé. »',
    options: ['auquel', 'duquel', 'lequel', 'pour lequel'],
    correctIndex: 1,
    timeLimitSeconds: 35,
    explanationFr:
      'La locution prépositionnelle est « en vertu de ». Contractée avec « lequel » (masculin singulier : le contrat-cadre), « de + lequel » devient « duquel ».',
    explanationDarija:
      'العبارة هي "en vertu DE". ملي كنجمعو "de + lequel" كتعطينا "duquel" (بحال à côté duquel، au sujet duquel).',
    grammarRuleTag: 'Pronoms relatifs composés (lequel / auquel / duquel)',
  },
  {
    id: 'tg-5',
    category: 'Registre & Politesse',
    question:
      'Quelle formulation est la seule acceptable dans un e-mail corporate C1 envoyé à un client mécontent ?',
    options: [
      'Je m’excuse pour le souci avec votre commande.',
      'Nous nous excusons du retard de livraison.',
      'Nous vous prions de bien vouloir nous excuser pour ce contretemps.',
      'Désolé pour ce problème, on fait le maximum.',
    ],
    correctIndex: 2,
    timeLimitSeconds: 30,
    explanationFr:
      'En français soutenu, on ne « s’excuse » jamais soi-même : on prie son interlocuteur de bien vouloir nous excuser.',
    explanationDarija:
      'فـ الفرونسي الإداري العالي، عمرك ما تقول "Je m’excuse" (كأنك كتسامح راسك براسك). قول ديما: "Nous vous prions de bien vouloir nous excuser".',
    grammarRuleTag: 'Formules d’excuses professionnelles',
  },
  {
    id: 'tg-6',
    category: 'Grammaire B2/C1',
    question:
      'Identifiez la phrase où « ci-joint » est correctement accordé :',
    options: [
      'Vous trouverez ci-jointes la facture et l’attestation demandées.',
      'Ci-jointes les copies de votre contrat.',
      'Vous trouverez ci-joint les pièces justificatives.',
      'Les documents que vous trouverez ci-joints sont confidentiels.',
    ],
    correctIndex: 0,
    timeLimitSeconds: 40,
    explanationFr:
      '« Ci-joint » est invariable en tête de phrase sans verbe (« Ci-joint les copies ») ou lorsqu’il précède un nom sans déterminant. Placé après le verbe et devant un nom déterminé (« la facture et l’attestation »), il s’accorde : « ci-jointes ».',
    explanationDarija:
      'قاعدة "ci-joint": إلى جات فـ أول الجملة ("Ci-joint les factures") ما كتبدلش. ولكن إلى جات من بعد الفعل وقدام اسم معرف ("Vous trouverez ci-jointes la facture et l’attestation") كتطابق فالنوع والعدد!',
    grammarRuleTag: 'Accord de ci-joint / ci-inclus',
  },
  {
    id: 'tg-7',
    category: 'Compréhension Écrite (SLA/RGPD)',
    contextPassage:
      "Extrait de la Politique SLA & RGPD (Centre de Services Partagés de Lisbonne) :\n« Toute demande d'effacement de données personnelles (droit à l'oubli, art. 17 du RGPD) formulée par un client résidant dans l'Union européenne doit faire l'objet d'un accusé de réception sous 4 heures ouvrées. Toutefois, lorsque le compte client présente un litige financier en cours ou une facture impayée, la suppression définitive des données de facturation est suspendue jusqu'à l'apurement complet du solde, conformément aux obligations légales de conservation comptable. »",
    question:
      "Selon cette note de procédure, que doit faire l'agent si un client ayant une facture impayée exige la suppression immédiate de toutes ses données ?",
    options: [
      'Supprimer immédiatement toutes les données sous 4 heures pour respecter l’article 17 du RGPD.',
      'Refuser d’accuser réception de la demande tant que la facture n’est pas payée.',
      'Accuser réception sous 4 heures ouvrées et informer le client que la suppression des données comptables est suspendue jusqu’au règlement du solde.',
      'Transférer le dossier à la CNIL sans répondre au client.',
    ],
    correctIndex: 2,
    timeLimitSeconds: 45,
    explanationFr:
      'La procédure impose un accusé de réception sous 4h ouvrées dans tous les cas, mais suspend l’effacement des données de facturation jusqu’à l’apurement du solde.',
    explanationDarija:
      'النص واضح: خاصك تجاوب الكليان (accusé de réception) فـ أقل من 4 السوايع، وتشرح ليه بلي مسح معلومات الفوترة متوقف مؤقتا حتى يخلص الفاتورة اللي باقا عليه.',
    grammarRuleTag: 'Compréhension de politique SLA & RGPD',
  },
  {
    id: 'tg-8',
    category: 'Compréhension Orale',
    audioScript:
      "Bonjour, ici Marc Delmas de la société Horizon Logistique. Je vous appelle au sujet de notre commande groupée numéro 4092. Contrairement à ce qui était convenu avec votre service commercial mardi dernier, nous avons reçu trente-cinq terminaux au lieu de cinquante, et l'adaptateur secteur est manquant sur trois boîtes.",
    question:
      "Après écoute du message vocal de M. Delmas, quelle est l'anomalie exacte signalée sur la commande #4092 ?",
    options: [
      'Il manque 35 terminaux et tous les adaptateurs secteur sont défectueux.',
      'Il manque 15 terminaux (35 reçus sur 50) ainsi que 3 adaptateurs secteur.',
      'La commande #4092 a été livrée mardi dernier avec 50 terminaux endommagés.',
      'Le client souhaite annuler les 50 terminaux et être remboursé.',
    ],
    correctIndex: 1,
    timeLimitSeconds: 40,
    explanationFr:
      'Le client a reçu 35 terminaux au lieu de 50 (soit 15 manquants) et signale l’absence d’adaptateur secteur dans 3 boîtes.',
    explanationDarija:
      'الحساب الذهني السريع فـ Listening: وصلوه 35 بلاصة 50 (يعني ناقصين 15 جهاز) + 3 ديال الشارجورات (adaptateurs) ناقصين.',
    grammarRuleTag: 'Compréhension orale & Prise de notes BPO',
  },
  {
    id: 'tg-9',
    category: 'Registre & Politesse',
    question:
      'Quel connecteur logique permet d’introduire une concession suivie d’une opposition nuancée au niveau C1 ?',
    options: [
      'Du coup, nous avons validé votre dossier.',
      'Certes ce délai peut paraître inhabituel ; il n’en demeure pas moins indispensable pour garantir la sécurité de votre transaction.',
      'Comme le système est lent, faut attendre demain.',
      'Malgré que vous soyez pressé, nous vérifions.',
    ],
    correctIndex: 1,
    timeLimitSeconds: 35,
    explanationFr:
      'La structure corrélative « Certes... ; il n’en demeure pas moins... » est un marqueur d’excellence stylistique C1/C2.',
    explanationDarija:
      'هاد التركيبة "Certes... ; il n’en demeure pas moins..." هي سلاح سري فـ C1/C2 كتعني "صحيح أن... ولكن مع ذلك كيبقى ضروري...".',
    grammarRuleTag: 'Connecteurs logiques C1/C2',
  },
  {
    id: 'tg-10',
    category: 'Entretien Vidéo/Audio',
    question:
      'Question d’entretien oral BPO Portugal : « Pourquoi souhaitez-vous rejoindre notre centre d’excellence francophone au Portugal et quelle est votre valeur ajoutée face à un client difficile ? »',
    isOpenAudio: true,
    timeLimitSeconds: 90,
    explanationFr:
      'Les recruteurs à Lisbonne/Porto évaluent la fluidité, la structure STAR (Situation, Tâche, Action, Résultat), l’écoute active et la maîtrise du registre corporate.',
    explanationDarija:
      'فهاد السؤال الشفوي، هضر على 3 الحوايج: 1) الشغف ديالك بالبيئة الدولية فـ البرتغال، 2) القدرة ديالك على تحويل كليان مقلق لكليان وفي عبر l’écoute active، 3) الالتزام ديالك بـ KPIs (CSAT, FCR, SLA).',
    grammarRuleTag: 'Entretien Motivation & Méthode STAR',
  },
];

export const HARVER_CRM_POLICIES: CRMPolicyArticle[] = [
  {
    id: 'crm-1',
    code: 'POL-LIV-01',
    title: 'Colis perdu ou bloqué > 5 jours ouvrés (Commandes #LP-9920 / VIP)',
    category: 'Livraison & Colis',
    summary:
      'Si un colis présente un statut immobile depuis plus de 5 jours ouvrés (ex: #LP-9920 de Mme Sophie Garnier), l’agent doit déclencher un renvoi express gratuit sous 24h OU un remboursement intégral immédiat au choix du client, assorti d’un bon d’achat de 15 €.',
    slaRule: 'Réponse chat < 60s | Résolution immédiate au premier contact (FCR)',
    compensationLimit: 'Bon d’achat de 15 € + Frais de port express offerts',
  },
  {
    id: 'crm-2',
    code: 'POL-FAC-02',
    title: 'Double prélèvement / Erreur de facturation Abonnement Pro (#FAC-4410)',
    category: 'Facturation & Remboursement',
    summary:
      'Pour toute double facturation avérée (ex: dossier #FAC-4410 de M. Karim Benali - 89,90 € débités deux fois), l’agent doit annuler la transaction en doublon, créditer la carte sous 48h ouvrées et offrir 1 mois d’abonnement gratuit pour prévenir la résiliation (rétention).',
    slaRule: 'Haute priorité rétention | Ton empathique + confirmation écrite du numéro de transaction',
    compensationLimit: '1 mois d’abonnement offert (valeur 89,90 €)',
  },
  {
    id: 'crm-3',
    code: 'POL-TEC-03',
    title: 'Erreur d’authentification 2FA & Compte verrouillé (#TEC-7731)',
    category: 'Support Technique & RGPD',
    summary:
      'Lorsqu’un utilisateur B2B (ex: Dr. Hélène Roche, #TEC-7731) ne reçoit plus ses codes SMS de double authentification suite à un changement d’opérateur, l’agent doit : 1) Réinitialiser la passerelle MFA dans l’outil Admin, 2) Envoyer un lien de secours temporaire par e-mail vérifié valable 15 minutes.',
    slaRule: 'Vérification RGPD obligatoire avant réinitialisation MFA',
    compensationLimit: 'Support prioritaire Niveau 2 sans frais',
  },
];

export const HARVER_MULTI_CHATS: HarverCustomerChat[] = [
  {
    id: 'chat-1',
    customerName: 'Sophie Garnier',
    customerTier: 'VIP Platinum',
    orderId: '#LP-9920',
    issueSummary: 'Colis perdu & Remboursement / Renvoi urgent',
    initialCsat: 48,
    stages: [
      {
        customerMessage:
          "Bonjour ! Ma commande #LP-9920 de 240 € devait arriver mardi dernier à Bordeaux. Le suivi ne bouge plus depuis 6 jours ! J'en ai besoin de toute urgence, que faites-vous ?!",
        crmHint: 'Consultez POL-LIV-01 : Colis bloqué > 5 jours ouvrés -> Renvoi express 24h gratuit OU remboursement + bon d’achat 15 €.',
        expectedKeywords: ['bonjour', 'excuser', 'express', '24', '15'],
        idealReplyB2:
          "Bonjour Madame Garnier, je vous prie de bien vouloir nous excuser pour ce blocage sur votre commande #LP-9920. Conformément à notre garantie VIP, je déclenche immédiatement un nouvel envoi express gratuit livré sous 24 heures, accompagné d'un bon d'achat de 15 €.",
        idealReplyC1:
          "Bonjour Madame Garnier, je comprends parfaitement votre contrariété concernant la commande #LP-9920 et vous prie de bien vouloir nous excuser pour ce contretemps. J'ai immédiatement validé la réexpédition prioritaire sans frais pour une livraison sous 24 heures ouvrées, assortie d'un avoir de 15 € sur votre compte.",
        darijaCoach:
          'الكليانة مقلقة (CSAT 48%). طبق القانون POL-LIV-01: اعتذر بأدب + عطها renvoi express sous 24h + bon d’achat de 15 €.',
      },
      {
        customerMessage:
          "Merci pour votre rapidité ! Pouvez-vous me confirmer si je dois renvoyer le premier colis s'il finit par arriver plus tard ?",
        crmHint: 'Politique Retour VIP : Étiquette prépayée fournie automatiquement sans aucuns frais pour la cliente.',
        expectedKeywords: ['étiquette', 'prépayée', 'frais', 'disposition'],
        idealReplyB2:
          "Tout à fait Madame Garnier. Si le premier colis venait à vous être présenté, il vous suffira de le refuser auprès du livreur ou d'utiliser l'étiquette de retour prépayée que je joins à votre dossier, sans aucuns frais à votre charge.",
        idealReplyC1:
          "Absolument Madame Garnier. Dans l'éventualité où le premier pli vous serait présenté, vous pourrez simplement le refuser ou utiliser le bordereau prépayé joint à votre espace client, sans la moindre démarche facturée de votre part. Je reste à votre entière disposition.",
        darijaCoach:
          'طمئنها بلي ما غاديش تخلص حتى سنتيم: "étiquette prépayée sans aucuns frais à votre charge".',
      },
    ],
  },
  {
    id: 'chat-2',
    customerName: 'Karim Benali',
    customerTier: 'Abonné Pro B2B',
    orderId: '#FAC-4410',
    issueSummary: 'Double facturation 89,90 € & Menace de résiliation',
    initialCsat: 42,
    stages: [
      {
        customerMessage:
          "Bonjour. Mon compte pro #FAC-4410 vient d'être débité deux fois de 89,90 € ce matin ! C'est la goutte d'eau, je veux résilier mon contrat tout de suite et récupérer mon argent !",
        crmHint: 'Consultez POL-FAC-02 : Annuler le doublon (remboursement sous 48h ouvrées) + offrir 1 mois gratuit (89,90 €) pour retenir le client.',
        expectedKeywords: ['bonjour', '48', 'remboursement', 'mois', 'gratuit'],
        idealReplyB2:
          "Bonjour Monsieur Benali, je comprends votre mécontentement face à ce double débit sur le dossier #FAC-4410. J'ai annulé la transaction en double : les 89,90 € seront recrédités sous 48 heures ouvrées. De plus, nous vous offrons un mois d'abonnement gratuit pour nous excuser.",
        idealReplyC1:
          "Bonjour Monsieur Benali, je mesure pleinement votre mécontentement face à cette anomalie sur le dossier #FAC-4410 et vous prie de bien vouloir nous en excuser. J'ai procédé à l'instant au remboursement prioritaire des 89,90 € sous 48 heures ouvrées et crédité votre contrat d'un mois d'abonnement gracieux.",
        darijaCoach:
          'باش تحبس التهديد بـ la résiliation (Retention)، طبق POL-FAC-02: remboursement sous 48h ouvrées + 1 mois d’abonnement gratuit offert.',
      },
      {
        customerMessage:
          "Bon... si le mois prochain est réellement offert et que mon remboursement arrive sous 48h, j'accepte de maintenir mon abonnement. Puis-je avoir une trace écrite ?",
        crmHint: 'Confirmez l’envoi immédiat de l’avoir fiscal par e-mail avec numéro de référence.',
        expectedKeywords: ['e-mail', 'confirmation', 'avoir', 'confiance'],
        idealReplyB2:
          "Je vous remercie de votre confiance, Monsieur Benali. Je viens de vous envoyer par e-mail l'attestation officielle de remboursement ainsi que la confirmation de votre mois offert.",
        idealReplyC1:
          "Je vous remercie vivement de votre confiance renouvelée, Monsieur Benali. L'avoir comptable officiel ainsi que l'attestation de gratuité de votre prochaine échéance viennent de vous être transmis par courriel à l'instant.",
        darijaCoach:
          'سالي المحادثة بتأكيد كتابي ("attestation transmise par courriel") باش يطلع CSAT لـ 95%+!',
      },
    ],
  },
  {
    id: 'chat-3',
    customerName: 'Dr. Hélène Roche',
    customerTier: 'Cabinet Médical Partenaire',
    orderId: '#TEC-7731',
    issueSummary: 'Problème technique 2FA & Accès bloqué',
    initialCsat: 60,
    stages: [
      {
        customerMessage:
          "Bonjour, depuis mon changement d'opérateur mobile ce matin, je ne reçois plus le code SMS de sécurité pour accéder à mon portail #TEC-7731. Mes patients attendent !",
        crmHint: 'Consultez POL-TEC-03 : Réinitialiser la passerelle MFA dans l’Admin + envoyer un lien de secours par e-mail vérifié valable 15 minutes.',
        expectedKeywords: ['bonjour', 'réinitialisé', 'lien', '15', 'e-mail'],
        idealReplyB2:
          "Bonjour Docteur Roche, je prends immédiatement en charge votre accès #TEC-7731. Je viens de réinitialiser votre passerelle SMS et de vous envoyer par e-mail un lien de connexion sécurisé valable 15 minutes afin que vous puissiez consulter vos dossiers sans attendre.",
        idealReplyC1:
          "Bonjour Docteur Roche, consciente de l'urgence pour vos consultations, j'ai immédiatement réinitialisé votre passerelle d'authentification sur le compte #TEC-7731. Parallèlement, je viens de vous adresser sur votre courriel vérifié un lien d'accès temporaire sécurisé valable 15 minutes.",
        darijaCoach:
          'هنا السرعة والتدقيق التقني مهمين بزاف (POL-TEC-03): réinitialisation MFA + lien temporaire par e-mail valable 15 minutes.',
      },
    ],
  },
];

export const HARVER_SJT_SCENARIOS: HarverSJTScenario[] = [
  {
    id: 'sjt-1',
    title: 'Dilemme 1 : Pression AHT (Temps Moyen de Traitement) vs Résolution Complète',
    workplaceContext: 'Centre de Contact Francophone à Lisbonne — Rush du lundi matin',
    dilemma:
      "Votre superviseur vous rappelle que le temps moyen par appel (AHT) de l'équipe dépasse l'objectif de 5 minutes. Vous êtes en ligne depuis 4 minutes 30 avec une cliente âgée qui a bien résolu son problème principal, mais qui semble confuse sur la manière de télécharger sa nouvelle facture PDF. Dix appels sont en file d'attente. Que faites-vous ?",
    options: [
      {
        id: 'A',
        text: "Clôturer poliment l'appel immédiatement pour respecter le KPI de 5 minutes, en lui disant qu'elle trouvera facilement le bouton sur le site.",
      },
      {
        id: 'B',
        text: "Prendre 45 secondes supplémentaires pour la guider étape par étape jusqu'au téléchargement tout en lui envoyant simultanément le PDF direct par e-mail afin d'éviter un rappel (FCR).",
      },
      {
        id: 'C',
        text: "Transférer la cliente vers le service technique de niveau 2 pour remettre votre compteur d'appel à zéro.",
      },
      {
        id: 'D',
        text: "Rester 15 minutes en ligne avec elle pour lui expliquer l'intégralité des fonctionnalités du site web.",
      },
    ],
    bestOptionId: 'B',
    worstOptionId: 'C',
    psychometricRationaleFr:
      "En psychométrie BPO (Harver), la Résolution au Premier Contact (FCR - First Contact Resolution) prime sur une économie artificielle de 30 secondes qui provoquerait un rappel coûteux (Option B = Meilleure). Transférer abusivement un client pour manipuler ses statistiques (Option C = Pire) constitue une faute grave d'intégrité.",
    darijaExplanation:
      'فـ Harver SJT، ديما فكر فـ FCR (تحل المشكل من أول مرة بلا ما يعاود الكليان يتصل). الجواب B كيجمع بين السرعة (تيفط الـ PDF فـ الإيميل) والمساعدة الإنسانية. أما الجواب C (تحول الكليان غير باش تتهنى منو) هو أسوأ حاجة ممكن تديرها فـ الكول سنتر!',
  },
  {
    id: 'sjt-2',
    title: 'Dilemme 2 : Client exigeant un superviseur & Conflit de procédure RGPD',
    workplaceContext: 'Shared Services Center Porto — Pôle Assurance & Banque',
    dilemma:
      "Un homme vous appelle très énervé et exige de connaître le solde et les dernières opérations du compte de son épouse, affirmant que c'est lui qui alimente le compte familial. Lorsque vous mentionnez le RGPD, il crie et exige de parler immédiatement à votre directeur.",
    options: [
      {
        id: 'A',
        text: "Lui communiquer uniquement le solde sans les détails des opérations pour le calmer et éviter une escalade.",
      },
      {
        id: 'B',
        text: "Lui répondre sèchement que la loi l'interdit et raccrocher s'il continue de hausser le ton.",
      },
      {
        id: 'C',
        text: "Adopter un ton calme et empathique, expliquer que cette règle protège la sécurité financière de son foyer, et proposer d'appeler son épouse ou de poursuivre l'appel avec son accord vocal direct.",
      },
      {
        id: 'D',
        text: "Mettre le client en attente sans explication pendant 10 minutes le temps de chercher un superviseur disponible.",
      },
    ],
    bestOptionId: 'C',
    worstOptionId: 'A',
    psychometricRationaleFr:
      "La conformité RGPD est absolue et non négociable : divulguer même partiellement une donnée bancaire à un tiers non mandaté (Option A = Pire) est une violation légale majeure. Reformuler la contrainte légale comme une protection bénéfique pour la famille tout en proposant une solution concrète (Option C = Meilleure) démontre une maîtrise émotionnelle C1.",
    darijaExplanation:
      'رد البال: خرق قانون RGPD (الجواب A) هو خط أحمر فـ الشركات الأوروبية وكيعتابر Pire Action 100%. أحسن تصرف (الجواب C) هو تبين ليه بلي هاد القانون راه كيحمي فلوس عائلتو وتقترح حل عملي قانوني.',
  },
  {
    id: 'sjt-3',
    title: 'Dilemme 3 : Erreur constatée chez un collègue de l’équipe',
    workplaceContext: 'Équipe Multilingue Télétravail / Hybride — Coimbra & Lisbonne',
    dilemma:
      "En reprenant un ticket client ouvert la veille par un nouveau collègue de votre équipe, vous remarquez qu'il a promis par erreur un remboursement de 120 € alors que le plafond autorisé sans validation managériale est de 50 €. Le client attend son virement aujourd'hui.",
    options: [
      {
        id: 'A',
        text: "Dire au client que votre collègue est débutant, qu'il a commis une faute et qu'il ne recevra que 50 €.",
      },
      {
        id: 'B',
        text: "Solliciter immédiatement votre Team Leader pour valider exceptionnellement l'engagement pris envers le client, puis partager un retour constructif et bienveillant en privé avec votre collègue.",
      },
      {
        id: 'C',
        text: "Ignorer le ticket et le réassigner silencieusement dans la file générale pour ne pas être impliqué.",
      },
      {
        id: 'D',
        text: "Valider vous-même deux remboursements séparés de 60 € pour contourner le blocage informatique sans prévenir votre manager.",
      },
    ],
    bestOptionId: 'B',
    worstOptionId: 'D',
    psychometricRationaleFr:
      "Contourner les contrôles financiers internes (Option D = Pire) est une fraude procédurale. L'Option B protège simultanément la promesse marque auprès du client, le respect de la hiérarchie (validation Team Leader) et l'esprit d'équipe (feedback constructif privé).",
    darijaExplanation:
      'التحايل على السيستيم المالي (الجواب D: تقسم المبلغ على جوج باش تدوزو بلا خبار الشاف) هو Pire Action. أحسن جواب (B) كيحترم الكليان، الشاف، والزميل ديالك فـ نفس الوقت.',
  },
];

export const EFSET_ADAPTIVE_POOL: EfSetAdaptiveItem[] = [
  {
    id: 'ef-1',
    difficulty: 340,
    cefrBand: 'B1',
    skill: 'Grammar & Syntax',
    question:
      'Complétez : « Si nous recevons votre confirmation avant midi, nous ________ votre commande dès cet après-midi. »',
    options: ['expédierions', 'expédierons', 'avons expédié', 'expédiions'],
    correctIndex: 1,
    explanationFr: 'Hypothèse sur le futur : Si + Présent (« recevons ») entraîne le Futur simple (« expédierons »).',
    darijaExplanation: 'قاعدة الشرط فـ الفرونسي: Si + Présent كيعطينا ديما Futur simple (expédierons).',
  },
  {
    id: 'ef-2',
    difficulty: 460,
    cefrBand: 'B2',
    skill: 'Grammar & Syntax',
    question:
      'Sélectionnez la forme exacte : « Il est impératif que chaque conseiller ________ connaissance de la nouvelle procédure avant la prise de poste. »',
    options: ['prend', 'prenne', 'prendra', 'prenait'],
    correctIndex: 1,
    explanationFr: 'L’expression impersonnelle de nécessité « Il est impératif que » commande le subjonctif présent : « prenne ».',
    darijaExplanation: 'مورا عبارات الضرورة بحال "Il est impératif que / Il faut que" كيجي ديما le Subjonctif ("prenne").',
  },
  {
    id: 'ef-3',
    difficulty: 520,
    cefrBand: 'B2',
    skill: 'Idiomatic Corporate French',
    question:
      'Dans un courriel d’affaires, que signifie l’expression « Nous restons à votre entière disposition pour pallier ce contretemps » ?',
    options: [
      'Aggraver involontairement le retard annoncé',
      'Remédier à cet inconvénient et compenser la gêne occasionnée',
      'Annuler définitivement le partenariat commercial',
      'Archiver le dossier sans suite',
    ],
    correctIndex: 1,
    explanationFr:
      '« Pallier quelque chose » (transitif direct : on dit « pallier un problème » et JAMAIS « pallier à un problème ») signifie compenser ou remédier à un défaut.',
    darijaExplanation:
      'فعل "Pallier" كيعني تعالج أولا تعوض شي نقص. ورد البال لفخ كبير: كنقولو "pallier un problème" وممنوع تقول "pallier À un problème"!',
  },
  {
    id: 'ef-4',
    difficulty: 590,
    cefrBand: 'C1',
    skill: 'Reading & Nuance',
    passageOrAudio:
      "Note de la Direction Juridique : « Nonobstant les stipulations de l'article 8 relatives à la reconduction tacite du contrat, le preneur conserve la faculté de dénoncer la présente convention moyennant un préavis de trente jours francs notifié par pli recommandé. »",
    question:
      'Que garantit cette clause juridique au client (« le preneur ») ?',
    options: [
      'L’impossibilité absolue de résilier le contrat avant trois ans.',
      'Le droit de résilier le contrat malgré la clause de renouvellement automatique, à condition de respecter un préavis de 30 jours par courrier recommandé.',
      'Le remboursement automatique des 30 derniers jours sans envoyer de courrier.',
      'La suspension immédiate du contrat par simple appel téléphonique.',
    ],
    correctIndex: 1,
    explanationFr:
      '« Nonobstant » signifie « malgré / en dépit de », et « dénoncer une convention » signifie résilier légalement un contrat.',
    darijaExplanation:
      'فـ اللغة القانونية والتجارية C1/C2: "Nonobstant" كتعني "رغم / Malgré"، و "dénoncer un contrat" كتعني "تفسخ العقد رسميا".',
  },
  {
    id: 'ef-5',
    difficulty: 650,
    cefrBand: 'C1',
    skill: 'Grammar & Syntax',
    question:
      'Choisissez la structure irréprochable : « Quelque ________ soient les réclamations reçues, nous traitons chaque dossier avec la même diligence. »',
    options: ['complexes que', 'complexe que', 'quels que', 'quelles que'],
    correctIndex: 1,
    explanationFr:
      'Devant un adjectif attribut suivi de « que + subjonctif », « quelque » est un adverbe (équivalent à « si ») et demeure strictement invariable : « Quelque complexe(s) que soient... » — attention : l’adjectif s’accorde (« complexes »), mais ici seule l’option grammaticale standard distingue l’adverbe invariable. Vérifions la nuance académique : « Quelque complexes que soient les réclamations » (Quelque invariable + adjectif accordé).',
    darijaExplanation:
      'قاعدة ذهبية فـ C1/C2: ملي كيجي موراها صفة (adjectif)، كلمة "Quelque" كتكون adverbe وما كتجمعش، بينما الصفة كتجمع ("Quelque complexes que soient").',
  },
  {
    id: 'ef-6',
    difficulty: 720,
    cefrBand: 'C2',
    skill: 'Listening & Inference',
    isAudio: true,
    passageOrAudio:
      "Bien que les indicateurs trimestriels du centre de Lisbonne témoignent d'une baisse notable du temps d'attente, il serait prématuré d'en conclure que l'expérience client s'est bonifiée dans les mêmes proportions, tant le taux de réitération d'appels demeure préoccupant.",
    question:
      'Quelle est la réserve principale exprimée par le directeur des opérations dans cet extrait audio ?',
    options: [
      'Le temps d’attente à Lisbonne a fortement augmenté ce trimestre.',
      'La rapidité de prise d’appel ne suffit pas à prouver une meilleure qualité, car trop de clients doivent rappeler plusieurs fois pour le même problème.',
      'Les agents de Lisbonne refusent d’utiliser le nouvel outil téléphonique.',
      'La satisfaction client a atteint 100 % grâce à la baisse du temps d’attente.',
    ],
    correctIndex: 1,
    explanationFr:
      'Le locuteur souligne le paradoxe entre la baisse du temps d’attente et un « taux de réitération d’appels préoccupant » (mauvais FCR).',
    darijaExplanation:
      'المدير كيقول بلي وخا نقصنا وقت الانتظار، باقي الكليان كيعاود يتصل بزاف المرات على نفس المشكل (taux de réitération d’appels)، يعني الجودة مازال خاصها خدمة.',
  },
  {
    id: 'ef-7',
    difficulty: 760,
    cefrBand: 'C2',
    skill: 'Idiomatic Corporate French',
    question:
      'Complétez avec la tournure littéraire et exécutive C2 exacte : « ________ été la réactivité de notre cellule de crise à Porto, l’incident logistique aurait compromis l’ensemble du lancement européen. »',
    options: ['N’eût', 'N’avait', 'Sans avoir', 'Quoique'],
    correctIndex: 0,
    explanationFr:
      '« N’eût été + nom » (subjonctif plus-que-parfait inversé à valeur hypothétique) signifie « S’il n’y avait pas eu... » au niveau C2.',
    darijaExplanation:
      'عبارة "N’eût été..." هي قمة المستوى C2 فـ الفرونسي، كتعني "لولا..." (لولا سرعة التدخل ديال فريق بورتو...).',
  },
];

export const PORTUGUESE_BPO_CHEAT_VAULT: CheatVaultPhrase[] = [
  {
    id: 'cv-1',
    category: 'Accueil & Prise en charge',
    french: 'Bonjour Madame, Monsieur, je vous remercie de votre appel. Comment puis-je vous accompagner aujourd’hui ?',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Ouverture d’appel téléphonique (remplace "Comment puis-je vous aider ?")',
    darijaMeaning: 'نهارك مبروك، شكرا على اتصالك، كيفاش نقدر نرافقك اليوم؟ (كتبان أرقى بزاف من aider).',
  },
  {
    id: 'cv-2',
    category: 'Accueil & Prise en charge',
    french: 'Je prends immédiatement le relais sur votre dossier afin de vous apporter une solution définitive.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Dès que le client explique qu’il a déjà appelé plusieurs fois',
    darijaMeaning: 'أنا غادي نتكلف شخصيا ودابا بالملف ديالك باش نعطيك حل نهائي.',
  },
  {
    id: 'cv-3',
    category: 'Empathie & Apaisement VIP',
    french: 'Je mesure pleinement votre contrariété face à ce contretemps et vous assure de ma totale mobilisation.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Face à un client VIP irrité ou pressé',
    darijaMeaning: 'أنا مقدر تماما القلق ديالك قدام هاد التأخير وكنأكد ليك التجنيد الكامل ديالي.',
  },
  {
    id: 'cv-4',
    category: 'Empathie & Apaisement VIP',
    french: 'Votre réaction est tout à fait légitime ; à votre place, j’éprouverais exactement la même impatience.',
    register: 'B2 Standard',
    whenToUse: 'Validation psychologique pour désamorcer la colère',
    darijaMeaning: 'ردة الفعل ديالك مشروعة تماما؛ لو كنت بلاصتك كنت غنحس بنفس القلق.',
  },
  {
    id: 'cv-5',
    category: 'Mise en attente élégante',
    french: 'Me permettez-vous de vous placer en attente une soixantaine de secondes afin d’effectuer une vérification approfondie ?',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Avant toute mise en attente (toujours demander l’accord + donner une durée précise)',
    darijaMeaning: 'واش تسمح ليا نخليك فـ الانتظار شي 60 ثانية باش ندير فحص معمق للملف؟',
  },
  {
    id: 'cv-6',
    category: 'Mise en attente élégante',
    french: 'Je vous remercie vivement de votre patience, Madame. Voici les éléments que j’ai pu consolider pour vous.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'En reprenant le client après la mise en attente (au lieu de "Désolé pour l’attente")',
    darijaMeaning: 'كنشكرك بزاف على الصبر ديالك (أحسن بـ 100 مرة من اعتذار سلبي).',
  },
  {
    id: 'cv-7',
    category: 'Gestion des objections & Refus diplomatique',
    french: 'Bien que notre procédure standard ne permette pas ce remboursement, j’ai le plaisir de vous accorder à titre exceptionnel...',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Transformer un refus réglementaire en geste commercial positif',
    darijaMeaning: 'وخا القانون العادي ما كيسمحش بهاد الاسترجاع، يسعدني نمنحك بصفة استثنائية...',
  },
  {
    id: 'cv-8',
    category: 'Excuses professionnelles C1',
    french: 'Nous vous prions de bien vouloir nous excuser pour ce désagrément indépendant de notre volonté.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Formule d’excuse obligatoire en écrit comme à l’oral',
    darijaMeaning: 'كنطلبو منك تقبل الاعتذار ديالنا على هاد الإزعاج الخارج عن إرادتنا.',
  },
  {
    id: 'cv-9',
    category: 'Clôture d’appel & CSAT',
    french: 'Ai-je répondu à l’ensemble de vos attentes aujourd’hui, ou souhaiteriez-vous aborder un autre point ?',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Vérification FCR juste avant de prendre congé',
    darijaMeaning: 'واش جاوبت على كاع التطلعات ديالك اليوم، أولا كتبغي نطرقو لشي نقطة أخرى؟',
  },
  {
    id: 'cv-10',
    category: 'Ponts anti-blanc (Emergency Fillers)',
    french: 'C’est une excellente question qui mérite une analyse précise ; permettez-moi de structurer les éléments en deux points.',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Quand votre esprit bloque pendant un enregistrement Pipplet / Versant : gagne 5 secondes sans dire "euh"',
    darijaMeaning: 'فاش يتبلوكا ليك الدماغ فـ امتحان شفوي، قول هاد الجملة باش تربح 5 ثواني ديال التفكير بلا ما تقول "euhhh"!',
  },
  {
    id: 'cv-11',
    category: 'Ponts anti-blanc (Emergency Fillers)',
    french: 'Afin de vous apporter la réponse la plus exhaustive possible, il convient tout d’abord de rappeler le contexte...',
    register: 'C1 Top 1% Recruiter',
    whenToUse: 'Pont de transition universel pour relancer votre discours oral avec fluidité',
    darijaMeaning: 'جسر ذهبي باش تعاود ترتب الأفكار ديالك فـ الشفوي وتبان C1.',
  },
];

export const EMAIL_TEMPLATES: EmailTemplateItem[] = [
  {
    id: 'tpl-1',
    title: 'Modèle 1 : Retard de livraison & Geste commercial (C1)',
    category: 'Retard de livraison',
    subject: 'Suivi prioritaire de votre commande #[NUMÉRO] — Livraison express activée',
    body: `Bonjour [Madame/Monsieur Nom],

Nous faisons suite à votre message relatif à la commande #[NUMÉRO] et comprenons pleinement votre impatience.

Bien qu'un aléa logistique ponctuel ait retardé l'acheminement initial de votre colis, nous avons immédiatement procédé au déclenchement d'une livraison prioritaire. Votre commande vous sera ainsi remise en main propre le [DATE] avant [HEURE].

Soucieux de vous témoigner notre engagement, nous avons également crédité votre espace client d'un avoir de [MONTANT/POURCENTAGE] valable sur votre prochaine acquisition.

En vous renouvelant nos excuses pour ce contretemps, nous vous prions d'agréer, [Madame/Monsieur], l'expression de nos salutations distinguées.`,
    darijaNote: 'استعمل هاد الموديل فـ Pipplet Écrit ملي يكون مشكل ديال التوصيل؛ فيه Bien que + Subjonctif وفيه مصطلحات C1 جاهزة.',
  },
  {
    id: 'tpl-2',
    title: 'Modèle 2 : Confirmation de remboursement suite à double facturation',
    category: 'Remboursement',
    subject: 'Confirmation de régularisation comptable — Dossier #[NUMÉRO]',
    body: `Bonjour [Madame/Monsieur Nom],

Nous accusons bonne réception de votre signalement concernant la double facturation constatée sur votre relevé du [DATE] et vous prions de bien vouloir nous excuser pour cette anomalie technique.

Après vérification approfondie par notre pôle financier, nous vous confirmons avoir ordonné ce jour le remboursement intégral de la somme de [MONTANT] €. Ce crédit apparaîtra sur votre compte bancaire sous un délai de 24 à 48 heures ouvrées (Référence de transaction : #[REF]).

Nous demeurons à votre entière disposition et vous adressons, [Madame/Monsieur], nos salutations les plus cordiales.`,
    darijaNote: 'موديل مثالي لمشاكل الفوترة والبنك (BNP Paribas / Webhelp / Foundever).',
  },
  {
    id: 'tpl-3',
    title: 'Modèle 3 : Refus diplomatique & Alternative commerciale',
    category: 'Refus diplomatique',
    subject: 'Information relative à votre demande de retour — Commande #[NUMÉRO]',
    body: `Bonjour [Madame/Monsieur Nom],

Nous vous remercions de la confiance que vous portez à notre enseigne et avons étudié avec la plus grande attention votre requête concernant la commande #[NUMÉRO].

Conformément à nos conditions générales de vente, le délai légal de rétractation est fixé à 30 jours calendaires à compter de la réception. Ce délai étant aujourd'hui échu, il ne nous est malheureusement plus possible de donner une suite favorable à votre demande de remboursement intégral.

Néanmoins, à titre purement commercial, nous avons le plaisir de vous octroyer une remise privilégiée de 20 % valable durant six mois sur l'intégralité de notre catalogue.

Nous vous remercions de votre compréhension et vous prions d'agréer, [Madame/Monsieur], nos salutations distinguées.`,
    darijaNote: 'أحسن طريقة باش تقول "لا" للكليان بلا ما تخسرو وتجيب نقطة كاملة فـ Coherence & Register.',
  },
  {
    id: 'tpl-4',
    title: 'Modèle 4 : Résolution d’incident technique B2B & Garantie RGPD',
    category: 'Problème technique',
    subject: 'Rétablissement complet de votre accès sécurisé — Ticket #[NUMÉRO]',
    body: `Bonjour [Madame/Monsieur Nom],

Nous faisons suite à votre ticket prioritaire #[NUMÉRO] relatif à la perturbation d'accès rencontrée ce matin sur votre interface professionnelle.

Nos équipes d'ingénierie ont identifié et corrigé l'origine de cette latence dès [HEURE]. Nous vous confirmons formellement que vos services sont désormais opérationnels à 100 % et que l'intégrité ainsi que la confidentialité de vos données (conformément au RGPD) sont demeurées strictement intactes.

Restant à votre écoute pour tout accompagnement complémentaire, nous vous prions d'agréer, [Madame/Monsieur], l'expression de notre considération distinguée.`,
    darijaNote: 'صالح للرد على الشركات (B2B Tech Support) فـ التست ديال Pipplet ولا TestGorilla.',
  },
];

export const GRAMMAR_TRAPS: GrammarTrapItem[] = [
  {
    id: 'gt-1',
    title: 'Conditionnel de politesse vs Futur simple',
    trapWrong: 'Je voudrais savoir si vous pourrez m’envoyer le reçu. / Je veux vérifier votre compte.',
    goldCorrect: 'Je souhaiterais savoir si vous pourriez m’adresser le justificatif.',
    ruleExplanation: 'Le conditionnel présent (« je souhaiterais », « pourriez-vous ») atténue la demande et marque la déférence professionnelle.',
    darijaMnemonic: 'ديما زيد الـ "R + AIS" فـ الطلبات المؤدبة: Je souhaiterais / Pourriez-vous.',
  },
  {
    id: 'gt-2',
    title: 'Bien que / Quoique (+ Subjonctif) vs Malgré (+ Nom)',
    trapWrong: 'Malgré que le colis a du retard... / Bien que nous faisons le maximum...',
    goldCorrect: 'Bien que le colis accuse un retard... / Bien que nous fassions le maximum...',
    ruleExplanation: '« Malgré que » est proscrit. Utilisez « Malgré + nom » (Malgré ce retard) ou « Bien que + subjonctif » (Bien que nous fassions).',
    darijaMnemonic: 'عمرك ما تلاقي "Malgré" مع "que"! قول "Malgré le retard" أولا "Bien que + Subjonctif".',
  },
  {
    id: 'gt-3',
    title: 'Après que (+ Indicatif) vs Avant que (+ Subjonctif)',
    trapWrong: 'Après que vous ayez validé le paiement, nous expédions.',
    goldCorrect: 'Après que vous avez validé (ou aurez validé) le paiement, nous expédions.',
    ruleExplanation: '« Après que » décrit un fait réel déjà accompli : il exige donc l’indicatif et non le subjonctif.',
    darijaMnemonic: 'Avant que = مازال ما وقعش (Subjonctif) | Après que = وقع وسالا (Indicatif).',
  },
  {
    id: 'gt-4',
    title: 'Pallier un problème (Transitif direct sans "à")',
    trapWrong: 'Afin de pallier à ce dysfonctionnement technique...',
    goldCorrect: 'Afin de pallier ce dysfonctionnement technique...',
    ruleExplanation: 'On dit « remédier À un problème », mais « pallier un problème » (sans préposition « à »).',
    darijaMnemonic: 'Pallier ما كتبغيش "à" نهائيا! قول مباشرة: Pallier ce retard.',
  },
  {
    id: 'gt-5',
    title: 'Accord de "Même" et "Tout"',
    trapWrong: 'Nous avons suivi les même procédures pour toute les demandes.',
    goldCorrect: 'Nous avons suivi les mêmes procédures pour toutes les demandes.',
    ruleExplanation: 'Placé devant un nom pluriel, « mêmes » et « toutes » s’accordent en nombre.',
    darijaMnemonic: 'ملي كتجي "les" قدام même، ضروري تزيد "s": les mêmes procédures.',
  },
];
