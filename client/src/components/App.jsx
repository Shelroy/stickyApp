import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";

const apiUrl = "http://localhost:5000/select";
const apiUrlDelete = "http://localhost:5000/delete";



function App() {
  const [notes, setNotes] = useState([]);

  function notesDB() {
    return axios.get(apiUrl);
  }

  
  useEffect(() => {
    (async () => {
      const response = await notesDB();
      setNotes(response.data);
    })();
  }, []);

  // when then note is passed from the create area, we have to store it in the notes array

  // receive a new note from the createArray component
  function addNote(newNote) {
    // when a note is returned form the createArray component, use the SetNotes method to put the note into the array notes.

    // get hold of the previous notes and the new note that was sent over and store it in the notes array
    setNotes((prevNotes) => {
      return [...prevNotes, newNote];
    });
  }

  function deleteNote(id) {
    axios
      .post(apiUrlDelete, {
        id: id,
      })
      .then((response) => {
        console.log("response", response);
      });

    setNotes((prevNotes) => {
      return prevNotes.filter((noteItem, index) => {
        console.log(id);
        return noteItem._id !== id;
      });
    });
  }

  return (
    <div>
      <Header login={true} />
      {/* passing over a addNote function that is called from the create area component */}

      <CreateArea onAdd={addNote} />

      {/* map through the notes array, taking every noteItem and index and pass them to the Note component in Note.jsx */}

      {notes.map((noteItem, index) => {
        
        return (
          <Note
            key={index}
            id={noteItem._id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={deleteNote}
          />
        );
      })}
      
      <Footer />
    </div>
  );
}

export default App;
