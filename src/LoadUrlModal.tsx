import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";
import { useRef, useState } from "react";

interface LoadUrlModalProps {
  show: boolean;
  // called when a blob is successfully retrieved from the user-provided URL
  loadBlob: (blob: Blob) => void;
  // called when a user initiates closing the modal
  onClose: () => void;
}

export default function LoadUrlModal(props: LoadUrlModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const loadUrl = (url: string, useCorsAnywhere?: boolean) => {
    setError(null);
    setIsLoading(true);
    fetch(useCorsAnywhere ? `http://cors-anywhere.herokuapp.com/${url}` : url)
      .then((result) => result.blob())
      .then(props.loadBlob)
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Load Game from URL</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger">
            {error}
            <br />
            <Alert.Link
              onClick={() => loadUrl(inputRef.current?.value ?? "", true)}
            >
              Click here to again with CORS Anywhere (Insecure).
            </Alert.Link>
          </Alert>
        )}
        <Form>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="http://example.org"
              ref={inputRef}
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </Form.Group>
        </Form>
        <a
          href="#"
          onClick={() =>
            setUrl("/api/v1/objects/r-pentamino.rle")
          }
        >
          Example 1
        </a>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => loadUrl(inputRef.current?.value ?? "", false)}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span style={{ marginLeft: "5px" }}>Loading...</span>
            </>
          ) : (
            "Load URL"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
