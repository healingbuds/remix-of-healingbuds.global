import { useTranslation } from 'react-i18next';

/**
 * Skip Links component for keyboard and screen reader accessibility.
 * Allows users to bypass navigation and jump directly to main content.
 * 
 * WCAG 2.1 compliant with:
 * - Visible focus states
 * - Keyboard navigation (Enter/Space)
 * - Screen reader announcements
 * - i18n support
 */
export const SkipLinks = () => {
  const { t } = useTranslation('common');

  const handleSkipToMain = (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Remove tabindex after focus to avoid leaving artifacts
      setTimeout(() => mainContent.removeAttribute('tabindex'), 100);
    }
  };

  const handleSkipToNav = (e: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    
    // Try desktop navigation first, then mobile
    const nav = document.getElementById('main-navigation') || 
                document.getElementById('main-navigation-mobile');
    if (nav) {
      const firstLink = nav.querySelector('a, button');
      if (firstLink instanceof HTMLElement) {
        firstLink.focus();
      }
    }
  };

  return (
    <div className="skip-links-container">
      <a
        href="#main-content"
        onClick={handleSkipToMain}
        onKeyDown={handleSkipToMain}
        className="skip-link"
      >
        {t('accessibility.skipToMain', 'Skip to main content')}
      </a>
      <a
        href="#main-navigation"
        onClick={handleSkipToNav}
        onKeyDown={handleSkipToNav}
        className="skip-link skip-link-second"
      >
        {t('accessibility.skipToNav', 'Skip to navigation')}
      </a>
    </div>
  );
};

export default SkipLinks;
