import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [board, setBoard] = useState([]);
  const [lastDrawnNumbers, setLastDrawnNumbers] = useState([]);


  // useEffect(() => {
  //   const numbers = Array.from({ length: 90 }, (_, index) => ({
  //     id: index + 1,
  //     title: `${index + 1}`,
  //     completed: false,
  //   }));
  //   setBoard(numbers);
  // }, []);

  const chunkArray = (arr, size) => {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArray.push(arr.slice(i, i + size));
    }
    return chunkedArray;
  };
  const groupedNumbers = chunkArray(board, 10);

  const handleNewGame = () => {
    // Resetta il tabellone (board) svuotando tutti i numeri completati
    const resetBoard = board.map(number => ({ ...number, completed: false }));
    setBoard(resetBoard);

    // Resetta gli ultimi numeri estratti (lastDrawnNumbers) a un array vuoto
    setLastDrawnNumbers([]);
    localStorage.setItem('savedBoard', JSON.stringify(board));

    console.log('Nuova partita');
  };

  const handleDrawNumber = () => {
    // Crea una copia del tabellone corrente
    const updatedBoard = [...board];

    // Estrai un numero randomico tra i numeri disponibili
    const availableNumbers = updatedBoard.filter(({ completed }) => !completed);
    if (availableNumbers.length === 0) {
      console.log('Hai estratto tutti i numeri!');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers[randomIndex];

    // Segna il numero come estratto
    selectedNumber.completed = true;

    // Aggiorna il tabellone con il numero estratto
    setBoard(updatedBoard);
    setLastDrawnNumbers(prevNumbers => [
      selectedNumber,
      ...prevNumbers.slice(0, 2),
    ]);

    // Puoi fare ulteriori azioni qui in base alle tue esigenze
    console.log(`Hai estratto il numero ${selectedNumber.title}`);
  };

  const headerHeight = 60; // altezza dell'header in pixel
  const footerHeight = 40; // altezza del footer in pixel

  const calculateContainerHeight = () => {
    const windowHeight = window.innerHeight;
    const fixedHeights = headerHeight + footerHeight;
    return windowHeight - fixedHeights;
  };

  const [containerHeight, setContainerHeight] = useState(calculateContainerHeight());

  useEffect(() => {
    const handleResize = () => {
      // Aggiorna l'altezza del container in base alle nuove dimensioni della finestra
      setContainerHeight(calculateContainerHeight());
    };

    // Aggiungi il listener all'evento resize
    window.addEventListener('resize', handleResize);

    // Rimuovi il listener quando il componente viene smontato
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [/* Dipendenze effettive, se necessario */]);

  useEffect(() => {
    localStorage.setItem('savedBoard', JSON.stringify(board));
  }, [board]);

  useEffect(() => {
    // Carica il tabellone salvato in localStorage al caricamento iniziale
    const savedBoard = JSON.parse(localStorage.getItem('savedBoard')) || [];

    if (savedBoard.length > 0) {
      setBoard(savedBoard);
    } else {
      // Inizializza il tabellone con 90 numeri se non ci sono dati salvati
      const numbers = Array.from({ length: 90 }, (_, index) => ({
        id: index + 1,
        title: `${index + 1}`,
        completed: false,
      }));
      setBoard(numbers);
    }
  }, []);

  return (
    <Container className="mt-4 min-h-screen flex flex-col">
      <h2 className="text-center mb-3">Tabellone della Tombola - San Michaelion</h2>

      <Row>
        {/* Parte a sinistra */}
        <Col className="w-3/4 mt-4">
          {groupedNumbers.map((group, groupIndex) => (
            <Row key={groupIndex} className="mb-4">
              {group.map(({ id, title, completed }) => (
                <Col key={id} className="text-center">
                  <div
                    className={`p-3 border border-black rounded-full w-12 h-12 flex items-center justify-center ${completed ? 'bg-red-500 text-white' : ''}`}
                  >
                    <p className="m-0">{title}</p>
                  </div>
                </Col>
              ))}
            </Row>
          ))}
        </Col>

        {/* Parte a destra */}
        <Col className="col-3 top-3 ml-auto">
          <Col className="text-center">
            <h4>Ultimi 3 numeri estratti:</h4>
            <div className="flex items-center justify-center mb-4">
              {lastDrawnNumbers.length > 0 ? (
                lastDrawnNumbers
                  .slice(0)
                  .reverse()
                  .map(({ id, title }) => (
                    <div
                      key={id}
                      className="m-2 text-2xl p-3 border border-black rounded-full w-12 h-12 flex items-center justify-center"
                    >
                      <p className="m-0">{title}</p>
                    </div>
                  ))
              ) : (
                <div className="m-2 text-2xl p-3 border border-black rounded-full w-12 h-12 flex items-center justify-center">
                  <p className="m-0">-</p>
                </div>
              )}
            </div>
          </Col>

          <Col className="text-center">
            <Col className="text-center mb-5">
              <Button variant="success" onClick={handleDrawNumber}>
                Estrai il Numero
              </Button>
            </Col>
            <Col className="text-center">
              <Button variant="primary" onClick={handleNewGame}>
                Nuova Partita
              </Button>
            </Col>
          </Col>
        </Col>
      </Row>
    </Container>



  );
};

export default App;
