'use client'
import { useState } from "react";
import API from "../../../API"
export default function Page() {
    const [message, setMessage] = useState("");
    const handleSubmit = async () =>{
        const response = await fetch(`${API.backendURL}/connection-check`);
        const data = await response.json();
        setMessage(data.message);
        console.log('Fetched data:', data);
    }
    return <>
    <p>File Upload Page</p>;
    {/* <input name="Select File" type="file">
    </input> */}
    <button onClick={handleSubmit}>
        Check Server Connection
    </button>
    <p>{message}</p>
    </> 
}