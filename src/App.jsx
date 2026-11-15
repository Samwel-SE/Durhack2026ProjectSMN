import StraightLine from './StraightLine.jsx';

function App({ input, password, requestId }) {

  return (
    <>
      <StraightLine
        input={input}
        password={password}
        requestId={requestId}
      />
    </>
  );

}

export default App;