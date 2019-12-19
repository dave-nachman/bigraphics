import React from "react";
import "./App.css";
import { evaluate } from "./language/evaluate";
import { parse } from "./language/parser";
import { Token } from "./language/tokens";
import Output from "./Output";
import { Action } from "./updater/actions";
import { reprint } from "./language/reprint";
import { update } from "./updater/update";
import { Environment } from "./language/value";

(window as any).theParse = parse;

const startingExample = `
  
(def rect-one (rect 20 20 20 20))

(def rect-two (fill (rect 40 40 40 40) "red"))

(export rect-one)
(export rect-two)
  `;

const App: React.FC = () => {
  const [code, setCode] = React.useState(startingExample);
  const [error, setError] = React.useState<string | null>(null)
  const [parsed, setParsed] = React.useState<Token[] | null>(null)
  const [env, setEnv] = React.useState<Environment| null>(null)

  React.useEffect(() => {
    try {
      setParsed(parse(code));
      setError(null);
    } catch (e) {
      setError(String(e))
      setParsed(null)
    }
  }, [code])

  React.useEffect(() => {
    if(parsed){
      try {
        setEnv(evaluate(parsed || []));
      } catch (e) {
        setEnv(null)
        setError(String(e))
      }
    }
  }, [parsed])

  return (
    <div className="App" style={{ display: "flex" }}>
      <textarea
        value={code}
        style={{ minWidth: 500, minHeight: 500 }}
        onChange={e => setCode(e.target.value)}
      />
      {error && <div>
        Error:
        {error}
      </div>
      }
      <Output
        env={env || {}}
        dispatchActions={(actions: Action[]) => {
          setCode(reprint(update(parsed || [], actions)));
        }}
      />
    </div>
  );
};

export default App;
