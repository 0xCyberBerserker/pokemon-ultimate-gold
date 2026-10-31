import { Component, type ReactNode } from 'react';
import type { Language } from './data/types';

type Props = { language: Language; children: ReactNode };
type State = { failed: boolean };

export default class SectionErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State { return { failed: true }; }

  render() {
    if (!this.state.failed) return this.props.children;
    const es = this.props.language === 'es';
    return <div className="panel section-error" role="alert"><p>{es ? 'No se pudo cargar esta sección.' : 'This section could not be loaded.'}</p><button type="button" onClick={() => window.location.reload()}>{es ? 'Reintentar' : 'Try again'}</button></div>;
  }
}
