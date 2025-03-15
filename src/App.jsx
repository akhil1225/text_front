import { useState, useEffect } from "react";
import "./App.css"

const render_url = "https://four93-node-project.onrender.com"; 

const App = () => {
    const [translations, setTranslations] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [newTranslation, setNewTranslation] = useState({ original_text: "", transed_text: "" });


    const fetchTranslations = async () => {
        try {
            const response = await fetch(`${render_url}/api/getTranslations`);
            const data = await response.json();
            setTranslations(data);
        } catch (error) {
            console.error("Error fetching translations:", error);
        }
    };

    useEffect(() => {
        fetchTranslations();
    }, []);

    const searchTranslation = async () => {
        if (!searchText) return;
        try {
            const response = await fetch(`${render_url}/api/translateText`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: searchText }),
            });

            const data = await response.json();
            if (data.hindi_text) {
                alert(`Translation: ${data.hindi_text}`);
            } else {
                alert("Translation not found!");
            }
        } catch (error) {
            console.error("Error searching translation:", error);
        }
    };

    // ✅ Add a new translation
    const addTranslation = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${render_url}/api/addTranslation`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTranslation),
            });

            const data = await response.json();
            if (data.message.includes("successfully")) {
                alert("Translation added!");
                fetchTranslations();
                setNewTranslation({ original_text: "", transed_text: "" });
            }
        } catch (error) {
            console.error("Error adding translation:", error);
        }
    };

    return (
        <div >
            <h2>Translation App</h2>

         
            <input
                type="text"
                placeholder="Enter English text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            <button onClick={searchTranslation}>Search</button>

            <form onSubmit={addTranslation}>
                <input
                    type="text"
                    name="original_text"
                    placeholder="English Text"
                    value={newTranslation.original_text}
                    onChange={(e) => setNewTranslation({ ...newTranslation, original_text: e.target.value })}
                    required
                />
                <input
                    type="text"
                    name="transed_text"
                    placeholder="Hindi Translation"
                    value={newTranslation.transed_text}
                    onChange={(e) => setNewTranslation({ ...newTranslation, transed_text: e.target.value })}
                    required
                />
                <button type="submit">Add Translation</button>
            </form>


            <h3>All Translations</h3>
            {translations.length === 0 ? <p>No translations found</p> : (
                <ul >
                    {translations.map((t, index) => (
                        <li key={index}>
                            <p><strong>{t.original_text}</strong> → {t.transed_text}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default App;
