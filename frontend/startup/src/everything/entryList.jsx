import React, {useState} from "react";
import {useOutletContext} from "react-router-dom";

export function EntryList({ entries }) {
    const { setSelectedIndex, addEntry } = useOutletContext();
    const [selected, setSelected] = useState(null);

    function select(i) {
        setSelected(i);
        setSelectedIndex(i);
    }

    return ( // goofy <> needed cause multiple entries :/ could just hard code it but it is part of the list right now
        <>
            {entries.map((entry, index) => (
                <button
                    key={index}
                    className={`list-item-button ${index === selected ? 'selected' : ''}`}
                    onClick={() => select(index)}
                > {entry.name}
                </button>
            ))}
            <button className="list-item-button" onClick={addEntry}>+</button>
        </>
    );
}