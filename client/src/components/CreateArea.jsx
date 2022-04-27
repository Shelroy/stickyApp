import React, { useState } from "react";
import Add from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Zoom from '@material-ui/core/Zoom';
import axios from "axios";

// const apiUrl = 'http://localhost:5000/add';
const apiUrl = 'add';


function CreateArea(props) {
  const [isExpanded, setIsExpanded] = useState (false);

  const [note, setNote] = useState({
    title: "",
    content: ""
  });

  // this handle change function will get hold of the name of the field and value of the feild when it's value have been change. 
  function handleChange(event) {
    const { name, value } = event.target;

    // calling the setNote method to update the note array, it returns the previous note and  the value of the field 'nameed' field that was declared above in event.target
    setNote(prevNote => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }

  // when this submit button is clicked, this function will be called and it will take the note from the note array and pass it over to the app.jsx component
  function submitNote(event) {
    // this props.addNote is taking the note from the note array and passing it back to the App.jx 
    props.onAdd(note);
    // after adding note, we can clear the object by setting it to empty strings
  
    // send data to database
    axios.post(apiUrl,{
      title: note.title,
      content:note.content
    }).then((response)=>{
      console.log('response',response)
    });

    setNote({
      title: "",
      content: ""
    });
    // prevent the form from refreshing when the submit button is clicked
    event.preventDefault();
  }
  function expand(){
     setIsExpanded(true);
  }

  return (
    <div>
      <form className="create-note">

       {isExpanded ?  <input
          name="title"
          onChange={handleChange}
          value={note.title}
          placeholder="Title"
        /> : null
        }

        <textarea
          onClick = {expand}
          name="content"
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows= {isExpanded ? 3 : 1}
        />

        
        <Zoom in ={isExpanded}>
        <Fab onClick={submitNote}>
        <Add />
        </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
