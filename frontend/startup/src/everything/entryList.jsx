import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";

export function EntryList({ entries }) {
    const { setSelectedIndex } = useOutletContext();
    const [selected, setSelected] = useState(null);

    function select(i) {
        setSelected(i);
        setSelectedIndex(i);
    }

    return entries.map((entry, index) => (
        <button
            key={index}
            className={`list-item-button ${index === selected ? 'selected' : ''}`}
            onClick={() => select(index)}
        > {entry.name}
        </button>
    ));
}