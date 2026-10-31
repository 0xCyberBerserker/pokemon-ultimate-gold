import type { Acquisition as AcquisitionRecord, Language } from '../../data/types';
import { localized } from '../../data/wiki';

function localPath(path: string | undefined, image = false): string | undefined {
  if (!path) return undefined;
  try {
    const url = new URL(path, 'https://wiki.invalid/wiki/');
    if (url.origin !== 'https://wiki.invalid' || (image && !/\.(png|jpe?g|webp)$/i.test(url.pathname))) return undefined;
    return path;
  } catch { return undefined; }
}

function statusLabel(status: string | undefined, es: boolean): string {
  if (status?.includes('prototype')) return status.includes('location')
    ? (es ? 'Ubicación de prototipo; no demuestra stock ni compra' : 'Prototype location; does not establish stock or purchase')
    : (es ? 'Captura QA del prototipo' : 'Prototype QA capture');
  switch (status) {
    case 'native_exact_target_gift': return es ? 'Captura del diálogo de regalo' : 'Gift dialogue capture';
    case 'verified_target_shop_stock': return es ? 'Stock comprobado; compra no necesariamente probada' : 'Stock verified; purchase not necessarily tested';
    case 'verified_event_script_static_no_gameplay': return es ? 'Evento comprobado; recogida sin probar' : 'Event verified; pickup untested';
    case 'verified_held_item_data_static': return es ? 'Objeto equipado comprobado; captura sin probar' : 'Held item verified; capture untested';
    case 'native_gift_runtime_only': return es ? 'Regalo observado; guardado posterior sin probar' : 'Gift observed; post-gift saving untested';
    case 'bounded_native_purchase_save_cold_verified': return es ? 'Compra y guardado/recarga comprobados en caso acotado' : 'Purchase and save/reload verified in a bounded case';
    case 'native_purchase_save_cold_bounded': return es ? 'Compra y guardado/recarga comprobados en caso acotado' : 'Purchase and save/reload verified in a bounded case';
    case 'documented_base_game': return es ? 'Ubicación de HGSS; contraste con esta ROM pendiente' : 'HGSS location; target comparison pending';
    case 'documented_upstream': return es ? 'Guía original; pendiente de contraste' : 'Upstream guide; target check pending';
    default: return status ? `${es ? 'Estado de origen' : 'Source status'}: ${status}` : (es ? 'Estado pendiente' : 'Status pending');
  }
}

export default function Acquisition({ records, language }: { records?: AcquisitionRecord[]; language: Language }) {
  const es = language === 'es';
  if (!records?.length) return <p>{es ? 'No hay ubicación verificada para esta ROM.' : 'No verified in-game location is recorded for this ROM.'}</p>;
  return <div>{records.map((record, index) => {
    const evidence = record.evidence;
    const report = localPath(evidence?.report?.path);
    const external = record.source?.url || record.source?.author_reference;
    return <article className="acquisition-record" key={index}>
      <strong>{localized(record.location?.name, language)}</strong><p>{localized(record.method, language)}</p>
      <small>{statusLabel(record.status, es)}{record.source?.title && ` · ${record.source.title}`}{external?.startsWith('https://') && <> · <a className="text-link" href={external}>{es ? 'Fuente' : 'Source'}</a></>}</small>
      {(evidence || record.source?.claim || record.source?.reference || record.source?.transcription || record.price != null) && <details><summary>{es ? 'Fuentes y comprobación' : 'Sources and verification'}</summary>
        {record.source?.reference && <p>{es ? 'Referencia de origen' : 'Source reference'}: <code>{record.source.reference}</code></p>}
        {record.price != null && <p>{es ? 'Precio registrado' : 'Recorded price'}: ₽{record.price.toLocaleString(language)}{record.shop_id != null && ` · ${es ? 'Tienda' : 'Shop'} ${record.shop_id}`}</p>}
        {record.source?.claim && <p>{es ? 'Alcance original de la fuente' : 'Original source claim'}: {record.source.claim}</p>}
        {record.source?.transcription && <p>{es ? 'Transcripción' : 'Transcription'}: {record.source.transcription.startsWith('https://') ? <a className="text-link" href={record.source.transcription}>{es ? 'Abrir fuente' : 'Open source'}</a> : record.source.transcription}</p>}
        {evidence?.scope && <p>{es ? 'Alcance' : 'Scope'}: {statusLabel(evidence.scope, es)}</p>}
        {evidence?.proof && <p>{es ? 'Registro de evidencia' : 'Evidence record'}: {evidence.proof.kind}{evidence.proof.item_id != null && ` · ID ${evidence.proof.item_id}`}{evidence.proof.species_ids?.map((id) => <span key={id}> · <a className="text-link" href={`#/pokemon/${id}`}>#{id}</a></span>)}</p>}
        {evidence?.rom_sha256 && <p>ROM SHA-256: <code>{evidence.rom_sha256}</code></p>}
        {evidence?.base_rom_sha256 && <p>{es ? 'ROM base SHA-256' : 'Base ROM SHA-256'}: <code>{evidence.base_rom_sha256}</code></p>}
        {report && <p><a className="text-link" href={report}>{es ? 'Informe QA' : 'QA report'}</a>{evidence?.report?.sha256 && <> · <code>{evidence.report.sha256}</code></>}</p>}
        {evidence?.screenshots?.map((shot, shotIndex) => { const path = localPath(shot.path, true); return path ? <figure key={shotIndex}><a href={path}><img src={path} alt={shot.alt || (es ? 'Captura de la pantalla superior' : 'Upper-screen capture')} loading="lazy" /></a>{shot.sha256 && <figcaption><code>{shot.sha256}</code></figcaption>}</figure> : null; })}
      </details>}
    </article>;
  })}</div>;
}
