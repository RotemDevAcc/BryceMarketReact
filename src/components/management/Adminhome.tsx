import React from 'react'
import { useNavigate } from 'react-router-dom'

const Adminhome = () => {
    const navigate = useNavigate()
    const goback = () =>{
        navigate("/")
    }
    return (
        <div>
            <section className="container mt-4">
                <h2>Admin Actions</h2>
                <p>if you navigated here that means you are a stuff member.</p>
                <h3>Choose your next action in the navigation menu above</h3>
                <button className='button btn-primary' style={{borderRadius:"20px"}} onClick={()=>goback()}>Click Here To Go Back</button>
            </section>
        </div>
    )
}

export default Adminhome