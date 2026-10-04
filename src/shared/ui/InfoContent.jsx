export default function InfoContent({ info, onClose, close }) {
  return (
    info && (
      <>
        <h2 id="dialog-title" className="dialog-title">
          {info.title}
        </h2>
        {info.content || <p className="dialog-description">{info.text}</p>}
        <button className="primary-button" onClick={onClose || close}>
          إغلاق
        </button>
      </>
    )
  );
}
