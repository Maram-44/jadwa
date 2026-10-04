import { forwardRef, useRef, useEffect, useImperativeHandle } from "react";
let openCount = 0;
let savedOverflow = "";
const Dialog = forwardRef(function Dialog(
  { open = false, onClose, children, ...props },
  forwarded,
) {
  const ref = useRef();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useImperativeHandle(forwarded, () => ref.current);
  useEffect(() => {
    const dialog = ref.current;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    const trigger = document.activeElement;
    if (openCount === 0) savedOverflow = document.body.style.overflow;
    openCount++;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      if (dialog.open) dialog.close();
      openCount = Math.max(0, openCount - 1);
      if (openCount === 0) {
        document.body.style.overflow = savedOverflow;
        if (trigger?.isConnected) trigger.focus({ preventScroll: true });
      }
    };
  }, [open]);
  return (
    <dialog
      {...props}
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        closeRef.current?.();
      }}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          closeRef.current?.();
      }}
    >
      {children}
    </dialog>
  );
});
export default Dialog;
