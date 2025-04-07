import DOMPurify from 'dompurify';

export class SanitizationService {
  static sanitizeInput(value: string): string {
    // Remove caracteres especiais e tags HTML
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: [], // Não permite nenhuma tag HTML
      ALLOWED_ATTR: [] // Não permite nenhum atributo
    }).trim();
  }

  static sanitizeHTML(value: string): string {
    // Permite algumas tags HTML seguras
    return DOMPurify.sanitize(value, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href']
    });
  }

  static sanitizeURL(url: string): string {
    // Sanitiza URLs
    const sanitized = DOMPurify.sanitize(url);
    try {
      const parsed = new URL(sanitized);
      return parsed.toString();
    } catch {
      return '';
    }
  }

  static escapeHTML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
} 