import { Button, Form, Modal } from "react-bootstrap";
import { useRef, useState } from "react";

interface LoadFileModalProps {
  show: boolean;
  loadBlob: (blob: Blob) => void;
  onClose: () => void;
}

export default function LoadFileModal(props: LoadFileModalProps) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const changeFile = () => {
    const fileInputDom = inputRef.current;
    if (!fileInputDom) return;
    if (fileInputDom.files == null || fileInputDom.files.length === 0) return;
    const file = fileInputDom.files[0];
    setSelectedFileName(file.name);
  };

  const loadFile = () => {
    const fileInputDom = inputRef.current;
    if (!fileInputDom) return;

    if (fileInputDom.files == null || fileInputDom.files.length === 0) return;
    const file = fileInputDom.files[0];
    props.loadBlob(file.slice());
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.File
            id="custom-file"
            label={selectedFileName ?? "Choose File"}
            ref={inputRef}
            onChange={() => changeFile()}
            custom
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => loadFile()}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
