export class AppErrors {
  // API / réseau
  static readonly SESSION_EXPIRED = 'Session expirée. Veuillez vous reconnecter.';
  static readonly NETWORK_ERROR = 'Erreur réseau. Vérifiez votre connexion.';
  static readonly GENERIC = 'Une erreur est survenue.';

  // Auth
  static readonly INVALID_CREDENTIALS = 'Email ou mot de passe incorrect.';
  static readonly EMAIL_ALREADY_USED = 'Cette adresse email est déjà utilisée.';

  // Séances
  static readonly CREATE_SEANCE_FAILED = 'Impossible de créer la séance.';

  /** Traduit un message d'erreur backend en message utilisateur français. */
  static translate(message: string): string {
    const map: Record<string, string> = {
      'Invalid credentials': AppErrors.INVALID_CREDENTIALS,
      'Email already in use': AppErrors.EMAIL_ALREADY_USED,
    };
    return map[message] ?? message;
  }
}
