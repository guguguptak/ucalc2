import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './calcReact.css';
import reportWebVitals from './reportWebVitals';

import {
	CalcController
} from './controller.js';
import {
    SET_STATE_ACTION,
    initialState,
    updateStore
} from './model.js';
import {
	Calc
} from './view.js';

export const store = createStore( updateStore, initialState );
ReactDOM.render(
  <React.StrictMode>
    <Calc />
  </React.StrictMode>,
  document.getElementsByTagName( 'calc-main' )[0]
);

const keymap = {
    'Enter': () => CalcController.calcTotalPressed(),
    'Escape': () => CalcController.calcClearPressed(),
    'Backspace': () => CalcController.undoInput(),
    '.': () => CalcController.dotPressed(),
    ',': () => CalcController.dotPressed(),
    'v': async ( evt ) => await pasteFromClipboard( evt ),
};
for ( let i = 0; i <= 9; i++ ) {
    keymap['' + i] = () => CalcController.handleNumberPressed( i );
}
const opMap = {
    'plus': '+',
    'minus': '-',
    'times': '*',
    'divide': '/',
};
for ( const [k, v] of Object.entries( opMap ) ) {
    keymap[v] = () => CalcController.calcOperationPressed( v );
}

async function pasteFromClipboard( evt ) {
    // const state = store.getState();
    let newState = {};
    if ( evt.ctrlKey !== true ) {
        return;
    }
    const clipboard = await window.navigator.clipboard.readText();
    const clipboardFloat = parseFloat( clipboard );
    if ( isNaN( clipboardFloat ) ) {
        return;
    }

    newState.result = clipboardFloat;
    newState.opWasLast = true;
    store.dispatch( {
        type: SET_STATE_ACTION,
        newState: newState,
    } );

}

document.getElementById( 'calc-body' ).addEventListener( 'keydown', ( evt ) => {

    const action = keymap[evt.key];
    if ( action === undefined ) {
        return;
    }
    action( evt );
    evt.preventDefault();

} );

/*
 If you want to start measuring performance in your app, pass a function
 to log results (for example: reportWebVitals(console.log))
 or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
*/
reportWebVitals();
