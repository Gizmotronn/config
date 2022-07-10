import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import * as esbuild from 'esbuild-wasm';

const App = () => {
    const ref = useRef<any>();
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm', // from `public`
        });
    };

    useEffect(() => {
        startService();
    }, []); // Only run this once, when the component is [first] rendered to the screen

    const onClick = async () => {
        if (!ref.current) {
            return;
        };

        const result = await ref.current.transform(input, { // transpile the input
            loader: 'jsx',
            target: 'es2015',
        });

        setCode(result.code);
    };

    return <div>
        <textarea value={input} onChange={e => setInput(e.target.value)}></textarea> {/* Whatever the user inputs is set as the input */}
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        <pre>{code}</pre>
    </div>;
};

ReactDOM.render(
    <App />,
    document.querySelector('#root'),
);