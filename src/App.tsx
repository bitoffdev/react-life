import { ChangeEvent, useState } from "react";
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { ButtonVariant } from "react-bootstrap/esm/types";

import Game from "./life";
import LifeCanvas from "./LifeCanvas";
import LoadFileModal from "./LoadFileModal";
import LoadUrlModal from "./LoadUrlModal";

const outlineDanger: ButtonVariant = "outline-danger";
const outlineSuccess: ButtonVariant = "outline-success";

function App() {
  const [game, setGame] = useState<Game | null>(null);
  const [cellPixelWidth, setCellPixelWidth] = useState(50);
  const [intervalMillis, setIntervalMillis] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [isFileModalVisible, setIsFileModalVisible] = useState(false);
  const [isUrlModalVisible, setIsUrlModalVisible] = useState(false);

  const toggleIsRunning = () => setIsRunning((isRunning) => !isRunning);
  const sanitizeIntervalMillis = (millis: string) =>
    Math.max(1, parseInt(millis));

  const loadRPentamino = () => {
    const game = new Game();
    game.setCell(2, 2, true);
    game.setCell(3, 2, true);
    game.setCell(2, 3, true);
    game.setCell(1, 3, true);
    game.setCell(2, 4, true);
    // turn off the game before we create the new one
    setIsRunning(false);
    setGame(game);
  };

  const loadBlob = async (blob: Blob) => {
    setIsFileModalVisible(false);
    setIsUrlModalVisible(false);

    const _game = new Game();
    await _game.loadBlob(blob);
    // turn off the game before we create the new one
    setIsRunning(false);
    setGame(_game);
  };

  const onChangeCellPixelWidth = (event: ChangeEvent<HTMLInputElement>) => {
    setCellPixelWidth(Math.max(1, parseInt(event.target.value)));
  };

  const onChangeInterval = (event: ChangeEvent<HTMLInputElement>) => {
    // pause the game while the user is adjust input so the game doesn't strangely speed up and slow down
    setIsRunning(false);
    setIntervalMillis(sanitizeIntervalMillis(event.target.value));
  };

  return (
    <>
      <LoadFileModal
        show={isFileModalVisible}
        loadBlob={loadBlob}
        onClose={() => setIsFileModalVisible(false)}
      />
      <LoadUrlModal
        show={isUrlModalVisible}
        loadBlob={loadBlob}
        onClose={() => setIsUrlModalVisible(false)}
      />
      <div className="d-flex flex-column">
        <Navbar bg="light" expand="lg">
          <Navbar.Brand href="#home">React-Life</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown title="Examples" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={loadRPentamino}>
                  R-Pentamino
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Load" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => setIsUrlModalVisible(true)}>
                  From URL
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => setIsFileModalVisible(true)}>
                  From File
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Form inline>
              <InputGroup className="mr-sm-2">
                <InputGroup.Prepend>
                  <InputGroup.Text id="btnGroupAddon2">
                    Cell Size
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="number"
                  onChange={onChangeCellPixelWidth}
                  value={cellPixelWidth}
                />
                <InputGroup.Append>
                  <InputGroup.Text>px</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <InputGroup className="mr-sm-2">
                <InputGroup.Prepend>
                  <InputGroup.Text id="btnGroupAddon2">
                    <FontAwesomeIcon icon={faClock} />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="number"
                  onChange={onChangeInterval}
                  value={intervalMillis}
                />
                <InputGroup.Append>
                  <InputGroup.Text>ms</InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
              <Button
                onClick={toggleIsRunning}
                variant={isRunning ? outlineDanger : outlineSuccess}
              >
                {isRunning ? "Pause" : "Start"}
              </Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <LifeCanvas
          cellPixelWidth={cellPixelWidth}
          game={game}
          intervalMillis={intervalMillis}
          isRunning={isRunning}
        />
      </div>
    </>
  );
}

export default App;
