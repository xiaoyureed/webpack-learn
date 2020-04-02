// import exec from './hmr';
import React from 'react';
import ReactDOM from 'react-dom'

const App = () => (
    <div>
        hello react.
    </div>
);

// exec();
ReactDOM.render(<App />, document.getElementById('root'));
