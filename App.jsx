import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore"
import { db, notesCollection } from "./firebase"

export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState('')
    const [tempNoteText, setTempNoteText] = React.useState('')

    React.useEffect(() => {
        if(!currentNoteId){
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    
    const currentNote = 
        notes.find(note => note.id === currentNoteId) 
        || notes[0]


    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, function(snapshot){
            const notesArray = snapshot.docs.map(doc =>
                ({
                    ...doc.data(),
                    id: doc.id
                })
                )
                setNotes(notesArray)
        })
        return unsubscribe
    }, [])

   async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: Date.now(),
            updatedAt: Date.now()
        }
        const  newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, 'newNotes', currentNoteId)
        await setDoc(docRef, { 
            body: text,
            updatedAt: Date.now()
         }, { merge: true })
    }

    async function deleteNote(noteId) {
       const deletedNoteRef = doc(db, 'newNotes', noteId)
       await deleteDoc(deletedNoteRef)
    }

    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    React.useEffect(() => {
        if(currentNote){
            setTempNoteText(currentNote.body)
        }
    }, [currentNote])

    React.useEffect(() => {
        const timeOutId = setTimeout(() => {
            if(tempNoteText !== currentNote.body){
                updateNote(tempNoteText)
            }
        }, 1000)
        return () => clearTimeout(timeOutId)
    }, [tempNoteText])
    
    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[20, 80]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={sortedNotes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                        <Editor
                            tempNoteText={tempNoteText}
                            setTempNoteText={setTempNoteText}
                        />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}
