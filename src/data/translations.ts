export const languagesList = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
    { code: 'ko', name: '한국어' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pl', name: 'Polski' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'th', name: 'ไทย' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'sv', name: 'Svenska' },
    { code: 'da', name: 'Dansk' },
    { code: 'fi', name: 'Suomi' },
    { code: 'no', name: 'Norsk' },
    { code: 'cs', name: 'Čeština' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'he', name: 'עברית' },
    { code: 'ro', name: 'Română' },
    { code: 'hu', name: 'Magyar' },
    { code: 'uk', name: 'Українська' },
    { code: 'ms', name: 'Bahasa Melayu' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ur', name: 'اردو' },
    { code: 'fa', name: 'فارسی' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' }
] as const;

export const translations = {
    en: {
        // Navigation
        home: 'Home',
        movies: 'Movies',
        tvShows: 'TV Shows',
        searchPlaceholder: 'Search movies, shows...',

        // Hero
        watchNow: 'Watch Now',
        moreInfo: 'More Info',
        playNow: 'Play Now',
        featured: 'Featured',
        trending: 'Trending',

        // Sections
        continueWatching: 'Continue Watching',
        trendingNow: 'Trending Now',
        top10: 'Top 10 Today',
        newReleases: 'New Releases',

        // Footer
        company: 'Company',
        aboutUs: 'About Us',
        careers: 'Careers',
        press: 'Press',
        blog: 'Blog',
        support: 'Support',
        helpCenter: 'Help Center',
        contactUs: 'Contact Us',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        discover: 'Discover',
        account: 'Account',
        accountSettings: 'Account Settings',
        manageDevices: 'Manage Devices',
        giftCards: 'Gift Cards',
        rightsReserved: 'All rights reserved',

        // Profile
        overview: 'Overview',
        settings: 'Settings',
        notifications: 'Notifications',
        privacy: 'Privacy',
        billing: 'Billing',
        editProfile: 'Edit Profile',
        watchStats: 'Watch Stats',
        totalWatched: 'Total Watched',
        hoursWatched: 'Hours Watched',
        favoriteGenre: 'Favorite Genre',
        dayStreak: 'Day Streak',
        recentActivity: 'Recent Activity',

        // Common
        loading: 'Loading...',
        details: 'Details',
        cast: 'Cast',
        creators: 'Creators',
        awards: 'Awards',
        moreLikeThis: 'More Like This',
        episodes: 'Episodes'
    },
    es: {
        // Navigation
        home: 'Inicio',
        movies: 'Películas',
        tvShows: 'Series TV',
        searchPlaceholder: 'Buscar películas, series...',

        // Hero
        watchNow: 'Ver Ahora',
        moreInfo: 'Más Info',
        playNow: 'Reproducir',
        featured: 'Destacado',
        trending: 'Tendencias',

        // Sections
        continueWatching: 'Continuar Viendo',
        trendingNow: 'Tendencias Ahora',
        top10: 'Top 10 Hoy',
        newReleases: 'Nuevos Lanzamientos',

        // Footer
        company: 'Empresa',
        aboutUs: 'Sobre Nosotros',
        careers: 'Carreras',
        press: 'Prensa',
        blog: 'Blog',
        support: 'Soporte',
        helpCenter: 'Centro de Ayuda',
        contactUs: 'Contáctanos',
        privacyPolicy: 'Política de Privacidad',
        termsOfService: 'Términos de Servicio',
        discover: 'Descubrir',
        account: 'Cuenta',
        accountSettings: 'Configuración',
        manageDevices: 'Gestionar Dispositivos',
        giftCards: 'Tarjetas de Regalo',
        rightsReserved: 'Todos los derechos reservados',

        // Profile
        overview: 'Resumen',
        settings: 'Ajustes',
        notifications: 'Notificaciones',
        privacy: 'Privacidad',
        billing: 'Facturación',
        editProfile: 'Editar Perfil',
        watchStats: 'Estadísticas',
        totalWatched: 'Total Visto',
        hoursWatched: 'Horas Vistas',
        favoriteGenre: 'Género Favorito',
        dayStreak: 'Racha de Días',
        recentActivity: 'Actividad Reciente',

        // Common
        loading: 'Cargando...',
        details: 'Detalles',
        cast: 'Reparto',
        creators: 'Creadores',
        awards: 'Premios',
        moreLikeThis: 'Más como esto',
        episodes: 'Episodios'
    },
    fr: {
        // Navigation
        home: 'Accueil',
        movies: 'Films',
        tvShows: 'Séries TV',
        searchPlaceholder: 'Rechercher films, séries...',

        // Hero
        watchNow: 'Regarder',
        moreInfo: 'Plus d\'infos',
        playNow: 'Lecture',
        featured: 'En Vedette',
        trending: 'Tendances',

        // Sections
        continueWatching: 'Reprendre la lecture',
        trendingNow: 'Tendances actuelles',
        top10: 'Top 10 aujourd\'hui',
        newReleases: 'Nouveautés',

        // Footer
        company: 'Société',
        aboutUs: 'À propos',
        careers: 'Carrières',
        press: 'Presse',
        blog: 'Blog',
        support: 'Aide',
        helpCenter: 'Centre d\'aide',
        contactUs: 'Nous contacter',
        privacyPolicy: 'Confidentialité',
        termsOfService: 'Conditions d\'utilisation',
        discover: 'Découvrir',
        account: 'Compte',
        accountSettings: 'Paramètres du compte',
        manageDevices: 'Gérer les appareils',
        giftCards: 'Cartes cadeaux',
        rightsReserved: 'Tous droits réservés',

        // Profile
        overview: 'Aperçu',
        settings: 'Paramètres',
        notifications: 'Notifications',
        privacy: 'Confidentialité',
        billing: 'Facturation',
        editProfile: 'Modifier le profil',
        watchStats: 'Statistiques',
        totalWatched: 'Total visionné',
        hoursWatched: 'Heures visionnées',
        favoriteGenre: 'Genre favori',
        dayStreak: 'Série de jours',
        recentActivity: 'Activité récente',

        // Common
        loading: 'Chargement...',
        details: 'Détails',
        cast: 'Distribution',
        creators: 'Créateurs',
        awards: 'Récompenses',
        moreLikeThis: 'Similaire',
        episodes: 'Épisodes'
    },
    de: {
        // Navigation
        home: 'Startseite',
        movies: 'Filme',
        tvShows: 'Serien',
        searchPlaceholder: 'Filme, Serien suchen...',

        // Hero
        watchNow: 'Jetzt ansehen',
        moreInfo: 'Mehr Info',
        playNow: 'Abspielen',
        featured: 'Vorgestellt',
        trending: 'Trends',

        // Sections
        continueWatching: 'Weiterschauen',
        trendingNow: 'Jetzt im Trend',
        top10: 'Top 10 Heute',
        newReleases: 'Neuerscheinungen',

        // Footer
        company: 'Unternehmen',
        aboutUs: 'Über uns',
        careers: 'Karriere',
        press: 'Presse',
        blog: 'Blog',
        support: 'Support',
        helpCenter: 'Hilfezentrum',
        contactUs: 'Kontakt',
        privacyPolicy: 'Datenschutz',
        termsOfService: 'Nutzungsbedingungen',
        discover: 'Entdecken',
        account: 'Konto',
        accountSettings: 'Einstellungen',
        manageDevices: 'Geräte verwalten',
        giftCards: 'Geschenkkarten',
        rightsReserved: 'Alle Rechte vorbehalten',

        // Profile
        overview: 'Übersicht',
        settings: 'Einstellungen',
        notifications: 'Benachrichtigungen',
        privacy: 'Privatsphäre',
        billing: 'Abrechnung',
        editProfile: 'Profil bearbeiten',
        watchStats: 'Statistiken',
        totalWatched: 'Insgesamt gesehen',
        hoursWatched: 'Stunden gesehen',
        favoriteGenre: 'Lieblingsgenre',
        dayStreak: 'Tages-Streak',
        recentActivity: 'Letzte Aktivität',

        // Common
        loading: 'Laden...',
        details: 'Details',
        cast: 'Besetzung',
        creators: 'Schöpfer',
        awards: 'Auszeichnungen',
        moreLikeThis: 'Ähnliche Titel',
        episodes: 'Episoden'
    }
};

// Fallback for languages not yet translated
languagesList.forEach(lang => {
    if (!translations[lang.code as keyof typeof translations]) {
        (translations as any)[lang.code] = translations.en;
    }
});

export type TranslationData = typeof translations.en;
export type Language = typeof languagesList[number]['code'];
export type TranslationKey = keyof TranslationData;

export const allTranslations = translations as unknown as Record<Language, TranslationData>;
