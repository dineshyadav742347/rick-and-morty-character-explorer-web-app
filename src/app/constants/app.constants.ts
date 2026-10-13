export const APP_CONSTANTS = {
  ROLES: {
    ADMIN: 'Admin' as const,
    VIEWER: 'Viewer' as const
  },
  STORAGE_KEYS: {
    USER_ROLE: 'user_role'
  },
  MESSAGES: {
    UNAUTHORIZED_ACCESS: 'Access Denied: Viewer role cannot access character details. Please switch to Admin role.',
    NO_CHARACTERS_FOUND: 'No characters found matching your search.',
    LOAD_ERROR: 'Failed to load data. Please try again later.'
  },
  LABELS: {
    APP_TITLE: 'Rick & Morty Character Explorer Web Application',
    GRID_VIEW: 'Grid',
    LIST_VIEW: 'List',
    SEARCH_PLACEHOLDER: 'Search characters by name...',
    EPISODE_SEARCH_PLACEHOLDER: 'Filter episodes by name...',
    BACK_TO_CHARACTERS: 'Back to Characters',
    VIEW_DETAILS: 'View Details',
    PREVIOUS: 'Previous',
    NEXT: 'Next'
  }
};