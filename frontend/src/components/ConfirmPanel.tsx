import React, {useEffect} from 'react';
import LoadingSpinner from "@/components/LoadingSpinner";

const ConfirmPanel = ({headerText, bodyText, confirmFunction, cancelFunction, isPending = false, errorMsg = ''}: {
  headerText: string;
  bodyText: string;
  confirmFunction: () => void;
  cancelFunction: () => void;
  isPending?: boolean;
  errorMsg?: string;
}) => {

  const closePanel = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      cancelFunction();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', closePanel);

    return () => {
      document.removeEventListener('keydown', closePanel);
    }
  }, []);

  return (
    <div className="w-full h-screen fixed top-0 left-0 bg-black/50 z-50 flex items-center justify-center">

      <div className="bg-dark text-white rounded-md shadow-md flex flex-col gap-4 w-96 overflow-hidden">
        <h5 className="text-accent font-semibold text-lg pt-4 px-4 text-start">{headerText}</h5>
        <p className="px-4 text-start">{bodyText}</p>
        {errorMsg && <p className="text-danger text-start font-semibold text-sm px-4">{errorMsg}</p>}

        <div className="bg-darker p-4 flex items-center justify-end gap-4 text-white">

          <button className="hover-btn" onClick={cancelFunction}>Cancel</button>
          <button className="button submit-btn2" onClick={confirmFunction}>
            {!isPending
              ? <span>Confirm</span>
              : <LoadingSpinner/>
            }
          </button>
        </div>
      </div>

    </div>
  );
};

export default ConfirmPanel;