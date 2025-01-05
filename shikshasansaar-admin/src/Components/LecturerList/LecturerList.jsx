import {React, useState, useEffect} from 'react'
import './LecturerList.css';
import cross_icon from '../assets/cart_cross_icon.png'

const LecturerList = () => {
  const [allfaculties, setallfaculties] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchInfo = async () => {
    await fetch(`${BACKEND_URL}/allFaculties`)
      .then((res) => res.json())
      .then((data) => {
        setallfaculties(data);
      });
  }

  useEffect(() => {
    fetchInfo()
  }, []);

  const handleRemove = async (id) => {
              await fetch(`${BACKEND_URL}/removefaculty`,{
                method: 'POST',
                headers:{
                  Accept:'application/json',
                  'Content-type': 'application/json',
                },
                body:JSON.stringify({id:id})
              })
              await fetchInfo();
  }

  return (
    <div className='faculty-product'>
      <div className="faculty-product-head">
        <p>Name</p>
        <p>Id</p>
        <p>Image</p>
       <p>About</p>
        <p>Remove</p>
      </div>
      <div className="faculty-product-main">
        <hr />
        {allfaculties.map((faculty, index) => {
          return (
            <div key={index} className="faculty-product-format-main faculty-product-format">
              <p>{faculty.lecturer}</p>
              <p>{faculty.id}</p>
              <img src={faculty.image} alt="not found" />
               <p>{faculty.about_faculty}</p> 
               <button onClick={() => handleRemove(faculty.id)}>
                <img src={cross_icon} alt="Remove" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LecturerList
