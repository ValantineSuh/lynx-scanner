import { useCallback, useRef, useState } from 'react';
import { TakePicture } from '@components/take-picture.tsx';
import { useAiLoadingState, useExtractDataFromText } from '@store';
import { Button, Progress } from 'react-daisyui';
import { Camera, X } from 'react-feather';

export interface CameraInputProps {
  name: string;
  id?: string;
}

export function CameraInput(props: CameraInputProps) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const openModal = useCallback(() => ref.current?.showModal(), [ref]);
  const extractedData = useExtractDataFromText();
  const aiLoading = useAiLoadingState();
  const [shouldTake, setShouldTake] = useState(false);
  const [dataUri, setDataUri] = useState<string | null>(null);

  const onPicture = useCallback((dataUri: string) => {
    setDataUri(dataUri);
    setShouldTake(false);
  }, []);

  return (
    <>
      <button className="btn" onClick={openModal}>
        open modal
      </button>
      <dialog
        id={props.id}
        ref={ref}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box flex flex-col gap-2 items-center">
          <form className="w-full" method="dialog">
            <h2>{props.name}</h2>
            {/* if there is a button in form, it will close the modal */}
            <Button
              color="ghost"
              shape="circle"
              className="absolute right-2 top-2 z-10"
            >
              <X />
            </Button>
          </form>

          {shouldTake && <TakePicture onTakePhoto={onPicture} />}
          {dataUri && !shouldTake && (
            <div className="rounded-lg relative overflow-hidden">
              <img src={dataUri} alt="image" />
            </div>
          )}
          {!shouldTake && (
            <Button shape="circle" onClick={() => setShouldTake(true)}>
              <Camera />
            </Button>
          )}
          {extractedData && !shouldTake && (
            <pre className="bg-base-200 rounded-xl overflow-scroll h-[100px] w-full">
              {JSON.stringify(extractedData, null, 2)}
            </pre>
          )}
          {dataUri && aiLoading > 0 && aiLoading < 3 && (
            <Progress className="w-full" value={aiLoading} max={3} />
          )}
        </div>
      </dialog>
    </>
  );
}