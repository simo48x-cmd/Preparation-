import { PippletScenario } from './assessmentBank';

export type TPProjectTag = 'Fintech' | 'E-Commerce' | 'Voyages' | 'Tech' | 'Banque' | 'Télécom';

export interface ExtendedPippletScenario extends PippletScenario {
  projectTag: TPProjectTag;
}

/**
 * Expanded Built-in Pool of 16 Authentic Teleperformance Portugal Scenarios
 * (Lisbon Parque das Nações / Porto — Atlantic Experience Program)
 * Covering Spoken & Written scenarios across Fintech 2FA, SEPA, Airlines, Luxury E-Commerce, Telecom Fiber, and Streaming.
 */
export const TP_PORTUGAL_SCENARIO_POOL: ExtendedPippletScenario[] = [
  {
    id: 'tp-pool-1',
    type: 'spoken',
    projectTag: 'E-Commerce',
    title: 'Colis bloqué en douane & Client VIP furieux (Lisbonne / Paris)',
    companyContext: 'Teleperformance Portugal (Lisbonne) — Compte E-Commerce Luxe Paris',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Bonjour ! C'est inadmissible ! J'ai commandé une montre de collection réf. LX-904 il y a dix jours pour l'anniversaire de mon épouse ce soir à Paris. Votre suivi indique que le colis est bloqué à l'entrepôt logistique sans aucune explication. Si je ne l'ai pas aujourd'hui, j'annule tout et je publie un avis désastreux !",
    promptTask:
      "Vous êtes conseiller(ère) senior TP Portugal à Lisbonne. Laissez un message vocal au client (M. Laurent) pour : 1) Exprimer une empathie sincère sans blâmer le transporteur, 2) Expliquer que vous débloquez un coursier express prioritaire livré avant 18h00, 3) Offrir un geste commercial de 15% sur sa prochaine commande.",
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
      'فهاد السيناريو السمعي ديال Pipplet، السر باش تجيب C1 هو ما تقولش C’est la faute du transporteur. بدا بـ Je mesure pleinement votre contrariété و استعمل J’ai pris l’initiative de dépêcher un coursier.',
  },
  {
    id: 'tp-pool-2',
    type: 'spoken',
    projectTag: 'Banque',
    title: 'Double prélèvement bancaire & Demande de régularisation urgente',
    companyContext: 'Teleperformance Portugal — Pôle Néo-Banque & Services Financiers',
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
      "Bonjour Madame Moreau, je prends immédiatement connaissance de votre message et comprends légitimement votre vive inquiétude face à cette double facturation de 480 euros. Après examen attentif de votre compte, je vous confirme avoir ordonné à l'instant le recrédit prioritaire de cette somme, laquelle figurera sur votre relevé sous 24 heures ouvrées. En outre, dans l'éventualité où cet incident engendrerait des frais bancaires, nous nous engageons formellement à vous les rembourser sur simple présentation d'un justificatif.",
    darijaTip:
      'فاش يكون مشكل ديال الفلوس Facturation، الكليان كيبغي الأمان والسرعة. استعمل عبارات قوية بحال Recrédit prioritaire sous 24 heures ouvrées و Dans l’éventualité où cet incident engendrerait des frais.',
  },
  {
    id: 'tp-pool-3',
    type: 'spoken',
    projectTag: 'Voyages',
    title: 'Annulation de vol & Reclassement Hôtelier (Hub Lisbonne / Lyon)',
    companyContext: 'Teleperformance Portugal — Pôle Aviation & Tourisme International',
    cefrTarget: 'B2',
    customerVoiceScript:
      "Allô ? Notre vol TP-712 au départ de Lisbonne vers Lyon vient d'être annulé à cause d'une grève technique. Nous sommes à l'aéroport avec deux enfants en bas âge et personne au guichet ne nous répond !",
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
      "Bonjour Monsieur et Madame Garnier, je suis sincèrement navré d'apprendre l'annulation de votre vol TP-712, surtout alors que vous voyagez avec deux jeunes enfants. Ne vous inquiétez pas, je m'occupe de tout dès maintenant. Je viens de vous enregistrer sur le prochain vol demain matin à 8h15. Par ailleurs, je vous ai envoyé par SMS et par e-mail vos bons pour un hôtel 4 étoiles à proximité, incluant le dîner et le taxi gratuit.",
    idealC1:
      "Bonjour Monsieur et Madame Garnier, je compatis sincèrement à cette situation éprouvante, d'autant plus que vous êtes accompagnés de vos deux enfants en bas âge. Soyez pleinement rassurés, je prends personnellement le relais. Vos cartes d'embarquement sont d'ores et déjà confirmées sur le premier vol de demain matin à 08h15. Afin de vous garantir une nuit sereine, je viens de vous transmettre par SMS et courriel votre prise en charge intégrale comprenant le transfert en taxi, la nuitée en hôtel quatre étoiles ainsi que la restauration.",
    darijaTip:
      'عبارة d’ores et déjà (من دابا نيت) و Je prends personnellement le relais كيعطيو انطباع ديال C1 حقيقي فـ Pipplet!',
  },
  {
    id: 'tp-pool-4',
    type: 'written',
    projectTag: 'E-Commerce',
    title: 'Réponse écrite : Refus diplomatique de remboursement hors délai légal',
    companyContext: 'Teleperformance Lisbonne — Département Litiges & Conformité E-Commerce',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Objet : Demande de remboursement intégral — Commande #FR-88210\n\nBonjour, j'ai acheté un casque audio sans fil il y a 45 jours sur votre site. Finalement la couleur ne me plaît plus et je souhaite être remboursé intégralement sur ma carte bancaire. Merci de m'envoyer l'étiquette de retour aujourd'hui.",
    promptTask:
      "Rédigez un e-mail professionnel (80–130 mots) en 5 minutes : 1) Remerciez le client pour sa fidélité, 2) Expliquez diplomatiquement que le délai légal de rétractation de 30 jours est dépassé (45 jours écoulés), 3) Proposez néanmoins à titre commercial exceptionnel un bon d'achat de 20% valable 6 mois.",
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
      'فاش كترفض شي طلب ديال الكليان فـ الإيميل، عمرك ما تقول Non, c’est impossible. استعمل الصيغة الدبلوماسية: Bien que nous attachions une importance primordiale..., il ne nous est malheureusement plus possible d’accéder favorablement à votre demande.',
  },
  {
    id: 'tp-pool-5',
    type: 'written',
    projectTag: 'Tech',
    title: 'Réponse écrite : Incident SaaS B2B & Compte-rendu SLA',
    companyContext: 'Teleperformance Porto — Support Entreprise Cloud & Cybersécurité',
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
      'فـ B2B التعامل مع الشركات، كلمات بحال Perturbation momentanée و L’intégrité de vos données est demeurée intacte و Conformément à nos engagements contractuels SLA كيخليو المصحح يعطيك C2 بلا تردد!',
  },
  {
    id: 'tp-pool-6',
    type: 'spoken',
    projectTag: 'Fintech',
    title: 'Compte Pro Bloqué 2FA & Virement de Salaires Urgent (Fintech PME)',
    companyContext: 'Teleperformance Lisbonne (Parque das Nações) — Compte Néo-Banque PME Française',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Bonjour ! Je suis gérant d'une PME à Bordeaux et j'ai changé de téléphone hier soir. Depuis ce matin, mon application bancaire pro refuse mon code 2FA et bloque mes virements de salaires pour mes douze employés ! C'est une catastrophe si les salaires ne partent pas avant midi !",
    promptTask:
      "Répondez à l'oral à M. Chevalier : rassurez-le immédiatement, expliquez que vous réinitialisez son appairage biométrique 2FA après vérification vidéo KYC de 2 minutes, et confirmez que ses virements SEPA Instant partiront avant midi sans frais.",
    prepSeconds: 30,
    responseSeconds: 90,
    keyPointsToCover: [
      'Empathie immédiate pour l’échéance de paie des 12 salariés',
      'Procédure de sécurité RGPD/KYC : réinitialisation de l’appareil 2FA en 2 minutes',
      'Exécution des virements en SEPA Instantané gratuit avant 12h00',
    ],
    idealB2:
      "Bonjour Monsieur Chevalier, je comprends parfaitement l'urgence concernant le paiement des salaires de vos douze employés avant midi. Ne vous inquiétez pas, nous allons débloquer votre accès immédiatement. Pour protéger votre compte suite à votre changement de téléphone, je viens de vous envoyer un lien de vérification d'identité rapide qui prend deux minutes. Dès validation, votre nouvel appareil sera activé et vos virements partiront en SEPA instantané gratuit avant midi.",
    idealC1:
      "Bonjour Monsieur Chevalier, je mesure pleinement le caractère critique de votre situation concernant le règlement des salaires de vos douze collaborateurs avant midi. Soyez immédiatement rassuré : je prends votre dossier en priorité absolue. Conformément à nos protocoles de sécurité bancaire, je viens de déclencher la réinitialisation de votre authentification forte 2FA via un lien de validation biométrique sécurisé. Dès votre confirmation d'ici deux minutes, votre nouveau terminal sera habilité et vos virements partiront en SEPA Instantané sans aucuns frais.",
    darijaTip:
      'فـ مشاريع Fintech فـ لشبونة، ديما جمع بين السرعة والأمان البنكي: Réinitialisation de l’authentification forte 2FA + Virement SEPA Instantané sans frais.',
  },
  {
    id: 'tp-pool-7',
    type: 'written',
    projectTag: 'Fintech',
    title: 'Réponse écrite : Retard de Virement SEPA International & Contrôle Conformité',
    companyContext: 'Teleperformance Portugal — Pôle Fintech & Conformité Bancaire SEPA',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Objet : Virement SEPA #SP-77412 de 18 500 € toujours non crédité !\n\nBonjour, j'ai émis un virement de 18 500 € vers mon fournisseur à Milan il y a 48 heures. L'argent a quitté mon compte mais mon fournisseur n'a rien reçu. Où est passé mon argent ?!",
    promptTask:
      "Rédigez un e-mail rassurant et précis : 1) Expliquez que tout virement supérieur à 15 000 € fait l'objet d'un contrôle réglementaire automatique de sécurité européenne, 2) Confirmez que le contrôle vient d'être validé avec succès ce matin, 3) Joignez l'attestation officielle d'exécution SWIFT/SEPA garantissant le crédit cet après-midi avant 16h00.",
    prepSeconds: 0,
    responseSeconds: 300,
    keyPointsToCover: [
      'Apaisement immédiat sur la traçabilité des 18 500 € (#SP-77412)',
      'Explication claire du contrôle réglementaire européen (> 15 000 €)',
      'Validation définitive + attestation d’exécution SEPA jointe (crédit avant 16h00)',
    ],
    idealB2:
      "Bonjour Monsieur,\n\nJe fais suite à votre message concernant votre virement SEPA #SP-77412 d'un montant de 18 500 € et comprends votre inquiétude.\n\nJe tiens tout d'abord à vous rassurer : vos fonds sont totalement sécurisés. Conformément à la réglementation bancaire européenne, les virements supérieurs à 15 000 € font l'objet d'une vérification de sécurité supplémentaire. Ce contrôle a été validé avec succès ce matin par notre service conformité.\n\nVous trouverez ci-joint l'attestation officielle d'exécution SEPA. La somme sera créditée sur le compte de votre fournisseur aujourd'hui avant 16h00.\n\nCordialement,\nService Conformité SEPA",
    idealC1:
      "Bonjour Monsieur,\n\nNous accusons réception de votre requête prioritaire relative au virement SEPA #SP-77412 de 18 500 € et comprenons légitimement votre préoccupation.\n\nSoyez pleinement rassuré quant à la parfaite sécurité de vos fonds. Conformément aux directives européennes de sécurité financière, toute transaction excédant le seuil de 15 000 € est soumise à une revue réglementaire obligatoire. Nous avons le plaisir de vous confirmer que notre pôle conformité a définitivement validé votre opération ce matin.\n\nVous trouverez ci-jointe l'attestation officielle d'exécution bancaire ; le compte de votre partenaire à Milan sera crédité cet après-midi même avant 16h00.\n\nNous vous prions d'agréer, Monsieur, l'expression de nos salutations distinguées.",
    darijaTip:
      'ملي يكون virement SEPA كبير معطل، طمئن الكليان بـ Soyez pleinement rassuré quant à la sécurité de vos fonds وشرح ليه بلي راه غير Revue réglementaire obligatoire.',
  },
  {
    id: 'tp-pool-8',
    type: 'spoken',
    projectTag: 'Voyages',
    title: 'Bagage égaré à l’arrivée à Lisbonne & Indemnisation Première Nécessité',
    companyContext: 'Teleperformance Lisbonne — Compte Compagnie Aérienne Européenne',
    cefrTarget: 'B2',
    customerVoiceScript:
      "Bonjour, je viens d'atterrir à l'aéroport Humberto Delgado à Lisbonne pour un congrès médical demain matin, et ma valise contenant mon costume et mes affaires professionnelles est restée à Paris Orly ! Que dois-je faire ?",
    promptTask:
      "Répondez à l'oral au Dr. Mercier : donnez-lui son numéro de dossier PIR (#LIS-3309), confirmez que sa valise arrive sur le vol de 21h30 ce soir et lui sera livrée directement à son hôtel à 23h00, et indiquez qu'il dispose d'une allocation immédiate de 150 € pour ses achats de première nécessité.",
    prepSeconds: 30,
    responseSeconds: 90,
    keyPointsToCover: [
      'Empathie pour son congrès médical demain matin à Lisbonne',
      'Confirmation de localisation du bagage (#LIS-3309) sur le vol de 21h30',
      'Livraison par coursier à son hôtel à 23h00 + enveloppe de 150 € de première nécessité',
    ],
    idealB2:
      "Bonjour Docteur Mercier, je suis sincèrement désolé pour ce contretemps à votre arrivée à Lisbonne, surtout à la veille de votre congrès médical. J'ai enregistré votre dossier sous la référence #LIS-3309. Bonne nouvelle : votre valise a bien été localisée à Paris Orly et embarquera sur le vol de 21h30. Un coursier vous la livrera directement à la réception de votre hôtel dès 23h00. En attendant, nous vous accordons un remboursement immédiat jusqu'à 150 euros pour vos achats de première nécessité.",
    idealC1:
      "Bonjour Docteur Mercier, je regrette vivement ce désagrément survenu lors de votre arrivée à Lisbonne, a fortiori à la veille de votre congrès médical. Soyez rassuré : votre bagage est d'ores et déjà localisé à Paris-Orly sous le dossier prioritaire #LIS-3309 et acheminé sur le vol de 21h30. Notre service de conciergerie vous le remettra directement à votre hôtel dès 23h00. Par ailleurs, vous bénéficiez immédiatement d'une allocation forfaitaire de 150 euros afin de couvrir vos achats de première nécessité sur simple présentation des reçus.",
    darijaTip:
      'فـ قطاع الطيران، الكلمات المفتاحية هما Dossier prioritaire PIR و Achats de première nécessité و Acheminé sur le prochain vol.',
  },
  {
    id: 'tp-pool-9',
    type: 'written',
    projectTag: 'Télécom',
    title: 'Réponse écrite : Panne Fibre Optique Télétravail & Partage 4G/5G Illimité',
    companyContext: 'Teleperformance Portugal — Pôle Opérateur Télécom & Fibre France',
    cefrTarget: 'B2',
    customerVoiceScript:
      "Objet : Coupure totale de ma ligne Fibre depuis hier soir (#FIB-9012)\n\nBonjour, le voyant PON de ma box clignote en rouge depuis hier soir. Je travaille à domicile et j'ai des visioconférences toute la semaine. Quand un technicien va-t-il intervenir ?",
    promptTask:
      "Rédigez un e-mail : 1) Présentez vos excuses pour cette coupure réseau (#FIB-9012), 2) Confirmez le passage d'un technicien demain entre 08h00 et 10h00, 3) Indiquez que vous venez de créditer 200 Go de données 5G gratuites sur son forfait mobile pour assurer son télétravail aujourd'hui.",
    prepSeconds: 0,
    responseSeconds: 300,
    keyPointsToCover: [
      'Excuses professionnelles pour l’impact sur son télétravail (#FIB-9012)',
      'Intervention technicien planifiée demain entre 08h00 et 10h00',
      'Continuité de service immédiate : 200 Go de data 5G crédités gratuitement',
    ],
    idealB2:
      "Bonjour Madame, Monsieur,\n\nNous faisons suite à votre message concernant la coupure de votre ligne Fibre #FIB-9012 et comprenons parfaitement la gêne occasionnée pour votre activité en télétravail.\n\nNous avons planifié l'intervention prioritaire d'un technicien à votre domicile demain matin entre 08h00 et 10h00 afin de rétablir votre connexion.\n\nDans l'intervalle, pour vous permettre d'assurer vos visioconférences dès aujourd'hui, nous venons d'activer gratuitement une enveloppe de 200 Go de données 5G sur votre ligne mobile.\n\nNous vous prions de nous excuser pour ce dérangement et vous adressons nos salutations cordiales.",
    idealC1:
      "Bonjour Madame, Monsieur,\n\nNous accusons bonne réception de votre signalement relatif à l'interruption de votre ligne fibre #FIB-9012 et mesurons pleinement l'impact de cet incident sur vos impératifs de télétravail.\n\nAfin de rétablir durablement votre accès très haut débit, nous avons dépêché en priorité un technicien réseau qui interviendra demain matin sur le créneau 08h00–10h00.\n\nDans cette attente, soucieux de garantir la continuité immédiate de vos visioconférences, nous venons de créditer gracieusement votre ligne mobile d'une enveloppe de 200 Go en 5G utilisable en partage de connexion.\n\nEn vous renouvelant nos excuses pour ce contretemps, nous vous prions d'agréer, Madame, Monsieur, nos salutations distinguées.",
    darijaTip:
      'عبارة Garantir la continuité immédiate de votre activité en télétravail كتعطي قيمة كبيرة للجواب ديالك فـ مشاريع Télécom!',
  },
  {
    id: 'tp-pool-10',
    type: 'spoken',
    projectTag: 'E-Commerce',
    title: 'Colis de Parfumerie de Luxe reçu brisé & Remplacement Express',
    companyContext: 'Teleperformance Lisbonne — Maison de Haute Parfumerie Parisienne',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Bonjour, je viens d'ouvrir mon coffret de parfum réf. #LUX-308 et le flacon en cristal est entièrement brisé à l'intérieur ! Au prix où vous vendez vos créations, c'est extrêmement décevant !",
    promptTask:
      "Répondez à l'oral à Mme de Saint-Clair : exprimez votre profond regret au nom de la Maison, dispensez-la de renvoyer le flacon brisé (simple photo suffit), et confirmez l'envoi immédiat d'un nouveau coffret accompagné d'une miniature de collection offerte.",
    prepSeconds: 30,
    responseSeconds: 90,
    keyPointsToCover: [
      'Ton raffiné Haute Couture / Luxe & excuses sincères',
      'Dispense de retour du flacon brisé (pour éviter tout risque de blessure)',
      'Réexpédition immédiate d’un coffret neuf + miniature de collection en cadeau',
    ],
    idealB2:
      "Bonjour Madame de Saint-Clair, je suis sincèrement navré d'apprendre que votre coffret #LUX-308 vous est parvenu endommagé. Afin de vous éviter toute démarche contraignante et tout risque avec le verre brisé, vous n'avez pas besoin de nous retourner l'article : une simple photo par e-mail suffira. Je déclenche dès aujourd'hui l'expédition prioritaire d'un nouveau coffret intact, accompagné d'une miniature de collection offerte pour nous excuser.",
    idealC1:
      "Bonjour Madame de Saint-Clair, c'est avec un profond regret que je prends connaissance de l'avarie constatée à la réception de votre écrin #LUX-308, laquelle ne reflète aucunement l'exigence de notre Maison. Afin de vous épargner toute manipulation du cristal brisé, nous vous dispensons naturellement de tout retour physique sur simple envoi d'un cliché photographique. J'ai d'ores et déjà ordonné l'acheminement prioritaire d'un nouvel exemplaire, sublimé d'une miniature de collection offerte en témoignage de notre considération.",
    darijaTip:
      'فـ مشاريع Luxe فـ لشبونة، استعمل معجم راقي: Écrin بلاصة boîte، و Acheminement prioritaire بلاصة envoi، و En témoignage de notre considération.',
  },
  {
    id: 'tp-pool-11',
    type: 'written',
    projectTag: 'Tech',
    title: 'Réponse écrite : Contestation de Renouvellement Automatique Streaming / SaaS',
    companyContext: 'Teleperformance Portugal — Support Abonnements Numériques & Médias',
    cefrTarget: 'B2',
    customerVoiceScript:
      "Objet : Prélèvement non autorisé de 119,99 € pour renouvellement annuel (#SUB-6610)\n\nBonjour, j'avais oublié de désactiver le renouvellement automatique de mon abonnement annuel hier soir et je viens d'être débité de 119,99 €. Je n'ai pas utilisé le service depuis un mois, merci de me rembourser intégralement.",
    promptTask:
      "Rédigez un e-mail bienveillant : 1) Rappelez courtoisement que l'abonnement a été renouvelé automatiquement à la date d'échéance, 2) Annoncez qu'au vu de l'absence d'utilisation depuis le renouvellement, vous accordez exceptionnellement l'annulation et le remboursement intégral des 119,99 € sous 3 à 5 jours ouvrés.",
    prepSeconds: 0,
    responseSeconds: 300,
    keyPointsToCover: [
      'Explication courtoise du mécanisme de reconduction tacite (#SUB-6610)',
      'Acceptation exceptionnelle du remboursement intégral (119,99 €) car aucune consommation constatée',
      'Délai bancaire de 3 à 5 jours ouvrés + désactivation confirmée',
    ],
    idealB2:
      "Bonjour Madame, Monsieur,\n\nJe fais suite à votre demande concernant le renouvellement automatique de votre abonnement #SUB-6610 pour un montant de 119,99 €.\n\nBien que nos conditions prévoient la reconduction automatique à la date d'échéance, j'ai constaté que vous n'avez pas utilisé nos services depuis ce prélèvement. Par conséquent, à titre commercial exceptionnel, j'ai procédé à l'annulation de ce renouvellement et déclenché le remboursement intégral des 119,99 €.\n\nCette somme apparaîtra sur votre compte bancaire sous 3 à 5 jours ouvrés.\n\nBien cordialement,\nService Abonnements",
    idealC1:
      "Bonjour Madame, Monsieur,\n\nNous accusons réception de votre message relatif à l'échéance annuelle de votre abonnement #SUB-6610 d'un montant de 119,99 €.\n\nBien que cette facturation résulte de la reconduction tacite prévue contractuellement à la date d'anniversaire, nous avons constaté qu'aucune connexion n'a été enregistrée depuis lors. Soucieux de privilégier votre satisfaction, nous avons le plaisir de déroger à titre exceptionnel à notre politique en ordonnant ce jour le remboursement intégral des 119,99 €.\n\nCe recrédit sera effectif sur votre carte bancaire sous un délai de 3 à 5 jours ouvrés, et le renouvellement automatique est désormais désactivé.\n\nNous vous prions d'agréer, Madame, Monsieur, nos salutations distinguées.",
    darijaTip:
      'عبارة Déroger à titre exceptionnel à notre politique (نديرو استثناء للقانون ديالنا) كتعطي نقطة ممتازة فـ Pipplet Écrit!',
  },
  {
    id: 'tp-pool-12',
    type: 'spoken',
    projectTag: 'Télécom',
    title: 'Surfacturation Hors-Forfait Roaming Suisse / Andorre & Remise Gracieuse',
    companyContext: 'Teleperformance Portugal — Service Client Mobile Francophone',
    cefrTarget: 'B2',
    customerVoiceScript:
      "Bonjour ! Je viens de recevoir une facture mobile de 195 euros au lieu de 29 euros parce que mon téléphone s'est connecté automatiquement au réseau suisse pendant que je conduisais près de la frontière à Annecy ! Je refuse de payer cette somme !",
    promptTask:
      "Répondez à l'oral à Mme Blanchard : expliquez le phénomène de bascule automatique d'antenne frontalière (Suisse hors zone UE), annoncez l'annulation exceptionnelle des 166 € de hors-forfait, et activez gratuitement l'option « Blocage Hors-Forfait International » sur sa ligne.",
    prepSeconds: 30,
    responseSeconds: 90,
    keyPointsToCover: [
      'Compréhension immédiate du phénomène d’itinérance frontalière involontaire',
      'Annulation exceptionnelle intégrale des 166 € de hors-forfait data',
      'Action préventive : activation gratuite du plafonnement / blocage hors-forfait',
    ],
    idealB2:
      "Bonjour Madame Blanchard, je comprends tout à fait votre surprise face à cette facture de 195 euros. En effet, à proximité de la frontière, votre téléphone a basculé automatiquement sur une antenne suisse, qui ne fait pas partie de la zone Union européenne. Comme il s'agit d'une connexion involontaire, j'annule exceptionnellement la totalité des 166 euros de hors-forfait : vous ne paierez que vos 29 euros habituels. De plus, j'active gratuitement le blocage hors-forfait sur votre ligne pour que cela ne se reproduise plus.",
    idealC1:
      "Bonjour Madame Blanchard, je comprends parfaitement votre étonnement à la lecture de cette facturation de 195 euros. Ce montant s'explique par un basculement automatique de votre terminal sur un relais frontalier suisse, territoire situé hors de la réglementation d'itinérance européenne. Conscient du caractère totalement involontaire de cette connexion, j'ai le plaisir de vous accorder la remise gracieuse intégrale des 166 euros de dépassement. Par ailleurs, afin de vous prémunir contre toute récidive, j'ai activé sans frais l'option de blocage automatique hors-forfait sur votre contrat.",
    darijaTip:
      'فاش تحل المشكل وتزيد معاه Action préventive (بحال تبلوكي ليها hors-forfait باش ما يتعاودش المشكل)، كتربح النقطة الكاملة فـ Coherence & FCR!',
  },
  {
    id: 'tp-pool-13',
    type: 'written',
    projectTag: 'Fintech',
    title: 'Réponse écrite : Synchronisation Comptable & Export FEC Bloqué (SaaS PME)',
    companyContext: 'Teleperformance Lisbonne — Pôle Logiciel Comptable & Fintech B2B',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Objet : Erreur de synchronisation bancaire et export FEC impossible (#FIN-2049)\n\nBonjour, notre expert-comptable doit clôturer notre bilan trimestriel demain soir, mais la synchronisation automatique avec notre compte bancaire est interrompue depuis ce matin. Comment débloquer l'export de nos écritures ?",
    promptTask:
      "Rédigez un e-mail B2B rassurant : 1) Expliquez que la passerelle DSP2 bancaire nécessitait un renouvellement de jeton de sécurité, 2) Indiquez que vous venez de forcer la synchronisation manuelle complète de leurs écritures, 3) Confirmez que le fichier FEC conforme est désormais prêt au téléchargement.",
    prepSeconds: 0,
    responseSeconds: 300,
    keyPointsToCover: [
      'Prise en compte de l’échéance du bilan trimestriel avec l’expert-comptable (#FIN-2049)',
      'Explication claire de la norme européenne DSP2 et resynchronisation effectuée',
      'Disponibilité immédiate de l’export comptable FEC',
    ],
    idealB2:
      "Bonjour Madame, Monsieur,\n\nJe fais suite à votre message concernant l'interruption de synchronisation sur votre dossier #FIN-2049, à la veille de votre clôture trimestrielle.\n\nCet arrêt temporaire était lié au renouvellement obligatoire du jeton de sécurité bancaire européen DSP2. Je viens de relancer manuellement la synchronisation complète de vos flux : toutes vos écritures sont désormais à jour et votre fichier FEC est disponible au téléchargement pour votre expert-comptable.\n\nCordialement,\nSupport Fintech PME",
    idealC1:
      "Bonjour Madame, Monsieur,\n\nNous accusons réception de votre signalement prioritaire relatif au dossier #FIN-2049 et mesurons pleinement l'urgence liée à la remise de votre bilan trimestriel.\n\nCette suspension momentanée résultait de l'actualisation réglementaire du certificat d'authentification bancaire DSP2. Nous avons immédiatement procédé à la réinitialisation du flux et forcé la synchronisation intégrale de vos opérations. Votre journal comptable ainsi que votre export FEC certifié sont d'ores et déjà disponibles dans votre espace dédié.\n\nNous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.",
    darijaTip:
      'فـ مشاريع Fintech B2B، استعمل مصطلحات تقنية دقيقة بحال Certificat DSP2 و Synchronisation intégrale de vos opérations.',
  },
  {
    id: 'tp-pool-14',
    type: 'spoken',
    projectTag: 'Tech',
    title: 'Compte Streaming Famille Suspendu & Détection de Connexion Suspecte',
    companyContext: 'Teleperformance Portugal — Support Plateforme Streaming & Divertissement',
    cefrTarget: 'B2',
    customerVoiceScript:
      "Bonjour, mon compte streaming Famille #STR-5512 est bloqué depuis une heure avec un message d'alerte de sécurité, alors que nous sommes simplement en vacances au Portugal avec mes enfants !",
    promptTask:
      "Répondez à l'oral : rassurez le client sur la protection anti-piratage qui s'est déclenchée suite à la connexion depuis un nouveau pays, déverrouillez immédiatement son profil Famille en certifiant son adresse IP de vacances, et offrez 7 jours d'abonnement supplémentaires.",
    prepSeconds: 30,
    responseSeconds: 90,
    keyPointsToCover: [
      'Ton chaleureux + souhaiter d’excellentes vacances au Portugal',
      'Explication positive de l’alerte de sécurité anti-intrusion (#STR-5512)',
      'Déblocage immédiat des 4 écrans + 7 jours offerts',
    ],
    idealB2:
      "Bonjour Monsieur, je vous souhaite tout d'abord d'excellentes vacances au Portugal en famille ! Ne vous inquiétez pas : notre système de sécurité a simplement détecté une connexion inhabituelle depuis l'étranger et a protégé votre compte #STR-5512 par précaution. Je viens d'autoriser votre localisation actuelle et de débloquer immédiatement l'ensemble de vos profils. De plus, je vous offre sept jours d'abonnement gratuits.",
    idealC1:
      "Bonjour Monsieur, permettez-moi tout d'abord de vous souhaiter un excellent séjour au Portugal avec vos enfants. Soyez pleinement rassuré : cette suspension préventive sur le compte #STR-5512 résultait uniquement de notre bouclier anti-intrusion ayant détecté une connexion hors de votre zone habituelle. J'ai immédiatement certifié votre accès et rétabli l'intégralité de vos flux simultanés. En outre, j'ai le plaisir de créditer votre abonnement d'une semaine gratuite.",
    darijaTip:
      'ديما قلب المشكل الأمني لنقطة إيجابية: Ce blocage préventif résultait de notre bouclier de sécurité pour protéger votre compte.',
  },
  {
    id: 'tp-pool-15',
    type: 'written',
    projectTag: 'Voyages',
    title: 'Réponse écrite : Demande de Remboursement Franchise Location Voiture (Lisbonne)',
    companyContext: 'Teleperformance Lisbonne — Pôle Mobilité & Location Automobile Internationale',
    cefrTarget: 'C1',
    customerVoiceScript:
      "Objet : Prélèvement abusif de 350 € de frais de nettoyage / rayure — Contrat #CAR-7821\n\nBonjour, j'ai rendu mon véhicule de location à l'aéroport de Lisbonne dimanche soir en parfait état. J'ai pris des photos horodatées lors de la restitution, mais vous m'avez débité 350 € ! Ci-joint mes photos.",
    promptTask:
      "Rédigez un e-mail : 1) Remerciez la cliente pour l'envoi des photos horodatées du contrat #CAR-7821, 2) Confirmez qu'après examen des clichés, la rayure était antérieure à sa location, 3) Annoncez l'annulation totale de la facture et le remboursement intégral des 350 € sous 48h ouvrées + un surclassement offert.",
    prepSeconds: 0,
    responseSeconds: 300,
    keyPointsToCover: [
      'Accusé de réception des clichés horodatés (#CAR-7821)',
      'Validation de la bonne foi de la cliente et clôture sans frais du dossier dommage',
      'Remboursement prioritaire des 350 € sous 48h + bon de surclassement gratuit',
    ],
    idealB2:
      "Bonjour Madame,\n\nNous vous remercions de nous avoir transmis vos photos horodatées concernant votre contrat de location #CAR-7821 à l'aéroport de Lisbonne.\n\nAprès vérification attentive de vos clichés par notre service flotte, nous vous confirmons que l'impact signalé était antérieur à votre prise en charge. Par conséquent, nous annulons immédiatement cette facturation et procédons au remboursement intégral des 350 € sur votre carte bancaire sous 48 heures ouvrées.\n\nPour nous excuser de cette erreur, nous vous offrons un surclassement gratuit lors de votre prochaine location.\n\nCordialement,\nService Client Mobilité",
    idealC1:
      "Bonjour Madame,\n\nNous accusons bonne réception des clichés horodatés relatifs à votre contrat #CAR-7821 et vous remercions de votre diligence.\n\nAprès examen comparatif mené par notre pôle d'expertise à Lisbonne, il apparaît manifestement que ce défaut esthétique préexistait à votre location. Nous vous prions de bien vouloir nous excuser pour cette imputation erronée et vous confirmons avoir ordonné ce jour le recrédit intégral des 350 € sous 48 heures ouvrées.\n\nSoucieux de vous renouveler notre considération, nous avons crédité votre profil d'un bon de surclassement gracieux.\n\nNous vous prions d'agréer, Madame, nos salutations distinguées.",
    darijaTip:
      'عبارة Il apparaît manifestement que ce défaut préexistait + Imputation erronée كتبين مستوى C1 عالي بزاف فـ قطاع السياحة وكراء السيارات.',
  },
  {
    id: 'tp-pool-16',
    type: 'spoken',
    projectTag: 'E-Commerce',
    title: 'Colis livré dans un Point Relais distant & Réexpédition à Domicile',
    companyContext: 'Teleperformance Portugal — Support Livraison E-Commerce France',
    cefrTarget: 'B2',
    customerVoiceScript:
      "Bonjour, je suis à mobilité réduite et j'avais payé 9,90 € pour une livraison à domicile de ma commande #DOM-1180. Or le livreur a déposé mon colis dans un point relais à 4 kilomètres sans même sonner chez moi !",
    promptTask:
      "Répondez à l'oral : présentez vos excuses les plus sincères pour le non-respect de la consigne de livraison à domicile, organisez l'enlèvement du colis et sa remise en main propre à son domicile dès demain matin, et remboursez intégralement ses 9,90 € de frais de port.",
    prepSeconds: 30,
    responseSeconds: 90,
    keyPointsToCover: [
      'Empathie prioritaire face à sa situation de mobilité réduite (#DOM-1180)',
      'Reprogrammation d’un coursier à domicile demain matin avec appel préalable',
      'Remboursement immédiat des 9,90 € de frais de livraison',
    ],
    idealB2:
      "Bonjour Madame, je suis sincèrement navré d'apprendre que votre commande #DOM-1180 a été déposée en point relais alors que vous aviez choisi la livraison à domicile, d'autant plus au vu de votre situation. Vous n'aurez aucunement à vous déplacer : je viens de mandater un coursier dédié qui récupérera votre colis et vous le remettra directement chez vous demain matin. De plus, je vous rembourse immédiatement vos 9,90 euros de frais de port.",
    idealC1:
      "Bonjour Madame, je mesure pleinement votre légitime mécontentement face au dépôt inapproprié de votre commande #DOM-1180 en point relais, a fortiori compte tenu de votre mobilité réduite. Nous vous prions de bien vouloir nous excuser pour ce manquement du transporteur. Soyez rassurée, vous n'avez aucune démarche à effectuer : j'ai immédiatement mandaté un coursier prioritaire afin que votre colis vous soit remis en main propre à votre domicile demain matin, et j'ai procédé au remboursement intégral de vos 9,90 euros de frais d'expédition.",
    darijaTip:
      'ملي يكون الكليان à mobilité réduite، التعاطف الإنساني هو الأول: Vous n’aurez aucunement à vous déplacer, j’ai mandaté un coursier à domicile.',
  },
];

export interface TPClientSimulationCase {
  id: string;
  projectTitle: string;
  projectBadge: TPProjectTag;
  locationHub: string;
  clientPersona: string;
  scenarioDescription: string;
  customerOpeningQuote: string;
  tpFiveSteps: Array<{
    stepName: string;
    frenchTargetPhrase: string;
    darijaExplanation: string;
  }>;
  idealFullResponseC1: string;
}

export const TP_PORTUGAL_CLIENT_PROJECTS: TPClientSimulationCase[] = [
  {
    id: 'tp-proj-fintech',
    projectTitle: 'Projet 1 : Fintech & Comptabilité PME (Néo-Banque Française)',
    projectBadge: 'Fintech',
    locationHub: 'Campus Teleperformance Nations — Parque das Nações, Lisbonne',
    clientPersona: 'M. Thomas Mercier, Dirigeant de PME à Lyon (Compte Pro verrouillé 2FA & SEPA)',
    scenarioDescription:
      'Le client a changé d’iPhone ce matin et ne peut plus valider le virement SEPA de paie de ses salariés à cause du blocage de sécurité 2FA.',
    customerOpeningQuote:
      "« Mon accès bancaire pro est verrouillé par votre double authentification depuis que j'ai changé de téléphone ce matin ! Mes virements de salaires SEPA doivent partir aujourd'hui, aidez-moi vite ! »",
    tpFiveSteps: [
      {
        stepName: '1. Écoute Active & Accueil C1',
        frenchTargetPhrase:
          'Bonjour Monsieur Mercier, je prends immédiatement en charge votre demande en priorité absolue.',
        darijaExplanation: 'كتستقبل الكليان بهدوء وكتحسسو بلي الملف ديالو فـ أيدي أمينة.',
      },
      {
        stepName: '2. Empathie & Dé-escalade',
        frenchTargetPhrase:
          'Je mesure pleinement l’urgence liée au règlement des salaires de vos collaborateurs aujourd’hui.',
        darijaExplanation: 'كتبين ليه بلي فاهم الأهمية ديال خلاص الخدامة ديالو اليوم.',
      },
      {
        stepName: '3. Vérification CRM & Sécurité RGPD',
        frenchTargetPhrase:
          'Conformément aux normes de sécurité bancaire, ce verrouillage automatique protège vos fonds lors d’un changement d’appareil.',
        darijaExplanation: 'كتقلب المشكل لميزة: هاد البلوكاج راه كيحمي فلوس الشركة ديالو.',
      },
      {
        stepName: '4. Solution Concrète Immédiate',
        frenchTargetPhrase:
          'Je viens de vous transmettre un lien de réinitialisation biométrique 2FA valable 15 minutes et j’active l’option SEPA Instantané gratuit.',
        darijaExplanation: 'كتعطيه الحل العملي دابا نيت: رابط التفعيل + SEPA Instantané فابور.',
      },
      {
        stepName: '5. Clôture Positive & FCR',
        frenchTargetPhrase:
          'Restons en ligne ensemble les 60 prochaines secondes jusqu’à la confirmation effective de votre virement.',
        darijaExplanation: 'كتبقى معاه فـ الخط حتى يتأكد بلي كلشي داز 100% باش تجيب أحسن CSAT.',
      },
    ],
    idealFullResponseC1:
      "Bonjour Monsieur Mercier, je prends immédiatement en charge votre demande en priorité absolue et mesure pleinement l'urgence liée au règlement des salaires de vos collaborateurs. Conformément aux normes de sécurité bancaire, ce verrouillage protège vos avoirs lors d'un changement de terminal. Je viens de vous adresser un lien sécurisé de réinitialisation biométrique 2FA valable 15 minutes et d'activer gratuitement le mode SEPA Instantané sur votre compte. Si vous le souhaitez, je reste en ligne avec vous jusqu'à la validation complète de votre opération.",
  },
  {
    id: 'tp-proj-airline',
    projectTitle: 'Projet 2 : Réservation & Compagnie Aérienne (Hub Lisbonne / Paris)',
    projectBadge: 'Voyages',
    locationHub: 'Campus Teleperformance Marconi — Entrecampos, Lisbonne',
    clientPersona: 'Mme Claire Valéry, Passagère Business Class (Vol annulé & Bagage prioritaire)',
    scenarioDescription:
      'Son vol de correspondance à Lisbonne vers Paris a été annulé pour raison météo ; elle détient un billet non-modifiable et doit signer un contrat demain midi.',
    customerOpeningQuote:
      "« Mon vol de 19h40 vers Paris vient d'être annulé ! J'ai un billet tarif restreint mais j'ai une réunion décisive demain à 11h00 à La Défense. Trouvez-moi une solution ! »",
    tpFiveSteps: [
      {
        stepName: '1. Écoute Active & Accueil C1',
        frenchTargetPhrase:
          'Bonjour Madame Valéry, soyez assurée que je mobilise immédiatement nos accès prioritaires pour votre déplacement.',
        darijaExplanation: 'ترحيب راقي كيطمئن المسافرة من أول ثانية.',
      },
      {
        stepName: '2. Empathie & Dé-escalade',
        frenchTargetPhrase:
          'Je comprends parfaitement l’enjeu stratégique de votre réunion demain matin à Paris-La Défense.',
        darijaExplanation: 'كتعترف بأهمية الاجتماع ديالها غدا فـ باريس.',
      },
      {
        stepName: '3. Vérification CRM & Dérogation Tarifaire',
        frenchTargetPhrase:
          'En cas d’irrégularité opérationnelle, la restriction initiale de votre billet est intégralement levée sans aucuns frais.',
        darijaExplanation: 'كتشرح ليها بلي ملي كيتلغى الفول، القانون كيسمح نبدلو التيكي فابور وخا كان non-modifiable.',
      },
      {
        stepName: '4. Solution Concrète Immédiate',
        frenchTargetPhrase:
          'Je viens de vous confirmer un siège au premier rang sur le vol de 07h10 demain matin (arrivée 10h05 à Orly) ainsi qu’une nuitée en hôtel 4 étoiles à l’aéroport.',
        darijaExplanation: 'حل متكامل: أول طائرة مع الصباح + أوطيل 4 نجوم فابور.',
      },
      {
        stepName: '5. Clôture Positive & FCR',
        frenchTargetPhrase:
          'Votre nouvelle carte d’embarquement et votre bon d’hôtel viennent de vous être envoyés sur votre application mobile.',
        darijaExplanation: 'تأكيد فوري فـ الهاتف ديالها باش ترتاح.',
      },
    ],
    idealFullResponseC1:
      "Bonjour Madame Valéry, je comprends parfaitement l'enjeu stratégique de votre réunion demain matin à Paris-La Défense et prends personnellement le relais. En cas d'irrégularité opérationnelle, la restriction initiale de votre tarif est intégralement levée sans frais. Je viens de vous réserver une place prioritaire sur le premier vol de demain matin à 07h10, atterrissant à 10h05 à Paris-Orly, et de vous émettre une prise en charge complète en hôtel quatre étoiles pour cette nuit. Vos documents viennent d'être transmis par SMS et courriel.",
  },
  {
    id: 'tp-proj-luxury',
    projectTitle: 'Projet 3 : E-Commerce & Marques de Luxe (Haute Horlogerie & Mode)',
    projectBadge: 'E-Commerce',
    locationHub: 'Campus Teleperformance — Lisbonne & Télétravail Hybride Portugal',
    clientPersona: 'M. Alexandre Delacroix, Client Ambassadeur Luxe (Article reçu endommagé)',
    scenarioDescription:
      'Le client a reçu une mallette en cuir de luxe présentant une griffure sur le fermoir doré, commandée pour un départ en voyage d’affaires après-demain.',
    customerOpeningQuote:
      "« J'ai déballé ma mallette en cuir réf. #ML-809 à 1 400 € et le fermoir présente une rayure visible ! Je pars en déplacement à Zurich jeudi matin, c'est inacceptable ! »",
    tpFiveSteps: [
      {
        stepName: '1. Écoute Active & Accueil Maison de Luxe',
        frenchTargetPhrase:
          'Bonjour Monsieur Delacroix, je vous remercie de nous avoir alertés et prends personnellement soin de votre requête.',
        darijaExplanation: 'أسلوب راقي خاص بـ les Maisons de Luxe.',
      },
      {
        stepName: '2. Empathie & Regret Sincère',
        frenchTargetPhrase:
          'C’est avec un profond regret que nous constatons cette imperfection, qui ne correspond aucunement aux standards d’excellence de notre Maison.',
        darijaExplanation: 'اعتذار أنيق كيحافظ على هيبة الماركة وكيرضي الكليان.',
      },
      {
        stepName: '3. Vérification CRM & Dispense de Retour Préalable',
        frenchTargetPhrase:
          'Compte tenu de votre statut privilégié, nous n’attendrons pas le retour de la pièce actuelle pour déclencher son remplacement.',
        darijaExplanation: 'ما غاديش نتسناو حتى يرجع لينا السلعة عاد نصيفطو ليه وحدة جديدة!',
      },
      {
        stepName: '4. Solution Concrète Immédiate',
        frenchTargetPhrase:
          'Un nouvel exemplaire contrôlé par notre atelier part ce jour par coursier dédié pour une remise en main propre demain avant 14h00, assorti d’un porte-cartes en cuir offert.',
        darijaExplanation: 'إرسال فوري مع مراقبة الجودة + هدية فاخرة (porte-cartes en cuir).',
      },
      {
        stepName: '5. Clôture Positive & Collecte VIP',
        frenchTargetPhrase:
          'Le même coursier récupérera simultanément le premier article demain à l’heure de votre convenance.',
        darijaExplanation: 'نفس الكورسيي غيعطيه الجديدة وياخد القديمة بلا ما يتعذب الكليان.',
      },
    ],
    idealFullResponseC1:
      "Bonjour Monsieur Delacroix, c'est avec un profond regret que je prends connaissance de cette imperfection sur votre pièce #ML-809, laquelle ne reflète aucunement l'exigence de notre Maison. Compte tenu de votre départ jeudi matin pour Zurich, j'ai immédiatement ordonné l'envoi par coursier dédié d'un nouvel exemplaire minutieusement contrôlé, qui vous sera remis demain avant 14h00 et procédera simultanément à la reprise du premier article. En témoignage de notre considération, nous avons glissé dans votre coffret un porte-cartes en cuir assorti.",
  },
];

export interface TPInterviewQuestion {
  id: string;
  language: 'fr-FR' | 'en-US';
  badgeLabel: string;
  recruiterQuestion: string;
  recruiterSubtext: string;
  modelAnswer: string;
  darijaRecruiterTip: string;
  redFlagsToAvoid: string;
}

/**
 * Sub-Module 7B: 8 Official Teleperformance Portugal Telephone Screening Questions
 * (5 in Fluent French C1/C2 + 3 in Working English B2)
 */
export const TP_PORTUGAL_INTERVIEW_QUESTIONS: TPInterviewQuestion[] = [
  {
    id: 'tpi-fr-1',
    language: 'fr-FR',
    badgeLabel: 'FR #1 · Motivation & Lisbonne',
    recruiterQuestion:
      '« Bonjour ! Pour commencer notre entretien téléphonique pour Teleperformance Portugal, pouvez-vous vous présenter et nous expliquer pourquoi vous souhaitez rejoindre notre programme Atlantic Experience à Lisbonne ? »',
    recruiterSubtext: 'Évalue la fluidité spontanée C1, la maturité du projet d’expatriation à Lisbonne et la stabilité.',
    modelAnswer:
      "Bonjour, je vous remercie de votre appel. Fort(e) d'une solide expérience en relation client et parfaitement francophone, je souhaite donner une dimension internationale à ma carrière en rejoignant Teleperformance Portugal à Lisbonne. Le programme Atlantic Experience représente pour moi l'alliance idéale entre l'exigence opérationnelle d'un leader mondial certifié Great Place to Work et la qualité de vie exceptionnelle du Portugal. Je suis pleinement préparé(e) à m'investir durablement au sein de vos équipes multiculturelles.",
    darijaRecruiterTip:
      'الروكروتور ديال TP Portugal فـ التليفون كيبغي يتأكد بلي نتا ماشي جاي غير تدوز عطلة فـ لشبونة وتمشي! ركز على Stabilité durable و Dimension internationale و Great Place to Work.',
    redFlagsToAvoid: 'Ne jamais dire que vous venez uniquement pour le soleil ou pour quelques mois d’été.',
  },
  {
    id: 'tpi-fr-2',
    language: 'fr-FR',
    badgeLabel: 'FR #2 · Gestion Client Furieux',
    recruiterQuestion:
      '« Imaginez qu’un client français vous appelle en criant parce que son compte ou sa commande est bloqué(e). Comment gérez-vous cet appel étape par étape ? »',
    recruiterSubtext: 'Vérifie la maîtrise de la méthode TP en 5 étapes (Écoute active, Empathie, CRM, Solution, Clôture).',
    modelAnswer:
      "Face à un client irrité, je garde un ton calme, posé et chaleureux sans jamais prendre son mécontentement personnellement. Dans un premier temps, je pratique l'écoute active sans l'interrompre, puis je reformule son besoin avec empathie en utilisant une formule telle que : « Je mesure pleinement votre contrariété ». Ensuite, je vérifie immédiatement son dossier dans le CRM pour lui proposer une solution concrète assortie d'un délai précis, avant de clôturer l'appel en m'assurant de son entière satisfaction (FCR).",
    darijaRecruiterTip:
      'عطيهم المنهجية ديال 5 خطوات بالترتيب: 1) Calme & écoute active، 2) Empathie & reformulation، 3) Vérification CRM، 4) Solution concrète، 5) Clôture FCR.',
    redFlagsToAvoid: 'Ne dites jamais « Je lui demande de se calmer » (cela énerve encore plus le client).',
  },
  {
    id: 'tpi-fr-3',
    language: 'fr-FR',
    badgeLabel: 'FR #3 · KPIs (CSAT, FCR, AHT)',
    recruiterQuestion:
      '« Dans un centre de contact BPO, comment parvenez-vous à concilier rapidité de traitement (AHT) et haute qualité de satisfaction client (CSAT / FCR) ? »',
    recruiterSubtext: 'Évalue la culture KPI BPO et l’efficacité opérationnelle.',
    modelAnswer:
      "Pour concilier un temps moyen de traitement (AHT) maîtrisé et un CSAT élevé, la clé réside dans la structuration de l'appel et la maîtrise parfaite de la base de connaissances CRM. En identifiant dès les trente premières secondes le motif exact du contact grâce à une reformulation précise, j'évite les digressions tout en apportant une résolution complète dès le premier contact (FCR), ce qui satisfait pleinement le client sans prolonger inutilement l'échange.",
    darijaRecruiterTip:
      'منين تذكر مصطلحات بحال AHT و CSAT و FCR و Base de connaissances CRM بطريقة طبيعية، الروكروتور كيعرفك فاهم الحرفة ديال BPO مزيان!',
    redFlagsToAvoid: 'Évitez d’opposer vitesse et qualité ; montrez que la précision du diagnostic fait gagner du temps.',
  },
  {
    id: 'tpi-fr-4',
    language: 'fr-FR',
    badgeLabel: 'FR #4 · RGPD & Confidentialité',
    recruiterQuestion:
      '« Que signifie pour vous le respect du RGPD au quotidien lorsque vous traitez des dossiers bancaires ou confidentiels chez Teleperformance ? »',
    recruiterSubtext: 'Vérifie la rigueur sécuritaire indispensable sur les projets Fintech / Banque / Santé.',
    modelAnswer:
      "Le respect du RGPD et de la politique Clean Desk chez Teleperformance est une responsabilité absolue. Au quotidien, cela implique d'authentifier formellement chaque interlocuteur avant de communiquer la moindre information sur un dossier, de ne jamais noter de coordonnées personnelles ou bancaires sur support libre, et de verrouiller systématiquement mon poste dès que je m'absente.",
    darijaRecruiterTip:
      'جبد ليهم كلمة Clean Desk Policy (سياسة المكتب النظيف فـ TP: ممنوع تكتب معلومات الكليان فـ ورقة أو تدخل التليفون الشخصي للـ floor)! هادي كتعجبهم بزاف.',
    redFlagsToAvoid: 'Ne minimisez jamais les procédures d’authentification même si un proche appelle pour le titulaire.',
  },
  {
    id: 'tpi-fr-5',
    language: 'fr-FR',
    badgeLabel: 'FR #5 · Esprit d’Équipe & Feedback',
    recruiterQuestion:
      '« Comment réagissez-vous lorsque votre superviseur (Team Leader) vous fait une remarque suite à une écoute qualité (Quality Monitoring) ? »',
    recruiterSubtext: 'Teste la coachabilité (Coachability) et l’état d’esprit positif.',
    modelAnswer:
      "J'accueille chaque retour de Quality Monitoring comme une opportunité précieuse de progression. J'écoute attentivement les axes d'amélioration soulignés par mon Team Leader ou le Quality Analyst, je pose des questions pour bien comprendre le standard attendu, et j'applique immédiatement ces conseils dès mes appels suivants afin d'atteindre l'excellence opérationnelle.",
    darijaRecruiterTip:
      'أهم صفة كيقلبو عليها فـ TP هي Coachability (تكون قابل للتعلم والتطور وتقبل الملاحظات ديال Quality Analyst بصدر رحب).',
    redFlagsToAvoid: 'Ne soyez jamais sur la défensive face à un feedback qualité.',
  },
  {
    id: 'tpi-en-1',
    language: 'en-US',
    badgeLabel: 'EN #1 · Relocation & TP Housing (B2 Check)',
    recruiterQuestion:
      '« Great! Now let’s switch to English for a quick B2 check, as our internal training and tools use English. How do you feel about relocating to Lisbon and sharing a Teleperformance apartment with international colleagues? »',
    recruiterSubtext: 'Mandatory English B2 check during the TP Portugal recruiter call — tests conversational fluency and adaptability.',
    modelAnswer:
      "I feel very excited and fully prepared to relocate to Lisbon. Living in a shared Teleperformance apartment with international colleagues is a great opportunity to adapt quickly, respect common living rules, and build strong friendships in a multicultural environment. I already have all my documents ready for a smooth transition.",
    darijaRecruiterTip:
      'فوسط المكالمة بالفرونسي، الروكروتور ديال TP Portugal غيقوليك: Let’s switch to English for 2 minutes! ما تخلعش، غير هضر بإنجليزية واضحة B2 وبين ليهم بلي نتا متفتح على السكن المشترك TP Shared Apartment وعندك روح التعايش.',
    redFlagsToAvoid: 'Avoid freezing when switching from French to English—keep sentences clear, positive, and structured.',
  },
  {
    id: 'tpi-en-2',
    language: 'en-US',
    badgeLabel: 'EN #2 · Rotating Shifts 24/7 Flexibility',
    recruiterQuestion:
      '« Many of our projects in Lisbon operate with rotating shifts, including weekends or evening hours. Are you comfortable working flexible schedules? »',
    recruiterSubtext: 'Crucial operational filter: TP Portugal requires flexibility on rotating shifts (horaires rotatifs).',
    modelAnswer:
      "Yes, absolutely. I completely understand that international customer support requires full coverage, including rotating shifts, evenings, and weekends. I am very organized, reliable with my punctuality, and 100% flexible with any schedule assigned to my team.",
    darijaRecruiterTip:
      'سؤال حاسم فـ القبول النهائي: واش قابل تخدم Horaires rotatifs / Weekends؟ الجواب خاصو يكون ديما: Yes, I am 100% flexible and reliable with rotating shifts!',
    redFlagsToAvoid: 'Saying "I only want Monday to Friday 9-to-5" can immediately disqualify you from most BPO projects.',
  },
  {
    id: 'tpi-en-3',
    language: 'en-US',
    badgeLabel: 'EN #3 · Handling Stress & Multitasking',
    recruiterQuestion:
      '« How do you handle pressure when you have back-to-back calls and need to navigate multiple CRM screens at the same time? »',
    recruiterSubtext: 'Tests resilience and computer multitasking readiness.',
    modelAnswer:
      "I stay calm and focused by taking one customer at a time and following the standard procedures step by step. I am very comfortable using multiple software tabs, taking structured notes while listening, and maintaining a warm, positive voice even during peak hours.",
    darijaRecruiterTip:
      'بين ليهم بلي كتعرف تخدم فـ plusieurs écrans CRM وتكتب الملاحظات فـ نفس الوقت اللي كتسمع فيه للكليان بهدوء وابتسامة.',
    redFlagsToAvoid: 'Do not say that multitasking makes you anxious or slows you down.',
  },
];

export interface PanicSosBundle {
  openersC1: Array<{ french: string; darija: string }>;
  bridgesC1: Array<{ french: string; darija: string }>;
  closingsC1: Array<{ french: string; darija: string }>;
}

export const PANIC_SOS_PHRASES: PanicSosBundle = {
  openersC1: [
    {
      french: 'Bonjour Madame, Monsieur, je vous remercie de nous avoir contactés et prends immédiatement le relais sur votre dossier.',
      darija: 'افتتاحية جوكر صالحة لأي مكالمة أولا إيميل فـ Pipplet و Harver.',
    },
    {
      french: 'Je mesure pleinement votre contrariété face à ce contretemps et vous assure de ma totale mobilisation.',
      darija: 'عبارة تعاطف C1 كتبرد أي كليان مقلق فـ الثانية الأولى.',
    },
    {
      french: 'Soyez pleinement rassuré(e) : votre demande fait dès cet instant l’objet d’un traitement prioritaire.',
      darija: 'كتعطي الأمان للكليان ملي يكون عندو مشكل مستعجل (Fintech / Vol / Colis).',
    },
  ],
  bridgesC1: [
    {
      french: 'Bien que notre procédure standard prévoie un délai habituel, j’ai pris l’initiative d’activer une solution exceptionnelle.',
      darija: 'جسر ذهبي فيه Bien que + Subjonctif باش تدوز من المشكل للحل الاستثنائي.',
    },
    {
      french: 'Permettez-moi de structurer ma réponse en deux points afin de vous apporter une visibilité complète.',
      darija: 'جملة الإنقاذ ملي يتبلوكا ليك الدماغ فـ الشفوي: كتربح 5 ثواني ديال التفكير بلا ما تقول euh!',
    },
    {
      french: 'Conformément à nos engagements de qualité, nous avons d’ores et déjà procédé à la régularisation de votre situation.',
      darija: 'عبارة C1 قوية كتعني: طبقا للالتزامات ديالنا، رانا قدينا الوضعية ديالك من دابا نيت.',
    },
  ],
  closingsC1: [
    {
      french: 'En vous renouvelant nos excuses pour ce désagrément, je reste à votre entière disposition et vous souhaite une excellente journée.',
      darija: 'خاتمة شاملة ومؤدبة بزاف صالحة للشفوي والكتابي.',
    },
    {
      french: 'Ai-je répondu à l’ensemble de vos attentes aujourd’hui, ou souhaiteriez-vous aborder un autre point ?',
      darija: 'سؤال اختتام المكالمة باش تضمن 100% فـ FCR و CSAT.',
    },
  ],
};
