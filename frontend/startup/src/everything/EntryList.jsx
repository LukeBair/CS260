import {useOutletContext} from "react-router-dom";
import {useState} from "react";

export function EntryList({ entries }) {
    // @ts-ignore
    const { setDescription } = useOutletContext();
    const [selected, setSelected] = useState(0);

    function select(i) {
        setSelected(i);
        setDescription(entries[i].desc);

        return entries.map((entry, index) => (
            <button
                key={index}
                className={`list-item-button ${index === selected ? 'selected' : ''}`}
                onClick={() => select(index)}
                > {entry.name}
            </button>
        ));
    }
}