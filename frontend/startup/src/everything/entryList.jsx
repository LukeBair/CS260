import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";

export function EntryList({ entries }) {
    const { setDescription } = useOutletContext();
    const [selected, setSelected] = useState(null);

    function select(i) {
        setSelected(i);
        setDescription(entries[i].desc);
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